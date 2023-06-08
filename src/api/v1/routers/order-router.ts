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
  .patch(
    "/import/update-detail-by-id/:id",
    authenticate,
    checkExist(Order),
    OrderController.Import().updateDetailByID,
    errorHandler
  )
  .patch(
    "/import/update-status-by-id/:id",
    authenticate,
    checkExist(Order),
    OrderController.Import().updateStatusByID,
    errorHandler
  )
  .post("/purchase/create", OrderController.Purchase().create),
  errorHandler;

export default orderRouter;
