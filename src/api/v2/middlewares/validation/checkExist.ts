import { STATUS_CODE, STATUS_MESSAGE } from "../../ts/enums/api_enums";
import { Request, Response, NextFunction } from "express";
import { GetByIdAsyncPayload } from "../../services/helpers/baseModelHelper/shared/baseModelHelper.interface";
import { BaseModelHelper } from "../../services/helpers/baseModelHelper/baseModelHelper";
import RestFullAPI from "../../utils/response/apiResponse";

export const CheckItemExistMiddleware =
  (Model: any) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id ?? req.query.id ?? req.body.id;

      const getItemByIdPayload: GetByIdAsyncPayload = {
        Model,
        where: {
          id,
        },
      };

      const { data } = await BaseModelHelper.getOneAsync(getItemByIdPayload);

      const shouldStopAction = data?.data.dataValues.isDelete;

      if (shouldStopAction) {
        res
          .status(STATUS_CODE.NOT_FOUND)
          .send(RestFullAPI.onSuccess(STATUS_MESSAGE.NOT_FOUND));
      } else {
        next();
      }
    } catch (err) {
      next(err);
    }
  };
