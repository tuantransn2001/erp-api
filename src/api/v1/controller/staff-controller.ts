require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
import { NextFunction, Request, Response } from "express";
import HashStringHandler from "../utils/hashString/string.hash";
import db from "../models";
const {
  StaffRole,
  Customer,
  Staff,
  User,
  StaffAgencyBranchInCharge,
  Role,
  UserAddress,
  AgencyBranch,
} = db;
import {
  handleFormatUpdateDataByValidValue,
  isEmpty,
  randomStringByCharsetAndLength,
} from "../../v1/common";
import { handleFormatStaff } from "../utils/format/staff.format";
import {
  StaffAttributes,
  UserAddressAttributes,
  StaffRoleAttributes,
  StaffAgencyBranchInChargeAttributes,
  UserAttributes,
  CustomerAttributes,
} from "@/src/api/v1/ts/interfaces/app_interfaces";
import { STATUS_CODE, STATUS_MESSAGE } from "../../v1/ts/enums/api_enums";
import RestFullAPI from "../utils/response/apiResponse";
class StaffController {
  public static async getAll(_: Request, res: Response, next: NextFunction) {
    try {
      const userStaffList = await User.findAll({
        where: {
          isDelete: null,
          user_type: "staff",
        },
        attributes: ["id", "user_name", "user_phone", "createdAt"],
        include: [
          {
            model: Staff,
            attributes: ["id", "staff_status"],
          },
        ],
      });

      res
        .status(STATUS_CODE.STATUS_CODE_200)
        .send(
          RestFullAPI.onSuccess(
            STATUS_MESSAGE.SUCCESS,
            handleFormatStaff(userStaffList, "isArray")
          )
        );
    } catch (err) {
      next(err);
    }
  }
  public static async getByID(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userStaffList = await User.findOne({
        where: {
          isDelete: null,
          id,
          user_type: "staff",
        },
        attributes: [
          "id",
          "user_phone",
          "user_name",
          "user_email",
          "createdAt",
        ],
        include: [
          {
            model: Staff,
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
          },
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
      });

      res
        .status(STATUS_CODE.STATUS_CODE_200)
        .send(
          RestFullAPI.onSuccess(
            STATUS_MESSAGE.SUCCESS,
            handleFormatStaff(userStaffList, "isObject")
          )
        );
    } catch (err) {
      next(err);
    }
  }
  public static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        user_phone,
        user_email,
        user_password,
        user_name,
        staff_birthday,
        staff_gender,
        isAllowViewImportNWholesalePrice,
        isAllowViewShippingPrice,
        roles,
        address_list,
      } = req.body;
      const SALT_ROUNDS: number = +(process.env.SALT_ROUNDS as string);
      const hashPW: string = HashStringHandler.hash(user_password, SALT_ROUNDS);

      const userID: string = uuidv4();
      const newUserRow: UserAttributes = {
        id: userID,
        user_type: "staff",
        user_code: randomStringByCharsetAndLength("alphanumeric", 6, true),
        user_phone,
        user_email,
        user_password: hashPW,
        user_name,
        isDelete: null,
      };
      const staffID: string = uuidv4();
      const newStaffRow: StaffAttributes = {
        id: staffID,
        user_id: userID,
        staff_status: "Đang giao dịch",
        staff_birthday,
        staff_gender,
        note_about_staff: "Những ghi chú về nhân viên sẽ được lưu ở cột này",
        isAllowViewImportNWholesalePrice,
        isAllowViewShippingPrice,
      };

      interface StaffRoleInputAttributes {
        role_id: string;
        agencyBranches_inCharge: Array<string>;
      }

      interface StaffRoleAndAgencyInChargeInputAttributes {
        staffRolesRowArr: Array<StaffRoleAttributes>;
        staffAgencyBranchesInChargeRowArr: Array<StaffAgencyBranchInChargeAttributes>;
      }
      const {
        staffRolesRowArr,
        staffAgencyBranchesInChargeRowArr,
      }: StaffRoleAndAgencyInChargeInputAttributes = roles.reduce(
        (
          result: StaffRoleAndAgencyInChargeInputAttributes,
          role: StaffRoleInputAttributes
        ) => {
          const { role_id, agencyBranches_inCharge } = role;
          const staffRoleID: string = uuidv4();
          const newStaffRoleRow: StaffRoleAttributes = {
            id: staffRoleID,
            staff_id: newStaffRow.id,
            role_id,
          };
          result.staffRolesRowArr.push(newStaffRoleRow);
          agencyBranches_inCharge.forEach((agencyBranchID: any) => {
            const staffAgencyBranchInChargeID: string = uuidv4();
            const newStaffAgencyBranchInCharge: StaffAgencyBranchInChargeAttributes =
              {
                id: staffAgencyBranchInChargeID,
                staff_role_id: newStaffRoleRow.id,
                agency_branch_id: agencyBranchID,
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

      const staffAddressRowArr: Array<UserAddressAttributes> = address_list.map(
        (address: UserAddressAttributes) => {
          return {
            ...address,
            user_id: userID,
          };
        }
      );

      if (
        newUserRow &&
        newStaffRow &&
        staffRolesRowArr &&
        staffAgencyBranchesInChargeRowArr &&
        staffAddressRowArr
      ) {
        await User.create(newUserRow);
        await Staff.create(newStaffRow);
        await StaffRole.bulkCreate(staffRolesRowArr);
        await StaffAgencyBranchInCharge.bulkCreate(
          staffAgencyBranchesInChargeRowArr
        );
        await UserAddress.bulkCreate(staffAddressRowArr);
        res
          .status(STATUS_CODE.STATUS_CODE_201)
          .send(RestFullAPI.onSuccess(STATUS_MESSAGE.SUCCESS));
      } else {
        res
          .status(STATUS_CODE.STATUS_CODE_409)
          .send(RestFullAPI.onSuccess(STATUS_MESSAGE.CONFLICT));
      }
    } catch (err) {
      next(err);
    }
  }
  public static async updateByID(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const {
        user_code,
        user_name,
        user_phone,
        user_email,
        staff_birthday,
        staff_gender,
        staff_address_list,
      } = req.body;

      const foundUserStaff = await User.findOne({
        where: {
          id,
          isDelete: null,
          user_type: "staff",
        },
        include: [
          {
            model: Staff,
          },
        ],
      });

      const userDataValues: Object = Object.keys(
        foundUserStaff.dataValues
      ).reduce((result: object, key: any) => {
        if (key !== "Staff") {
          result = { ...result, [key]: foundUserStaff.dataValues[key] };
        }

        return result;
      }, {});
      const StaffDataValue: Object = foundUserStaff.dataValues.Staff.dataValues;

      const userRowUpdate = handleFormatUpdateDataByValidValue(
        {
          user_code,
          user_name,
          user_phone,
          user_email,
        },
        userDataValues
      );
      const staffRowUpdate = handleFormatUpdateDataByValidValue(
        {
          staff_gender,
          staff_birthday,
        },
        StaffDataValue
      );
      await User.update(userRowUpdate, {
        where: {
          id: foundUserStaff.dataValues.id,
        },
      });
      await Staff.update(staffRowUpdate, {
        where: {
          id: foundUserStaff.dataValues.Staff.dataValues.id,
        },
      });

      if (isEmpty(staff_address_list)) {
        await UserAddress.destroy({
          where: {
            user_id: foundUserStaff.dataValues.id,
          },
        });
      } else {
        await UserAddress.destroy({
          where: {
            user_id: foundUserStaff.dataValues.id,
          },
        });

        const updateUserAddressRow: Array<UserAddressAttributes> =
          staff_address_list.map((address: UserAddressAttributes) => {
            const { user_province, user_district, user_specific_address } =
              address;

            return {
              user_id: foundUserStaff.dataValues.id,
              user_province,
              user_district,
              user_specific_address,
            };
          });

        await UserAddress.bulkCreate(updateUserAddressRow);
      }

      res
        .status(STATUS_CODE.STATUS_CODE_200)
        .send(RestFullAPI.onSuccess(STATUS_MESSAGE.SUCCESS));
    } catch (err) {
      next(err);
    }
  }
  public static async deleteByID(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params; // ? This is userID
      const foundUser = await User.findOne({
        where: {
          id,
        },
        include: [{ model: Staff, include: [{ model: Customer }] }],
      });

      foundUser.isDelete = true;
      foundUser.save();
      // ? Delete data staff_in_charge in Customer
      const staff_id: string = foundUser.dataValues.Staff.dataValues.id;
      const customerList = await Customer.findAll({
        where: {
          staff_id,
        },
      });
      customerList.forEach(async (customer: CustomerAttributes) => {
        await Customer.update(
          { staff_id: null },
          { where: { id: customer.id } }
        );
      });
      res
        .status(STATUS_CODE.STATUS_CODE_202)
        .send(RestFullAPI.onSuccess(STATUS_MESSAGE.SUCCESS));
    } catch (err) {
      next(err);
    }
  }
  public static async updateRoleByID(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params; // ? This belongs to User
      const { roles } = req.body;

      const foundUserStaff = await User.findOne({
        where: {
          id,
        },
        include: [
          {
            model: Staff,
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
          },
        ],
      });
      // * =====================  DELETE ALL STAFF ROLE =====================
      interface DeleteDataArrAttributes {
        staffRoleIDArray: Array<string>;
        staffAgencyBranchInChargeIDArray: Array<string>;
      }
      interface StaffAgencyBranchInChargeItemAttributes {
        dataValues: StaffAgencyBranchInChargeAttributes;
      }
      const {
        staffRoleIDArray,
        staffAgencyBranchInChargeIDArray,
      }: DeleteDataArrAttributes =
        // TODO: FIX
        foundUserStaff.dataValues.Staff.dataValues.StaffRoles.reduce(
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
            // TODO: fix
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
      interface CreateDataArrAttributes {
        newStaffRoleRowArr: Array<{
          id: string;
          role_id: string;
          staff_id: string;
        }>;
        newStaffAgencyBranchInChargeRowArr: Array<{
          staff_role_id: string;
          agency_branch_id: string;
        }>;
      }
      const staffID: string = foundUserStaff.dataValues.Staff.id;

      interface RolesInputAttributes {
        role_id: string;
        agencyBranches_inCharge_id_list: Array<string>;
      }

      const {
        newStaffRoleRowArr,
        newStaffAgencyBranchInChargeRowArr,
      }: CreateDataArrAttributes = roles.reduce(
        (result: CreateDataArrAttributes, role: RolesInputAttributes) => {
          const { role_id, agencyBranches_inCharge_id_list } = role;
          const staffRoleID: string = uuidv4();

          result.newStaffRoleRowArr.push({
            id: staffRoleID,
            role_id,
            staff_id: staffID,
          });

          agencyBranches_inCharge_id_list.forEach((agencyBranch_id: string) => {
            result.newStaffAgencyBranchInChargeRowArr.push({
              staff_role_id: staffRoleID,
              agency_branch_id: agencyBranch_id,
            });
          });

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
      res
        .status(STATUS_CODE.STATUS_CODE_200)
        .send(RestFullAPI.onSuccess(STATUS_MESSAGE.SUCCESS));
    } catch (err) {
      next(err);
    }
  }
}
export default StaffController;
