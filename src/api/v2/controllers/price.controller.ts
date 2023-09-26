import { NextFunction, Request, Response } from "express";
import db from "../models";
import { STATUS_CODE, STATUS_MESSAGE } from "../ts/enums/api_enums";
import RestFullAPI from "../utils/response/apiResponse";
import { map as mapAsync } from "awaity";
import { BaseModelHelper } from "../services/helpers/baseModelHelper/baseModelHelper";
import {
  CreateAsyncPayload,
  GetAllAsyncPayload,
  GetByIdAsyncPayload,
  SoftDeleteByIDAsyncPayload,
  UpdateAsyncPayload,
} from "../services/helpers/baseModelHelper/shared/baseModelHelper.interface";
import {
  CreatePriceItemRowDTO,
  UpdatePriceItemRowDTO,
} from "../dto/input/price/price.interface";
import { ObjectType } from "../ts/types/common";
import { handleServerResponse } from "../utils/response/handleServerResponse";
import { isEmpty } from "../common";
const { Price } = db;

type IsImportOrSellDefaultPrice = {
  isSellDefault: boolean;
  isImportDefault: boolean;
};

class PriceController {
  public async checkDefaultPriceMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;

      const getPriceByIdData: GetByIdAsyncPayload = {
        Model: Price,
        where: {
          id,
        },
      };

      const { data: foundPrice } = await BaseModelHelper.getOneAsync(
        getPriceByIdData
      );

      const IsPriceDefaultObj: IsImportOrSellDefaultPrice = {
        isSellDefault: foundPrice.data.dataValues.isSellDefault,
        isImportDefault: foundPrice.data.dataValues.isImportDefault,
      };

      const isPriceDefault = Object.values(IsPriceDefaultObj).some(
        (isDefault) => isDefault
      );

      if (!isPriceDefault) {
        next();
      } else {
        const errorMess: string[] = [];
        Object.keys(IsPriceDefaultObj).map((key, index) => {
          if (Object.values(IsPriceDefaultObj)[index]) {
            errorMess.push(
              `Can not modified price with id: ${id} while ${key} is default`
            );
          }
        });

        res
          .status(STATUS_CODE.BAD_GATEWAY)
          .send(RestFullAPI.onSuccess(STATUS_MESSAGE.BAD_REQUEST, errorMess));
      }
    } catch (err) {
      next(err);
    }
  }
  private static async handleDisableDefaultPriceAlreadyExist(
    payload: IsImportOrSellDefaultPrice
  ) {
    const bulkUpdatePayload = Object.keys(payload).reduce(
      (res, currentDefaultPriceStatusKey) => {
        const isDefault = payload[currentDefaultPriceStatusKey];
        if (isDefault) {
          const dto: ObjectType<boolean> = {
            [currentDefaultPriceStatusKey]: !isDefault,
          };
          const where: ObjectType<boolean> = {
            [currentDefaultPriceStatusKey]: isDefault,
          };
          res.push({
            dto,
            where,
          } as never);
        }

        return res;
      },
      []
    );

    if (!isEmpty(bulkUpdatePayload)) {
      const bulkUpdateRes = await mapAsync(
        bulkUpdatePayload,
        async ({ dto, where }) => {
          const updateData: UpdateAsyncPayload<ObjectType<boolean>> = {
            Model: Price,
            dto,
            where,
          };

          return await BaseModelHelper.updateAsync(updateData);
        }
      );

      const { statusCode, data } = await RestFullAPI.onArrayPromiseSuccess(
        bulkUpdateRes
      );

      return handleServerResponse(statusCode, data);
    }

    return handleServerResponse(
      STATUS_CODE.OK,
      RestFullAPI.onSuccess(STATUS_MESSAGE.ACCEPTED)
    );
  }
  public async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const getTypeAllData: GetAllAsyncPayload = {
        ...BaseModelHelper.getPagination(req),
        Model: Price,
        attributes: [
          "id",
          "price_type",
          "price_description",
          "isImportDefault",
          "isSellDefault",
          "createdAt",
          "updatedAt",
        ],
      };

      const { statusCode, data } = await BaseModelHelper.getAllAsync(
        getTypeAllData
      );

      res.status(statusCode).send(data);
    } catch (err) {
      next(err);
    }
  }
  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { price_type, price_description, isImportDefault, isSellDefault } =
        req.body;

      const shouldSwitchToDefault = isImportDefault ?? isSellDefault;

      if (shouldSwitchToDefault) {
        const data: IsImportOrSellDefaultPrice = {
          isImportDefault,
          isSellDefault,
        };
        await PriceController.handleDisableDefaultPriceAlreadyExist(data);
      }

      const createPriceData: CreateAsyncPayload<CreatePriceItemRowDTO> = {
        Model: Price,
        dto: { price_type, price_description, isImportDefault, isSellDefault },
      };

      const { statusCode, data } = await BaseModelHelper.createAsync(
        createPriceData
      );

      res.status(statusCode).send(data);
    } catch (err) {
      next(err);
    }
  }
  public async softDeleteByID(req: Request, res: Response, next: NextFunction) {
    try {
      const softDeletePriceData: SoftDeleteByIDAsyncPayload = {
        Model: Price,
        id: req.params.id,
      };
      const { statusCode, data } = await BaseModelHelper.softDeleteByIdAsync(
        softDeletePriceData
      );

      res.status(statusCode).send(data);
    } catch (err) {
      next(err);
    }
  }
  public async updateByID(req: Request, res: Response, next: NextFunction) {
    try {
      const { price_type, price_description, isImportDefault, isSellDefault } =
        req.body;

      const shouldSwitchToDefault = isImportDefault ?? isSellDefault;

      if (shouldSwitchToDefault) {
        const data: IsImportOrSellDefaultPrice = {
          isImportDefault,
          isSellDefault,
        };
        await PriceController.handleDisableDefaultPriceAlreadyExist(data);
      }

      const updatePriceData: UpdateAsyncPayload<UpdatePriceItemRowDTO> = {
        Model: Price,
        dto: { price_type, price_description, isImportDefault, isSellDefault },
        where: { id: req.params.id },
      };

      const { statusCode, data } = await BaseModelHelper.updateAsync(
        updatePriceData
      );

      res.status(statusCode).send(data);
    } catch (err) {
      next(err);
    }
  }
}

export default PriceController;
