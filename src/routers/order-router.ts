import { Router } from "express";
import OrderController from "../controller/order-controller";
import { checkExist, errorHandler } from "../middlewares";
import model from "../models";
const { Order } = model;
const orderRouter = Router();

orderRouter
  .get("/import/get-all", OrderController.Import().getAll)
  .patch(
    "/import/update-by-id/:id",
    checkExist(Order),
    OrderController.Import().updateByID,
    errorHandler
  )
  .post(
    "/import/create",
    OrderController.checkValidOrderDataInputBeforeModify,
    OrderController.Import().create,
    errorHandler
  );

export default orderRouter;
