require("dotenv").config();
import { NextFunction, Request, Response } from "express";
import { UserAttributes } from "../../v1/ts/interfaces/app_interfaces";
import { STATUS_CODE, STATUS_MESSAGE } from "../../v1/ts/enums/api_enums";
import RestFullAPI from "../utils/response/apiResponse";
import HashStringHandler from "../utils/hashString/string.hash";
import jwt from "jsonwebtoken";
import db from "../models";
import { MyRequest } from "../ts/interfaces/global_interfaces";
const { User } = db;
class AuthController {
  public static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        phone,
        password,
      }: {
        phone: string;
        password: string;
      } = req.body;

      const foundUser: {
        dataValues: UserAttributes;
      } = await User.findOne({
        where: {
          user_phone: phone,
        },
      });
      // ? Check user is exist or not by phone
      if (foundUser) {
        // * Case Exist
        const userDB_PW: string = foundUser.dataValues.user_password as string;
        const isMatchPassword: boolean = HashStringHandler.verify(
          password,
          userDB_PW
        );
        switch (isMatchPassword) {
          case true: {
            const { id, user_name } = foundUser.dataValues;

            const tokenPayload: {
              id: string | undefined;
              user_name: string | undefined;
            } = {
              id,
              user_name,
            };

            const jwtSecretKey: string = process.env
              .JWT_TOKEN_SECRET_KEY as string;
            const token = jwt.sign(tokenPayload, jwtSecretKey, {
              expiresIn: "3d",
            });

            res
              .status(STATUS_CODE.STATUS_CODE_200)
              .send(RestFullAPI.onSuccess(STATUS_MESSAGE.SUCCESS, token));
            break;
          }
          case false: {
            res
              .status(STATUS_CODE.STATUS_CODE_401)
              .send(RestFullAPI.onSuccess(STATUS_MESSAGE.UN_AUTHORIZE));
            break;
          }
        }
      } else {
        // * Case does not exist
        res
          .status(STATUS_CODE.STATUS_CODE_404)
          .send(
            RestFullAPI.onSuccess(
              STATUS_MESSAGE.NOT_FOUND,
              `User with phone: ${phone} doesn't exist ! Please check it and try again!`
            )
          );
      }
    } catch (err) {
      next(err);
    }
  }
  public static async me(req: MyRequest, res: Response, next: NextFunction) {
    try {
      const foundUser = await User.findOne({
        attributes: ["id", "user_code", "user_name"],
        where: {
          id: req.currentUserID,
          isDelete: null,
        },
      });

      res
        .status(STATUS_CODE.STATUS_CODE_200)
        .send(RestFullAPI.onSuccess(STATUS_MESSAGE.SUCCESS, foundUser));
    } catch (err) {
      next(err);
    }
  }
}

export default AuthController;
