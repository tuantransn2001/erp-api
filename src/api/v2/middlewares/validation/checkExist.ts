import { reduce as asyncReduce } from "awaity";
import { STATUS_CODE, STATUS_MESSAGE } from "../../common/enums/api_enums";
import { Request, Response, NextFunction } from "express";
import { GetByIdAsyncPayload } from "../../services/helpers/baseModelHelper/shared/baseModelHelper.interface";
import { BaseModelHelper } from "../../services/helpers/baseModelHelper/baseModelHelper";
import RestFullAPI from "../../utils/response/apiResponse";
import { isEmpty } from "../../common/helper";
import HttpException from "../../utils/exceptions/http.exception";

export const CheckItemExistMiddleware =
  (Model: any) => async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body, req.params);
    try {
      const id = req.params.id ?? req.query.id;
      if (id) {
        const getItemByIdPayload: GetByIdAsyncPayload = {
          Model,
          where: {
            id,
          },
        };

        const { statusCode } = await BaseModelHelper.getOneAsync(
          getItemByIdPayload
        );
        const shouldStopAction = statusCode === STATUS_CODE.NOT_FOUND;
        if (shouldStopAction) {
          res
            .status(STATUS_CODE.NOT_FOUND)
            .send(RestFullAPI.onFail(STATUS_MESSAGE.NOT_FOUND));
        }
      }

      const ids = req.body.ids;

      if (ids) {
        const notFoundIdList = await asyncReduce(
          ids,
          async (res: string[], id: string) => {
            const getItemByIdPayload: GetByIdAsyncPayload = {
              Model,
              where: {
                id,
              },
            };

            const { statusCode, data } = await BaseModelHelper.getOneAsync(
              getItemByIdPayload
            );

            const isFound =
              statusCode === STATUS_CODE.OK && !data.data.dataValues.isDelete;

            if (!isFound) res.push(id);

            return res;
          },
          []
        );

        if (!isEmpty(notFoundIdList)) {
          res.status(STATUS_CODE.NOT_FOUND).send(
            RestFullAPI.onFail(STATUS_MESSAGE.NOT_FOUND, {
              message:
                "customers with id: " +
                notFoundIdList.join(" and ") +
                " does not exist!!",
            } as HttpException)
          );
        }
      }

      if (isEmpty(ids))
        res.status(STATUS_CODE.BAD_REQUEST).send(
          RestFullAPI.onFail(STATUS_MESSAGE.BAD_REQUEST, {
            message: `ids cannot be empty`,
          } as HttpException)
        );

      next();
    } catch (err) {
      next(err);
    }
  };
