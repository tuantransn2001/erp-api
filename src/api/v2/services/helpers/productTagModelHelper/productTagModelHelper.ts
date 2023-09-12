import {
  BulkCreateProductTagRowDTO,
  CreateProductTagRowDTO,
} from "../../../dto/input/productTag/productTag.interface";
import { BulkCreateAsyncPayload } from "../baseModelHelper/shared/baseModelHelper.interface";
import db from "../../../models";
import { BaseModelHelper } from "../baseModelHelper/baseModelHelper";
import { handleServerResponse } from "../../../utils/response/handleServerResponse";
import { STATUS_CODE } from "../../../ts/enums/api_enums";
import { handleError } from "../../../utils/handleError/handleError";
import { ServerError } from "../../../ts/types/common";
const { ProductTag } = db;
export class ProductTagModelHelper {
  public static async bulkCreateAsync(payload: BulkCreateProductTagRowDTO) {
    try {
      const bulkCreateProductTag: BulkCreateAsyncPayload<CreateProductTagRowDTO> =
        {
          Model: ProductTag,
          dto: payload,
        };

      const { statusCode, data } = await BaseModelHelper.createAsync(
        bulkCreateProductTag
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
