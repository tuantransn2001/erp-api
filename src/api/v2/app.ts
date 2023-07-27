require("dotenv").config();
import express, { Express, Request, Response } from "express";
import cors from "cors";
import env from "./constants/env";
import rootRouter from "./routers";
import APIGateWay from "./gateway/app.gateway";
import RestFullAPI from "./utils/response/apiResponse";
import db from "./models";
import { STATUS_CODE, STATUS_MESSAGE } from "./ts/enums/api_enums";
import setupOnConnectDB from "./setup/setupOnConnectDB";
// ? ============================== INITIATE SERVER ==============================
const app: Express = express();
// ? ============================== VARIABLES ====================================
const ROOT_URL = env.root_url as string;
const PORT = env.port as string;
const HOST = env.host as string;
// ? ============================== SETTING SERVER ===============================
app.use(cors()); // * Allow cors
app.use(express.json()); //  * Converted Data into JSON type - !Important
// ? ============================== HEALTH CHECK =================================
app.get(ROOT_URL, (_: Request, res: Response) => {
  res
    .status(STATUS_CODE.STATUS_CODE_200)
    .send(RestFullAPI.onSuccess(STATUS_MESSAGE.SUCCESS));
});
app.use(ROOT_URL, APIGateWay.handleUseGlobalMiddleware, rootRouter); // * Use Router
// ? ========================== CONNECT DATABASE - RUN SERVER ====================
app.listen(PORT, async () => {
  await db.sequelize.sync({ force: true }).then(() => {
    console.log("Connected - Synchronous Database Success");
    console.log(`🚀 Server is running  🚀 - http://${HOST}:${PORT}`);
    setupOnConnectDB();
  });
});
