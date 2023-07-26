require("dotenv").config();

const env = {
  jwtSecretKey: process.env.JWT_TOKEN_SECRET_KEY,
  tokenExp: "1d",
  root_url: process.env.ROOT_URL,
  host: process.env.HOST,
  port: process.env.PORT,
  environment: process.env.NODE_ENVIRONMENT,
  account: {
    admin: {
      phone: process.env.ADMIN_PHONE,
      password: process.env.ADMIN_PASSWORD,
    },
  },
};

export default env;
