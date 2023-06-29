import { Router } from "express";
import AuthController from "../controller/auth-controller";
import { authenticate, errorHandler } from "../middlewares";
const authRouter = Router();

authRouter
  .post("/login", AuthController.login)
  .get("/me", authenticate, AuthController.me, errorHandler);

export default authRouter;
