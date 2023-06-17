import { Router } from "express";
import PaymentController from "../controller/payment-controller";
import { authenticate, errorHandler } from "../middlewares";

const paymentRouter = Router();

paymentRouter.get(
  "/get-all",
  authenticate,
  PaymentController.getAll,
  errorHandler
);

export default paymentRouter;
