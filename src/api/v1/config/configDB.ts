require("dotenv").config();
module.exports = {
  cloud: {
    development: {
      url: `${process.env.DB_DEV_URL}${process.env.SSL_REQUIRE}`,
    },
    production: {
      url: `${process.env.DB_PROD_URL}${process.env.SSL_REQUIRE}`,
    },
  },
  local: {
    development: {
      password: process.env.DB_PW,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      host: process.env.DB_HOST,
      dialect: process.env.DB_DIALECT,
    },
    production: {
      password: process.env.DB_PW,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      host: process.env.DB_HOST,
      dialect: process.env.DB_DIALECT,
    },
  },
};
