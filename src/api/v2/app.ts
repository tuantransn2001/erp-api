require("dotenv").config();
import express, { Express } from "express";
import cors from "cors";
import compression from "compression";
import env from "./constants/env";
import rootRouter from "./routers";
import APIGateWay from "./gateway/app.gateway";
import db from "./models";
import setupOnConnectDB from "./setup/setupOnConnectDB";
import chalk from "chalk";
import morgan from "morgan";
// ? ============================== INITIATE SERVER ==============================
const app: Express = express();
// ? ============================== VARIABLES ====================================
const ROOT_URL = env.root_url as string;
const PORT = env.port as string;
const HOST = env.host as string;
// ? ============================== SETTING SERVER ===============================
app.use(cors()); // * Allow cors
app.use(express.json()); //  * Converted Data into JSON type - !Important
app.use(compression()); // * The middleware will attempt to compress response bodies for all request that traverse through the middleware
app.use(
  morgan(function (tokens, req, res) {
    return [
      "\n\n\n",
      chalk.hex("#ff4757").bold("🍄  Morgan Logger --> "),
      chalk.hex("#34ace0").bold(tokens.method(req, res)),
      chalk.hex("#ffb142").bold(tokens.status(req, res)),
      chalk.hex("#ff5252").bold(tokens.url(req, res)),
      chalk.hex("#2ed573").bold(tokens["response-time"](req, res) + " ms"),
      chalk.hex("#f78fb3").bold("@ " + tokens.date(req, res)),
      chalk.yellow(tokens["remote-addr"](req, res)),
      chalk.hex("#fffa65").bold("from " + tokens.referrer(req, res)),
      chalk.hex("#1e90ff")(tokens["user-agent"](req, res)),
      "\n\n\n",
    ].join(" ");
  })
); // * Logger middleware
// ? ============================== USE ROUTER =================================
app.use(ROOT_URL, APIGateWay.handleUseGlobalMiddleware, rootRouter); // * Use Router
// ? ========================== CONNECT DATABASE - RUN SERVER ====================
app.listen(PORT, async () => {
  const isDbConnected = await db.sequelize.sync({ force: true });

  if (isDbConnected) {
    console.log("Connected - Synchronous Database Success");
    console.log(`🚀 Server is running  🚀 - http://${HOST}:${PORT}`);
    setupOnConnectDB();
  } else {
    console.log("Connected fail - Synchronous Database Failure");
  }
});
