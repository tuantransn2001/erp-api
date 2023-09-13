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
      password: process.env.DB_PW_DEV,
      database: process.env.DB_NAME_DEV,
      port: process.env.DB_PORT_DEV,
      username: process.env.DB_USERNAME_DEV,
      host: process.env.DB_HOST_DEV,
      dialect: process.env.DB_DIALECT_DEV,
    },
    staging: {
      password: process.env.DB_PW_STAGING,
      database: process.env.DB_NAME_STAGING,
      port: process.env.DB_PORT_STAGING,
      username: process.env.DB_USERNAME_STAGING,
      host: process.env.DB_HOST_STAGING,
      dialect: process.env.DB_DIALECT_STAGING,
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
