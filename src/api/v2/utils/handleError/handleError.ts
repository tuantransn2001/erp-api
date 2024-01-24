import { ZodError } from "zod";
import { STATUS_MESSAGE } from "../../common/enums/api_enums";
import HttpException from "../exceptions/http.exception";
import RestFullAPI from "../response/apiResponse";

export const handleError = (err: Error | ZodError) => {
  if (err instanceof ZodError) {
    return RestFullAPI.onFail(STATUS_MESSAGE.BAD_REQUEST, {
      message: err.issues
        .map((err) => `${err.path}:: ${err.message}`)
        .join(" || "),
    } as HttpException);
  }

  return RestFullAPI.onFail(STATUS_MESSAGE.SERVER_ERROR, {
    message: err.message,
  } as HttpException);
};
