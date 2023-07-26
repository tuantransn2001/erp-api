import db from "../models";
import * as jwt from "jsonwebtoken";
import HashStringHandler from "../utils/hashString/string.hash";
import { LoginDTO, MeDTO, TokenDTO } from "../ts/dto/auth.dto";
import env from "../constants/env";
import { STATUS_CODE, STATUS_MESSAGE } from "../ts/enums/api_enums";
import RestFullAPI from "../utils/response/apiResponse";
import { handleError } from "../utils/handleError/handleError";
const { User, Staff } = db;

class AuthServices {
  public static async login(payload: LoginDTO) {
    try {
      const { phone: user_phone, password } = payload;

      const foundUser = await User.findOne({
        attributes: ["id", "user_password"],
        where: {
          user_phone,
          isDelete: null,
        },
      });

      // ? Check user is exist or not by phone
      if (foundUser) {
        // * Case Exist
        const userDB_PW = foundUser.dataValues.user_password as string;
        const isMatchPassword = HashStringHandler.verify(password, userDB_PW);
        switch (isMatchPassword) {
          case true: {
            const { id, user_name } = foundUser.dataValues;
            const tokenPayload: TokenDTO = {
              id,
              user_name,
            };

            const tokenData = jwt.sign(
              tokenPayload,
              env.jwtSecretKey as string,
              {
                expiresIn: env.tokenExp,
              }
            );

            return {
              statusCode: STATUS_CODE.STATUS_CODE_200,
              data: RestFullAPI.onSuccess(STATUS_MESSAGE.SUCCESS, tokenData),
            };
          }
          case false: {
            return {
              statusCode: STATUS_CODE.STATUS_CODE_401,
              data: RestFullAPI.onFail(STATUS_MESSAGE.UN_AUTHORIZE),
            };
          }
        }
      } else {
        // * Case does not exist
        return {
          statusCode: STATUS_CODE.STATUS_CODE_404,
          data: RestFullAPI.onFail(STATUS_MESSAGE.NOT_FOUND),
        };
      }
    } catch (err) {
      return {
        statusCode: STATUS_CODE.STATUS_CODE_500,
        data: handleError(err as Error),
      };
    }
  }
  public static async me(payload: MeDTO) {
    try {
      const { currentUserID } = payload;
      const foundUser = await User.findOne({
        attributes: ["id", "user_code", "user_name"],
        where: {
          id: currentUserID,
          isDelete: null,
        },
        include: [
          {
            model: Staff,
            attributes: ["id"],
          },
        ],
      });

      const { id: user_id, user_code, user_name } = foundUser.dataValues;
      const { id: staff_id } = foundUser.dataValues.Staff.dataValues;

      return {
        statusCode: STATUS_CODE.STATUS_CODE_200,
        data: RestFullAPI.onSuccess(STATUS_MESSAGE.SUCCESS, {
          user_id,
          staff_id,
          user_code,
          user_name,
        }),
      };
    } catch (err) {
      return {
        statusCode: STATUS_CODE.STATUS_CODE_500,
        data: handleError(err as Error),
      };
    }
  }
}

export default AuthServices;
