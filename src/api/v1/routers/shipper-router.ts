import { Router } from "express";
import ShipperController from "../controller/shipper-controller";
import { authenticate, errorHandler } from "../middlewares";

const shipperRouter = Router();

shipperRouter.get(
  "/get-all",
  authenticate,
  ShipperController.getAll,
  errorHandler
);

export default shipperRouter;
