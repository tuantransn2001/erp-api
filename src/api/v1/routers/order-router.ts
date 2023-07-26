import { Router } from "express";
import OrderController from "../controller/order-controller";
import { checkExist, errorHandler } from "../middlewares";
import model from "../models";
const { Order } = model;
const orderRouter = Router();

orderRouter
  // ? ================================
  // ? Import
  // ? ================================
  .get("/get-all", OrderController.getAll)
  .get(
    "/get-by-id",

    checkExist(Order),
    OrderController.getByID,
    errorHandler
  )
  .post(
    "/import/create",

    OrderController.Import().create,
    errorHandler
  )
  .post("/sale/create", OrderController.Sale().create, errorHandler)
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
