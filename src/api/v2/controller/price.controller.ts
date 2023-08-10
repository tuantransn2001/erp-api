import { NextFunction, Request, Response } from "express";
const { v4: uuidv4 } = require("uuid");
import { PriceAttributes } from "@/src/api/v2/ts/interfaces/entities_interfaces";
import db from "../models";
import { handleFormatUpdateDataByValidValue } from "../common";
import { STATUS_CODE, STATUS_MESSAGE } from "../ts/enums/api_enums";
import RestFullAPI from "../utils/response/apiResponse";
const { Price, ProductVariantPrice } = db;

type PriceTypeOnlyIsImportIsSell =
  | Omit<
      PriceAttributes,
      "id" | "price_type" | "price_description" | "isImportDefault"
    >
  | Omit<
      PriceAttributes,
      "id" | "price_type" | "price_description" | "isSellDefault"
    >;

class PriceController {
  static async checkDefaultPrice(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;

      const foundPrice = await Price.findOne({
        where: {
          id,
        },
      });

      const IsPriceDefaultObj: PriceTypeOnlyIsImportIsSell = {
        isSellDefault: foundPrice.dataValues.isSellDefault,
        isImportDefault: foundPrice.dataValues.isImportDefault,
      };

      const isPriceDefault = Object.values(IsPriceDefaultObj).some(
        (isDefault) => isDefault
      );

      if (!isPriceDefault) {
        next();
      } else {
        const NOTIFICATION: Array<string> = new Array();
        Object.keys(IsPriceDefaultObj).map((key, index) => {
          if (Object.values(IsPriceDefaultObj)[index]) {
            NOTIFICATION.push(
              `Cann't modified price with id: ${id} while ${key} is default`
            );
          }
        });

        res
          .status(STATUS_CODE.STATUS_CODE_406)
          .send(
            RestFullAPI.onSuccess(STATUS_MESSAGE.NOT_ACCEPTABLE, NOTIFICATION)
          );
      }
    } catch (err) {
      next(err);
    }
  }
  static async getAll(_: Request, res: Response, next: NextFunction) {
    try {
      const priceList = await Price.findAll();

      res
        .status(STATUS_CODE.STATUS_CODE_200)
        .send(RestFullAPI.onSuccess(STATUS_MESSAGE.SUCCESS, priceList));
    } catch (err) {
      next(err);
    }
  }
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { price_type, price_description, isImportDefault, isSellDefault } =
        req.body;

      const foundPrice = await Price.findOne({
        where: {
          price_type,
        },
      });

      if (foundPrice) {
        res
          .status(STATUS_CODE.STATUS_CODE_409)
          .send(
            RestFullAPI.onSuccess(
              STATUS_MESSAGE.CONFLICT,
              "Price has already been exists!"
            )
          );
      } else {
        if (isImportDefault | isSellDefault) {
          const whereConditionArray: Array<PriceTypeOnlyIsImportIsSell> = [
            {
              isSellDefault,
            },
            {
              isImportDefault,
            },
          ];

          whereConditionArray.forEach(async (whereCondition, index) => {
            if (Object.values(whereCondition)[0]) {
              const foundDefaultPrice = await Price.findOne({
                where: whereCondition,
              });

              await foundDefaultPrice.update({
                [Object.keys(whereConditionArray[index])[0]]: false,
              });
            }
          });
        }

        const newPriceRow:
          | Omit<PriceAttributes, "isImportDefault" | "isSellDefault">
          | PriceAttributes = {
          id: uuidv4(),
          price_type,
          price_description,
          isImportDefault,
          isSellDefault,
        };
        await Price.create(newPriceRow);
        res
          .status(STATUS_CODE.STATUS_CODE_201)
          .send(RestFullAPI.onSuccess(STATUS_MESSAGE.SUCCESS));
      }
    } catch (err) {
      next(err);
    }
  }
  static async deleteByID(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      await ProductVariantPrice.destroy({
        where: {
          price_id: id,
        },
      });
      await Price.destroy({
        where: {
          id,
        },
      });

      res
        .status(STATUS_CODE.STATUS_CODE_200)
        .send(RestFullAPI.onSuccess(STATUS_MESSAGE.SUCCESS));
    } catch (err) {
      next(err);
    }
  }
  static async updateByID(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { price_type, price_description } = req.body;

      const foundPrice = await Price.findOne({
        where: {
          id,
        },
      });

      const updatePriceRow: PriceAttributes =
        handleFormatUpdateDataByValidValue(
          { price_type, price_description },
          foundPrice.dataValues
        );

      await Price.update(updatePriceRow, {
        where: {
          id,
        },
      });

      res
        .status(STATUS_CODE.STATUS_CODE_200)
        .send(RestFullAPI.onSuccess(STATUS_MESSAGE.SUCCESS));
    } catch (err) {
      next(err);
    }
  }
}

export default PriceController;
