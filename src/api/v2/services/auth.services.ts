import db from "../models";
import HashStringHandler from "../utils/hashString/string.hash";
import { STATUS_CODE, STATUS_MESSAGE } from "../ts/enums/api_enums";
import RestFullAPI from "../utils/response/apiResponse";
import { handleError } from "../utils/handleError/handleError";
import { LoginDTO } from "../dto/input/auth/auth.interface";
import { GetMePayload } from "../dto/input/auth/auth.payload";
import { GetMeSchema } from "../dto/input/auth/auth.schema";
import { ServerError } from "../ts/types/common";
import { isNullOrFalse } from "../common";
import { JwtServiceHelper } from "./helpers/jwtServiceHelper/jwtServiceHelper";
import { handleServerResponse } from "../utils/response/handleServerResponse";
import { GetByIdAsyncPayload } from "./helpers/baseModelHelper/shared/baseModelHelper.interface";
import { BaseModelHelper } from "./helpers/baseModelHelper/baseModelHelper";
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

            const tokenData = JwtServiceHelper.generateToken(tokenPayload);

            return handleServerResponse(
              STATUS_CODE.OK,
              RestFullAPI.onSuccess(STATUS_MESSAGE.SUCCESS, tokenData)
            );
          }
          case false: {
            return handleServerResponse(
              STATUS_CODE.UNAUTHORIZED,
              RestFullAPI.onFail(STATUS_MESSAGE.UN_AUTHORIZE)
            );
          }
        }
      } else {
        // * Case does not exist
        return handleServerResponse(
          STATUS_CODE.NOT_FOUND,
          RestFullAPI.onFail(STATUS_MESSAGE.NOT_FOUND)
        );
      }
    } catch (err) {
      return handleServerResponse(
        STATUS_CODE.INTERNAL_SERVER_ERROR,
        handleError(err as ServerError)
      );
    }
  }
  public static async me(payload: GetMePayload) {
    try {
      const data = GetMeSchema.parse(payload);
      const getUserByIdData: GetByIdAsyncPayload = {
        Model: User,
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
      };

      const { data: UserData } = await BaseModelHelper.getOneAsync(
        getUserByIdData
      );

      const {
        id: user_id,
        user_code,
        user_name,
        user_type,
      } = UserData.data.dataValues;
      const { id: staff_id } = UserData.data.dataValues.Staff.dataValues;

      return handleServerResponse(
        STATUS_CODE.OK,
        RestFullAPI.onSuccess(STATUS_MESSAGE.SUCCESS, {
          user_id,
          user_type,
          staff_id,
          user_code,
          user_name,
        })
      );
    } catch (err) {
      return handleServerResponse(
        STATUS_CODE.INTERNAL_SERVER_ERROR,
        handleError(err as ServerError)
      );
    }
  }
}

export default AuthServices;
