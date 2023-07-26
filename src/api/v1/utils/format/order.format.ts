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
<<<<<<< HEAD
} from "@/src/api/v1/ts/interfaces/app_interfaces";
=======
  PaymentAttributes,
  ShipperAttributes,
} from "@/src/api/v1/ts/interfaces/app_interfaces";

>>>>>>> dev/api-v2
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
  Shipper: { dataValues: ShipperAttributes };
  Payment: { dataValues: PaymentAttributes };
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

export const handleFormatOrder = (
  OrderSource: Array<OrderSourceAttributes> & OrderSourceAttributes,
  formatType: string
) => {
  if (formatType === "isObject") {
    const {
      id: order_id,
      order_note,
      order_status,
      order_total,
      order_code,
      order_delivery_date,
      createdAt,
    } = OrderSource.dataValues;

    const {
      id: shipper_id,
      shipper_unit,
      shipper_phone,
    } = OrderSource.dataValues.Shipper.dataValues;

    const { id: payment_id, payment_type } =
      OrderSource.dataValues.Payment.dataValues;
    const { id: supplier_id } = OrderSource.dataValues.Customer.dataValues;
    const {
      id: user_id,
      user_name: supplier_name,
      user_phone: supplier_phone,
    } = OrderSource.dataValues.Customer.dataValues.User.dataValues;

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
      id: order_id,
      order_code,
      order_status,
      order_note,
      order_total,
      order_delivery_date,
      createdAt,
      shipper: {
        id: shipper_id,
        shipper_unit,
        shipper_phone,
      },
      payment: {
        id: payment_id,
        payment_type,
      },
      supplier: {
        user_id,
        id: supplier_id,
        name: supplier_name,
        phone: supplier_phone,
        addresses: supplier_address_list,
      },
      staff: { id: staff_id, name: staff_name },
      agency_branch: {
        id: agency_branch_id,
        name: agency_branch_name,
      },
      order_tags,
      order_product_list,
    };
  }
  return OrderSource.map((orderItem: OrderSourceAttributes) => {
    const {
      id: order_id,
      order_status,
      order_note,
      order_total,
      order_code,
    } = orderItem.dataValues;
    const {
      id: user_id,
      user_name: supplier_name,
      user_phone: supplier_phone,
    } = orderItem.dataValues.Customer.dataValues.User.dataValues;
    const { user_name: staff_name } =
      orderItem.dataValues.Staff.dataValues.User.dataValues;
    const { agency_branch_name } = orderItem.dataValues.AgencyBranch.dataValues;

    const isPaymentSuccess: boolean =
      order_status === ORDER_IMPORT_STATUS.DONE ? true : false;
    return {
      id: order_id,
      user_id,
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
  });
};
