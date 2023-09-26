import { handleFormatUpdateDataByValidValue } from "../../../common";
import {
  CreateCustSuppRowDTO,
  UpdateCustSuppRowDTO,
} from "../../../dto/input/custSupp/custSupp.interface";
import db from "../../../models";
import { STATUS_CODE } from "../../../ts/enums/api_enums";
import { ServerError } from "../../../ts/types/common";
import { handleError } from "../../../utils/handleError/handleError";
import { handleServerResponse } from "../../../utils/response/handleServerResponse";
import { BaseModelHelper } from "../baseModelHelper/baseModelHelper";
import {
  CreateAsyncPayload,
  GetByIdAsyncPayload,
  SoftDeleteByIDAsyncPayload,
  UpdateAsyncPayload,
} from "../baseModelHelper/shared/baseModelHelper.interface";
const { CustSupp } = db;
export class CustSuppModelHelper {
  public static async createAsync(payload: CreateCustSuppRowDTO) {
    try {
      const createCustSuppData: CreateAsyncPayload<CreateCustSuppRowDTO> = {
        Model: CustSupp,
        dto: payload,
      };

      const { statusCode, data } = await BaseModelHelper.createAsync(
        createCustSuppData
      );
      return handleServerResponse(statusCode, data);
    } catch (err) {
      return handleServerResponse(
        STATUS_CODE.INTERNAL_SERVER_ERROR,
        handleError(err as ServerError)
      );
    }
  }
  public static async updateByIdAsync(payload: UpdateCustSuppRowDTO) {
    try {
      const getCustomerData: GetByIdAsyncPayload = {
        Model: CustSupp,
        where: {
          id: payload.id,
        },
      };

      const { data: customerData } = await BaseModelHelper.getOneAsync(
        getCustomerData
      );

      const updateCustSuppDto: UpdateCustSuppRowDTO =
        handleFormatUpdateDataByValidValue(
          payload,
          customerData.data.dataValues
        );

      const updateCustSuppRowData: UpdateAsyncPayload<UpdateCustSuppRowDTO> = {
        Model: CustSupp,
        dto: updateCustSuppDto,
        where: {
          id: `${payload.id}`,
        },
      };

      const { statusCode, data } = await BaseModelHelper.updateAsync(
        updateCustSuppRowData
      );

      return handleServerResponse(statusCode, data);
    } catch (err) {
      return handleServerResponse(
        STATUS_CODE.INTERNAL_SERVER_ERROR,
        handleError(err as ServerError)
      );
    }
  }
  public static async softDeleteByIdAsync(id: string) {
    try {
      const softDeleteData: SoftDeleteByIDAsyncPayload = {
        Model: CustSupp,
        id,
      };

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
}
