import { Router } from "express";
import AuthController from "../controller/auth.controller";
import { errorHandler } from "../middlewares";
const authRouter = Router();

authRouter
  .post("/login", AuthController.login, errorHandler)
  .get("/me", AuthController.me, errorHandler);

export default authRouter;
