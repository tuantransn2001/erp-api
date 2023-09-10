import db from "../models";
import * as jwt from "jsonwebtoken";
import HashStringHandler from "../utils/hashString/string.hash";
import env from "../constants/env";
import { STATUS_CODE, STATUS_MESSAGE } from "../ts/enums/api_enums";
import RestFullAPI from "../utils/response/apiResponse";
import { handleError } from "../utils/handleError/handleError";
import { LoginDTO } from "../ts/dto/input/auth/auth.interface";
import { GetMePayload } from "../ts/dto/input/auth/auth.payload";
import { GetMeSchema } from "../ts/dto/input/auth/auth.schema";
import { ServerError } from "../ts/types/common";
import { isNullOrFalse } from "../common";
const { User, Staff } = db;

class AuthServices {
  public static async login(payload: LoginDTO) {
    try {
      const { phone: user_phone, password } = payload;

      const foundUser = await User.findOne({
        attributes: ["id", "user_password"],
        where: {
          user_phone,
          isDelete: isNullOrFalse,
        },
      });

      // ? Check user is exist or not by phone
      if (foundUser) {
        // * Case Exist
        const userDB_PW = foundUser.dataValues.user_password as string;
        const isMatchPassword = HashStringHandler.verify(password, userDB_PW);
        switch (isMatchPassword) {
          case true: {
            const { id, user_name, user_type } = foundUser.dataValues;
            const tokenPayload = {
              id,
              user_name,
              user_type,
            };

            const tokenData = jwt.sign(
              tokenPayload,
              env.jwtSecretKey as string,
              {
                expiresIn: env.tokenExp,
              }
            );

            return {
              statusCode: STATUS_CODE.OK,
              data: RestFullAPI.onSuccess(STATUS_MESSAGE.SUCCESS, tokenData),
            };
          }
          case false: {
            return {
              statusCode: STATUS_CODE.UNAUTHORIZED,
              data: RestFullAPI.onFail(STATUS_MESSAGE.UN_AUTHORIZE),
            };
          }
        }
      } else {
        // * Case does not exist
        return {
          statusCode: STATUS_CODE.NOT_FOUND,
          data: RestFullAPI.onFail(STATUS_MESSAGE.NOT_FOUND),
        };
      }
    } catch (err) {
      return {
        statusCode: STATUS_CODE.INTERNAL_SERVER_ERROR,
        data: handleError(err as ServerError),
      };
    }
  }
  public static async me(payload: GetMePayload) {
    try {
      const data = GetMeSchema.parse(payload);
      const foundUser = await User.findOne({
        attributes: ["id", "user_code", "user_name", "user_type"],
        where: {
          id: data.currentUserID,
          isDelete: isNullOrFalse,
        },
        include: [
          {
            model: Staff,
            attributes: ["id"],
          },
        ],
      });

      const {
        id: user_id,
        user_code,
        user_name,
        user_type,
      } = foundUser.dataValues;
      const { id: staff_id } = foundUser.dataValues.Staff.dataValues;

      return {
        statusCode: STATUS_CODE.OK,
        data: RestFullAPI.onSuccess(STATUS_MESSAGE.SUCCESS, {
          user_id,
          user_type,
          staff_id,
          user_code,
          user_name,
        }),
      };
    } catch (err) {
      return {
        statusCode: STATUS_CODE.INTERNAL_SERVER_ERROR,
        data: handleError(err as ServerError),
      };
    }
  }
}

export default AuthServices;
