import { Request, Response } from "express";
import HttpException from "@/src/api/v2/utils/exceptions/http.exception";

export const errorHandler = (
  error: HttpException,
  _: Request,
  res: Response
) => {
  const status = error.status || 500;
  const message = error.message || "Something in sever went wrong";
  res.status(status).send({
    status,
    message,
  });
};
