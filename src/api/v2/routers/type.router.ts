import { Router } from "express";
import TypeController from "../controllers/type.controller";
const typeRouter = Router();

const _TypeController = new TypeController();

typeRouter.get("/get-all", _TypeController.getAll);

export default typeRouter;
