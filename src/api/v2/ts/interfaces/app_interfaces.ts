export interface AgencyBranchAttributes {
  id: string;
  agency_branch_name: string;
  agency_branch_phone: string;
  agency_branch_code: string;
  agency_branch_address: string;
  agency_branch_area: string;
  agency_branch_expiration_date: string;
  agency_branch_status: string;
  isDefaultCN: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface OrderAttributes {
  id: string;
  agency_branch_id: string;
  shipper_id: string;
  payment_id: string;
  staff_id: string;
  custSupp_id: string;
  order_type: string;
  order_code: string;
  order_delivery_date: Date | string;
  order_status: string;
  order_total: number;
  order_note?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface OrderProductListAttributes {
  id: string;
  order_id: string;
  product_variant_id: string;
  product_price: number;
  product_amount: number;
  product_discount: number;
  product_unit: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RolePermissionAttributes {
  id: string;
  role_id: string;
  role_permission_description: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface ProductAttributes {
  id: string;
  order_product_item_id: string;
  agency_branch_product_item_id: string;
  product_name: string;
  product_classify: string;
  product_SKU: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface CustSuppAttributes {
  id: string;
  user_id: string;
  staff_id: string | null;
  staff_in_charge_note: string | null;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RoleAttributes {
  id: string;
  role_title: string;
  role_description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface StaffAttributes {
  id: string;
  user_id: string;
  staff_status: string;
  staff_birthday: Date | string;
  note_about_staff: string;
  staff_gender: boolean;
  isAllowViewImportNWholesalePrice: boolean;
  isAllowViewShippingPrice: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface StaffAgencyBranchInChargeAttributes {
  id: string;
  staff_role_id: string;
  agency_branch_id: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface StaffRoleAttributes {
  id: string;
  role_id: string;
  staff_id: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface UserAttributes {
  id: string;
  user_code: string;
  user_phone: string;
  user_email: string;
  user_password: string | null;
  user_name: string;
  user_type: string;
  isDelete: boolean | null;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface UserAddressAttributes {
  id: string;
  user_id: string;
  user_province: string;
  user_district: string;
  user_specific_address: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface CustSuppTagAttributes {
  id: string;
  custSupp_id: string;
  tag_id: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TagAttributes {
  id: string;
  tag_title: string;
  tag_description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TypeAttributes {
  id: string;
  type_title: string;
  type_description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BrandAttributes {
  id: string;
  brand_title: string;
  brand_description: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface ProductTagItemAttributes {
  id: string;
  tag_id: string;
  addition_product_information_id: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AdditionProductInformationAttributes {
  id: string;
  product_id: string;
  type_id: string;
  brand_id: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductVariantDetailAttributes {
  id: string;
  product_id: string;
  product_variant_name: string;
  product_variant_SKU: string;
  product_variant_barcode: string;
  product_weight: string;
  product_weight_calculator_unit: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductVariantPropertyAttributes {
  id: string;
  product_variant_id: string;
  product_variant_property_key: string;
  product_variant_property_value: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductVariantPriceAttributes {
  id: string;
  product_variant_id: string;
  price_id: string;
  price_value: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PriceAttributes {
  id: string;
  price_type: string;
  price_description: string;
  isImportDefault: boolean;
  isSellDefault: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DebtAttributes {
  id: string;
  user_id: string;
  source_id: string;
  change_debt: string;
  debt_amount: string;
  debt_note: string;
  action: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ShipperAttributes {
  id: string;
  shipper_unit: string;
  shipper_phone: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PaymentAttributes {
  id: string;
  payment_type: string;
  payment_description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderTagAttributes {
  id: string;
  order_id: string;
  tag_id: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AgencyBranchProductListAttributes {
  id: string;
  agency_branch_id: string;
  product_variant_id: string;
  available_quantity: number;
  trading_quantity: number;
  available_to_sell_quantity: number;
  product_price: number;
  product_discount: number;
  createdAt?: Date;
  updatedAt?: Date;
}
