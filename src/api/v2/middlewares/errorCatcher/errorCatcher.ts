import { Request, Response } from "express";
import HttpException from "@/src/api/v2/utils/exceptions/http.exception";
import { STATUS_CODE, STATUS_MESSAGE } from "../../ts/enums/api_enums";

export const errorCatcher = (
  error: HttpException,
  _: Request,
  res: Response
) => {
  const status = error.status || STATUS_CODE.INTERNAL_SERVER_ERROR;
  const message = error.message || STATUS_MESSAGE.SERVER_ERROR;

  res.status(status).send({
    status,
    message,
  });
};
