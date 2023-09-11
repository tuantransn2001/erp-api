import { NextFunction, Request, Response } from "express";
import db from "../models";
import { BaseModelHelper } from "../services/helpers/baseModelHelper/baseModelHelper";
import { GetAllAsyncPayload } from "../services/helpers/baseModelHelper/shared/baseModelHelper.interface";
const { Type } = db;

class TypeController {
  public async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const getTypeAllData: GetAllAsyncPayload = {
        ...BaseModelHelper.getPagination(req),
        Model: Type,
      };

      const { statusCode, data } = await BaseModelHelper.getAllAsync(
        getTypeAllData
      );

      res.status(statusCode).send(data);
    } catch (err) {
      next(err);
    }
  }
}

export default TypeController;
