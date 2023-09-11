import { NextFunction, Request, Response } from "express";
import db from "../models";
const { UserAddress } = db;
import {
  CreateUserAddressItemRowDTO,
  UpdateUserAddressItemRowDTO,
} from "../dto/input/userAddress/userAddress.interface";
import {
  CreateAsyncPayload,
  SoftDeleteByIDAsyncPayload,
  UpdateAsyncPayload,
} from "../services/helpers/shared/baseModelHelper.interface";
import { BaseModelHelper } from "../services/helpers/baseModelHelper";

class UserAddressController {
  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        user_province,
        user_district,
        user_specific_address,
      }: CreateUserAddressItemRowDTO = req.body;

      const createNewUserAddressData: CreateAsyncPayload<CreateUserAddressItemRowDTO> =
        {
          Model: UserAddress,
          dto: {
            user_id: req.params.id,
            user_province,
            user_district,
            user_specific_address,
          },
        };

      const { statusCode, data } = await BaseModelHelper.createAsync(
        createNewUserAddressData
      );
      res.status(statusCode).send(data);
    } catch (err) {
      next(err);
    }
  }
  public async update(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        user_province,
        user_district,
        user_specific_address,
      }: UpdateUserAddressItemRowDTO = req.body;

      const updateNewUserAddressData: UpdateAsyncPayload<UpdateUserAddressItemRowDTO> =
        {
          Model: UserAddress,
          where: {
            id: req.params.id,
          },
          dto: {
            user_province,
            user_district,
            user_specific_address,
          },
        };

      const { statusCode, data } = await BaseModelHelper.updateAsync(
        updateNewUserAddressData
      );

      res.status(statusCode).send(data);
    } catch (err) {
      next(err);
    }
  }
  public async softDeleteByID(req: Request, res: Response, next: NextFunction) {
    try {
      const softDeleteData: SoftDeleteByIDAsyncPayload = {
        Model: UserAddress,
        id: req.params.id,
      };

      const { statusCode, data } = await BaseModelHelper.softDeleteAsync(
        softDeleteData
      );

      res.status(statusCode).send(data);
    } catch (err) {
      next(err);
    }
  }
}

export default UserAddressController;
