import { Router } from "express";
const priceRouter = Router();
import PriceController from "../controllers/price.controller";
import {
  CheckItemExistMiddleware,
  ZodValidationMiddleware,
} from "../middlewares";
import db from "../models";
import { CreatePriceItemRowSchema } from "../dto/input/price/price.schema";
const { Price } = db;

const _PriceController = new PriceController();

priceRouter
  .get("/get-all", _PriceController.getAll)
  .post(
    "/create",
    ZodValidationMiddleware(CreatePriceItemRowSchema),
    _PriceController.create
  )
  .patch(
    "/update-by-id/:id",
    CheckItemExistMiddleware(Price),
    _PriceController.checkDefaultPriceMiddleware,
    _PriceController.updateByID
  )
  .delete(
    "/delete-by-id/:id",
    CheckItemExistMiddleware(Price),
    _PriceController.checkDefaultPriceMiddleware,
    _PriceController.softDeleteByID
  );

export default priceRouter;
