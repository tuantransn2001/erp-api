import { NextFunction, Request, Response } from "express";
import db from "../models";
const { UserAddress } = db;
<<<<<<< HEAD

=======
>>>>>>> dev/api-v2
import { handleFormatUpdateDataByValidValue } from "../../v1/common";
import { UserAddressAttributes } from "@/src/api/v1/ts/interfaces/app_interfaces";
import { STATUS_CODE, STATUS_MESSAGE } from "../../v1/ts/enums/api_enums";
import RestFullAPI from "../utils/response/apiResponse";
interface NewAddressAttributes {
  user_province: string;
  user_district: string;
  user_specific_address: string;
  user_id?: string;
}
class UserAddressController {
  public static async addNewAddressByUserID(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const { user_province, user_district, user_specific_address } = req.body;

      const newAddressRow: NewAddressAttributes = {
        user_id: id,
        user_province,
        user_district,
        user_specific_address,
      };

      await UserAddress.create(newAddressRow);
      res
        .status(STATUS_CODE.STATUS_CODE_201)
        .send(RestFullAPI.onSuccess(STATUS_MESSAGE.SUCCESS));
    } catch (err) {
      next(err);
    }
  }
  public static async updateAddressByID(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const { user_province, user_district, user_specific_address } = req.body;

      const foundAddress = await UserAddress.findByPk(id);
      const updateAddressRow: UserAddressAttributes =
        handleFormatUpdateDataByValidValue(
          {
            user_province,
            user_district,
            user_specific_address,
          },
          foundAddress.dataValues
        );

      await UserAddress.update(updateAddressRow, {
        where: {
          id,
        },
      });

      res
        .status(STATUS_CODE.STATUS_CODE_202)
        .send(RestFullAPI.onSuccess(STATUS_MESSAGE.SUCCESS));
    } catch (err) {
      next(err);
    }
  }
  public static async deleteAddressByID(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      await UserAddress.destroy({
        where: {
          id,
        },
      });

      res
        .status(STATUS_CODE.STATUS_CODE_202)
        .send(RestFullAPI.onSuccess(STATUS_MESSAGE.SUCCESS));
    } catch (err) {
      next(err);
    }
  }
}

export default UserAddressController;
