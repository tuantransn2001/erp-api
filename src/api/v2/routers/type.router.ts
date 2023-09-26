import { Router } from "express";
import TypeController from "../controllers/type.controller";
import { errorCatcher } from "../middlewares";
const typeRouter = Router();

const _TypeController = new TypeController();

typeRouter.get("/get-all", _TypeController.getAll, errorCatcher);

export default typeRouter;
