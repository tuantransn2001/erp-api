import { NextFunction, Request, Response } from "express";
import db from "../models";
const { Type } = db;

class BrandController {
  public static async getAll(_: Request, res: Response, next: NextFunction) {
    try {
      const brandList = await Type.findAll();

      res.status(200).send({
        status: "success",
        data: brandList,
      });
    } catch (err) {
      next(err);
    }
  }
}

export default BrandController;
