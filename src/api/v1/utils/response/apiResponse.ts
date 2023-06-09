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
}

export default RestFullAPI;
