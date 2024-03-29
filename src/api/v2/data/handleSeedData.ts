import { each as forEachAsync } from "awaity";
import {
  USER_ARRAY,
  USER_ADDRESS_LIST_ARRAY,
  CUSTSUPP_ARRAY,
  STAFF_ARRAY,
  USER_ROLE_ARRAY,
  USER_AGENCY_INCHARGE_ARRAY,
  AGENCY_BRANCH_ARRAY,
  ROLE_ARRAY,
  TAG_ARRAY,
  CUSTSUPP_TAG_LIST_ARRAY,
  PRICE_ARRAY,
  BRAND_ARRAY,
  TYPE_ARRAY,
  PRODUCT_ARRAY,
  PRODUCT_TAG_LIST_ARRAY,
  ADDITIONAL_PRODUCT_INFORMATION,
  PRODUCT_VARIANT_DETAIL_ARRAY,
  PRODUCT_VARIANT_PRICE_ARRAY,
  PRODUCT_VARIANT_PROPERTY_ARRAY,
  SHIPPER_ARRAY,
  PAYMENT_ARRAY,
  ORDER_ARRAY,
  ORDER_TAG_LIST_ARRAY,
  ORDER_PRODUCT_LIST_ARRAY,
  DEBT_ARRAY,
  AGENCY_BRANCH_PRODUCT_ARRAY,
} from "./seeders";
import db from "../models";
const {
  User,
  Order,
  OrderTag,
  OrderProductList,
  Debt,
  CustSupp,
  UserAddress,
  AgencyBranch,
  Role,
  Staff,
  UserAgencyBranchInCharge,
  UserRole,
  Tag,
  CustSuppTag,
  Price,
  Brand,
  Type,
  AgencyBranchProductList,
  Products,
  ProductTagList,
  AdditionProductInformation,
  ProductVariantDetail,
  ProductVariantPrice,
  ProductVariantProperty,
  Shipper,
  Payment,
} = db;

export const handleSeedData = () => {
  const seedData = [
    {
      Model: User,
      data: USER_ARRAY,
    },
    {
      Model: Payment,
      data: PAYMENT_ARRAY,
    },
    {
      Model: Shipper,
      data: SHIPPER_ARRAY,
    },
    {
      Model: UserAddress,
      data: USER_ADDRESS_LIST_ARRAY,
    },
    {
      Model: Brand,
      data: BRAND_ARRAY,
    },
    {
      Model: Type,
      data: TYPE_ARRAY,
    },
    {
      Model: Price,
      data: PRICE_ARRAY,
    },
    {
      Model: Tag,
      data: TAG_ARRAY,
    },
    {
      Model: Role,
      data: ROLE_ARRAY,
    },
    {
      Model: Staff,
      data: STAFF_ARRAY,
    },

    {
      Model: AgencyBranch,
      data: AGENCY_BRANCH_ARRAY,
    },
    {
      Model: CustSupp,
      data: CUSTSUPP_ARRAY,
    },

    {
      Model: UserRole,
      data: USER_ROLE_ARRAY,
    },
    {
      Model: Products,
      data: PRODUCT_ARRAY,
    },
    {
      Model: ProductVariantDetail,
      data: PRODUCT_VARIANT_DETAIL_ARRAY,
    },
    {
      Model: ProductVariantPrice,
      data: PRODUCT_VARIANT_PRICE_ARRAY,
    },
    {
      Model: ProductVariantProperty,
      data: PRODUCT_VARIANT_PROPERTY_ARRAY,
    },
    {
      Model: AdditionProductInformation,
      data: ADDITIONAL_PRODUCT_INFORMATION,
    },
    {
      Model: ProductTagList,
      data: PRODUCT_TAG_LIST_ARRAY,
    },
    {
      Model: CustSuppTag,
      data: CUSTSUPP_TAG_LIST_ARRAY,
    },
    {
      Model: UserAgencyBranchInCharge,
      data: USER_AGENCY_INCHARGE_ARRAY,
    },
    {
      Model: Order,
      data: ORDER_ARRAY,
    },
    {
      Model: Debt,
      data: DEBT_ARRAY,
    },
    {
      Model: OrderProductList,
      data: ORDER_PRODUCT_LIST_ARRAY,
    },
    {
      Model: AgencyBranchProductList,
      data: AGENCY_BRANCH_PRODUCT_ARRAY,
    },
    {
      Model: OrderTag,
      data: ORDER_TAG_LIST_ARRAY,
    },
  ];

  forEachAsync(seedData, async ({ Model, data }) => {
    await Model.bulkCreate(data);
  });
};
