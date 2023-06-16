import {
  AgencyBranchAttributes,
  CustomerAttributes,
  OrderAttributes,
  OrderProductListAttributes,
  OrderTagAttributes,
  ProductVariantDetailAttributes,
  StaffAttributes,
  UserAddressAttributes,
  UserAttributes,
} from "@/src/api/v1/ts/interfaces/app_interfaces";
import { ORDER_IMPORT_STATUS } from "../../ts/enums/order_enum";
type UserQueryExclude = Omit<
  UserAttributes,
  "user_code" | "user_email" | "user_password" | "user_type" | "isDelete"
>;

interface UserQueryIncludeAddressList extends UserQueryExclude {
  UserAddresses: Array<{ dataValues: UserAddressAttributes }>;
}

interface CustomerQueryAttributes extends CustomerAttributes {
  User: {
    dataValues: UserQueryIncludeAddressList;
  };
}

interface StaffQueryAttributes extends StaffAttributes {
  User: {
    dataValues: UserQueryExclude;
  };
}

interface OrderProductListQueyIncludeProductVariantDetailAttributes
  extends Omit<OrderProductListAttributes, "order_id" | "product_variant_id"> {
  ProductVariantDetail: {
    dataValues: ProductVariantDetailAttributes;
  };
}

type OrderProductItemQueryExcludeAttributes = {
  dataValues: OrderProductListQueyIncludeProductVariantDetailAttributes;
};

interface OrderItemQueryAttributes extends OrderAttributes {
  Customer: { dataValues: CustomerQueryAttributes };
  Staff: { dataValues: StaffQueryAttributes };
  AgencyBranch: {
    dataValues: Omit<
      AgencyBranchAttributes,
      | "agency_branch_phone"
      | "agency_branch_code"
      | "agency_branch_address"
      | "agency_branch_area"
      | "agency_branch_expiration_date"
      | "agency_branch_status"
      | "isDefaultCN"
    >;
  };
  OrderProductLists: Array<OrderProductItemQueryExcludeAttributes>;
  OrderTags: Array<OrderTagAttributes>;
}
interface OrderSourceAttributes {
  dataValues: OrderItemQueryAttributes;
}

interface OrderItemResult {
  id: string;
  order_status: string;
  order_note?: string;
  createdAt: Date;
  supplier_name: string;
  supplier_phone: string;
  staff_name: string;
  agency_branch_name: string;
  order_total: number;
  isPaymentSuccess: boolean;
}

interface OrderDetailResult {
  [prop: string]: any;
}

export const handleFormatOrder = (
  OrderSource: Array<OrderSourceAttributes> & OrderSourceAttributes,
  formatType: string
): Array<OrderItemResult> | OrderDetailResult => {
  if (formatType === "isObject") {
    const { id, order_note, order_status, order_total, order_code } =
      OrderSource.dataValues;

    const { id: supplier_id } = OrderSource.dataValues.Customer.dataValues;
    const { user_name: supplier_name, user_phone: supplier_phone } =
      OrderSource.dataValues.Customer.dataValues.User.dataValues;

    const supplier_address_list =
      OrderSource.dataValues.Customer.dataValues.User.dataValues.UserAddresses;

    const { id: staff_id } = OrderSource.dataValues.Staff.dataValues;
    const { user_name: staff_name } =
      OrderSource.dataValues.Staff.dataValues.User.dataValues;

    const { id: agency_branch_id, agency_branch_name } =
      OrderSource.dataValues.AgencyBranch.dataValues;

    const order_tags = OrderSource.dataValues.OrderTags;

    const order_product_list = OrderSource.dataValues.OrderProductLists.map(
      (order_product_item) => {
        const {
          id: order_product_item_id,
          product_amount,
          product_discount,
          product_price,
          product_unit,
        } = order_product_item.dataValues;
        const {
          id: product_variant_detail_id,
          product_variant_name: product_variant_detail_name,
          product_variant_SKU: product_variant_detail_SKU,
        } = order_product_item.dataValues.ProductVariantDetail.dataValues;

        return {
          order_product_item_id,
          product_variant_detail_id,
          product_variant_detail_name,
          product_variant_detail_SKU,
          product_amount,
          product_discount,
          product_price,
          product_unit,
        };
      }
    );
    return {
      id,
      order_code,
      order_status,
      order_note,
      order_total,
      supplier: {
        user_id: OrderSource.dataValues.Customer.dataValues.User.dataValues.id,
        id: supplier_id,
        name: supplier_name,
        phone: supplier_phone,
        addresses: supplier_address_list,
      },
      staff: {
        user_id: OrderSource.dataValues.Staff.dataValues.User.dataValues.id,
        id: staff_id,
        name: staff_name,
      },
      agency_branch: {
        id: agency_branch_id,
        name: agency_branch_name,
      },
      order_tags,
      order_product_list,
    };
  }
  const orderResultList: Array<OrderItemResult> = OrderSource.map(
    (orderItem: OrderSourceAttributes) => {
      const { id, order_status, order_note, order_total, order_code } =
        orderItem.dataValues;
      const { user_name: supplier_name, user_phone: supplier_phone } =
        orderItem.dataValues.Customer.dataValues.User.dataValues;
      const { user_name: staff_name } =
        orderItem.dataValues.Staff.dataValues.User.dataValues;
      const { agency_branch_name } =
        orderItem.dataValues.AgencyBranch.dataValues;

      const isPaymentSuccess: boolean =
        order_status === ORDER_IMPORT_STATUS.DONE ? true : false;

      return {
        id,
        staff_name,
        supplier_name,
        supplier_phone,
        agency_branch_name,
        order_code,
        order_status,
        order_total,
        isPaymentSuccess,
        order_note,
        createdAt: orderItem.dataValues.createdAt as Date,
      };
    }
  );

  return orderResultList;
};
