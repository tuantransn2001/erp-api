import { Router } from "express";
import AuthController from "../controller/auth-controller";
const authRouter = Router();

authRouter.post("/login", AuthController.login);

export default authRouter;
