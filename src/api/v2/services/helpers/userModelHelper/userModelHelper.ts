import {
  CreateUserRowDTO,
  UpdateUserRowDTO,
} from "../../../dto/input/user/user.interface";
import { ServerError } from "../../../ts/types/common";
import { handleError } from "../../../utils/handleError/handleError";
import {
  CreateAsyncPayload,
  MultipleSoftDeleteByIDAsyncPayload,
  SoftDeleteByIDAsyncPayload,
} from "../baseModelHelper/shared/baseModelHelper.interface";
import db from "../../../models";
import { BaseModelHelper } from "../baseModelHelper/baseModelHelper";
import { handleServerResponse } from "../../../utils/response/handleServerResponse";
import { STATUS_CODE } from "../../../ts/enums/api_enums";

const { User } = db;

export class UserModelHelper {
  public static async createAsync(payload: CreateUserRowDTO) {
    try {
      const createUserData: CreateAsyncPayload<CreateUserRowDTO> = {
        Model: User,
        dto: payload,
      };

      const { statusCode, data } = await BaseModelHelper.createAsync(
        createUserData
      );
      return handleServerResponse(statusCode, data);
    } catch (err) {
      return handleError(err as ServerError);
    }
  }
  public static async softDeleteByIdAsync(id: string) {
    try {
      const softDeleteData: SoftDeleteByIDAsyncPayload = { Model: User, id };

      const { statusCode, data } = await BaseModelHelper.softDeleteByIdAsync(
        softDeleteData
      );

      return handleServerResponse(statusCode, data);
    } catch (err) {
      return handleServerResponse(
        STATUS_CODE.INTERNAL_SERVER_ERROR,
        handleError(err as ServerError)
      );
    }
  }
  public static async multipleSoftDeleteByIdsAsync(ids: string[]) {
    try {
      const multipleSoftDeleteData: MultipleSoftDeleteByIDAsyncPayload = {
        Model: User,
        ids,
      };
      const { statusCode, data } =
        await BaseModelHelper.multipleSoftDeleteAsync(multipleSoftDeleteData);
      return handleServerResponse(statusCode, data);
    } catch (err) {
      return handleServerResponse(
        STATUS_CODE.INTERNAL_SERVER_ERROR,
        handleError(err as ServerError)
      );
    }
  }
  public static async updateByIdAsync(payload: UpdateUserRowDTO) {
    try {
      const updateUserRowData = {
        Model: User,
        dto: payload,
        where: {
          id: `${payload.id}`,
        },
      };

      const { statusCode, data } = await BaseModelHelper.updateAsync(
        updateUserRowData
      );

      return handleServerResponse(statusCode, data);
    } catch (err) {
      return handleServerResponse(
        STATUS_CODE.INTERNAL_SERVER_ERROR,
        handleError(err as ServerError)
      );
    }
  }
}
