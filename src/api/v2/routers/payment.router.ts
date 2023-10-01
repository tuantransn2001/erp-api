import { Router } from "express";
import PaymentController from "../controllers/payment.controller";

const paymentRouter = Router();

const _PaymentController = new PaymentController();

paymentRouter.get("/get-all", _PaymentController.getAll);

export default paymentRouter;
