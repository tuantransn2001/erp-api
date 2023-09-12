import {
  BulkCreateProductVariantRowDTO,
  CreateProductVariantRowDTO,
} from "../../../dto/input/productVariantDetail/productVariantDetail.interface";
import {
  BulkCreateAsyncPayload,
  CreateAsyncPayload,
} from "../baseModelHelper/shared/baseModelHelper.interface";
import db from "../../../models";
import { BaseModelHelper } from "../baseModelHelper/baseModelHelper";
import { handleServerResponse } from "../../../utils/response/handleServerResponse";
import { STATUS_CODE } from "../../../ts/enums/api_enums";
import { handleError } from "../../../utils/handleError/handleError";
import { ServerError } from "../../../ts/types/common";
const { ProductVariantDetail } = db;
export class ProductVariantModelHelper {
  public static async createAsync(payload: CreateProductVariantRowDTO) {
    try {
      const createProductVariantData: CreateAsyncPayload<CreateProductVariantRowDTO> =
        {
          Model: ProductVariantDetail,
          dto: payload,
        };

      const { statusCode, data } = await BaseModelHelper.createAsync(
        createProductVariantData
      );
      return handleServerResponse(statusCode, data);
    } catch (err) {
      return handleServerResponse(
        STATUS_CODE.INTERNAL_SERVER_ERROR,
        handleError(err as ServerError)
      );
    }
  }
  public static async bulkCreateAsync(payload: BulkCreateProductVariantRowDTO) {
    try {
      const bulkCreateProductVariantData: BulkCreateAsyncPayload<CreateProductVariantRowDTO> =
        {
          Model: ProductVariantDetail,
          dto: payload,
        };

      const { statusCode, data } = await BaseModelHelper.bulkCreateAsyncPayload(
        bulkCreateProductVariantData
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
