import {
  ProductAttributes,
  ProductVariantDetailAttributes,
  ProductVariantPriceAttributes,
  PriceAttributes,
  ProductVariantPropertyAttributes,
  AdditionProductInformationAttributes,
  TypeAttributes,
  BrandAttributes,
  ProductTagItemAttributes,
  TagAttributes,
  AgencyBranchProductListAttributes,
} from "@/src/api/v2/ts/interfaces/entities_interfaces";
import { isEmpty } from "../../common";

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
  Variants: Array<{
    dataValues: ProductVariantDetailQueryAttributes;
  }>;
  AdditionProductInformation: {
    dataValues: AdditionProductInformationQueryAttributes;
  };
}

interface ProductItemQueryAttributes {
  dataValues: ProductQueryAttributes;
}

type ProductSourceAttributes = ProductItemQueryAttributes[] &
  ProductItemQueryAttributes;

export const handleFormatProduct = (
  productSource: ProductSourceAttributes,
  formatType: string
) => {
  if (formatType === "isObject") {
    const {
      id,
      order_product_item_id,
      agency_branch_product_item_id,
      product_name,
      product_classify,
      product_SKU,
      createdAt,
      updatedAt,
    } = productSource.dataValues;

    const productVariants = productSource.dataValues.Variants.map(
      (productVariant: { dataValues: ProductVariantDetailQueryAttributes }) => {
        const {
          id,
          product_variant_name,
          product_variant_SKU,
          product_variant_barcode,
          product_weight,
          product_weight_calculator_unit,
          createdAt,
          updatedAt,
        } = productVariant.dataValues;

        const productPrices = productVariant.dataValues.Variant_Prices.map(
          (productPrice: {
            dataValues: ProductVariantPriceQueryAttributes;
          }) => {
            const { id, price_id, price_value, createdAt, updatedAt } =
              productPrice.dataValues;

            const { price_type, price_description } =
              productPrice.dataValues.Price.dataValues;
            return {
              id,
              price_id,
              price_value,
              price_type,
              price_description,
              createdAt,
              updatedAt,
            };
          }
        );

        const productProperties = productVariant.dataValues.Properties.map(
          (property) => {
            const {
              id,
              product_variant_property_key,
              product_variant_property_value,
              createdAt,
              updatedAt,
            } = property.dataValues;

            return {
              id,
              product_variant_property_key,
              product_variant_property_value,
              createdAt,
              updatedAt,
            };
          }
        );

        return {
          id,
          product_variant_name,
          product_variant_SKU,
          product_variant_barcode,
          product_weight,
          product_weight_calculator_unit,
          createdAt,
          updatedAt,
          productPrices,
          productProperties,
        };
      }
    );

    const generateAdditionInformation = () => {
      const { id, product_id, type_id, brand_id, createdAt, updatedAt } =
        productSource.dataValues.AdditionProductInformation.dataValues;

      const { brand_title, brand_description } =
        productSource.dataValues.AdditionProductInformation.dataValues.Brand
          .dataValues;
      const { type_title, type_description } =
        productSource.dataValues.AdditionProductInformation.dataValues.Type
          .dataValues;
      const productTagList =
        productSource.dataValues.AdditionProductInformation.dataValues.Product_Tag_List.map(
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

    return {
      id,
      order_product_item_id,
      agency_branch_product_item_id,
      product_name,
      product_classify,
      product_SKU,
      createdAt,
      updatedAt,
      productVariants,
      productAdditionInformation: generateAdditionInformation(),
    };
  }

  const productListResult = productSource.map((product) => {
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

  return productListResult;
};

interface ProductVariantQueryAttributes extends ProductVariantDetailAttributes {
  Variant_Prices: { dataValues: ProductVariantPriceAttributes }[];
  AgencyBranchProductLists: { dataValues: AgencyBranchProductListAttributes }[];
}

interface ImportProductSourceAttributes {
  dataValues: ProductVariantQueryAttributes;
}

export const handleFormatImportProduct = (
  importProductSources: ImportProductSourceAttributes[]
) => {
  return importProductSources.map((product) => {
    const {
      id: product_variant_id,
      product_variant_name,
      product_variant_SKU,
      product_weight_calculator_unit,
    } = product.dataValues;
    const prices = product.dataValues.Variant_Prices;

    const handleGetInfo = () => {
      const AgencyProductVariantList =
        product.dataValues.AgencyBranchProductLists;

      if (isEmpty(AgencyProductVariantList)) {
        return {
          inStock: 0,
          available_to_sell: 0,
        };
      } else {
        return {
          inStock: AgencyProductVariantList[0].dataValues.available_quantity,
          available_to_sell:
            AgencyProductVariantList[0].dataValues.available_to_sell_quantity,
        };
      }
    };

    return {
      product_variant: {
        id: product_variant_id,
        name: product_variant_name,
        sku: product_variant_SKU,
        calculator_unit: product_weight_calculator_unit,
        price_sell: prices[0].dataValues.price_value,
        amount: handleGetInfo(),
      },
    };
  });
};
