import { NextFunction, Request, Response } from "express";
import { Schema, ZodError } from "zod";
import { STATUS_CODE } from "../../ts/enums/api_enums";
import { handleError } from "../../utils/handleError/handleError";

export const ZodValidationMiddleware =
  (schema: Schema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = req.body;
      schema.parse(input);
      return next();
    } catch (err) {
      res.status(STATUS_CODE.BAD_REQUEST).send(handleError(err as ZodError));
    }
  };
