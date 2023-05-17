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
} from "@/src/ts/interfaces/app_interfaces";

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

interface ProductResultAttributes {
  id: string;
}

export const handleFormatProduct = (
  productList: Array<ProductItemQueryAttributes>,
  formatType: string
): Array<ProductResultAttributes> | ProductResultAttributes => {
  if (formatType === "isObject") {
  }

  return productList.reduce(
    (result: any, product: ProductItemQueryAttributes) => {
      const {
        id,
        order_product_item_id,
        agency_branch_product_item_id,
        product_name,
        product_classify,
        product_SKU,
        createdAt,
        updatedAt,
      } = product.dataValues;

      const productVariants = product.dataValues.Variants.map(
        (productVariant: {
          dataValues: ProductVariantDetailQueryAttributes;
        }) => {
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
          product.dataValues.AdditionProductInformation.dataValues;

        const { brand_title, brand_description } =
          product.dataValues.AdditionProductInformation.dataValues.Brand
            .dataValues;
        const { type_title, type_description } =
          product.dataValues.AdditionProductInformation.dataValues.Type
            .dataValues;
        const productTagList =
          product.dataValues.AdditionProductInformation.dataValues.Product_Tag_List.map(
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

      const newProductRes = {
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
      result.push(newProductRes);
      return result;
    },
    []
  );
};
