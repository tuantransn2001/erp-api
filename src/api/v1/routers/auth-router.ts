import { Router } from "express";
import AuthController from "../controller/auth-controller";
<<<<<<< HEAD
const authRouter = Router();

authRouter.post("/login", AuthController.login);
=======
import { authenticate, errorHandler } from "../middlewares";
const authRouter = Router();

authRouter
  .post("/login", AuthController.login)
  .get("/me", authenticate, AuthController.me, errorHandler);
>>>>>>> dev/api-v2

export default authRouter;
