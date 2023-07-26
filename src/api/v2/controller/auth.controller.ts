require("dotenv").config();
import { NextFunction, Request, Response } from "express";
import { MyRequest } from "../ts/interfaces/global_interfaces";
import { LoginDTO, MeDTO } from "../ts/dto/auth.dto";
import AuthServices from "../services/auth.services";

class AuthController {
  public static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { phone, password }: LoginDTO = req.body;

      const { statusCode, data } = await AuthServices.login({
        phone,
        password,
      });

      res.status(statusCode).send(data);
    } catch (err) {
      next(err);
    }
  }
  public static async me(req: MyRequest, res: Response, next: NextFunction) {
    try {
      const { currentUserID } = req as MeDTO;
      console.log(req.headers.token);
      const { statusCode, data } = await AuthServices.me({ currentUserID });
      res.status(statusCode).send(data);
    } catch (err) {
      next(err);
    }
  }
}

export default AuthController;
