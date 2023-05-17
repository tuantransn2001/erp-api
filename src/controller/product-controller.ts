import { v4 as uuidv4 } from "uuid";
import { Request, Response, NextFunction } from "express";
import {
  handleGenerateVariantBaseOnProperties,
  randomStringByCharsetAndLength,
  checkMissPropertyInObjectBaseOnValueCondition,
} from "../common";
import { handleFormatProduct } from "../utils/format/product.format";
import db from "../models";
import {
  ProductVariantDetailAttributes,
  ProductVariantPriceAttributes,
  ProductVariantPropertyAttributes,
} from "../ts/interfaces/app_interfaces";
const {
  Products,
  ProductVariantDetail,
  ProductVariantPrice,
  ProductVariantProperty,
  ProductTagList,
  AdditionProductInformation,
  Type,
  Brand,
  Price,
  Tag,
} = db;
class ProductController {
  public static async getAll(_: Request, res: Response, next: NextFunction) {
    try {
      const productList = await Products.findAll({
        include: [
          {
            model: ProductVariantDetail,
            as: "Variants",
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
            ],
          },
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
      });

      res.status(201).send({
        status: "Success",
        data: handleFormatProduct(productList, "isArray"),
      });
    } catch (err) {
      next(err);
    }
  }
  public static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        product_name,
        product_classify,
        brand_id,
        type_id,
        tagIDList,
        properties,
        product_SKU,
        product_weight,
        product_weight_calculator_unit,
        product_variant_prices,
      } = req.body;
      const argMissArr: Array<string> =
        checkMissPropertyInObjectBaseOnValueCondition(
          {
            product_name,
            type_id,
            brand_id,
          },
          undefined
        );
      const isAllowToCreate: boolean = argMissArr.length === 0;

      if (isAllowToCreate) {
        // * ==========================================
        //   Product
        // * ==========================================
        const productRow = {
          id: uuidv4(),
          product_name,
          product_classify,
          product_SKU: product_SKU
            ? product_SKU
            : randomStringByCharsetAndLength("alphabetic", 5, "uppercase"),
        };
        // * ==========================================
        //   Addition Information
        // * ==========================================
        const additionProductInfoRow = {
          id: uuidv4(),
          product_id: productRow.id,
          type_id,
          brand_id,
        };
        // * ==========================================
        //   Product Tag List
        // * ==========================================
        const productTagListRowArr = tagIDList.map((tagID: string) => ({
          addition_product_information_id: additionProductInfoRow.id,
          tag_id: tagID,
        }));
        // * ==========================================
        //   Product Variants Detail
        // * ==========================================
        let productVariantDetailRowArr: Array<ProductVariantDetailAttributes> =
          [];
        let productVariantPriceRowArr: Array<ProductVariantPriceAttributes> =
          [];
        let productVariantPropertyRowArr: Array<ProductVariantPropertyAttributes> =
          [];
        const isPropertiesEmpty: boolean = properties.length === 0;
        if (isPropertiesEmpty) {
          const product_special_variant_name: string = productRow.product_name;
          const product_variant_code: string =
            productRow.product_SKU +
            randomStringByCharsetAndLength("alphabetic", 1, "uppercase");
          // * ==========================================
          //   Product Variants Detail Row Arr
          // * ==========================================
          const newProductVariantDetailRow = {
            id: uuidv4(),
            product_id: productRow.id,
            product_variant_name: product_special_variant_name,
            product_variant_SKU: product_variant_code,
            product_variant_barcode: product_variant_code,
            product_weight,
            product_weight_calculator_unit,
          };
          productVariantDetailRowArr.push(newProductVariantDetailRow);
          // * ==========================================
          //   Product Variants Price Row Arr
          // * ==========================================
          const newProductPriceRow = product_variant_prices.map(
            ({ price_id, price_value }: any) => ({
              product_variant_id: newProductVariantDetailRow.id,
              price_id,
              price_value,
            })
          );
          productVariantPriceRowArr.push(newProductPriceRow);
        } else {
          const { keys, productVariants } =
            handleGenerateVariantBaseOnProperties(properties);
          productVariants.forEach(
            (p_variant_properties: Array<any> | string) => {
              let product_variant_code: string = productRow.product_SKU;
              let product_special_variant_name: string =
                productRow.product_name;
              if (Array.isArray(p_variant_properties)) {
                product_variant_code =
                  product_variant_code +
                  p_variant_properties
                    .map((p_variant_property: string) => p_variant_property[0])
                    .join("");
                product_special_variant_name =
                  product_special_variant_name +
                  " " +
                  p_variant_properties
                    .map((p_variant_property: string) => p_variant_property)
                    .join("-");
              } else {
                product_variant_code =
                  product_variant_code + p_variant_properties[0];
                product_special_variant_name =
                  product_special_variant_name + " " + p_variant_properties;
              }
              // * ==========================================
              //   Product Variants Detail Row Arr
              // * ==========================================
              const newProductVariantDetailRow = {
                id: uuidv4(),
                product_id: productRow.id,
                product_variant_name: product_special_variant_name,
                product_variant_SKU: product_variant_code,
                product_variant_barcode: product_variant_code,
                product_weight,
                product_weight_calculator_unit,
              };
              productVariantDetailRowArr.push(newProductVariantDetailRow);
              // * ==========================================
              //   Product Variants Price Row Arr
              // * ==========================================
              const newProductPriceRow = product_variant_prices.map(
                ({ price_id, price_value }: any) => ({
                  product_variant_id: newProductVariantDetailRow.id,
                  price_id,
                  price_value,
                })
              );
              productVariantPriceRowArr.push(newProductPriceRow);
              // * ==========================================
              //   Product Variants Property Row Arr
              // * ==========================================
              const newProductVariantProperty = keys.map(
                (key: string, index: number) => ({
                  product_variant_id: newProductVariantDetailRow.id,
                  product_variant_property_key: key,
                  product_variant_property_value: p_variant_properties[index],
                })
              );
              productVariantPropertyRowArr.push(newProductVariantProperty);
            }
          );
        }

        await Products.create(productRow);
        await AdditionProductInformation.create(additionProductInfoRow);
        await ProductTagList.bulkCreate(productTagListRowArr);
        await ProductVariantDetail.bulkCreate(
          productVariantDetailRowArr.flat(1)
        );
        await ProductVariantPrice.bulkCreate(productVariantPriceRowArr.flat(1));

        if (!isPropertiesEmpty) {
          await ProductVariantProperty.bulkCreate(
            productVariantPropertyRowArr.flat(1)
          );
        }

        res.status(202).send({
          status: "Success",
          message: "Create Product Success",
        });
      } else {
        res.status(409).send({
          status: "Conflict",
          message: `${argMissArr} is require!`,
        });
      }
    } catch (err) {
      next(err);
    }
  }
}

export default ProductController;
