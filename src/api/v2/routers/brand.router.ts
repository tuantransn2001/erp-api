import { Router } from "express";
import BrandController from "../controller/brand.controller";
import { errorHandler } from "../middlewares";

const brandRouter = Router();

brandRouter.get("/get-all", BrandController.getAll, errorHandler);

export default brandRouter;
