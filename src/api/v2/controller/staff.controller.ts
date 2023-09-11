import { v4 as uuidv4 } from "uuid";

import { NextFunction, Request, Response } from "express";
import { handleFormatUpdateDataByValidValue, isNullOrFalse } from "../common";
import db from "../models";
import { BaseModelHelper } from "../services/helpers/baseModelHelper/baseModelHelper";
import {
  BulkCreateAsyncPayload,
  CreateAsyncPayload,
  GetAllAsyncPayload,
  GetByIdAsyncPayload,
  SoftDeleteByIDAsyncPayload,
} from "../services/helpers/baseModelHelper/shared/baseModelHelper.interface";
import { STAFF_STATUS, USER_TYPE } from "../ts/enums/app_enums";
import RestFullAPI from "../utils/response/apiResponse";
import {
  CreateUserRowDTO,
  UpdateUserRowDTO,
} from "../dto/input/user/user.interface";
import {
  BulkUpdateAddressItemRowDTO,
  CreateUserAddressItemRowDTO,
} from "../dto/input/userAddress/userAddress.interface";
import {
  CreateStaffRowDTO,
  UpdateStaffRowDTO,
} from "../dto/input/staff/staff.interface";
import { CreateUserRoleDTO } from "../dto/input/userRole/userRole.interface";

import { UserRoleModelHelper } from "../services/helpers/userRole/userRoleModelHelper";
import { UserModelHelper } from "../services/helpers/userModelHelper/userModelHelper";
import { StaffModelHelper } from "../services/helpers/staffModelHelper/staffModelHelper";
import { UserAddressModelHelper } from "../services/helpers/userAddressModelHelper/userAddressModelHelper";
const {
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
        Model: db.User,
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
            model: db.User,
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
      } = req.body;

      const user_id = uuidv4();

      const createUserRowData: CreateAsyncPayload<CreateUserRowDTO> = {
        Model: db.User,
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

      const bulkCreateUserRoleWithAgencyBranchInChargeData: CreateUserRoleDTO =
        {
          roles,
        };

      const bulkCreateUserRoleWithAgencyBranchInChargeRes =
        await UserRoleModelHelper.createAsync(
          bulkCreateUserRoleWithAgencyBranchInChargeData,
          user_id
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
  public async updateDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const staff_id = req.params.id;

      const getStaffByIdData: GetByIdAsyncPayload = {
        Model: Staff,
        where: { id: staff_id, isDelete: isNullOrFalse },
        include: [
          {
            model: db.User,
          },
        ],
      };

      const { data: staffIncludeUser } = await BaseModelHelper.getByIDAsync(
        getStaffByIdData
      );
      const { User, ...rest } = staffIncludeUser.data.dataValues;

      const user_id = User.dataValues.id;

      const {
        user_code,
        user_name,
        user_phone,
        user_email,
        staff_gender,
        staff_status,
        staff_birthday,
        note_about_staff,
        isAllowViewImportNWholesalePrice,
        isAllowViewShippingPrice,
        address_list,
        roles,
      } = req.body;

      const updateUserRowData: UpdateUserRowDTO =
        handleFormatUpdateDataByValidValue(
          {
            user_code,
            user_name,
            user_phone,
            user_email,
          },
          User.dataValues
        );

      const updateStaffRowData: UpdateStaffRowDTO =
        handleFormatUpdateDataByValidValue(
          {
            staff_gender,
            staff_status,
            staff_birthday,
            note_about_staff,
            isAllowViewImportNWholesalePrice,
            isAllowViewShippingPrice,
          },
          { ...rest }
        );

      const bulkUpdateUserAddressData: BulkUpdateAddressItemRowDTO =
        address_list.map(
          ({ user_district, user_province, user_specific_address }) => ({
            user_id: user_id,
            user_district,
            user_province,
            user_specific_address,
          })
        );
      const bulkUpdateUserAddressRes =
        await UserAddressModelHelper.bulkUpdateAsync(bulkUpdateUserAddressData);

      const updateUserRes = await UserModelHelper.updateByIdAsync(
        updateUserRowData
      );
      const updateStaffRes = await StaffModelHelper.updateByIdAsync(
        updateStaffRowData
      );
      const updateUserRoleRes = await UserRoleModelHelper.updateAsync(
        { roles },
        user_id
      );

      const { statusCode, data } = await RestFullAPI.onArrayPromiseSuccess([
        bulkUpdateUserAddressRes,
        updateUserRes,
        updateStaffRes,
        updateUserRoleRes,
      ]);
      res.status(statusCode).send(data);
    } catch (err) {
      next(err);
    }
  }
}
