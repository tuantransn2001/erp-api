import { Router } from "express";
import ShipperController from "../controller/shipper.controller";
import { errorHandler } from "../middlewares";

const shipperRouter = Router();

shipperRouter.get(
  "/get-all",

  ShipperController.getAll,
  errorHandler
);

export default shipperRouter;
