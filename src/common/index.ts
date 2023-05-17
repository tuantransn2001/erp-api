const randomstring = require("randomstring");
import {
  AgencyBranchAttributes,
  CustomerAttributes,
  RoleAttributes,
  UserAddressAttributes,
  TagAttributes,
  CustomerTagAttributes,
  StaffAttributes,
  UserAttributes,
} from "../ts/interfaces/app_interfaces";

export const isEmpty = (target: Object): boolean => {
  return target === undefined || target === null
    ? true
    : Object.keys(target).length === 0;
};

export const handleGetFirstNameFromFullName = (fullName: string) => {
  let targetIndex: number | undefined;
  for (let index = fullName.length - 1; index >= 0; index--) {
    if (fullName[index] === " ") {
      targetIndex = index + 1;
      break;
    }
  }

  return fullName.slice(targetIndex);
};

interface CustomerResult {
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
): Array<CustomerResult> | CustomerResult => {
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
      staff_in_charge,
      tags: tagList,
      address_list,
      createdAt,
      updatedAt,
    };
  }

  let customerResultList: Array<CustomerResult> = new Array();
  customerResultList = UserCustomerArray.map((User: UserCustomerAttributes) => {
    const {
      id,
      user_code,
      user_phone,
      user_email,
      user_name,
      createdAt,
      updatedAt,
    } = User.dataValues;
    const { customer_status, staff_in_charge_note } =
      User.dataValues.Customer.dataValues;

    const tagList: Array<TagAttributes> =
      User.dataValues.Customer.dataValues.CustomerTags.map(
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
    const address_list = User.dataValues.UserAddresses.map(
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
    return {
      id,
      user_code,
      customer_id: User.dataValues.Customer.dataValues.id,
      customer_phone: user_phone,
      customer_email: user_email,
      customer_name: user_name,
      customer_status,
      staff_in_charge_note,
      tags: tagList,
      address_list,
      createdAt,
      updatedAt,
    };
  });

  return customerResultList;
};

export const handleFormatUpdateDataByValidValue = (
  targetObj: any,
  defaultValue: any
) => {
  return Object.keys(targetObj).reduce(
    (result, key) => {
      if (defaultValue.hasOwnProperty(key) && targetObj[key] !== undefined) {
        result = { ...result, [key]: targetObj[key] };
      }

      return result;
    },
    { ...defaultValue, updatedAt: new Date() }
  );
};

export const randomIntFromInterval = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const randomStringByCharsetAndLength = (
  charset: string,
  length: number,
  formatType: string
): string => {
  return randomstring.generate({
    charset: charset,
    length: length,
    capitalization: formatType ? formatType : "lowercase",
  });
};

interface UserStaffAttributes {
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
    Staff: {
      dataValues: {
        id: string;
        user_id: string;
        staff_status: string;
        staff_birthday: Date;
        note_about_staff: string;
        staff_gender: boolean | string;
        isAllowViewImportNWholesalePrice: boolean;
        isAllowViewShippingPrice: boolean;
        createdAt: Date;
        updatedAt: Date;
        StaffRoles: Array<{
          dataValues: {
            id: string;
            role_id: string;
            staff_id: string;
            createdAt: Date;
            updatedAt: Date;
            StaffAgencyBranchInCharges: Array<{
              dataValues: {
                id: string;
                staff_role_id: string;
                agency_branch_id: string;
                createdAt: Date;
                updatedAt: Date;
              };
            }>;
          };
        }>;
      };
    };
    UserAddresses: Array<{
      dataValues: {
        id: string;
        user_id: string;
        user_province: string;
        user_district: string;
        user_specific_address: string;
        createdAt: Date;
        updatedAt: Date;
      };
      map: any;
    }>;
  };
}

interface StaffAddressItemAttributes {
  dataValues: {
    id: string;
    user_province: string;
    user_district: string;
    user_specific_address: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

interface StaffRoleItemAttributes {
  dataValues: {
    id: string;
    role: string | undefined;
    updatedAt: Date;
    createdAt: Date;
    agencyBranchesInCharge: Array<{
      id: string;
      agency_branch_inCharge_name: string | undefined;
      createdAt: Date;
      updatedAt: Date;
    }>;
  };
}

interface StaffResult {
  id: string;
  staff_id: string;
  staff_code: string;
  staff_phone: string;
  staff_email: string;
  staff_password: string;
  staff_name: string;
  staff_status: string;
  staff_birthday: Date;
  note_about_staff: string;
  staff_gender: boolean | string;
  isAllowViewImportNWholesalePrice: boolean;
  isAllowViewShippingPrice: boolean;
  createdAt: Date;
  updatedAt: Date;
  addressList: Array<StaffAddressItemAttributes["dataValues"]>;
  staffRoleList: Array<StaffRoleItemAttributes["dataValues"]>;
}
export const handleFormatStaff = (
  userStaffList: Array<UserStaffAttributes> & UserStaffAttributes,
  roleList: Array<{ dataValues: RoleAttributes }>,
  agencyBranchList: Array<{ dataValues: AgencyBranchAttributes }>,
  formatType: string
): Array<StaffResult> | StaffResult => {
  if (formatType === "isObject") {
    const {
      id,
      user_code,
      user_phone,
      user_email,
      user_password,
      user_name,
      createdAt,
      updatedAt,
    } = userStaffList.dataValues;

    const {
      staff_status,
      staff_birthday,
      note_about_staff,
      staff_gender,
      isAllowViewImportNWholesalePrice,
      isAllowViewShippingPrice,
    } = userStaffList.dataValues.Staff.dataValues;
    const addressList: StaffResult["addressList"] =
      userStaffList.dataValues.UserAddresses.map(
        (UserAddress: StaffAddressItemAttributes) => {
          const {
            id,
            user_province,
            user_district,
            user_specific_address,
            createdAt,
            updatedAt,
          } = UserAddress.dataValues;

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

    const staffRoleList: StaffResult["staffRoleList"] =
      userStaffList.dataValues.Staff.dataValues.StaffRoles.map(
        (StaffRole: any) => {
          const { id, role_id, createdAt, updatedAt } = StaffRole.dataValues;

          const currentStaffRole: string | undefined = roleList.filter(
            ({ id }: any) => role_id === id
          )[0].dataValues.role_title;

          const staffAgencyBranchInCharge: Array<{
            id: string;
            agency_branch_id: string;
            createdAt: Date;
            updatedAt: Date;
            agency_branch_inCharge_name: string | undefined;
          }> = StaffRole.dataValues.StaffAgencyBranchInCharges.map(
            (AgencyInCharge: {
              id: string;
              agency_branch_id: string;
              createdAt: Date;
              updatedAt: Date;
            }) => {
              const { id, agency_branch_id, createdAt, updatedAt } =
                AgencyInCharge;
              const currentAgencyBranchName = agencyBranchList.filter(
                ({ id }: any) => agency_branch_id === id
              )[0].dataValues.agency_branch_name;
              return {
                id,
                agency_branch_id,
                createdAt,
                updatedAt,
                agency_branch_inCharge_name: currentAgencyBranchName,
              };
            }
          );
          return {
            id,
            createdAt,
            updatedAt,
            role_id,
            role: currentStaffRole,
            agencyBranchesInCharge: staffAgencyBranchInCharge,
          };
        }
      );

    return {
      id,
      staff_id: userStaffList.dataValues.Staff.dataValues.id,
      staff_code: user_code,
      staff_phone: user_phone,
      staff_email: user_email,
      staff_password: user_password,
      staff_name: user_name,
      staff_status,
      staff_birthday,
      note_about_staff,
      staff_gender: staff_gender ? "male" : "female",
      isAllowViewImportNWholesalePrice,
      isAllowViewShippingPrice,
      createdAt,
      updatedAt,
      staffRoleList,
      addressList,
    };
  }
  let staffListResult: Array<StaffResult> = new Array();
  staffListResult = userStaffList.reduce(
    (result: Array<StaffResult>, UserStaff: UserStaffAttributes) => {
      const {
        id,
        user_code,
        user_phone,
        user_email,
        user_password,
        user_name,
        createdAt,
        updatedAt,
      } = UserStaff.dataValues;

      const {
        staff_status,
        staff_birthday,
        note_about_staff,
        staff_gender,
        isAllowViewImportNWholesalePrice,
        isAllowViewShippingPrice,
      } = UserStaff.dataValues.Staff.dataValues;

      const addressList: StaffResult["addressList"] =
        UserStaff.dataValues.UserAddresses.map(
          (UserAddress: StaffAddressItemAttributes) => {
            const {
              id,
              user_province,
              user_district,
              user_specific_address,
              createdAt,
              updatedAt,
            } = UserAddress.dataValues;

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

      const staffRoleList: StaffResult["staffRoleList"] =
        UserStaff.dataValues.Staff.dataValues.StaffRoles.map(
          (StaffRole: any) => {
            const { id, role_id, createdAt, updatedAt } = StaffRole.dataValues;

            const currentStaffRole: string | undefined = roleList.filter(
              ({ id }: any) => role_id === id
            )[0].dataValues.role_title;

            const staffAgencyBranchInCharge: Array<{
              id: string;
              createdAt: Date;
              updatedAt: Date;
              agency_branch_inCharge_name: string | undefined;
            }> = StaffRole.dataValues.StaffAgencyBranchInCharges.map(
              (AgencyInCharge: {
                id: string;
                agency_branch_id: string;
                createdAt: Date;
                updatedAt: Date;
              }) => {
                const { id, agency_branch_id, createdAt, updatedAt } =
                  AgencyInCharge;
                const currentAgencyBranchName = agencyBranchList.filter(
                  ({ id }: any) => agency_branch_id === id
                )[0].dataValues.agency_branch_name;
                return {
                  id,
                  agency_branch_id,
                  agency_branch_inCharge_name: currentAgencyBranchName,
                  createdAt,
                  updatedAt,
                };
              }
            );
            return {
              id,
              createdAt,
              updatedAt,
              role_id,
              role: currentStaffRole,
              agencyBranchesInCharge: staffAgencyBranchInCharge,
            };
          }
        );

      result.push({
        id,
        staff_id: UserStaff.dataValues.Staff.dataValues.id,
        staff_code: user_code,
        staff_phone: user_phone,
        staff_email: user_email,
        staff_password: user_password,
        staff_name: user_name,
        staff_status,
        staff_birthday,
        note_about_staff,
        staff_gender: staff_gender ? "male" : "female",
        isAllowViewImportNWholesalePrice,
        isAllowViewShippingPrice,
        createdAt,
        updatedAt,
        addressList,
        staffRoleList,
      });

      return result;
    },
    []
  );

  return staffListResult;
};

export const cartesian = (...a) =>
  a.reduce((a, b) => a.flatMap((d) => b.map((e) => [d, e].flat())));

export const handleGenerateVariantBaseOnProperties = (
  properties: Array<any>
) => {
  const { keys, combineValues } = properties.reduce(
    (res: any, property: any) => {
      const { key, values }: any = property;
      res.keys.push(key);
      res.combineValues.push(values);
      return res;
    },
    {
      keys: [],
      combineValues: [],
    }
  );

  return { keys, productVariants: cartesian(...combineValues) };
};

interface ErrorContainer {
  [props: string]: string;
}
type Falsy = false | 0 | "" | null | undefined;
export const checkMissPropertyInObjectBaseOnValueCondition = (
  baseObject: ErrorContainer,
  valueCondition: Falsy
): Array<string> => {
  const arrMissArray: Array<string> = Object.keys(baseObject).reduce(
    (res: any, key: string) => {
      if (
        baseObject.hasOwnProperty(key) &&
        baseObject[key] === valueCondition
      ) {
        res.push(key);
      }
      return res;
    },
    []
  );

  return arrMissArray;
};
