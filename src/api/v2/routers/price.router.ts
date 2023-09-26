import { Router } from "express";
const priceRouter = Router();
import PriceController from "../controllers/price.controller";
import {
  errorCatcher,
  CheckItemExistMiddleware,
  ZodValidationMiddleware,
} from "../middlewares";
import db from "../models";
import { CreatePriceItemRowSchema } from "../dto/input/price/price.schema";
const { Price } = db;

const _PriceController = new PriceController();

priceRouter
  .get("/get-all", _PriceController.getAll, errorCatcher)
  .post(
    "/create",
    ZodValidationMiddleware(CreatePriceItemRowSchema),
    _PriceController.create,
    errorCatcher
  )
  .patch(
    "/update-by-id/:id",
    CheckItemExistMiddleware(Price),
    _PriceController.checkDefaultPriceMiddleware,
    _PriceController.updateByID,
    errorCatcher
  )
  .delete(
    "/delete-by-id/:id",
    CheckItemExistMiddleware(Price),
    _PriceController.checkDefaultPriceMiddleware,
    _PriceController.softDeleteByID,
    errorCatcher
  );

export default priceRouter;
