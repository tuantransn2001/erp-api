import { Router } from "express";
import BrandController from "../controller/brand-controller";
import { authenticate, errorHandler } from "../middlewares";

const brandRouter = Router();

brandRouter.get("/get-all", authenticate, BrandController.getAll, errorHandler);

export default brandRouter;
