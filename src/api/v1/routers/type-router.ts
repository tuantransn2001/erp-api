import { Router } from "express";
import TypeController from "../controller/brand-controller";
import { authenticate, errorHandler } from "../middlewares";

const typeRouter = Router();

typeRouter.get("/get-all", authenticate, TypeController.getAll, errorHandler);

export default typeRouter;
