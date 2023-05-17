import { Request, Response } from "express";
import HttpException from "@/src/utils/exceptions/http.exception";

function errorHandler(error: HttpException, _: Request, res: Response): void {
  const status = error.status || 500;
  const message = error.message || "Something in sever went wrong";
  res.status(status).send({
    status,
    message,
  });
}

export default errorHandler;
