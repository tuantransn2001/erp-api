import { Router } from "express";
import BrandController from "../controllers/brand.controller";
import { errorCatcher } from "../middlewares";

const brandRouter = Router();

const _BrandController = new BrandController();

brandRouter.get("/get-all", _BrandController.getAll, errorCatcher);

export default brandRouter;
