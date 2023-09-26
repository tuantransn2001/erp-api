import { Router } from "express";
import PaymentController from "../controllers/payment.controller";
import { errorCatcher } from "../middlewares";

const paymentRouter = Router();

const _PaymentController = new PaymentController();

paymentRouter.get("/get-all", _PaymentController.getAll, errorCatcher);

export default paymentRouter;
