import { Router } from "express";
const priceRouter = Router();
import PriceController from "../controller/price-controller";
import {
  errorHandler,
  checkExist,
  authenticate,
  authorize,
} from "../middlewares";
import db from "../models";
const { Price } = db;

priceRouter
  .get(
    "/get-all",
    authenticate,
    authorize,
    PriceController.getAll,
    errorHandler
  )
  .post(
    "/create",
    authenticate,
    authorize,
    PriceController.create,
    errorHandler
  )
  .patch(
    "/update-by-id/:id",
    authenticate,
    authorize,
    checkExist(Price),
    PriceController.checkDefaultPrice,
    PriceController.updateByID,
    errorHandler
  )
  .delete(
    "/delete-by-id/:id",
    authenticate,
    authorize,
    checkExist(Price),
    PriceController.checkDefaultPrice,
    PriceController.deleteByID,
    errorHandler
  );

export default priceRouter;
