import { STATUS_CODE, STATUS_MESSAGE } from "../../ts/enums/api_enums";
import HttpException from "../exceptions/http.exception";

type PromiseResultAttributes = Promise<any>[];

class RestFullAPI {
  public static onSuccess(message: string, data?: any) {
    return {
      message: message || "",
      data: data || {},
    };
  }
  public static onFail(message: string, error?: HttpException) {
    return {
      message: message || "",
      error: error || {},
    };
  }
  public static async onArrayPromiseSuccess(
    promisesResult: PromiseResultAttributes
  ) {
    const findResult = await Promise.all(promisesResult);
    const isOK = findResult.every((result) => result.statusCode === 200);
    return isOK
      ? {
          statusCode: STATUS_CODE.STATUS_CODE_200,
          response: RestFullAPI.onSuccess(STATUS_MESSAGE.SUCCESS),
        }
      : {
          statusCode: STATUS_CODE.STATUS_CODE_500,
          response: RestFullAPI.onSuccess(STATUS_MESSAGE.SERVER_ERROR),
        };
  }
}

export default RestFullAPI;
