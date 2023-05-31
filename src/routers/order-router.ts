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
  .get("/import/get-all", authenticate, OrderController.Import().getAll)
  .get(
    "/import/get-by-id/:id",
    authenticate,
    checkExist(Order),
    OrderController.Import().getByID,
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
  .post(
    "/import/create",
    authenticate,
    OrderController.checkValidOrderDataInputBeforeModify,
    OrderController.Import().create,
    errorHandler
  );

export default orderRouter;
