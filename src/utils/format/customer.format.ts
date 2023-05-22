import {
  CustomerAttributes,
  UserAddressAttributes,
  TagAttributes,
  CustomerTagAttributes,
  StaffAttributes,
  UserAttributes,
} from "../../ts/interfaces/app_interfaces";

interface CustomerDetailResult {
  id: string;
  user_code: string;
  customer_id: string | undefined;
  staff_in_charge?: Object | null;
  customer_status: string | undefined;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  staff_in_charge_note: string | undefined;
  address_list: Array<UserAddressAttributes>;
  tags: Array<TagAttributes>;
  createdAt: Date;
  updatedAt: Date;
}

type CustomerListResult = Omit<
  CustomerDetailResult,
  | "staff_in_charge"
  | "customer_status"
  | "customer_email"
  | "staff_in_charge_note"
  | "address_list"
  | "tags"
  | "updatedAt"
>;

interface QueryTagAttributes extends CustomerTagAttributes {
  Tag: {
    dataValues: TagAttributes;
  };
}
interface QueryStaffAttributes extends StaffAttributes {
  User: {
    dataValues: UserAttributes;
  };
}
interface QueryCustomerAttributes extends CustomerAttributes {
  CustomerTags: Array<QueryTagAttributes>;
  Staff: { dataValues: QueryStaffAttributes };
}
interface UserCustomerAttributes {
  dataValues: {
    id: string;
    user_code: string;
    user_phone: string;
    user_email: string;
    user_password: string;
    user_name: string;
    user_type: string;
    isDelete: boolean | null;
    createdAt: Date;
    updatedAt: Date;
    Customer: {
      dataValues: QueryCustomerAttributes;
    };
    UserAddresses: {
      dataValues: UserAddressAttributes;
      map: any;
    };
  };
}
type UserCustomerParameterType = UserCustomerAttributes &
  Array<UserCustomerAttributes>;

export const handleFormatCustomer = (
  UserCustomerArray: UserCustomerParameterType, // ? isObject if format type === object
  formatType: string
): Array<CustomerListResult> | CustomerDetailResult => {
  // ? Handle Case Format Object options
  if (formatType === "isObject") {
    const {
      id,
      user_code,
      user_phone,
      user_email,
      user_name,
      createdAt,
      updatedAt,
    } = UserCustomerArray.dataValues;
    const { customer_status, staff_in_charge_note } =
      UserCustomerArray.dataValues.Customer.dataValues;
    const tagList: Array<TagAttributes> =
      UserCustomerArray.dataValues.Customer.dataValues.CustomerTags.map(
        (tag: QueryTagAttributes) => {
          const { id, tag_id, createdAt, updatedAt, Tag } = tag;

          return {
            id,
            tag_id,
            tag_title: Tag.dataValues.tag_title,
            tag_description: Tag.dataValues.tag_description,
            createdAt,
            updatedAt,
          };
        }
      );

    const address_list: Array<UserAddressAttributes> =
      UserCustomerArray.dataValues.UserAddresses.map(
        (address: { dataValues: UserAddressAttributes }) => {
          const {
            id,
            user_province,
            user_district,
            user_specific_address,
            createdAt,
            updatedAt,
          } = address.dataValues;

          return {
            id,
            user_province,
            user_district,
            user_specific_address,
            createdAt,
            updatedAt,
          };
        }
      );

    const isStaffInChargeExist: boolean =
      UserCustomerArray.dataValues.Customer.dataValues.Staff === null
        ? false
        : true;
    const staff_in_charge = isStaffInChargeExist
      ? {
          staff_id:
            UserCustomerArray.dataValues.Customer.dataValues.Staff.dataValues
              .id,
          user_staff_id:
            UserCustomerArray.dataValues.Customer.dataValues.Staff.dataValues
              .user_id,
          staff_name:
            UserCustomerArray.dataValues.Customer.dataValues.Staff.dataValues
              .User.dataValues.user_name,
        }
      : null;
    return {
      id,
      customer_id: UserCustomerArray.dataValues.Customer.dataValues.id,
      user_code,
      customer_phone: user_phone,
      customer_email: user_email,
      customer_name: user_name,
      customer_status,
      staff_in_charge_note,
      createdAt,
      updatedAt,
      staff_in_charge,
      tags: tagList,
      address_list,
    };
  }

  let customerResultList: Array<CustomerListResult> = new Array();
  customerResultList = UserCustomerArray.map((User: UserCustomerAttributes) => {
    const { id, user_code, user_phone, user_name } = User.dataValues;
    const { customer_status } = User.dataValues.Customer.dataValues;
    return {
      id,
      customer_id: User.dataValues.Customer.dataValues.id,
      customer_name: user_name,
      customer_phone: user_phone,
      customer_status,
      user_code,
      createdAt: User.dataValues.Customer.dataValues.createdAt as Date,
    };
  });

  return customerResultList;
};
