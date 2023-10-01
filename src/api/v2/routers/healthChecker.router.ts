import { Router } from "express";
import { HealthCheckerController } from "../controllers/healthChecker.controller";

const healthCheckerRouter = Router();

const _HealthCheckerController = new HealthCheckerController();

healthCheckerRouter.get("/screen", _HealthCheckerController.screen);

export default healthCheckerRouter;
