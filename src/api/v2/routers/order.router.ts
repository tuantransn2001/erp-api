import { Router } from "express";
import OrderController from "../controller/order.controller";
import { checkExist, errorHandler } from "../middlewares";
import model from "../models";
import { ORDER_TYPE } from "../ts/enums/order_enum";
const { Order } = model;
const orderRouter = Router();

orderRouter
  // ? ================================
  // ? Import
  // ? ================================
  .get("/import/get-all", OrderController.getAll(ORDER_TYPE.IMPORT))
  .post("/import/create", OrderController.Import().create, errorHandler)
  .get("/sell/get-all", OrderController.getAll(ORDER_TYPE.SALE))
  .post("/sale/create", OrderController.Sale().create, errorHandler)
  .get("/get-by-id", checkExist(Order), OrderController.getByID, errorHandler)
  .patch(
    "/update-detail-by-id/:id",
    checkExist(Order),
    OrderController.updateDetailByID,
    errorHandler
  )
  .patch(
    "/update-status-by-id/:id",
    checkExist(Order),
    OrderController.updateStatusByID,
    errorHandler
  )
  .patch("/pay", OrderController.pay, errorHandler);

export default orderRouter;
