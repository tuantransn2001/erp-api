require("dotenv").config();
import { NextFunction, Request, Response } from "express";
import { UserAttributes } from "@/src/ts/interfaces/app_interfaces";
import HashStringHandler from "../utils/hashString/string.hash";
import jwt from "jsonwebtoken";
import db from "../models";
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

            res.status(201).send({
              status: "Login Success",
              token,
            });
            break;
          }
          case false: {
            res.status(403).send({
              status: "Fail",
              message: `Password is in-correct ! Please check it and try again!`,
            });
            break;
          }
        }
      } else {
        // * Case does not exist
        res.status(404).send({
          status: "Not found",
          message: `User with phone: ${phone} doesn't exist ! Please check it and try again!`,
        });
      }
    } catch (err) {
      next(err);
    }
  }
}

export default AuthController;
