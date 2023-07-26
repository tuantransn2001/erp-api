import db from "../models";
import { handleSeedData } from "../data/handleSeedData";
import env from "../constants/env";
const HOST = env.host as string;
const PORT = env.port as string;
const setupOnConnectDB = async () => {
  await db.sequelize.sync({ force: true }).then(() => {
    handleSeedData();
    console.log("Connected - Synchronous Database Success");
    console.log(`🚀 Server is running  🚀 - http://${HOST}:${PORT}`);
  });
};

export default setupOnConnectDB;
