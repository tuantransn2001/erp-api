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
  handleFormatStaff,
  handleFormatUpdateDataByValidValue,
  randomStringByCharsetAndLength,
} from "../../src/common/";
import {
  StaffAttributes,
  UserAddressAttributes,
  StaffRoleAttributes,
  StaffAgencyBranchInChargeAttributes,
  UserAttributes,
  CustomerAttributes,
} from "@/src/ts/interfaces/app_interfaces";
class StaffController {
  public static async getAll(_: Request, res: Response, next: NextFunction) {
    try {
      const userStaffList = await User.findAll({
        where: {
          isDelete: null,
          user_type: "staff",
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
                  },
                ],
              },
            ],
          },
          {
            model: UserAddress,
          },
        ],
      });

      const roleList = await Role.findAll();
      const agencyBranchList = await AgencyBranch.findAll();
      res.status(200).send({
        status: "success",
        data: handleFormatStaff(
          userStaffList,
          roleList,
          agencyBranchList,
          "isArray"
        ),
      });
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
        user_code: randomStringByCharsetAndLength(
          "alphanumeric",
          6,
          "uppercase"
        ),
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
        res.status(201).send({
          status: "Success",
          newUserRow,
          message: "Create new staff successfully",
        });
      } else {
        res.status(409).send({
          status: "Conflict",
          message:
            "Create new staff fail - Please check request and try again!",
        });
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

      if (staff_address_list.length === 0) {
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

      res.status(201).send({
        status: "Success",
        message: "Update staff success!",
      });
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
      res.status(200).send({
        status: "success",
        message: "Delete customer successfully!",
      });
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
                StaffAgencyBranchInCharges: Array<StaffAgencyBranchInChargeItemAttributes>;
              };
            }
          ) => {
            // TODO: fix
            const id: string = staffRoleData.dataValues.id;

            const staffAgencyInChargeListArr: Array<StaffAgencyBranchInChargeItemAttributes> =
              staffRoleData.dataValues.StaffAgencyBranchInCharges;

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
      res.status(201).send({
        status: "Success",
        message: "Update staff role success!",
      });
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
        include: [
          {
            model: Staff,
            include: [
              {
                model: StaffRole,
                include: [
                  {
                    model: StaffAgencyBranchInCharge,
                  },
                ],
              },
            ],
          },
          {
            model: UserAddress,
          },
        ],
      });
      const roleList = await Role.findAll();
      const agencyBranchList = await AgencyBranch.findAll();
      res.status(200).send({
        status: "success",
        data: handleFormatStaff(
          userStaffList,
          roleList,
          agencyBranchList,
          "isObject"
        ),
      });
    } catch (err) {
      next(err);
    }
  }
}
export default StaffController;
