import { Router } from "express";
import ShipperController from "../controller/shipper.controller";
import { errorCatcher } from "../middlewares";

const shipperRouter = Router();

const _ShipperController = new ShipperController();

shipperRouter.get("/get-all", _ShipperController.getAll, errorCatcher);

export default shipperRouter;
