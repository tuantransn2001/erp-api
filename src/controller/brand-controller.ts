import { NextFunction, Request, Response } from "express";
import db from "../models";
import { STATUS_CODE, STATUS_MESSAGE } from "../ts/enums/api_enums";
import RestFullAPI from "../utils/response/apiResponse";
const { Type } = db;

class BrandController {
  public static async getAll(_: Request, res: Response, next: NextFunction) {
    try {
      const brandList = await Type.findAll();

      res
        .status(STATUS_CODE.STATUS_CODE_200)
        .send(RestFullAPI.onSuccess(STATUS_MESSAGE.SUCCESS, brandList));
    } catch (err) {
      next(err);
    }
  }
}

export default BrandController;
