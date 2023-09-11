import { Router } from "express";
import AuthController from "../controller/auth.controller";
import { errorCatcher } from "../middlewares";
import { ZodValidationMiddleware } from "../middlewares";
import { LoginSchema } from "../dto/input/auth/auth.schema";

const authRouter = Router();

const _AuthController = new AuthController();

authRouter
  .post(
    "/login",
    ZodValidationMiddleware(LoginSchema),
    _AuthController.login,
    errorCatcher
  )
  .get("/me", _AuthController.me, errorCatcher);

export default authRouter;
