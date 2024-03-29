import { STATUS_CODE, STATUS_MESSAGE } from "../../common/enums/api_enums";
import HttpException from "../exceptions/http.exception";
import { handleServerResponse } from "./handleServerResponse";

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

  public static onChainSuccess(responseArr: any[]) {
    const shouldSendResponse = responseArr.every(
      ({ statusCode }) =>
        statusCode === STATUS_CODE.OK ||
        STATUS_CODE.ACCEPTED ||
        STATUS_CODE.CREATED
    );

    return shouldSendResponse
      ? handleServerResponse(
          STATUS_CODE.OK,
          RestFullAPI.onSuccess(STATUS_MESSAGE.SUCCESS)
        )
      : handleServerResponse(
          STATUS_CODE.INTERNAL_SERVER_ERROR,
          RestFullAPI.onFail(STATUS_MESSAGE.SERVER_ERROR)
        );
  }

  public static async onArrayPromiseSuccess(promisesResult: Promise<any>[]) {
    return await Promise.all(promisesResult)
      .then((response) =>
        handleServerResponse(
          STATUS_CODE.OK,
          RestFullAPI.onSuccess(STATUS_MESSAGE.SUCCESS, response)
        )
      )
      .catch((err) =>
        handleServerResponse(
          STATUS_CODE.INTERNAL_SERVER_ERROR,
          RestFullAPI.onFail(STATUS_MESSAGE.SERVER_ERROR, err)
        )
      );
  }
}

export default RestFullAPI;
