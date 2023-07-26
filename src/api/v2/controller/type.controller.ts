import { NextFunction, Request, Response } from "express";
import db from "../models";
import { STATUS_CODE, STATUS_MESSAGE } from "../../v1/ts/enums/api_enums";
import RestFullAPI from "../utils/response/apiResponse";
const { Type } = db;

class TypeController {
  public static async getAll(_: Request, res: Response, next: NextFunction) {
    try {
      const typeList = await Type.findAll();

      res
        .status(STATUS_CODE.STATUS_CODE_200)
        .send(RestFullAPI.onSuccess(STATUS_MESSAGE.SUCCESS, typeList));
    } catch (err) {
      next(err);
    }
  }
}

export default TypeController;
