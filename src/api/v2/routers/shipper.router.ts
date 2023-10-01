import { Router } from "express";
import ShipperController from "../controllers/shipper.controller";

const shipperRouter = Router();

const _ShipperController = new ShipperController();

shipperRouter.get("/get-all", _ShipperController.getAll);

export default shipperRouter;
