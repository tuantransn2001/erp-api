import { NextFunction, Request, Response } from "express";
import db from "../models";
const { UserAddress } = db;
import {
  BulkCreateUserAddressItemRowDTO,
  BulkUpdateAddressItemRowDTO,
} from "../dto/input/userAddress/userAddress.interface";
import { SoftDeleteByIDAsyncPayload } from "../services/helpers/baseModelHelper/shared/baseModelHelper.interface";
import { BaseModelHelper } from "../services/helpers/baseModelHelper/baseModelHelper";
import { UserAddressModelHelper } from "../services/helpers/userAddressModelHelper/userAddressModelHelper";

class UserAddressController {
  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { address_list } = req.body;

      const bulkCreateUserAddressData: BulkCreateUserAddressItemRowDTO =
        address_list.map((address) => ({
          ...address,
          user_id: req.params.user_id,
        }));

      const { statusCode, data } = await UserAddressModelHelper.bulkCreateAsync(
        bulkCreateUserAddressData
      );
      res.status(statusCode).send(data);
    } catch (err) {
      next(err);
    }
  }
  public async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { address_list } = req.body;

      const bulkUpdateUserAddressData: BulkUpdateAddressItemRowDTO =
        address_list.map((address) => ({
          ...address,
          user_id: req.params.user_id,
        }));

      const { statusCode, data } = await UserAddressModelHelper.bulkUpdateAsync(
        bulkUpdateUserAddressData
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
