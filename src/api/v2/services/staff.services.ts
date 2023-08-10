import { v4 as uuidv4 } from "uuid";
import {
  handleFormatUpdateDataByValidValue,
  isEmpty,
  randomStringByCharsetAndLength,
} from "../common";
import { STATUS_CODE, STATUS_MESSAGE } from "../ts/enums/api_enums";
import {
  AgencyBranchAttributes,
  RoleAttributes,
  StaffAgencyBranchInChargeAttributes,
  StaffAttributes,
  StaffRoleAttributes,
  UserAddressAttributes,
  UserAttributes,
} from "../ts/interfaces/entities_interfaces";
import { GetByIdPayload, GetEntitiesFormatPayload } from "../ts/types/common";
import { handleError } from "../utils/handleError/handleError";
import HashStringHandler from "../utils/hashString/string.hash";
import CommonServices from "./common.services";
import db from "../models";
import RestFullAPI from "../utils/response/apiResponse";

import { ENTITIES_FORMAT_TYPE, USER_TYPE } from "../ts/enums/app_enums";
import {
  CreateStaffDTO,
  StaffRoleInputDTO,
  UpdateDetailDTO,
  UpdateRoleDTO,
} from "../ts/dto/staff.dto";

const {
  UserAddress,
  StaffRole,
  StaffAgencyBranchInCharge,
  User,
  Staff,
  Role,
  AgencyBranch,
} = db;

interface StaffRoleAndAgencyInChargeInputAttributes {
  staffRolesRowArr: StaffRoleAttributes[];
  staffAgencyBranchesInChargeRowArr: StaffAgencyBranchInChargeAttributes[];
}

interface DeleteDataArrAttributes {
  staffRoleIDArray: string[];
  staffAgencyBranchInChargeIDArray: string[];
}
interface StaffAgencyBranchInChargeItemAttributes {
  dataValues: StaffAgencyBranchInChargeAttributes;
}

interface CreateDataArrAttributes {
  newStaffRoleRowArr: Partial<StaffRoleAttributes>[];
  newStaffAgencyBranchInChargeRowArr: Partial<StaffAgencyBranchInChargeAttributes>[];
}
interface RolesInputAttributes {
  role_id: string;
  agencyBranches_inCharge_id_list: string[];
}

interface UserStaffItemAttributesExclude extends UserAttributes {
  Staff: {
    dataValues: StaffAttributes;
  };
}

interface UserQueryAttributes extends UserAttributes {
  UserAddresses: { dataValues: UserAddressAttributes }[];
}

interface StaffAgencyBranchInChargeQueryAttributes
  extends StaffAgencyBranchInChargeAttributes {
  AgencyBranch: { dataValues: AgencyBranchAttributes };
}

interface StaffRoleQueryAttributes extends StaffRoleAttributes {
  Role: { dataValues: RoleAttributes };
  Staff_Agency_Branch_InCharge: {
    dataValues: StaffAgencyBranchInChargeQueryAttributes;
  }[];
}

interface UserStaffQueryAttributes extends StaffAttributes {
  User: { dataValues: UserQueryAttributes };
  StaffRoles: { dataValues: StaffRoleQueryAttributes }[];
}

interface StaffQueryAttributes {
  dataValues: UserStaffQueryAttributes;
}

interface StaffItemQueryInCludeStaffQueryAttributes {
  dataValues: UserStaffItemAttributesExclude;
}

class StaffServices {
  private static staffList: StaffItemQueryInCludeStaffQueryAttributes[];
  private static staffItem: StaffQueryAttributes;

  private static getStaffFormat({ format_type }: GetEntitiesFormatPayload) {
    switch (format_type) {
      case ENTITIES_FORMAT_TYPE.P_LIST: {
        const staffSource = [...StaffServices.staffList];

        return staffSource.map((staff) => {
          const {
            id: user_id,
            user_phone: staff_phone,
            user_name: staff_name,
          } = staff.dataValues;

          const {
            id: staff_id,
            staff_status,
            createdAt,
          } = staff.dataValues.Staff.dataValues;
          return {
            user_id,
            staff_id,
            staff_name,
            staff_status,
            staff_phone,
            createdAt: createdAt as Date,
          };
        });
      }
      case ENTITIES_FORMAT_TYPE.P_ITEM: {
        const staffSource = { ...StaffServices.staffItem };

        const {
          id: staff_id,
          staff_status,
          staff_birthday,
          note_about_staff,
          staff_gender,
          isAllowViewImportNWholesalePrice,
          isAllowViewShippingPrice,
        } = staffSource.dataValues;

        const {
          id: user_id,
          user_phone: staff_phone,
          user_name: staff_name,
          user_email: staff_email,
          UserAddresses: staff_address,
        } = staffSource.dataValues.User.dataValues;

        const staff_roles = staffSource.dataValues.StaffRoles.map(
          (staff_roles) => {
            const { id: staff_role_id } = staff_roles.dataValues;
            const { id: role_id, role_title } =
              staff_roles.dataValues.Role.dataValues;

            const agency_inCharges =
              staff_roles.dataValues.Staff_Agency_Branch_InCharge.map(
                (agency_inCharge) => {
                  const { id: staff_agency_branch_inCharge_id } =
                    agency_inCharge.dataValues;
                  const { id: agency_branch_id, agency_branch_name } =
                    agency_inCharge.dataValues.AgencyBranch.dataValues;
                  return {
                    staff_agency_branch_inCharge_id,
                    agency_branch_id,
                    agency_branch_name,
                  };
                }
              );

            return { staff_role_id, role_id, role_title, agency_inCharges };
          }
        );

        return {
          user_id,
          staff_id,
          staff_phone,
          staff_name,
          staff_email,
          staff_status,
          staff_birthday,
          note_about_staff,
          staff_gender,
          isAllowViewImportNWholesalePrice,
          isAllowViewShippingPrice,
          staff_address,
          staff_roles,
        };
      }
      default: {
        return {
          message: `format_type: ${format_type} is in-valid! ${Object.values(
            ENTITIES_FORMAT_TYPE
          )}`,
        };
      }
    }
  }
  public static async getAll({}) {
    try {
      const userStaffList = await User.findAll({
        where: {
          isDelete: null,
          user_type: USER_TYPE.STAFF,
        },
        attributes: ["id", "user_name", "user_phone", "createdAt"],
        include: [
          {
            model: Staff,
            attributes: ["id", "staff_status"],
          },
        ],
      });

      StaffServices.staffList = userStaffList;

      return {
        statusCode: STATUS_CODE.STATUS_CODE_200,
        data: RestFullAPI.onSuccess(
          STATUS_MESSAGE.SUCCESS,
          StaffServices.getStaffFormat({
            format_type: ENTITIES_FORMAT_TYPE.P_LIST,
          })
        ),
      };
    } catch (err) {
      return {
        statusCode: STATUS_CODE.STATUS_CODE_500,
        data: handleError(err as Error),
      };
    }
  }
  public static async getByID({ id }: GetByIdPayload) {
    try {
      const foundStaff = await Staff.findOne({
        where: { id },
        attributes: [
          "id",
          "staff_status",
          "staff_birthday",
          "note_about_staff",
          "staff_gender",
          "isAllowViewImportNWholesalePrice",
          "isAllowViewShippingPrice",
        ],
        include: [
          {
            model: User,
            attributes: [
              "id",
              "user_phone",
              "user_name",
              "user_email",
              "createdAt",
            ],
            where: {
              isDelete: null,
              user_type: USER_TYPE.STAFF,
            },
            include: [
              {
                model: UserAddress,
                attributes: [
                  "id",
                  "user_province",
                  "user_district",
                  "user_specific_address",
                ],
              },
            ],
          },
          {
            model: StaffRole,
            separate: true,
            attributes: ["id"],
            include: [
              { model: Role, attributes: ["id", "role_title"] },
              {
                model: StaffAgencyBranchInCharge,
                separate: true,
                as: "Staff_Agency_Branch_InCharge",
                attributes: ["id"],
                include: [
                  {
                    model: AgencyBranch,
                    attributes: ["id", "agency_branch_name"],
                  },
                ],
              },
            ],
          },
        ],
      });

      StaffServices.staffItem = foundStaff;

      return {
        statusCode: STATUS_CODE.STATUS_CODE_200,
        data: RestFullAPI.onSuccess(
          STATUS_MESSAGE.SUCCESS,
          StaffServices.getStaffFormat({
            format_type: ENTITIES_FORMAT_TYPE.P_ITEM,
          })
        ),
      };
    } catch (err) {
      return {
        statusCode: STATUS_CODE.STATUS_CODE_500,
        data: handleError(err as Error),
      };
    }
  }
  public static async create({
    user_phone,
    user_email,
    user_password,
    user_name,
    staff_gender,
    roles,
    isAllowViewImportNWholesalePrice,
    isAllowViewShippingPrice,
    staff_birthday,
    address_list,
  }: CreateStaffDTO) {
    try {
      const SALT_ROUNDS: number = +(process.env.SALT_ROUNDS as string);
      const hashPW: string = HashStringHandler.hash(
        user_password as string,
        SALT_ROUNDS
      );

      const newUserRow: UserAttributes = {
        id: uuidv4(),
        user_type: "staff",
        user_code: randomStringByCharsetAndLength("alphanumeric", 4, false),
        user_phone: user_phone as string,
        user_email: user_email as string,
        user_name: user_name as string,
        user_password: hashPW,
        isDelete: null,
      };

      const newStaffRow: StaffAttributes = {
        id: uuidv4(),
        user_id: newUserRow.id,
        staff_status: "Đang giao dịch",
        staff_birthday,
        staff_gender,
        note_about_staff: "Những ghi chú về nhân viên sẽ được lưu ở cột này",
        isAllowViewImportNWholesalePrice,
        isAllowViewShippingPrice,
      };

      const {
        staffRolesRowArr,
        staffAgencyBranchesInChargeRowArr,
      }: StaffRoleAndAgencyInChargeInputAttributes = roles.reduce(
        (
          result: StaffRoleAndAgencyInChargeInputAttributes,
          { role_id, agencyBranches_inCharge }: StaffRoleInputDTO
        ) => {
          const newStaffRoleRow: StaffRoleAttributes = {
            id: uuidv4(),
            staff_id: newStaffRow.id,
            role_id,
          };
          result.staffRolesRowArr.push(newStaffRoleRow);

          agencyBranches_inCharge.forEach((agency_branch_id: string) => {
            const newStaffAgencyBranchInCharge: StaffAgencyBranchInChargeAttributes =
              {
                id: uuidv4(),
                staff_role_id: newStaffRoleRow.id,
                agency_branch_id,
              };
            result.staffAgencyBranchesInChargeRowArr.push(
              newStaffAgencyBranchInCharge
            );
          });

          return result;
        },
        {
          staffRolesRowArr: [],
          staffAgencyBranchesInChargeRowArr: [],
        }
      );

      await User.create(newUserRow);
      await Staff.create(newStaffRow);
      await StaffRole.bulkCreate(staffRolesRowArr);
      await StaffAgencyBranchInCharge.bulkCreate(
        staffAgencyBranchesInChargeRowArr
      );
      await CommonServices.createJunctionRecord({
        attrs: address_list,
        ownerQuery: { user_id: newUserRow.id },
        JunctionModel: UserAddress,
      });

      return {
        statusCode: STATUS_CODE.STATUS_CODE_200,
        data: RestFullAPI.onSuccess(STATUS_MESSAGE.SUCCESS),
      };
    } catch (err) {
      return {
        statusCode: STATUS_CODE.STATUS_CODE_500,
        data: handleError(err as Error),
      };
    }
  }
  public static async updateRole(payload: UpdateRoleDTO) {
    try {
      const { staff_id, roles } = payload;
      console.log("payload:::", staff_id, roles);
      const foundStaff = await Staff.findOne({
        where: {
          id: staff_id,
        },
        include: [
          {
            model: StaffRole,
            include: [
              {
                model: StaffAgencyBranchInCharge,
                as: "Staff_Agency_Branch_InCharge",
              },
            ],
          },
        ],
      });

      const isAcceptUpdate = roles !== undefined && !isEmpty(roles);

      if (isAcceptUpdate) {
        // * =====================  DELETE ALL STAFF ROLE =====================
        const {
          staffRoleIDArray,
          staffAgencyBranchInChargeIDArray,
        }: DeleteDataArrAttributes = foundStaff.dataValues.StaffRoles.reduce(
          (
            result: DeleteDataArrAttributes,
            staffRoleData: {
              dataValues: {
                id: string;
                role_id: string;
                staff_id: string;
                createdAt: Date;
                updatedAt: Date;
                Staff_Agency_Branch_InCharge: Array<StaffAgencyBranchInChargeItemAttributes>;
              };
            }
          ) => {
            const id: string = staffRoleData.dataValues.id;

            const staffAgencyInChargeListArr: Array<StaffAgencyBranchInChargeItemAttributes> =
              staffRoleData.dataValues.Staff_Agency_Branch_InCharge;

            result.staffRoleIDArray.push(id);

            staffAgencyInChargeListArr.forEach(
              (staffAgencyBranch: StaffAgencyBranchInChargeItemAttributes) => {
                result.staffAgencyBranchInChargeIDArray.push(
                  staffAgencyBranch.dataValues.id as string
                );
              }
            );

            return result;
          },
          {
            staffRoleIDArray: [],
            staffAgencyBranchInChargeIDArray: [],
          }
        );
        await StaffAgencyBranchInCharge.destroy({
          where: {
            id: staffAgencyBranchInChargeIDArray,
          },
        });
        await StaffRole.destroy({
          where: {
            id: staffRoleIDArray,
          },
        });
        // * ===================== ADD NEW  =====================
        const staffID: string = foundStaff.dataValues.id;

        const { newStaffRoleRowArr, newStaffAgencyBranchInChargeRowArr } =
          roles.reduce(
            (
              result: CreateDataArrAttributes,
              {
                role_id,
                agencyBranches_inCharge_id_list,
              }: Partial<RolesInputAttributes>
            ) => {
              const staffRoleID: string = uuidv4();

              result.newStaffRoleRowArr.push({
                id: staffRoleID,
                role_id,
                staff_id: staffID,
              });

              [...(agencyBranches_inCharge_id_list as string[])].forEach(
                (agencyBranch_id) => {
                  result.newStaffAgencyBranchInChargeRowArr.push({
                    staff_role_id: staffRoleID,
                    agency_branch_id: agencyBranch_id,
                  });
                }
              );

              return result;
            },
            {
              newStaffRoleRowArr: [],
              newStaffAgencyBranchInChargeRowArr: [],
            }
          );
        await StaffRole.bulkCreate(newStaffRoleRowArr);
        await StaffAgencyBranchInCharge.bulkCreate(
          newStaffAgencyBranchInChargeRowArr
        );
      }
      return {
        statusCode: STATUS_CODE.STATUS_CODE_200,
        data: RestFullAPI.onSuccess(STATUS_MESSAGE.SUCCESS),
      };
    } catch (err) {
      return {
        statusCode: STATUS_CODE.STATUS_CODE_500,
        data: handleError(err as Error),
      };
    }
  }
  public static async updateDetail(payload: UpdateDetailDTO) {
    try {
      const {
        staff_id,
        user_code,
        user_name,
        user_phone,
        user_email,
        staff_birthday,
        staff_gender,
        staff_address_list,
        roles,
      } = payload;

      const foundStaff = await Staff.findOne({
        where: {
          id: staff_id,
        },
        include: [
          {
            model: User,
          },
        ],
      });

      const staffID = foundStaff.dataValues.id;
      const userID = foundStaff.dataValues.User.dataValues.id;

      const userRecordUpdate = handleFormatUpdateDataByValidValue(
        {
          user_code,
          user_name,
          user_phone,
          user_email,
        },
        foundStaff.dataValues.User.dataValues
      );

      const staffRecordUpdate = handleFormatUpdateDataByValidValue(
        {
          staff_birthday,
          staff_gender,
        },
        foundStaff.dataValues
      );

      await User.update(userRecordUpdate, {
        where: {
          id: userID,
        },
      });

      await Staff.update(staffRecordUpdate, {
        where: {
          id: staffID,
        },
      });

      await CommonServices.updateJunctionRecord({
        JunctionModel: UserAddress,
        ownerQuery: { user_id: userRecordUpdate.id },
        attrs: staff_address_list?.map(
          ({ user_province, user_district, user_specific_address }) => ({
            user_id: userRecordUpdate.id,
            user_province,
            user_district,
            user_specific_address,
          })
        ),
      });

      await StaffServices.updateRole({ roles, staff_id });

      return {
        statusCode: STATUS_CODE.STATUS_CODE_200,
        data: RestFullAPI.onSuccess(STATUS_MESSAGE.SUCCESS),
      };
    } catch (err) {
      return {
        statusCode: STATUS_CODE.STATUS_CODE_500,
        data: handleError(err as Error),
      };
    }
  }
}

export default StaffServices;
