import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { handleFormatUpdateDataByValidValue, isNullOrFalse } from "../common";

import db from "../models";
const { UserAddress, CustSupp, Staff, User, CustSuppTag, Tag } = db;
import { BaseModelHelper } from "../services/helpers/baseModelHelper";
import {
  GetAllAsyncPayload,
  GetByIdAsyncPayload,
  CreateAsyncPayload,
  BulkCreateAsyncPayload,
  SoftDeleteByIDAsyncPayload,
  UpdateAsyncPayload,
} from "../services/helpers/shared/baseModelHelper.interface";
import {
  CreateCustSuppRowDTO,
  UpdateCustSuppRowDTO,
} from "../dto/input/custSupp/custSupp.interface";
import { CreateCustSuppDTO } from "../dto/input/custSupp/custSupp.interface";
import {
  CreateUserRowDTO,
  UpdateUserRowDTO,
} from "../dto/input/user/user.interface";
import { CreateUserAddressItemRowDTO } from "../dto/input/userAddress/userAddress.interface";

import { CUSTSUPP_STATUS, USER_TYPE } from "../ts/enums/app_enums";
import RestFullAPI from "../utils/response/apiResponse";
class CustSuppController {
  public static _user_type: USER_TYPE | string = "";
  constructor(public user_type: USER_TYPE) {
    CustSuppController._user_type = user_type;
  }
  public async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const getAllAsyncData: GetAllAsyncPayload = {
        ...BaseModelHelper.getPagination(req),
        Model: User,
        where: {
          user_type: "supplier",
        },
        attributes: [
          "id",
          "user_name",
          "user_code",
          "user_phone",
          "user_type",
          "createdAt",
        ],
        include: [
          {
            model: CustSupp,
            attributes: ["id", "status", "createdAt"],
          },
        ],
      };

      const { statusCode, data } = await BaseModelHelper.getAllAsync(
        getAllAsyncData
      );

      res.status(statusCode).send(data);
    } catch (err) {
      next(err);
    }
  }
  public async getByID(req: Request, res: Response, next: NextFunction) {
    try {
      const getByIDAsyncData: GetByIdAsyncPayload = {
        Model: User,
        where: {
          isDelete: isNullOrFalse,
          id: req.params.id,
          user_type: CustSuppController._user_type,
        },
        attributes: [
          "id",
          "user_name",
          "user_phone",
          "user_email",
          "user_code",
          "user_type",
          "createdAt",
          "updatedAt",
        ],
        separate: true,
        include: [
          {
            model: UserAddress,
            where: {
              isDelete: isNullOrFalse,
            },
            attributes: [
              "id",
              "user_province",
              "user_district",
              "user_specific_address",
              "updatedAt",
              "createdAt",
            ],
          },
          {
            model: CustSupp,
            attributes: ["id", "staff_in_charge_note", "status"],
            include: [
              {
                model: Staff,
                attributes: ["id"],
                include: [
                  {
                    model: User,
                    attributes: ["id", "user_name"],
                  },
                ],
              },
              {
                model: CustSuppTag,
                attributes: ["id", "tag_id"],
                separate: true,
                include: [
                  {
                    model: Tag,
                    attributes: ["id", "tag_title"],
                  },
                ],
              },
            ],
          },
        ],
      };

      const { statusCode, data } = await BaseModelHelper.getByIDAsync(
        getByIDAsyncData
      );

      res.status(statusCode).send(data);
    } catch (err) {
      next(err);
    }
  }
  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        user_name,
        user_phone,
        user_email,
        user_password,
        status,
        staff_id,
        staff_in_charge_note,
        address_list,
      }: CreateCustSuppDTO = req.body;

      const user_id = uuidv4();

      const createUserPayload: CreateAsyncPayload<CreateUserRowDTO> = {
        Model: User,
        dto: {
          id: user_id,
          user_type: CustSuppController._user_type,
          user_name,
          user_phone,
          user_email,
          user_password,
        },
      };
      const createCustomerPayload: CreateAsyncPayload<CreateCustSuppRowDTO> = {
        Model: CustSupp,
        dto: {
          user_id,
          staff_id,
          staff_in_charge_note,
          status: status ? status : CUSTSUPP_STATUS.TRADING,
        },
      };
      const createUserAddressPayload: BulkCreateAsyncPayload<CreateUserAddressItemRowDTO> =
        {
          Model: UserAddress,
          dto: address_list.map((address) => ({ ...address, user_id })),
        };

      const createUserRes = await BaseModelHelper.createAsync(
        createUserPayload
      );

      const createCustomerRes = await BaseModelHelper.createAsync(
        createCustomerPayload
      );

      const createUserAddressRes = await BaseModelHelper.bulkCreateAsyncPayload(
        createUserAddressPayload
      );

      const { statusCode, data } = await RestFullAPI.onArrayPromiseSuccess([
        createUserRes,
        createCustomerRes,
        createUserAddressRes,
      ]);

      res.status(statusCode).send(data);
    } catch (err) {
      next(err);
    }
  }
  public async softDeleteByID(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const softDeleteData: SoftDeleteByIDAsyncPayload = { Model: User, id };

      const { statusCode, data } = await BaseModelHelper.softDeleteAsync(
        softDeleteData
      );

      res.status(statusCode).send(data);
    } catch (err) {
      next(err);
    }
  }
  public async updatePersonalInfoByID(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;

      const getUserData: GetByIdAsyncPayload = {
        Model: User,
        where: {
          isDelete: isNullOrFalse,
          id,
          user_type: CustSuppController._user_type,
        },
      };

      const { data: userData } = await BaseModelHelper.getByIDAsync(
        getUserData
      );

      const getCustomerData: GetByIdAsyncPayload = {
        Model: CustSupp,
        where: {
          user_id: userData.data.dataValues.id,
        },
      };

      const { data: customerData } = await BaseModelHelper.getByIDAsync(
        getCustomerData
      );

      const { user_name, user_phone, user_email } = req.body;
      const updateUserData: UpdateUserRowDTO =
        handleFormatUpdateDataByValidValue(
          { user_name, user_phone, user_email },
          userData.data.dataValues
        );

      const updateUserRecordData = {
        Model: User,
        dto: updateUserData,
        where: {
          id: `${updateUserData.id}`,
        },
      };

      const { status, staff_id, staff_in_charge_note } = req.body;
      const updateCustSuppData: UpdateCustSuppRowDTO =
        handleFormatUpdateDataByValidValue(
          { status, staff_id, staff_in_charge_note },
          customerData.data.dataValues
        );
      const updateCustSuppRecordData: UpdateAsyncPayload<UpdateCustSuppRowDTO> =
        {
          Model: CustSupp,
          dto: updateCustSuppData,
          where: {
            id: `${updateCustSuppData.id}`,
          },
        };

      const { tags } = req.body;

      const updateUserRes = await BaseModelHelper.updateAsync(
        updateUserRecordData
      );
      const updateCustomerRes = await BaseModelHelper.updateAsync(
        updateCustSuppRecordData
      );
      const updateTagRes = await BaseModelHelper.updateJunctionRecord({
        JunctionModel: CustSuppTag,
        ownerQuery: {
          custSupp_id: customerData.data.dataValues.id,
        },
        attrs: tags,
      });

      const { statusCode, data } = await RestFullAPI.onArrayPromiseSuccess([
        updateUserRes,
        updateCustomerRes,
        updateTagRes,
      ]);
      res.status(statusCode).send(data);
    } catch (err) {
      next(err);
    }
  }
}

export default CustSuppController;
