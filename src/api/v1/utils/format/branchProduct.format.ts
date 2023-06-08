import {
  AgencyBranchProductListAttributes,
  ProductVariantDetailAttributes,
  ProductVariantPriceAttributes,
} from "@/src/api/v1/ts/interfaces/app_interfaces";

interface ProductVariantQueryAttributes extends ProductVariantDetailAttributes {
  Variant_Prices: Array<{ dataValues: ProductVariantPriceAttributes }>;
}

interface AgencyBranchProductListQueryAttributes
  extends AgencyBranchProductListAttributes {
  ProductVariantDetail: { dataValues: ProductVariantQueryAttributes };
}

interface BranchProductQueryAttributes {
  dataValues: AgencyBranchProductListQueryAttributes;
}

export const handleFormatBranchProduct = (
  branchProductSource: Array<BranchProductQueryAttributes>
) => {
  return branchProductSource.map((branchProduct) => {
    const {
      id,
      available_quantity,
      available_to_sell_quantity,
      product_discount,
    } = branchProduct.dataValues;

    const {
      id: product_variant_id,
      product_variant_name,
      product_variant_SKU,
    } = branchProduct.dataValues.ProductVariantDetail.dataValues;

    const { id: product_variant_price_id, price_value } =
      branchProduct.dataValues.ProductVariantDetail.dataValues.Variant_Prices[0]
        .dataValues;

    return {
      id,
      available_quantity,
      available_to_sell_quantity,
      product_discount,
      product: {
        product_variant_id,
        name: product_variant_name,
        sku: product_variant_SKU,
      },
      price: { id: product_variant_price_id, price_value },
    };
  });
};
