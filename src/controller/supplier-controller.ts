import { Request, Response, NextFunction } from "express";
import db from "../models";
const { User, Customer, CustomerTag, Tag, UserAddress } = db;
import { handleFormatCustomer } from "../common";
class SupplierController {
  public static async getAll(_: Request, res: Response, next: NextFunction) {
    try {
      const supplierList = await User.findAll({
        where: {
          isDelete: null,
          user_type: "supplier",
        },
        include: [
          {
            model: Customer,
            include: [
              {
                model: CustomerTag,
                separate: true,
                include: [
                  {
                    model: Tag,
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

      res.status(200).send({
        status: "success",
        data: handleFormatCustomer(supplierList, "isArray"),
      });
    } catch (err) {
      next(err);
    }
  }
}

export default SupplierController;
