import { v4 as uuidv4 } from "uuid";

import { STATUS_CODE, STATUS_MESSAGE } from "../ts/enums/api_enums";
import { ENTITIES_FORMAT_TYPE, MODIFY_STATUS } from "../ts/enums/app_enums";
import {
  AdditionProductInformationAttributes,
  AgencyBranchAttributes,
  AgencyBranchProductListAttributes,
  BrandAttributes,
  PriceAttributes,
  ProductAttributes,
  ProductTagItemAttributes,
  ProductVariantDetailAttributes,
  ProductVariantPriceAttributes,
  ProductVariantPropertyAttributes,
  TagAttributes,
  TypeAttributes,
} from "../ts/interfaces/app_interfaces";
import {
  GetByIdPayload,
  GetEntitiesFormatPayload,
  ObjectType,
} from "../ts/types/app_type";
import { handleError } from "../utils/handleError/handleError";
import db from "../models";
import RestFullAPI from "../utils/response/apiResponse";
import {
  handleValidateClientRequestBeforeModify,
  isEmpty,
  randomStringByCharsetAndLength,
  removeItem,
} from "../common";
import { CreateProductDTO, PropertyDTO } from "../ts/dto/product.dto";
import HttpException from "../utils/exceptions/http.exception";
import {
  ORDER_IMPORT_STATUS,
  ORDER_SALE_STATUS,
  ORDER_TYPE,
} from "../ts/enums/order_enum";
const {
  Products,
  AdditionProductInformation,
  AgencyBranch,
  AgencyBranchProductList,
  Type,
  Brand,
  ProductVariantDetail,
  ProductVariantProperty,
  ProductVariantPrice,
  ProductTagList,
  OrderProductList,
  Tag,
  Price,
  Order,
} = db;

// ? ========================================================================
// ? ================ Type For Product Do Not Include Variant ===============
// ? ========================================================================
interface ProductVariantPriceQueryAttributes
  extends ProductVariantPriceAttributes {
  Price: { dataValues: PriceAttributes };
}

interface ProductVariantDetailQueryAttributes
  extends ProductVariantDetailAttributes {
  Variant_Prices: Array<{
    dataValues: ProductVariantPriceQueryAttributes;
  }>;
  Properties: Array<{
    dataValues: ProductVariantPropertyAttributes;
  }>;
}

interface ProductTagItemQueryAttributes extends ProductTagItemAttributes {
  Tag: { dataValues: TagAttributes };
}

interface AdditionProductInformationQueryAttributes
  extends AdditionProductInformationAttributes {
  Product_Tag_List: Array<{ dataValues: ProductTagItemQueryAttributes }>;
  Type: { dataValues: TypeAttributes };
  Brand: { dataValues: BrandAttributes };
}

interface ProductQueryAttributes extends ProductAttributes {
  Variants: {
    dataValues: ProductVariantDetailQueryAttributes;
  }[];
  AdditionProductInformation: {
    dataValues: AdditionProductInformationQueryAttributes;
  };
}

interface ProductItemQueryAttributes {
  dataValues: ProductQueryAttributes;
}

// ? ========================================================================
// ? ===================== Type For Product Include Variant =================
// ? ========================================================================

interface ProductVariantQueryAttributes extends ProductVariantDetailAttributes {
  Variant_Prices: { dataValues: ProductVariantPriceAttributes }[];
  AgencyBranchProductLists: { dataValues: AgencyBranchProductListAttributes }[];
  Variants: { dataValues: ProductQueryAttributes };
}

interface ImportProductSourceAttributes {
  dataValues: ProductVariantQueryAttributes;
}

// ? ========================================================================
// ? ===================== Type For Branch Product Include Variant =================
// ? ========================================================================

interface ProductVariantQueryAttributes extends ProductVariantDetailAttributes {
  Variant_Prices: Array<{ dataValues: ProductVariantPriceAttributes }>;
}

interface AgencyBranchProductListQueryAttributes
  extends AgencyBranchProductListAttributes {
  ProductVariantDetail: { dataValues: ProductVariantQueryAttributes };
  AgencyBranch: { dataValues: AgencyBranchAttributes };
}

interface BranchProductQueryAttributes {
  dataValues: AgencyBranchProductListQueryAttributes;
}

interface ProductVariantPriceQueryAttributes
  extends ProductVariantPriceAttributes {
  Price: { dataValues: PriceAttributes };
}

interface ProductQueryAttributesIncludeAdditionInfo extends ProductAttributes {
  AdditionProductInformation: {
    dataValues: AdditionProductInformationQueryAttributes;
  };
}

interface ProductDetailQueryAttributes
  extends ProductVariantDetailQueryAttributes {
  Variants: { dataValues: ProductQueryAttributesIncludeAdditionInfo };
}

interface ProductDetailAttributes {
  dataValues: ProductDetailQueryAttributes;
}

type GetProductVariantInventoryPayload = {
  id: string;
};

// ? ========================================================================
// ? ====================== Type For CartesianProduct =======================
// ? ========================================================================
type ElementType<A> = A extends ReadonlyArray<infer T> ? T : never;
type ElementsOfAll<
  Inputs,
  R extends ReadonlyArray<unknown> = []
> = Inputs extends readonly [infer F, ...infer M]
  ? ElementsOfAll<M, [...R, ElementType<F>]>
  : R;

type CartesianProduct<Inputs> = ElementsOfAll<Inputs>[];

class ProductServices {
  private static productList: ProductItemQueryAttributes[];
  private static branchProductVariantList: BranchProductQueryAttributes[];
  private static productDetail: ProductDetailAttributes;
  private static productVariantDetailList: ImportProductSourceAttributes[];
  private static getProductFormat({ format_type }: GetEntitiesFormatPayload) {
    switch (format_type) {
      case ENTITIES_FORMAT_TYPE.P_LIST: {
        const productsSource = [...ProductServices.productList];

        return productsSource.map((product) => {
          const {
            id,
            product_name,
            product_SKU,
            createdAt,
            AdditionProductInformation,
          } = product.dataValues;

          const { type_title } =
            AdditionProductInformation.dataValues.Type.dataValues;
          const { brand_title } =
            AdditionProductInformation.dataValues.Brand.dataValues;

          return {
            id,
            product_name,
            product_SKU,
            createdAt,
            type_title,
            brand_title,
          };
        });
      }
      case ENTITIES_FORMAT_TYPE.P_ITEM: {
        const productSource = { ...ProductServices.productDetail };

        const {
          id,
          product_id,
          product_variant_name,
          product_variant_SKU,
          product_variant_barcode,
          product_weight,
          product_weight_calculator_unit,
          createdAt,
          updatedAt,
        } = productSource.dataValues;

        const product_variant_properties =
          productSource.dataValues.Properties.map((property) => {
            const {
              id,
              product_variant_property_key,
              product_variant_property_value,
            } = property.dataValues;
            return {
              id,
              product_variant_property_key,
              product_variant_property_value,
            };
          });

        const product_variant_prices =
          productSource.dataValues.Variant_Prices.map((price) => {
            const { id: product_variant_price_id, price_value } =
              price.dataValues;
            const {
              id: price_id,
              price_type,
              isImportDefault,
              isSellDefault,
            } = price.dataValues.Price.dataValues;
            return {
              product_variant_price_id,
              price_id,
              price_value,
              price_type,
              isImportDefault,
              isSellDefault,
            };
          });

        const getAdditionInformation = () => {
          const { id, product_id, type_id, brand_id, createdAt, updatedAt } =
            productSource.dataValues.Variants.dataValues
              .AdditionProductInformation.dataValues;

          const { brand_title, brand_description } =
            productSource.dataValues.Variants.dataValues
              .AdditionProductInformation.dataValues.Brand.dataValues;
          const { type_title, type_description } =
            productSource.dataValues.Variants.dataValues
              .AdditionProductInformation.dataValues.Type.dataValues;
          const productTagList =
            productSource.dataValues.Variants.dataValues.AdditionProductInformation.dataValues.Product_Tag_List.map(
              (productItem) => {
                const { id, tag_id } = productItem.dataValues;
                const { tag_title, tag_description, createdAt, updatedAt } =
                  productItem.dataValues.Tag.dataValues;
                return {
                  id,
                  tag_id,
                  tag_title,
                  tag_description,
                  createdAt,
                  updatedAt,
                };
              }
            );
          return {
            id,
            product_id,
            createdAt,
            updatedAt,
            type: { type_id, type_title, type_description },
            brand: { brand_id, brand_title, brand_description },
            productTagList,
          };
        };
        // ? Trading
        return {
          id,
          product_id,
          product_variant_name,
          product_variant_SKU,
          product_variant_barcode,
          product_weight,
          product_weight_calculator_unit,
          product_variant_properties,
          product_variant_prices,
          additionProductInfo: getAdditionInformation(),
          createdAt,
          updatedAt,
        };
      }
      case ENTITIES_FORMAT_TYPE.B_P_V_LIST: {
        const branchProductList = [...ProductServices.branchProductVariantList];

        return branchProductList.map((branchProduct) => {
          const {
            id,
            available_quantity,
            available_to_sell_quantity,
            product_discount,
          } = branchProduct.dataValues;

          const { id: agency_branch_id, agency_branch_name } =
            branchProduct.dataValues.AgencyBranch.dataValues;

          const {
            id: product_variant_id,
            product_variant_name,
            product_variant_SKU,
          } = branchProduct.dataValues.ProductVariantDetail.dataValues;

          const { id: product_variant_price_id, price_value } =
            branchProduct.dataValues.ProductVariantDetail.dataValues
              .Variant_Prices[0].dataValues;
          return {
            id,
            available_quantity,
            available_to_sell_quantity,
            product_discount,
            agencyBranch: {
              id: agency_branch_id,
              name: agency_branch_name,
            },
            product: {
              product_variant_id,
              name: product_variant_name,
              sku: product_variant_SKU,
            },
            price: { id: product_variant_price_id, price_value },
          };
        });
      }
      case ENTITIES_FORMAT_TYPE.P_V_LIST: {
        const initiateProductVariantList = [
          ...ProductServices.productVariantDetailList,
        ];
        return initiateProductVariantList.map((initiateProductVariant) => {
          const {
            id: product_variant_id,
            product_variant_name,
            product_variant_SKU,
            product_weight_calculator_unit,
            createdAt,
          } = initiateProductVariant.dataValues;
          const prices = initiateProductVariant.dataValues.Variant_Prices;

          const brand_title =
            initiateProductVariant.dataValues.Variants.dataValues
              .AdditionProductInformation.dataValues.Brand.dataValues
              .brand_title;
          const type_title =
            initiateProductVariant.dataValues.Variants.dataValues
              .AdditionProductInformation.dataValues.Type.dataValues.type_title;

          const handleGetInfo = () => {
            const AgencyProductVariantList =
              initiateProductVariant.dataValues.AgencyBranchProductLists;

            if (isEmpty(AgencyProductVariantList)) {
              return {
                inStock: 0,
                available_to_sell: 0,
              };
            } else {
              return {
                inStock:
                  AgencyProductVariantList[0].dataValues.available_quantity,
                available_to_sell:
                  AgencyProductVariantList[0].dataValues
                    .available_to_sell_quantity,
              };
            }
          };

          return {
            addition_info: {
              brand_title,
              type_title,
            },
            product_variant: {
              id: product_variant_id,
              name: product_variant_name,
              sku: product_variant_SKU,
              calculator_unit: product_weight_calculator_unit,
              price_sell: prices[0].dataValues.price_value,
              amount: handleGetInfo(),
              createdAt,
            },
          };
        });
      }
      default: {
        return {
          message: `format_type: ${format_type} is in-valid! ${Object.values(
            ENTITIES_FORMAT_TYPE
          )}`,
        };
      }
    }
  }
  private static cartesianProduct<
    Sets extends ReadonlyArray<ReadonlyArray<unknown>>
  >(sets: Sets) {
    return sets.reduce((a, b) =>
      a.flatMap((d) => b.map((e) => [d, e].flat()))
    ) as CartesianProduct<Sets>;
  }
  private static handleGenerateVariantBaseOnProperties = (
    properties: PropertyDTO[]
  ) => {
    const { keys, combineValues } = properties.reduce(
      (res: ObjectType<any>, { key, values }) => {
        res.keys.push(key);
        res.combineValues.push(values);
        return res;
      },
      {
        keys: [],
        combineValues: [],
      }
    );

    return {
      keys,
      productVariants: ProductServices.cartesianProduct(combineValues),
    };
  };
  public static async getAllProduct() {
    try {
      const productList = await Products.findAll({
        attributes: ["id", "product_name", "product_SKU", "createdAt"],
        separate: true,
        include: [
          {
            model: AdditionProductInformation,
            attributes: ["id"],
            separate: true,
            include: [
              {
                model: Type,
                attributes: ["type_title"],
              },
              {
                model: Brand,
                attributes: ["brand_title"],
              },
            ],
          },
        ],
      });

      ProductServices.productList = productList;

      return {
        statusCode: STATUS_CODE.STATUS_CODE_200,
        data: RestFullAPI.onSuccess(
          STATUS_MESSAGE.SUCCESS,
          ProductServices.getProductFormat({
            format_type: ENTITIES_FORMAT_TYPE.P_LIST,
          })
        ),
      };
    } catch (err) {
      return {
        statusCode: STATUS_CODE.STATUS_CODE_500,
        data: handleError(err as Error),
      };
    }
  }
  public static async getVariantByID({ id }: GetByIdPayload) {
    const productDetail = await ProductVariantDetail.findOne({
      where: {
        id,
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
    });

    ProductServices.productDetail = productDetail;
    const { data: inventory } = await ProductServices.getProductsInventory({
      id,
    });
    return {
      statusCode: STATUS_CODE.STATUS_CODE_200,
      data: RestFullAPI.onSuccess(STATUS_MESSAGE.SUCCESS, {
        ...ProductServices.getProductFormat({
          format_type: ENTITIES_FORMAT_TYPE.P_ITEM,
        }),
        inventory,
      }),
    };
  }
  public static async getAllBranchProductVariant({ price_id }) {
    const branchProductVariantList = await AgencyBranchProductList.findAll({
      attributes: [
        "id",
        "available_quantity",
        "available_to_sell_quantity",
        "product_discount",
      ],
      include: [
        {
          model: ProductVariantDetail,
          attributes: ["id", "product_variant_name", "product_variant_SKU"],
          include: [
            {
              where: { price_id },
              as: "Variant_Prices",
              model: ProductVariantPrice,
              attributes: ["id", "price_value"],
            },
          ],
        },
        {
          attributes: ["id", "agency_branch_name"],
          model: AgencyBranch,
        },
      ],
    });

    ProductServices.branchProductVariantList = branchProductVariantList;

    return {
      statusCode: STATUS_CODE.STATUS_CODE_200,
      data: RestFullAPI.onSuccess(
        STATUS_MESSAGE.SUCCESS,
        ProductServices.getProductFormat({
          format_type: ENTITIES_FORMAT_TYPE.B_P_V_LIST,
        })
      ),
    };
  }
  public static async create(payload: CreateProductDTO) {
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
      } = payload;
      const { status, message } = handleValidateClientRequestBeforeModify(
        {
          product_name,
          type_id,
          brand_id,
        },
        [undefined]
      );

      if (status === MODIFY_STATUS.ACCEPT) {
        // * ==========================================
        //   Product
        // * ==========================================
        const productRow = {
          id: uuidv4(),
          product_name,
          product_classify,
          product_SKU: product_SKU
            ? product_SKU
            : randomStringByCharsetAndLength("alphabetic", 5, true),
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

        let productVariantDetailRowArr: ProductVariantDetailAttributes[] =
          new Array();
        let productVariantPriceRowArr: ProductVariantPriceAttributes[] =
          new Array();
        let productVariantPropertyRowArr: ProductVariantPropertyAttributes[] =
          new Array();

        // * ==========================================
        // ? Product Property Empty
        // * ==========================================
        switch (isEmpty(properties)) {
          case true: {
            const product_special_variant_name: string =
              productRow.product_name;
            const product_variant_code: string =
              productRow.product_SKU +
              randomStringByCharsetAndLength("alphabetic", 1, true);
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
              ({ price_id, price_value }) => ({
                id: uuidv4(),
                product_variant_id: newProductVariantDetailRow.id,
                price_id,
                price_value,
              })
            );
            productVariantPriceRowArr.push(...newProductPriceRow);
            break;
          }
          // * ==========================================
          // ? Product Property Not Empty
          // * ==========================================
          case false: {
            const { keys, productVariants } =
              ProductServices.handleGenerateVariantBaseOnProperties(properties);
            productVariants.forEach(
              (p_variant_properties: Array<any> | string) => {
                let product_variant_code: string = productRow.product_SKU;
                let product_special_variant_name: string =
                  productRow.product_name;
                if (Array.isArray(p_variant_properties)) {
                  product_variant_code =
                    product_variant_code +
                    p_variant_properties
                      .map(
                        (p_variant_property: string) => p_variant_property[0]
                      )
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
                    id: uuidv4(),
                    product_variant_id: newProductVariantDetailRow.id,
                    price_id,
                    price_value,
                  })
                );
                productVariantPriceRowArr.push(...newProductPriceRow);
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
            break;
          }
        }

        await Products.create(productRow);
        await AdditionProductInformation.create(additionProductInfoRow);
        await ProductTagList.bulkCreate(productTagListRowArr);
        await ProductVariantDetail.bulkCreate(
          productVariantDetailRowArr.flat(1)
        );
        await ProductVariantPrice.bulkCreate(productVariantPriceRowArr.flat(1));

        if (!isEmpty(properties)) {
          await ProductVariantProperty.bulkCreate(
            productVariantPropertyRowArr.flat(1)
          );
        }

        return {
          statusCode: STATUS_CODE.STATUS_CODE_201,
          data: RestFullAPI.onSuccess(STATUS_MESSAGE.SUCCESS),
        };
      } else {
        return {
          statusCode: STATUS_CODE.STATUS_CODE_409,
          data: RestFullAPI.onFail(STATUS_MESSAGE.CONFLICT, {
            message,
          } as HttpException),
        };
      }
    } catch (err) {
      return {
        statusCode: STATUS_CODE.STATUS_CODE_500,
        data: handleError(err as Error),
      };
    }
  }
  public static async getAllProductVariant() {
    try {
      const sellPriceDefault = await Price.findOne({
        where: {
          isSellDefault: true,
        },
      });

      const initiateProductVariantList = await ProductVariantDetail.findAll({
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
              price_id: sellPriceDefault.dataValues.id,
            },
            as: "Variant_Prices",
          },
          {
            attributes: [
              "id",
              "available_quantity",
              "available_to_sell_quantity",
            ],
            model: AgencyBranchProductList,
          },
        ],
      });

      ProductServices.productVariantDetailList = initiateProductVariantList;

      return {
        statusCode: STATUS_CODE.STATUS_CODE_200,
        data: RestFullAPI.onSuccess(
          STATUS_MESSAGE.SUCCESS,
          ProductServices.getProductFormat({
            format_type: ENTITIES_FORMAT_TYPE.P_V_LIST,
          })
        ),
      };
    } catch (err) {
      return {
        statusCode: STATUS_CODE.STATUS_CODE_500,
        data: handleError(err as Error),
      };
    }
  }
  public static async getProductsInventory({
    id,
  }: GetProductVariantInventoryPayload) {
    // ? Có sẵn trong kho sẵn sàng bán
    const productDetailAvailableAmount = await AgencyBranchProductList.findAll({
      where: {
        product_variant_id: id,
      },
      attributes: [
        "id",
        "available_quantity",
        "product_variant_id",
        "agency_branch_id",
      ],
      include: [
        {
          model: AgencyBranch,
          attributes: ["id", "agency_branch_name"],
        },
      ],
    }).then((res) => {
      return res.reduce((result, item) => {
        const { available_quantity } = item.dataValues;
        const { agency_branch_name } = item.dataValues.AgencyBranch.dataValues;

        const targetIndex = result.findIndex(
          (el) => el.agency_branch_name === agency_branch_name
        );
        if (targetIndex !== -1) {
          result[targetIndex].available = result[
            targetIndex
          ].available_quantity += available_quantity;
        } else {
          result.push({ agency_branch_name, available: available_quantity });
        }

        return result;
      }, []);
    });
    // ? Hàng đang giao dịch trong đơn bán
    const productDeliveryAmount = await OrderProductList.findAll({
      where: {
        product_variant_id: id,
      },

      attributes: ["id", "product_amount", "product_variant_id"],
      include: [
        {
          model: Order,
          where: {
            order_type: ORDER_TYPE.IMPORT,
            order_status: {
              // ? Số lượng sản phẩm đang giao dịch là những sản phẩm trong đơn hàng có những trạng thái này
              [db.Sequelize.Op.or]: removeItem(
                Object.values(ORDER_IMPORT_STATUS),
                [
                  ORDER_IMPORT_STATUS.CANCEL,
                  ORDER_IMPORT_STATUS.RETURN,
                  ORDER_IMPORT_STATUS.DONE,
                ]
              ),
            },
          },
          attributes: ["id", "agency_branch_id"],
          include: [
            { model: AgencyBranch, attributes: ["id", "agency_branch_name"] },
          ],
        },
      ],
    }).then((res) => {
      // ? Tính số lượng sản phẩm đang giao dịch tại từng chi nhánh
      return res.reduce((result, item) => {
        const { product_amount } = item.dataValues;
        const { agency_branch_name } =
          item.dataValues.Order.dataValues.AgencyBranch.dataValues;
        const targetIndex = result.findIndex(
          (el) => el.agency_branch_name === agency_branch_name
        );
        if (targetIndex !== -1) {
          result[targetIndex].delivering = result[targetIndex].delivering +=
            product_amount;
        } else {
          result.push({ agency_branch_name, delivering: product_amount });
        }

        return result;
      }, []);
    });
    // ? Hàng đang về trong đơn nhập
    const productPurchaseAmount = await OrderProductList.findAll({
      where: {
        product_variant_id: id,
      },

      attributes: ["id", "product_amount", "product_variant_id"],
      include: [
        {
          model: Order,
          where: {
            order_type: ORDER_TYPE.SALE,
            order_status: {
              // ? Số lượng sản phẩm đang giao dịch là những sản phẩm trong đơn hàng có những trạng thái này
              [db.Sequelize.Op.or]: removeItem(
                Object.values(ORDER_SALE_STATUS),
                [
                  ORDER_SALE_STATUS.CANCEL,
                  ORDER_SALE_STATUS.RETURN,
                  ORDER_SALE_STATUS.DONE,
                ]
              ),
            },
          },
          attributes: ["id", "agency_branch_id"],
          include: [
            { model: AgencyBranch, attributes: ["id", "agency_branch_name"] },
          ],
        },
      ],
    }).then((res) => {
      // ? Tính số lượng sản phẩm đang giao dịch tại từng chi nhánh
      return res.reduce((result, item) => {
        const { product_amount } = item.dataValues;
        const { agency_branch_name } =
          item.dataValues.Order.dataValues.AgencyBranch.dataValues;
        const targetIndex = result.findIndex(
          (el) => el.agency_branch_name === agency_branch_name
        );
        if (targetIndex !== -1) {
          result[targetIndex].inComing = result[targetIndex].inComing +=
            product_amount;
        } else {
          result.push({ agency_branch_name, inComing: product_amount });
        }

        return result;
      }, []);
    });
    // ? Tồn kho
    // ? Giá vốn
    // ? Có thể bán
    // ? Đang giao dịch
    // ? Hàng Đang về
    // ? Hàng đang giao

    const handleCheckAndFormatEmptyValues = (currentEl: ObjectType<number>) => {
      const inventoryKeyRequire = ["available", "inComing", "delivering"];
      let _currentEl = { ...currentEl };

      inventoryKeyRequire.forEach((requireKey) => {
        if (!Object.keys(_currentEl).includes(requireKey)) {
          _currentEl[requireKey] = 0;
        }
      });

      if (
        Object.keys(_currentEl).some((el) => inventoryKeyRequire.includes(el))
      ) {
        _currentEl = {
          ..._currentEl,
          inventory: _currentEl.available + _currentEl.delivering,
          trading: _currentEl.inComing + _currentEl.delivering,
        };
      }

      return _currentEl;
    };

    const inventory = productDetailAvailableAmount
      .concat(productDeliveryAmount)
      .concat(productPurchaseAmount)
      .reduce((res, item) => {
        const targetIndex = res.findIndex(
          (el) => el.agency_branch_name === item.agency_branch_name
        );
        if (targetIndex !== -1) {
          let currentEl = res[targetIndex];
          currentEl = { ...currentEl, ...item };

          currentEl = {
            ...currentEl,
            ...handleCheckAndFormatEmptyValues(currentEl),
          };
        } else {
          let currentItem = { ...item };
          currentItem = {
            ...currentItem,
            ...handleCheckAndFormatEmptyValues(currentItem),
          };

          res.push(currentItem);
        }
        return res;
      }, []);

    return {
      statusCode: STATUS_CODE.STATUS_CODE_200,
      data: inventory,
    };
  }
}

export default ProductServices;
