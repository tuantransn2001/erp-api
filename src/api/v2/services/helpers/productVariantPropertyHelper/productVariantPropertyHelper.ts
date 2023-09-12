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
import {
  BulkCreateProductVariantPropertyRowDTO,
  CreateProductVariantPropertyRowDTO,
} from "../../../dto/input/productVariantProperty/productVariantProperty.interface";
const { ProductVariantProperty } = db;
export class ProductVariantPropertyModelHelper {
  public static async createAsync(payload: CreateProductVariantPropertyRowDTO) {
    try {
      const createProductVariantPropertyData: CreateAsyncPayload<CreateProductVariantPropertyRowDTO> =
        {
          Model: ProductVariantProperty,
          dto: payload,
        };

      const { statusCode, data } = await BaseModelHelper.createAsync(
        createProductVariantPropertyData
      );
      return handleServerResponse(statusCode, data);
    } catch (err) {
      return handleServerResponse(
        STATUS_CODE.INTERNAL_SERVER_ERROR,
        handleError(err as ServerError)
      );
    }
  }
  public static async bulkCreateAsync(
    payload: BulkCreateProductVariantPropertyRowDTO
  ) {
    try {
      const bulkCreateProductVariantPropertyData: BulkCreateAsyncPayload<CreateProductVariantPropertyRowDTO> =
        {
          Model: ProductVariantProperty,
          dto: payload,
        };

      const { statusCode, data } = await BaseModelHelper.bulkCreateAsyncPayload(
        bulkCreateProductVariantPropertyData
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
