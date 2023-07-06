require("dotenv").config();

const env = {
  jwtSecretKey: process.env.JWT_TOKEN_SECRET_KEY,
  tokenExp: "3d",
  root_url: process.env.ROOT_URL,
  host: process.env.HOST,
  port: process.env.PORT,
  environment: process.env.SERVER_RUNNING_ON,
};

export default env;
