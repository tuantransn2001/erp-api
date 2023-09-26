import { Request, Response, NextFunction } from "express";
import { CreateProductRowDTO } from "../dto/input/product/product.interface";
import { v4 as uuidv4 } from "uuid";
import db from "../models";
import { BaseModelHelper } from "../services/helpers/baseModelHelper/baseModelHelper";
const {
  Price,
  ProductVariantPrice,
  Type,
  Brand,
  ProductVariantDetail,
  Products,
  AdditionProductInformation,
  ProductTagList,
  Tag,
  ProductVariantProperty,
} = db;
import {
  GetAllAsyncPayload,
  GetByIdAsyncPayload,
} from "../services/helpers/baseModelHelper/shared/baseModelHelper.interface";
import { handleGenerateRandomCode } from "../utils/generateCode/generateCode";
import { CreateAdditionProductInformationRowDTO } from "../dto/input/additionProductInformation/additionProductInformation.interface";
import { BulkCreateProductTagRowDTO } from "../dto/input/productTag/productTag.interface";
import { isEmpty, isNullOrFalse } from "../common";
import { handleCartesianBaseOnSource } from "../utils/cartesian/cartesian";
import {
  BulkCreateProductVariantRowDTO,
  CreateProductVariantRowDTO,
} from "../dto/input/productVariantDetail/productVariantDetail.interface";
import { BulkCreateProductVariantPriceRowDTO } from "../dto/input/productVariantPrice/productVariantPrice.interface";
import { BulkCreateProductVariantPropertyRowDTO } from "../dto/input/productVariantProperty/productVariantProperty.interface";
import { handleServerResponse } from "../utils/response/handleServerResponse";
import { STATUS_CODE } from "../ts/enums/api_enums";
import { ProductVariantModelHelper } from "../services/helpers/productVariantModelHelper/productVariantModelHelper";
import { ProductVariantPriceModelHelper } from "../services/helpers/productVariantPriceModelHelper/productVariantPriceModelHelper";
import { ProductVariantPropertyModelHelper } from "../services/helpers/productVariantPropertyHelper/productVariantPropertyHelper";
import { ProductModelHelper } from "../services/helpers/productModelHelper/productModelHelper";
import { AdditionProductInformationModelHelper } from "../services/helpers/additionProductInfoModelHelper/additionProductInfoModelHelper";
import { ProductTagModelHelper } from "../services/helpers/productTagModelHelper/productTagModelHelper";
import RestFullAPI from "../utils/response/apiResponse";

export class ProductController {
  public async getAllProductVariant(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const getSellPriceDefaultData: GetByIdAsyncPayload = {
        Model: Price,
        where: {
          isDelete: isNullOrFalse,
          isSellDefault: true,
        },
      };

      const { data: sellPriceDefaultData } = await BaseModelHelper.getOneAsync(
        getSellPriceDefaultData
      );

      const getAllProductVariantData: GetAllAsyncPayload = {
        ...BaseModelHelper.getPagination(req),
        Model: ProductVariantDetail,
        attributes: [
          "id",
          "product_variant_name",
          "product_variant_SKU",
          "product_weight_calculator_unit",
          "createdAt",
        ],
        include: [
          {
            model: Products,
            as: "Variants",
            attributes: [
              "id",
              "product_name",
              "product_classify",
              "product_SKU",
              "createdAt",
            ],
            include: [
              {
                model: AdditionProductInformation,
                include: [
                  {
                    model: Brand,
                  },
                  {
                    model: Type,
                  },
                ],
              },
            ],
          },
          {
            model: ProductVariantPrice,
            attributes: ["id", "price_id", "price_value"],
            where: {
              price_id: sellPriceDefaultData.data.dataValues.id,
            },
            as: "Variant_Prices",
          },
        ],
      };

      const { statusCode, data } = await BaseModelHelper.getAllAsync(
        getAllProductVariantData
      );

      res.status(statusCode).send(data);
    } catch (err) {
      next(err);
    }
  }
  public async getProductVariantById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const getProductVariantByIdData: GetByIdAsyncPayload = {
        Model: ProductVariantDetail,
        where: {
          id: req.params.id,
        },
        include: [
          {
            model: ProductVariantProperty,
            as: "Properties",
          },
          {
            model: ProductVariantPrice,
            include: [{ model: Price }],
            as: "Variant_Prices",
            separate: true,
          },
          {
            model: Products,
            as: "Variants",
            include: [
              {
                model: AdditionProductInformation,
                include: [
                  {
                    model: ProductTagList,
                    as: "Product_Tag_List",
                    separate: true,
                    include: [
                      {
                        model: Tag,
                      },
                    ],
                  },
                  {
                    model: Type,
                  },
                  {
                    model: Brand,
                  },
                ],
              },
            ],
          },
        ],
      };

      const { statusCode, data } = await BaseModelHelper.getOneAsync(
        getProductVariantByIdData
      );

      res.status(statusCode).send(data);
    } catch (err) {
      next(err);
    }
  }
  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        product_name,
        product_classify,
        brand_id,
        type_id,
        tagIds,
        properties,
        product_SKU,
        product_weight,
        product_weight_calculator_unit,
        product_variant_prices,
      } = req.body;

      const product_id = uuidv4();

      const createProductRowData: CreateProductRowDTO = {
        id: product_id,
        product_name,
        product_classify,
        product_SKU: product_SKU ?? handleGenerateRandomCode(),
      };

      const addition_product_information_id = uuidv4();

      const createAdditionProductInfoRowData: CreateAdditionProductInformationRowDTO =
        {
          id: addition_product_information_id,
          product_id,
          type_id,
          brand_id,
        };

      const bulkCreateProductTagRowDTO: BulkCreateProductTagRowDTO = tagIds.map(
        (tag_id) => ({
          tag_id,
          addition_product_information_id,
        })
      );

      const createProductRes = await ProductModelHelper.createAsync(
        createProductRowData
      );

      const createAdditionProductInfoRowRes =
        await AdditionProductInformationModelHelper.createAsync(
          createAdditionProductInfoRowData
        );

      const bulkCreateProductTagRowRes =
        await ProductTagModelHelper.bulkCreateAsync(bulkCreateProductTagRowDTO);

      let createOrBulkCreateProductVariantRes = handleServerResponse(
        STATUS_CODE.CREATED
      );
      let bulkCreateProductVariantPriceRes = handleServerResponse(
        STATUS_CODE.CREATED
      );
      let bulkCreateProductVariantPropertyRes = handleServerResponse(
        STATUS_CODE.CREATED
      );

      const shouldCartesianProductVariants = !isEmpty(properties);
      // ? Case multiple property and single property
      if (shouldCartesianProductVariants) {
        // ? Multiple
        const { keys, productVariants } =
          handleCartesianBaseOnSource(properties);

        const {
          bulkCreateProductVariantPriceRowData,
          bulkCreateProductVariantPropertyRowData,
          bulkCreateProductVariantRowData,
        } = productVariants.reduce(
          (res, product_variant_properties) => {
            let product_variant_code = product_SKU;
            let product_special_variant_name = product_name;

            const shouldChangeCodeAndVariantName = Array.isArray(
              product_variant_properties
            );

            if (shouldChangeCodeAndVariantName) {
              product_variant_code = `${product_variant_code} ${product_variant_properties.map(
                (p_variant_property) => p_variant_property[0]
              )}`;

              product_special_variant_name = `${product_special_variant_name} ${product_variant_properties
                .map((p_variant_property) => p_variant_property)
                .join("-")}`;
            } else {
              product_variant_code = `${product_variant_code} ${product_variant_properties[0]}`;
              product_special_variant_name = `${product_special_variant_name} ${product_variant_properties}`;
            }

            const product_variant_id = uuidv4();

            const createProductVariantDetailData: CreateProductVariantRowDTO = {
              id: product_variant_id,
              product_id,
              product_variant_name: product_special_variant_name,
              product_variant_SKU: product_variant_code,
              product_variant_barcode: product_variant_code,
              product_weight: +product_weight,
              product_weight_calculator_unit,
            };

            const bulkCreateProductPriceRowData: BulkCreateProductVariantPriceRowDTO =
              product_variant_prices.map(({ price_id, price_value }) => ({
                product_variant_id,
                price_id,
                price_value,
              }));

            const bulkCreateProductVariantPropertyRowData: BulkCreateProductVariantPropertyRowDTO =
              keys.map((key: string, index: number) => ({
                product_variant_id,
                product_variant_property_key: key,
                product_variant_property_value:
                  product_variant_properties[index],
              }));
            res.bulkCreateProductVariantRowData.push(
              createProductVariantDetailData
            );
            res.bulkCreateProductVariantPriceRowData = [
              ...res.bulkCreateProductVariantPriceRowData,
              ...bulkCreateProductPriceRowData,
            ];

            res.bulkCreateProductVariantPropertyRowData = [
              ...res.bulkCreateProductVariantPropertyRowData,
              ...bulkCreateProductVariantPropertyRowData,
            ];

            return res;
          },
          {
            bulkCreateProductVariantRowData:
              [] as BulkCreateProductVariantRowDTO,
            bulkCreateProductVariantPriceRowData:
              [] as BulkCreateProductVariantPriceRowDTO,
            bulkCreateProductVariantPropertyRowData:
              [] as BulkCreateProductVariantPropertyRowDTO,
          }
        );

        createOrBulkCreateProductVariantRes =
          await ProductVariantModelHelper.bulkCreateAsync(
            bulkCreateProductVariantRowData
          );
        bulkCreateProductVariantPriceRes =
          await ProductVariantPriceModelHelper.bulkCreateAsync(
            bulkCreateProductVariantPriceRowData
          );
        bulkCreateProductVariantPropertyRes =
          await ProductVariantPropertyModelHelper.bulkCreateAsync(
            bulkCreateProductVariantPropertyRowData
          );
      } else {
        // * ==========================================
        //   Product Variants Detail Row Arr
        // * ==========================================

        const product_variant_code = handleGenerateRandomCode();
        const product_variant_id = uuidv4();

        const createProductVariantDetailData: CreateProductVariantRowDTO = {
          id: product_variant_id,
          product_id,
          product_variant_name: product_name,
          product_variant_SKU: product_variant_code,
          product_variant_barcode: product_variant_code,
          product_weight: +product_weight,
          product_weight_calculator_unit,
        };

        createOrBulkCreateProductVariantRes =
          await ProductVariantModelHelper.createAsync(
            createProductVariantDetailData
          );

        // * ==========================================
        //   Product Variants Price Row Arr
        // * ==========================================
        const bulkCreateProductVariantPriceData: BulkCreateProductVariantPriceRowDTO =
          product_variant_prices.map(({ price_id, price_value }) => ({
            id: uuidv4(),
            product_variant_id: product_variant_id,
            price_id,
            price_value,
          }));

        bulkCreateProductVariantPriceRes =
          await ProductVariantPriceModelHelper.bulkCreateAsync(
            bulkCreateProductVariantPriceData
          );
      }

      const { statusCode, data } = RestFullAPI.onChainSuccess([
        createProductRes,
        createAdditionProductInfoRowRes,
        bulkCreateProductTagRowRes,
        createOrBulkCreateProductVariantRes,
        bulkCreateProductVariantPriceRes,
        bulkCreateProductVariantPropertyRes,
      ]);

      res.status(statusCode).send(data);
    } catch (err) {
      next(err);
    }
  }

  public async getProductById(_: Request, __: Response, next: NextFunction) {
    try {
    } catch (err) {
      next(err);
    }
  }

  public async softDeleteProductVariantById(
    _: Request,
    __: Response,
    next: NextFunction
  ) {
    try {
    } catch (err) {
      next(err);
    }
  }
  public async hardDeleteProductVariantById(
    _: Request,
    __: Response,
    next: NextFunction
  ) {
    try {
    } catch (err) {
      next(err);
    }
  }
}
