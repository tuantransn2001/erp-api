import express, { Request, Response, Express } from "express";
import cors from "cors";
import env from "../../../constants/env";
import APIGateWay from "../../../gateway/app.gateway";
import rootRouter from "../../../routers";
import { STATUS_CODE, STATUS_MESSAGE } from "../../../ts/enums/api_enums";
import RestFullAPI from "../../../utils/response/apiResponse";

export const appTest: Express = express();
// ? ============================== VARIABLES ====================================
const ROOT_URL = env.root_url as string;

// ? ============================== SETTING SERVER ===============================
appTest.use(cors()); // * Allow cors
appTest.use(express.json()); //  * Converted Data into JSON type - !Important
// ? ============================== HEALTH CHECK =================================
appTest.get(ROOT_URL, (_: Request, res: Response) => {
  res
    .status(STATUS_CODE.OK)
    .send(RestFullAPI.onSuccess(STATUS_MESSAGE.SUCCESS));
});
appTest.use(ROOT_URL, APIGateWay.handleUseGlobalMiddleware, rootRouter); // * Use Router
