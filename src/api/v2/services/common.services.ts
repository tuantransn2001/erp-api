import { isEmpty } from "../common";
import { STATUS_CODE, STATUS_MESSAGE } from "../ts/enums/api_enums";
import { ObjectType } from "../ts/types/common";
import HttpException from "../utils/exceptions/http.exception";

import RestFullAPI from "../utils/response/apiResponse";

interface ModifyJunctionPayload {
  JunctionModel: any;
  attrs: ObjectType<string>[];
  ownerQuery: { [key: string]: string };
}

class CommonServices {
  public static async createJunctionRecord(payload: ModifyJunctionPayload) {
    try {
      const { attrs, ownerQuery, JunctionModel } = payload;

      if (!isEmpty(attrs)) {
        const newTagRecords = attrs.map((attr) => ({
          ...attr,
          ...ownerQuery,
        }));
        await JunctionModel.bulkCreate(newTagRecords);
      }

      return {
        statusCode: STATUS_CODE.STATUS_CODE_200,
        data: RestFullAPI.onSuccess(STATUS_MESSAGE.SUCCESS),
      };
    } catch (err) {
      const { message } = err as HttpException;
      return {
        statusCode: STATUS_CODE.STATUS_CODE_500,
        data: RestFullAPI.onFail(STATUS_MESSAGE.SERVER_ERROR, {
          message,
        } as HttpException),
      };
    }
  }
  public static async updateJunctionRecord({
    JunctionModel,
    ownerQuery,
    attrs,
  }: ModifyJunctionPayload) {
    try {
      const isAcceptUpdateTag = attrs !== undefined && !isEmpty(attrs);

      if (isAcceptUpdateTag) {
        await JunctionModel.destroy({
          where: ownerQuery,
        });

        await CommonServices.createJunctionRecord({
          JunctionModel,
          attrs,
          ownerQuery,
        });
      }

      return {
        statusCode: STATUS_CODE.STATUS_CODE_200,
        data: RestFullAPI.onSuccess(STATUS_MESSAGE.SUCCESS),
      };
    } catch (err) {
      const { message } = err as HttpException;
      return {
        statusCode: STATUS_CODE.STATUS_CODE_500,
        data: RestFullAPI.onFail(STATUS_MESSAGE.SERVER_ERROR, {
          message,
        } as HttpException),
      };
    }
  }
}

export default CommonServices;
