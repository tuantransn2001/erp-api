import { Router } from "express";
import OrderController from "../controller/order-controller";
import { authenticate, checkExist, errorHandler } from "../middlewares";
import model from "../models";
const { Order } = model;
const orderRouter = Router();

orderRouter
  // ? ================================
  // ? Import
  // ? ================================
  .get("/get-all", authenticate, OrderController.getAll)
  .get(
    "/get-by-id",
    authenticate,
    checkExist(Order),
    OrderController.getByID,
    errorHandler
  )
  .post(
    "/import/create",
    authenticate,
    OrderController.Import().create,
    errorHandler
  )
  .post("/sale/create", OrderController.Sale().create, errorHandler)
  .patch(
    "/update-detail-by-id/:id",
    authenticate,
    checkExist(Order),
    OrderController.updateDetailByID,
    errorHandler
  )
  .patch(
    "/update-status-by-id/:id",
    authenticate,
    checkExist(Order),
    OrderController.updateStatusByID,
    errorHandler
  )
  .patch("/pay", authenticate, OrderController.pay, errorHandler);

export default orderRouter;
