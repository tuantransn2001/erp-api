import {
  AgencyBranchAttributes,
  CustomerAttributes,
  OrderAttributes,
  OrderProductListAttributes,
  StaffAttributes,
  UserAttributes,
} from "@/src/ts/interfaces/app_interfaces";
import { ORDER_IMPORT_STATUS } from "../../ts/enums/order_enum";
type UserQueryExclude = Omit<
  UserAttributes,
  "id" | "user_code" | "user_email" | "user_password" | "user_type" | "isDelete"
>;
interface CustomerQueryAttributes extends CustomerAttributes {
  User: {
    dataValues: UserQueryExclude;
  };
}

interface StaffQueryAttributes extends StaffAttributes {
  User: {
    dataValues: UserQueryExclude;
  };
}

type OrderProductItemQueryExcludeAttributes = {
  dataValues: Omit<
    OrderProductListAttributes,
    "id" | "order_id" | "product_variant_id" | "product_unit"
  >;
};

interface OrderItemQueryAttributes extends OrderAttributes {
  Customer: { dataValues: CustomerQueryAttributes };
  Staff: { dataValues: StaffQueryAttributes };
  AgencyBranch: {
    dataValues: Omit<
      AgencyBranchAttributes,
      | "id"
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
}
interface OrderSourceAttributes {
  dataValues: OrderItemQueryAttributes;
}

type OrderItemResult = {
  id: string;
  order_status: string;
  order_note: string;
  createdAt: string;
  supplier_name: string;
  supplier_phone: string;
  staff_name: string;
  agency_branch_name: string;
  order_debt: number;
  isPaymentSuccess: boolean;
};

export const handleFormatOrder = (
  OrderSource: Array<OrderSourceAttributes>
  //   formatType: string
): Array<OrderItemResult> => {
  const orderResultList: Array<any> = OrderSource.map(
    (orderItem: OrderSourceAttributes) => {
      const { id, order_status, order_note, createdAt } = orderItem.dataValues;
      const { user_name: supplier_name, user_phone: supplier_phone } =
        orderItem.dataValues.Customer.dataValues.User.dataValues;
      const { user_name: staff_name } =
        orderItem.dataValues.Staff.dataValues.User.dataValues;
      const { agency_branch_name } =
        orderItem.dataValues.AgencyBranch.dataValues;

      const user_debt: number = orderItem.dataValues.OrderProductLists.reduce(
        (
          totalDebt: number,
          orderProductItem: OrderProductItemQueryExcludeAttributes
        ): number => {
          const { product_amount, product_discount, product_price } =
            orderProductItem.dataValues;

          return (
            totalDebt +
            (product_price * product_amount * (100 - product_discount)) / 100
          );
        },
        0
      );

      const isPaymentSuccess: boolean =
        order_status === ORDER_IMPORT_STATUS.DONE ? true : false;

      return {
        id,
        staff_name,
        supplier_name,
        supplier_phone,
        agency_branch_name,
        order_status,
        order_debt: +user_debt.toFixed(3),
        isPaymentSuccess,
        order_note,
        createdAt,
      };
    }
  );

  return orderResultList;
};
