import {
  CreateStaffRowDTO,
  UpdateStaffRowDTO,
} from "../../../dto/input/staff/staff.interface";
import { STATUS_CODE } from "../../../ts/enums/api_enums";
import { ServerError } from "../../../ts/types/common";
import { handleError } from "../../../utils/handleError/handleError";
import { handleServerResponse } from "../../../utils/response/handleServerResponse";
import {
  CreateAsyncPayload,
  GetByIdAsyncPayload,
  SoftDeleteByIDAsyncPayload,
} from "../baseModelHelper/shared/baseModelHelper.interface";
import db from "../../../models";
import { BaseModelHelper } from "../baseModelHelper/baseModelHelper";
import {
  handleFormatUpdateDataByValidValue,
  isNullOrFalse,
} from "../../../common";
const { Staff } = db;
export class StaffModelHelper {
  public static async createAsync(payload: CreateStaffRowDTO) {
    try {
      const createStaffData: CreateAsyncPayload<CreateStaffRowDTO> = {
        Model: Staff,
        dto: payload,
      };

      const { statusCode, data } = await BaseModelHelper.createAsync(
        createStaffData
      );
      return handleServerResponse(statusCode, data);
    } catch (err) {
      return handleError(err as ServerError);
    }
  }
  public static async softDeleteByIdAsync(id: string) {
    try {
      const softDeleteData: SoftDeleteByIDAsyncPayload = { Model: Staff, id };

      const { statusCode, data } = await BaseModelHelper.softDeleteAsync(
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
  public static async updateByIdAsync(payload: UpdateStaffRowDTO) {
    try {
      const getStaffData: GetByIdAsyncPayload = {
        Model: Staff,
        where: {
          isDelete: isNullOrFalse,
          id: payload.id,
        },
      };

      const { data: staffData } = await BaseModelHelper.getByIDAsync(
        getStaffData
      );

      const updateStaffData: UpdateStaffRowDTO =
        handleFormatUpdateDataByValidValue(payload, staffData.data.dataValues);

      const updateStaffRowData = {
        Model: Staff,
        dto: updateStaffData,
        where: {
          id: `${updateStaffData.id}`,
        },
      };

      const { statusCode, data } = await BaseModelHelper.updateAsync(
        updateStaffRowData
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
