require("dotenv").config();
import express, { Express } from "express";
import cors from "cors";
<<<<<<< HEAD:src/app.ts
import db from "./api/v1/models";
import { handleSeedData } from "./api/v1/data/handleSeedData";
import rootRouter from "./api/v1/routers";
=======
import db from "./models";
import { handleSeedData } from "./data/handleSeedData";
import rootRouter from "./routers";

>>>>>>> dev/api-v2:src/api/v1/app.ts
// ? ============================== INITIATE SERVER ====================================
const app: Express = express();
// ? ============================== VARIABLES ====================================
const ROOT_URL: string = process.env.ROOT_URL as string;
const HOST: string = process.env.HOST as string;
const PORT: string = process.env.PORT as string;
const ENVIRONMENT: string = process.env.SERVER_RUNNING_ON as string;
// ? ============================== SETTING SERVER ================================
app.use(cors()); // * Allow cors
app.use(express.json()); // * Converted Data into JSON type - !Important
app.use(ROOT_URL, rootRouter); // * Router Set up
// ? ========================== CONNECT DATABASE - RUN SERVER ====================
(async () => {
  await db.sequelize.sync({ force: true }).then(() => {
    app.listen(PORT, async () => {
      handleSeedData();
      console.log("Connected - Synchronous Database Success");
      console.log(
        `🚀 Server is running on ${ENVIRONMENT}  🚀 - http://${HOST}:${PORT}${ROOT_URL}`
      );
    });
  });
})();
