import env from "./constants/env";
import { app } from "./app";
import setupOnConnectDB from "./setup/setupOnConnectDB";
// ? ========================== CONNECT DATABASE - RUN SERVER ====================
const PORT = env.port as string;
export const server = app.listen(PORT, () => {
  setupOnConnectDB();
});
