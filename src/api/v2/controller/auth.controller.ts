import { NextFunction, Request, Response } from "express";
import { MyRequest } from "../ts/interfaces/common";
import AuthServices from "../services/auth.services";
import { LoginDTO } from "../ts/dto/input/auth/auth.interface";
import { GetMePayload } from "../ts/dto/input/auth/auth.payload";

class AuthController {
  public async login(req: Request, res: Response, next: NextFunction) {
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
  public async me(req: MyRequest, res: Response, next: NextFunction) {
    try {
      const { currentUserID } = req as GetMePayload;
      const { statusCode, data } = await AuthServices.me({ currentUserID });
      res.status(statusCode).send(data);
    } catch (err) {
      next(err);
    }
  }
}

export default AuthController;
