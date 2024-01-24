import { CreateProductRowDTO } from "../../../dto/input/product/product.interface";
import { handleServerResponse } from "../../../utils/response/handleServerResponse";
import { CreateAsyncPayload } from "../baseModelHelper/shared/baseModelHelper.interface";
import db from "../../../models";
import { BaseModelHelper } from "../baseModelHelper/baseModelHelper";
import { STATUS_CODE } from "../../../common/enums/api_enums";
import { handleError } from "../../../utils/handleError/handleError";
import { ServerError } from "../../../common/types/common";
const { Products } = db;
export class ProductModelHelper {
  public static async createAsync(payload: CreateProductRowDTO) {
    try {
      const createProductData: CreateAsyncPayload<CreateProductRowDTO> = {
        Model: Products,
        dto: payload,
      };

      const { statusCode, data } = await BaseModelHelper.createAsync(
        createProductData
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
