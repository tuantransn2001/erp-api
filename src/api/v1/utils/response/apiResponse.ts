<<<<<<< HEAD
import { STATUS_CODE } from "../../ts/enums/api_enums";

class RestFullAPI {
  public data: any;
  public statusMessage: string;
  public message: string;
  public statusCode: number;

  constructor() {
    this.data = {};
    this.statusMessage = "";
    this.message = "";
    this.statusCode = STATUS_CODE.STATUS_CODE_200;
  }

  public static onSuccess(message: string, data?: any) {
    return {
      message,
      data,
    };
  }
=======
import { STATUS_CODE, STATUS_MESSAGE } from "../../ts/enums/api_enums";
import HttpException from "../exceptions/http.exception";

type PromiseResultAttributes = Array<Promise<any>>;

class RestFullAPI {
  private static message: string = STATUS_MESSAGE.SUCCESS;
  private static data: any = {};
  public static _error: Partial<HttpException> = {
    status: STATUS_CODE.STATUS_CODE_200,
    message: STATUS_MESSAGE.SUCCESS,
  };
  public static onSuccess(message: string, data?: any) {
    return {
      message: message || RestFullAPI.message,
      data: data || RestFullAPI.data,
    };
  }
  public static onFail(message: string, error: HttpException) {
    return {
      message: message || RestFullAPI.message,
      error: error || RestFullAPI._error,
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
>>>>>>> dev/api-v2
}

export default RestFullAPI;
