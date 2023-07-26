import { Router } from "express";
import PaymentController from "../controller/payment.controller";
import { errorHandler } from "../middlewares";

const paymentRouter = Router();

paymentRouter.get(
  "/get-all",

  PaymentController.getAll,
  errorHandler
);

export default paymentRouter;
