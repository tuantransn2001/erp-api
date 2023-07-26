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
<<<<<<< HEAD
    authenticate,
    OrderController.Import().create,
    errorHandler
  )
=======

    OrderController.Import().create,
    errorHandler
  )
  .post("/sale/create", OrderController.Sale().create, errorHandler)
>>>>>>> dev/api-v2
  .patch(
    "/update-detail-by-id/:id",

    checkExist(Order),
    OrderController.Import().updateDetailByID,
    errorHandler
  )
  .patch(
    "/update-status-by-id/:id",

    checkExist(Order),
    OrderController.Import().updateStatusByID,
    errorHandler
  )
<<<<<<< HEAD
  .post("/create", OrderController.Purchase().create),
  errorHandler;
=======
  .patch("/pay", OrderController.pay, errorHandler);
>>>>>>> dev/api-v2

export default orderRouter;
