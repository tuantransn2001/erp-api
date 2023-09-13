import express, { Express } from "express";
import cors from "cors";
import env from "../../../constants/env";
import APIGateWay from "../../../gateway/app.gateway";
import rootRouter from "../../../routers";

export const appTest: Express = express();
// ? ============================== VARIABLES ====================================
const ROOT_URL = env.root_url as string;

// ? ============================== SETTING SERVER ===============================
appTest.use(cors()); // * Allow cors
appTest.use(express.json()); //  * Converted Data into JSON type - !Important

appTest.use(ROOT_URL, APIGateWay.handleUseGlobalMiddleware, rootRouter); // * Use Router
