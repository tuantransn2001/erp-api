import { Request, Response, NextFunction } from "express";
import { healthCheckData } from "../common";
import APIGateWay from "../gateway/app.gateway";
import { STATUS_CODE, STATUS_MESSAGE } from "../ts/enums/api_enums";
import RestFullAPI from "../utils/response/apiResponse";
export class HealthCheckerController {
  public async screen(req: Request, res: Response, next: NextFunction) {
    try {
      const url = APIGateWay.getFullURL(req);

      const healthCheckResponse = {
        status: healthCheckData,
        url,
      };

      res
        .status(STATUS_CODE.OK)
        .send(
          RestFullAPI.onSuccess(STATUS_MESSAGE.SUCCESS, healthCheckResponse)
        );
    } catch (err) {
      next(err);
    }
  }
}
