import { Router } from "express";
import { HealthCheckerController } from "../controller/healthChecker.controller";
import { errorCatcher } from "../middlewares";

const healthCheckerRouter = Router();

const _HealthCheckerController = new HealthCheckerController();

healthCheckerRouter.get(
  "/screen",
  _HealthCheckerController.screen,
  errorCatcher
);

export default healthCheckerRouter;
