import { NextFunction, Request, Response } from "express";
import db from "../models";
const { Type } = db;

class TypeController {
  public static async getAll(_: Request, res: Response, next: NextFunction) {
    try {
      const typeList = await Type.findAll();

      res.status(200).send({
        status: "success",
        data: typeList,
      });
    } catch (err) {
      next(err);
    }
  }
}

export default TypeController;
