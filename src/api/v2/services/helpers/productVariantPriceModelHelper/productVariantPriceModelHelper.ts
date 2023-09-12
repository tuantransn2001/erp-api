import {
  BulkCreateProductVariantPriceRowDTO,
  CreateProductVariantPriceRowDTO,
} from "../../../dto/input/productVariantPrice/productVariantPrice.interface";
import { STATUS_CODE } from "../../../ts/enums/api_enums";
import { ServerError } from "../../../ts/types/common";
import { handleError } from "../../../utils/handleError/handleError";
import { handleServerResponse } from "../../../utils/response/handleServerResponse";
import {
  BulkCreateAsyncPayload,
  CreateAsyncPayload,
} from "../baseModelHelper/shared/baseModelHelper.interface";
import db from "../../../models";
import { BaseModelHelper } from "../baseModelHelper/baseModelHelper";
const { ProductVariantPrice } = db;
export class ProductVariantPriceModelHelper {
  public static async createAsync(payload: CreateProductVariantPriceRowDTO) {
    try {
      const createProductVariantPriceData: CreateAsyncPayload<CreateProductVariantPriceRowDTO> =
        {
          Model: ProductVariantPrice,
          dto: payload,
        };

      const { statusCode, data } = await BaseModelHelper.createAsync(
        createProductVariantPriceData
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
    payload: BulkCreateProductVariantPriceRowDTO
  ) {
    try {
      const bulkCreateProductVariantPriceData: BulkCreateAsyncPayload<CreateProductVariantPriceRowDTO> =
        {
          Model: ProductVariantPrice,
          dto: payload,
        };

      const { statusCode, data } = await BaseModelHelper.bulkCreateAsyncPayload(
        bulkCreateProductVariantPriceData
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
