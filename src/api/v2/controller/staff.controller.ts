import { v4 as uuidv4 } from "uuid";
import { map as mapAsync } from "awaity";
import { NextFunction, Request, Response } from "express";
import { isNullOrFalse } from "../common";
import db from "../models";
import { BaseModelHelper } from "../services/helpers/baseModelHelper";
import {
  BulkCreateAsyncPayload,
  CreateAsyncPayload,
  GetAllAsyncPayload,
  GetByIdAsyncPayload,
  SoftDeleteByIDAsyncPayload,
} from "../services/helpers/shared/baseModelHelper.interface";
import { STAFF_STATUS, USER_TYPE } from "../ts/enums/app_enums";
import RestFullAPI from "../utils/response/apiResponse";
import { CreateUserRowDTO } from "../dto/input/user/user.interface";
import { CreateUserAddressItemRowDTO } from "../dto/input/userAddress/userAddress.interface";
import {
  CreateStaffDTO,
  CreateStaffRowDTO,
} from "../dto/input/staff/staff.interface";
import { CreateUserRoleRowDTO } from "../dto/input/userRole/userRole.interface";
import { CreateUserAgencyBranchInChargeRowDTO } from "../dto/input/userAgencyBranchInCharge/userAgencyBranchInCharge.interface";
const {
  User,
  Staff,
  UserAddress,
  UserRole,
  UserAgencyBranchInCharge,
  Role,
  AgencyBranch,
} = db;
export class StaffController {
  public async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const getStaffData: GetAllAsyncPayload = {
        ...BaseModelHelper.getPagination(req),
        Model: User,
        where: {
          isDelete: isNullOrFalse,
          user_type: USER_TYPE.STAFF,
        },
        attributes: ["id", "user_name", "user_phone", "createdAt"],
        include: [
          {
            model: Staff,
            where: {
              isDelete: isNullOrFalse,
            },
            attributes: ["id", "staff_status"],
          },
        ],
      };

      const { statusCode, data } = await BaseModelHelper.getAllAsync(
        getStaffData
      );

      res.status(statusCode).send(data);
    } catch (err) {
      next(err);
    }
  }
  public async getByID(req: Request, res: Response, next: NextFunction) {
    try {
      const getStaffByIdData: GetByIdAsyncPayload = {
        Model: Staff,
        where: { id: req.params.id },
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
              isDelete: isNullOrFalse,
              user_type: USER_TYPE.STAFF,
            },
            include: [
              {
                model: UserRole,
                separate: true,
                attributes: ["id"],
                include: [
                  { model: Role, attributes: ["id", "role_title"] },
                  {
                    model: UserAgencyBranchInCharge,
                    separate: true,
                    as: "User_Agency_Branch_InCharge",
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
        ],
      };

      const { statusCode, data } = await BaseModelHelper.getByIDAsync(
        getStaffByIdData
      );

      res.status(statusCode).send(data);
    } catch (err) {
      next(err);
    }
  }
  public async create(req: Request, res: Response, next: NextFunction) {
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
        note_about_staff,
      }: CreateStaffDTO = req.body;

      const user_id = uuidv4();

      const createUserRowData: CreateAsyncPayload<CreateUserRowDTO> = {
        Model: User,
        dto: {
          id: user_id,
          user_phone,
          user_email,
          user_password,
          user_name,
          user_type: USER_TYPE.STAFF,
        },
      };

      const createUserRes = await BaseModelHelper.createAsync(
        createUserRowData
      );

      const createStaffRowData: CreateAsyncPayload<CreateStaffRowDTO> = {
        Model: Staff,
        dto: {
          note_about_staff,
          user_id,
          staff_status: STAFF_STATUS.WORKING,
          staff_birthday,
          staff_gender,
          isAllowViewImportNWholesalePrice,
          isAllowViewShippingPrice,
        },
      };

      const createStaffRowRes = await BaseModelHelper.createAsync(
        createStaffRowData
      );

      const bulkCreateUserAddressData: BulkCreateAsyncPayload<CreateUserAddressItemRowDTO> =
        {
          Model: UserAddress,
          dto: address_list.map((address) => ({ ...address, user_id })),
        };

      const bulkCreateUserAddressRes =
        await BaseModelHelper.bulkCreateAsyncPayload(bulkCreateUserAddressData);

      const bulkCreateUserRoleWithAgencyBranchInChargeRes =
        await RestFullAPI.onArrayPromiseSuccess(
          await mapAsync(roles, async (role) => {
            const user_role_id = uuidv4();
            const createUserRoleData: CreateAsyncPayload<CreateUserRoleRowDTO> =
              {
                Model: UserRole,
                dto: { id: user_role_id, user_id, role_id: role.role_id },
              };

            const createUserRoleRes = await BaseModelHelper.createAsync(
              createUserRoleData
            );

            const bulkCreateUserRoleAgencyBranchInChargeData: BulkCreateAsyncPayload<CreateUserAgencyBranchInChargeRowDTO> =
              {
                Model: UserAgencyBranchInCharge,
                dto: role.agencyBranches_inCharge.map((agency_branch_id) => ({
                  agency_branch_id,
                  user_role_id,
                })),
              };

            const bulkCreateUserRoleAgencyBranchInChargeRes =
              await BaseModelHelper.bulkCreateAsyncPayload(
                bulkCreateUserRoleAgencyBranchInChargeData
              );
            return await RestFullAPI.onArrayPromiseSuccess([
              createUserRoleRes,
              bulkCreateUserRoleAgencyBranchInChargeRes,
            ]);
          })
        );

      const { statusCode, data } = await RestFullAPI.onArrayPromiseSuccess([
        createUserRes,
        createStaffRowRes,
        bulkCreateUserAddressRes,
        bulkCreateUserRoleWithAgencyBranchInChargeRes,
      ]);

      res.status(statusCode).send(data);
    } catch (err) {
      next(err);
    }
  }
  public async softDeleteByID(req: Request, res: Response, next: NextFunction) {
    try {
      const softDeleteStaffData: SoftDeleteByIDAsyncPayload = {
        Model: Staff,
        id: req.params.id,
      };

      const { statusCode, data } = await BaseModelHelper.softDeleteAsync(
        softDeleteStaffData
      );

      res.status(statusCode).send(data);
    } catch (err) {
      next(err);
    }
  }
}
