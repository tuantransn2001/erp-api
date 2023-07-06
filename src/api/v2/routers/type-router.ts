import { Router } from "express";
import TypeController from "../controller/type.controller";
import { errorHandler } from "../middlewares";

const typeRouter = Router();

typeRouter.get("/get-all", TypeController.getAll, errorHandler);

export default typeRouter;
