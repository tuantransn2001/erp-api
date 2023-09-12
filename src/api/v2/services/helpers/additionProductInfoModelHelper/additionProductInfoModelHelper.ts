import { CreateAdditionProductInformationRowDTO } from "../../../dto/input/additionProductInformation/additionProductInformation.interface";
import db from "../../../models";
import { STATUS_CODE } from "../../../ts/enums/api_enums";
import { ServerError } from "../../../ts/types/common";
import { handleError } from "../../../utils/handleError/handleError";
import { handleServerResponse } from "../../../utils/response/handleServerResponse";
import { BaseModelHelper } from "../baseModelHelper/baseModelHelper";
import { CreateAsyncPayload } from "../baseModelHelper/shared/baseModelHelper.interface";
const { AdditionProductInformation } = db;
export class AdditionProductInformationModelHelper {
  public static async createAsync(
    payload: CreateAdditionProductInformationRowDTO
  ) {
    try {
      const createAdditionProductInformationProductData: CreateAsyncPayload<CreateAdditionProductInformationRowDTO> =
        {
          Model: AdditionProductInformation,
          dto: payload,
        };

      const { statusCode, data } = await BaseModelHelper.createAsync(
        createAdditionProductInformationProductData
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
