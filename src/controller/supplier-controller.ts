import { Request, Response, NextFunction } from "express";
import db from "../models";
import { STATUS_CODE, STATUS_MESSAGE } from "../ts/enums/api_enums";
const { User, Customer } = db;
import { handleFormatCustomer } from "../utils/format/customer.format";
import RestFullAPI from "../utils/response/apiResponse";
class SupplierController {
  public static async getAll(_: Request, res: Response, next: NextFunction) {
    try {
      const supplierList = await User.findAll({
        where: {
          isDelete: null,
          user_type: "supplier",
        },
        attributes: ["id", "user_name", "user_code", "user_phone", "user_type"],
        include: [
          {
            model: Customer,
            attributes: ["id", "customer_status", "createdAt"],
          },
        ],
      });

      res
        .status(STATUS_CODE.STATUS_CODE_200)
        .send(
          RestFullAPI.onSuccess(
            STATUS_MESSAGE.SUCCESS,
            handleFormatCustomer(supplierList, "isArray")
          )
        );
    } catch (err) {
      next(err);
    }
  }
}

export default SupplierController;
