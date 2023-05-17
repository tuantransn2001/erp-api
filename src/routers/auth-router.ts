import { Router } from "express";
import AuthController from "../controller/auth-controller";
import errorHandler from "../middlewares/errorHandler";
const authRouter = Router();

authRouter.post("/login", AuthController.login, errorHandler);

export default authRouter;
