import { Router } from "express";
import AuthController from "../controllers/auth.controller";
import { ZodValidationMiddleware } from "../middlewares";
import { LoginSchema } from "../dto/input/auth/auth.schema";

const authRouter = Router();

const _AuthController = new AuthController();

authRouter
  .post("/login", ZodValidationMiddleware(LoginSchema), _AuthController.login)
  .get("/me", _AuthController.me);

export default authRouter;
