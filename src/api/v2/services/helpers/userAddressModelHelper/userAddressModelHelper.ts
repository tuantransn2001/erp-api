import {
  BulkCreateUserAddressItemRowDTO,
  BulkUpdateAddressItemRowDTO,
  CreateUserAddressItemRowDTO,
  UpdateUserAddressItemRowDTO,
} from "../../../dto/input/userAddress/userAddress.interface";
import { map as mapAsync } from "awaity";
import { ServerError } from "../../../ts/types/common";
import { handleError } from "../../../utils/handleError/handleError";
import {
  BulkCreateAsyncPayload,
  HardDeleteByIDAsyncPayload,
  UpdateAsyncPayload,
} from "../baseModelHelper/shared/baseModelHelper.interface";
import db from "../../../models";
import { BaseModelHelper } from "../baseModelHelper/baseModelHelper";
import { handleServerResponse } from "../../../utils/response/handleServerResponse";
import { STATUS_CODE } from "../../../ts/enums/api_enums";
import RestFullAPI from "../../../utils/response/apiResponse";
const { UserAddress } = db;
export class UserAddressModelHelper {
  public static async bulkCreateAsync(
    payload: BulkCreateUserAddressItemRowDTO
  ) {
    try {
      const createUserAddressData: BulkCreateAsyncPayload<CreateUserAddressItemRowDTO> =
        {
          Model: UserAddress,
          dto: payload,
        };

      const { statusCode, data } = await BaseModelHelper.bulkCreateAsyncPayload(
        createUserAddressData
      );

      return handleServerResponse(statusCode, data);
    } catch (err) {
      return handleServerResponse(
        STATUS_CODE.INTERNAL_SERVER_ERROR,
        handleError(err as ServerError)
      );
    }
  }

  public static async bulkUpdateAsync(payload: BulkUpdateAddressItemRowDTO) {
    try {
      const hardDeleteUserAddressData: HardDeleteByIDAsyncPayload = {
        Model: UserAddress,
        where: {
          user_id: payload[0].user_id,
        },
      };

      const hardDeleteUserAddressRes = await BaseModelHelper.hardDeleteAsync(
        hardDeleteUserAddressData
      );

      const bulkUpdateRes = await mapAsync(
        payload,
        async ({
          user_id,
          user_province,
          user_district,
          user_specific_address,
        }) => {
          const updateUserAddressData: UpdateAsyncPayload<UpdateUserAddressItemRowDTO> =
            {
              Model: UserAddress,
              dto: {
                user_province,
                user_district,
                user_specific_address,
              },
              where: {
                user_id,
              },
            };

          const updateUserAddressRes = await BaseModelHelper.updateAsync(
            updateUserAddressData
          );

          return updateUserAddressRes;
        }
      );
      const { statusCode, data } = await RestFullAPI.onArrayPromiseSuccess([
        hardDeleteUserAddressRes,
        bulkUpdateRes,
      ]);

      return handleServerResponse(statusCode, data);
    } catch (err) {
      return handleServerResponse(
        STATUS_CODE.INTERNAL_SERVER_ERROR,
        handleError(err as ServerError)
      );
    }
  }
}
