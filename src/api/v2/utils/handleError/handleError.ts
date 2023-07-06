import { STATUS_MESSAGE } from "../../ts/enums/api_enums";
import HttpException from "../exceptions/http.exception";
import RestFullAPI from "../response/apiResponse";

export const handleError = (err: Error) =>
  RestFullAPI.onFail(STATUS_MESSAGE.SERVER_ERROR, {
    message: err.message,
  } as HttpException);
