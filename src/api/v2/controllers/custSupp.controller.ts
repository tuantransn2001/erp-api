import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { handleFormatUpdateDataByValidValue, isNullOrFalse } from "../common";
import db from "../models";
const { UserAddress, Staff, User, CustSuppTag, Tag } = db;
import { BaseModelHelper } from "../services/helpers/baseModelHelper/baseModelHelper";
import {
  GetAllAsyncPayload,
  GetByIdAsyncPayload,
} from "../services/helpers/baseModelHelper/shared/baseModelHelper.interface";
import {
  CreateCustSuppRowDTO,
  UpdateCustSuppRowDTO,
} from "../dto/input/custSupp/custSupp.interface";
import { CreateCustSuppDTO } from "../dto/input/custSupp/custSupp.interface";
import {
  CreateUserRowDTO,
  UpdateUserRowDTO,
} from "../dto/input/user/user.interface";
import { BulkCreateUserAddressItemRowDTO } from "../dto/input/userAddress/userAddress.interface";

import { CUSTSUPP_STATUS, USER_TYPE } from "../ts/enums/app_enums";
import RestFullAPI from "../utils/response/apiResponse";
import { UserModelHelper } from "../services/helpers/userModelHelper/userModelHelper";
import { CustSuppModelHelper } from "../services/helpers/custSuppModelHelper/custSuppModelHelper";
import { UserAddressModelHelper } from "../services/helpers/userAddressModelHelper/userAddressModelHelper";

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
          isDelete: isNullOrFalse,
          user_type: CustSuppController._user_type,
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
            model: db.CustSupp,
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
            model: db.CustSupp,
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

      const { statusCode, data } = await BaseModelHelper.getOneAsync(
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
        status,
        staff_id,
        staff_in_charge_note,
        address_list,
      }: CreateCustSuppDTO = req.body;

      const user_id = uuidv4();

      const createUserPayload: CreateUserRowDTO = {
        id: user_id,
        user_type: CustSuppController._user_type,
        user_name,
        user_phone,
        user_email,
      };
      const createUserRes = UserModelHelper.createAsync(createUserPayload);

      const createCustomerPayload: CreateCustSuppRowDTO = {
        user_id,
        staff_id,
        staff_in_charge_note,
        status: status ? status : CUSTSUPP_STATUS.TRADING,
      };

      const createCustomerRes = CustSuppModelHelper.createAsync(
        createCustomerPayload
      );

      const createUserAddressPayload: BulkCreateUserAddressItemRowDTO =
        address_list.map((address) => ({ ...address, user_id }));

      const createUserAddressRes = UserAddressModelHelper.bulkCreateAsync(
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

      const { statusCode, data } = await UserModelHelper.softDeleteByIdAsync(
        id
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
        },
        include: [
          {
            model: db.CustSupp,
            where: {
              isDelete: isNullOrFalse,
            },
          },
        ],
      };

      const { data: userIncludeCustomerData } =
        await BaseModelHelper.getOneAsync(getUserData);

      const { CustSupp, ...rest } = userIncludeCustomerData.data.dataValues;

      const { user_name, user_phone, user_email } = req.body;
      const updateUserData: UpdateUserRowDTO =
        handleFormatUpdateDataByValidValue(
          { user_name, user_phone, user_email },
          { ...rest }
        );

      const updateUserRowRes = await UserModelHelper.updateByIdAsync(
        updateUserData
      );

      const { status, staff_id, staff_in_charge_note } = req.body;
      const updateCustSuppData: UpdateCustSuppRowDTO =
        handleFormatUpdateDataByValidValue(
          {
            status,
            staff_id,
            staff_in_charge_note,
          },
          CustSupp.dataValues
        );

      const updateCustomerRowRes = await CustSuppModelHelper.updateByIdAsync(
        updateCustSuppData
      );

      const { tags } = req.body;

      const updateTagRes = await BaseModelHelper.updateJunctionRecord({
        JunctionModel: CustSuppTag,
        ownerQuery: {
          custSupp_id: userIncludeCustomerData.data.CustSupp.dataValues.id,
        },
        attrs: tags,
      });

      const { statusCode, data } = await RestFullAPI.onArrayPromiseSuccess([
        updateUserRowRes,
        updateCustomerRowRes,
        updateTagRes,
      ]);
      res.status(statusCode).send(data);
    } catch (err) {
      next(err);
    }
  }
  public async multipleSoftDeleteCustomer(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { ids } = req.body;

      const { statusCode, data } =
        await UserModelHelper.multipleSoftDeleteByIdsAsync(ids);

      res.status(statusCode).send(data);
    } catch (err) {
      next(err);
    }
  }
}

export default CustSuppController;
