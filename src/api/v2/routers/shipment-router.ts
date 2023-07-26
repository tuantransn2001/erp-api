import { Router } from "express";
import ShipmentController from "../controller/shipment.controller";
import { errorHandler } from "../middlewares";

const shipmentRouter = Router();

shipmentRouter
  .get("/get-all", ShipmentController.getAll, errorHandler)
  .get("/get-by-id", ShipmentController.getByID, errorHandler);

export default shipmentRouter;
