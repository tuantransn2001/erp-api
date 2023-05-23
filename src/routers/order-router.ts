import { Router } from "express";
import OrderController from "../controller/order-controller";
import { errorHandler } from "../middlewares";
const orderRouter = Router();

orderRouter.post(
  "/import/create",
  OrderController.checkValidOrderDataInputBeforeModify,
  OrderController.Import().create,
  errorHandler
);

export default orderRouter;
