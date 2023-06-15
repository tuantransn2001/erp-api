import { STATUS_CODE, STATUS_MESSAGE } from "../../ts/enums/api_enums";

type PromiseResultAttributes = Array<Promise<any>>;

class RestFullAPI {
  private static message: string = STATUS_MESSAGE.SUCCESS;
  private static data: any = {};

  public static onSuccess(message: string, data?: any) {
    return {
      message: message || RestFullAPI.message,
      data: data || RestFullAPI.data,
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
