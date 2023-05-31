import { Request, Response, NextFunction } from "express";
import db from "../models";
import { STATUS_CODE, STATUS_MESSAGE } from "../ts/enums/api_enums";
const { User, Customer, Staff, CustomerTag, UserAddress, Tag } = db;
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
  public static async getByID(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const foundCustomer = await User.findOne({
        where: {
          isDelete: null,
          user_type: "supplier",
          id,
        },
        attributes: [
          "id",
          "user_name",
          "user_phone",
          "user_email",
          "user_code",
          "createdAt",
          "updatedAt",
        ],
        include: [
          {
            model: Customer,
            attributes: ["staff_in_charge_note", "customer_status"],
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
                model: CustomerTag,
                attributes: ["id", "tag_id"],
                include: [
                  {
                    model: Tag,
                    attributes: ["id", "tag_title"],
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

      res
        .status(STATUS_CODE.STATUS_CODE_200)
        .send(
          RestFullAPI.onSuccess(
            STATUS_MESSAGE.SUCCESS,
            handleFormatCustomer(foundCustomer, "isObject")
          )
        );
    } catch (err) {
      next(err);
    }
  }
}

export default SupplierController;
