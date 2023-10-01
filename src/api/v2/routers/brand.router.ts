import { Router } from "express";
import BrandController from "../controllers/brand.controller";

const brandRouter = Router();

const _BrandController = new BrandController();

brandRouter.get("/get-all", _BrandController.getAll);

export default brandRouter;
