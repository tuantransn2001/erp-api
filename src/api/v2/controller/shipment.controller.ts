import { Request, Response, NextFunction } from "express";
import ShipmentServices from "../services/shipment.services";
import { STATUS_MESSAGE } from "../ts/enums/api_enums";
import RestFullAPI from "../utils/response/apiResponse";
class ShipmentController {
  public static async getAll(_: Request, res: Response, next: NextFunction) {
    try {
      const { statusCode, data } = await ShipmentServices.getAllOrderSale();
      res
        .status(statusCode)
        .send(RestFullAPI.onSuccess(STATUS_MESSAGE.SUCCESS, data));
    } catch (err) {
      next(err);
    }
  }
  public static async getByID(_: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).send("Get by id - building...");
    } catch (err) {
      next(err);
    }
  }
}

export default ShipmentController;
