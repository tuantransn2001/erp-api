require("dotenv").config();
import express, { Express } from "express";
import cors from "cors";
import db from "./models";
import env from "./constants/env";
import { handleSeedData } from "./data/handleSeedData";
import rootRouter from "./routers";
import { ObjectType } from "./ts/types/app_type";
// ? ============================== INITIATE SERVER ====================================
const app: Express = express();
// ? ============================== VARIABLES ====================================
const { root_url, port, environment, host }: ObjectType = env;
// ? ============================== SETTING SERVER ================================
app.use(cors()); // * Allow cors
app.use(express.json()); // * Converted Data into JSON type - !Important
app.use(root_url, rootRouter); // * Router Set up
// ? ========================== CONNECT DATABASE - RUN SERVER ====================
(async () => {
  await db.sequelize.sync({ force: true }).then(() => {
    app.listen(port, async () => {
      handleSeedData();
      console.log("Connected - Synchronous Database Success");
      console.log(
        `🚀 Server is running on ${environment}  🚀 - http://${host}:${port}${root_url}`
      );
    });
  });
})();
