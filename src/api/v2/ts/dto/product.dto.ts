export interface PropertyDTO {
  key: string;
  values: string[];
}

export interface ProductVariantPriceDTO {
  price_id: string;
  price_value: string;
}

export interface CreateProductDTO {
  product_name: string;
  product_classify: string;
  brand_id: string;
  type_id: string;
  product_SKU: string;
  product_weight: string;
  product_weight_calculator_unit: string;
  tagIDList: string[];
  properties: PropertyDTO[];
  product_variant_prices: ProductVariantPriceDTO[];
}
