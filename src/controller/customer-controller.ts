import { NextFunction, Request, Response } from "express";
const { v4: uuidv4 } = require("uuid");
import db from "../models";
const { Customer, User, UserAddress, CustomerTag, Tag, Staff } = db;
import { handleFormatUpdateDataByValidValue, isEmpty } from "../../src/common";
import { handleFormatCustomer } from "../utils/format/customer.format";
import {
  UserAddressAttributes,
  CustomerAttributes,
  UserAttributes,
  TagAttributes,
  CustomerTagAttributes,
} from "@/src/ts/interfaces/app_interfaces";
import { STATUS_CODE, STATUS_MESSAGE } from "../ts/enums/api_enums";
import RestFullAPI from "../utils/response/apiResponse";
class CustomerController {
  public static async getAll(_: Request, res: Response, next: NextFunction) {
    try {
      const userCustomerList = await User.findAll({
        where: {
          isDelete: null,
          user_type: "customer",
        },
        attributes: ["id", "user_name", "user_code", "user_phone"],
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
            handleFormatCustomer(userCustomerList, "isArray")
          )
        );
    } catch (err) {
      next(err);
    }
  }
  public static async getByID(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params; // ? This id is belongs to User

      const foundCustomer = await User.findOne({
        where: {
          isDelete: null,
          user_type: "customer",
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
                attributes: ["id"],
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
  public static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        user_name,
        user_code,
        user_phone,
        user_email,
        customer_status,
        address_list,
        staff_id,
        staff_in_charge_note,
        tags,
      } = req.body;

      const userID: string = uuidv4();
      const newUserRow: UserAttributes = {
        id: userID,
        user_code,
        user_phone,
        user_email,
        user_name,
        user_type: "customer",
        user_password: null,
        isDelete: null,
      };
      const customerID: string = uuidv4();
      const newCustomerRow: CustomerAttributes = {
        id: customerID,
        user_id: newUserRow.id,
        staff_id,
        staff_in_charge_note,
        customer_status,
      };

      const userAddressRowArray: Array<UserAddressAttributes> =
        address_list.map((address: UserAddressAttributes) => {
          const { user_province, user_district, user_specific_address } =
            address;
          return {
            user_id: userID,
            user_province,
            user_district,
            user_specific_address,
          };
        });

      const customerTagRowArray: Array<CustomerTagAttributes> = tags.map(
        (tagID: TagAttributes) => {
          return {
            owner_id: customerID,
            tag_id: tagID,
          };
        }
      );

      if (
        newUserRow &&
        newCustomerRow &&
        userAddressRowArray &&
        customerTagRowArray
      ) {
        await User.create(newUserRow);
        await Customer.create(newCustomerRow);
        await UserAddress.bulkCreate(userAddressRowArray);
        await CustomerTag.bulkCreate(customerTagRowArray);

        res
          .status(STATUS_CODE.STATUS_CODE_201)
          .send(RestFullAPI.onSuccess(STATUS_MESSAGE.SUCCESS));
      } else {
        res
          .status(STATUS_CODE.STATUS_CODE_409)
          .send(RestFullAPI.onSuccess(STATUS_MESSAGE.CONFLICT));
      }
    } catch (err) {
      next(err);
    }
  }
  public static async deleteByID(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params; // ? ID nay la user id
      const foundUser = await User.findByPk(id);
      foundUser.isDelete = true;
      foundUser.save();
      res
        .status(STATUS_CODE.STATUS_CODE_200)
        .send(RestFullAPI.onSuccess(STATUS_MESSAGE.SUCCESS));
    } catch (err) {
      next(err);
    }
  }
  public static async updatePersonalInfoByID(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const {
        user_code,
        user_name,
        user_phone,
        user_email,
        customer_status,
        staff_id,
        staff_in_charge_note,
        tags,
      } = req.body;
      const { id } = req.params;
      const foundUser = await User.findByPk(id);
      const foundCustomer = await Customer.findOne({
        where: {
          user_id: id,
        },
      });

      const userRowUpdated: UserAddressAttributes =
        handleFormatUpdateDataByValidValue(
          {
            user_code,
            user_name,
            user_phone,
            user_email,
          },
          foundUser.dataValues
        );
      const customerRowUpdated: CustomerAttributes =
        handleFormatUpdateDataByValidValue(
          {
            customer_status,
            staff_id,
            staff_in_charge_note,
          },
          foundCustomer.dataValues
        );
      const customerID: string = foundCustomer.dataValues.id;
      const customerTagRowArr: Array<CustomerTagAttributes> = tags.map(
        (tagID: string) => {
          return {
            customer_id: customerID,
            tag_id: tagID,
            updatedAt: new Date(),
          };
        }
      );

      if (!isEmpty(userRowUpdated)) {
        await User.update(userRowUpdated, {
          where: {
            id: foundUser.id,
          },
        });
      }
      if (!isEmpty(customerRowUpdated)) {
        await foundCustomer.set(customerRowUpdated);
        await foundCustomer.save();
      }
      if (tags.length > 0) {
        await CustomerTag.destroy({
          where: {
            customer_id: customerID,
          },
        });
        await CustomerTag.bulkCreate(customerTagRowArr);
      } else {
        await CustomerTag.destroy({
          where: {
            customer_id: customerID,
          },
        });
      }
      res
        .status(STATUS_CODE.STATUS_CODE_200)
        .send(RestFullAPI.onSuccess(STATUS_MESSAGE.SUCCESS));
    } catch (err) {
      next(err);
    }
  }
}

export default CustomerController;
