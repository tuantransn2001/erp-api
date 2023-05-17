"use strict";
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const configDB = require("../config/configDB");
const db: any = {};
let sequelize: any;

const NODE_ENVIRONMENT: string = process.env.NODE_ENVIRONMENT as string;
const RUNNING_ON: string = process.env.SERVER_RUNNING_ON as string;

switch (RUNNING_ON) {
  case "cloud": {
    sequelize = new Sequelize(configDB[RUNNING_ON][NODE_ENVIRONMENT].url);
    break;
  }
  case "local": {
    sequelize = new Sequelize(configDB[RUNNING_ON][NODE_ENVIRONMENT]);
  }
}

const currentPath: string = `${__dirname}/models`;
fs.readdirSync(currentPath)
  .filter((file: any) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".ts"
    );
  })
  .forEach((file: any) => {
    const model: any = require(`../models/${file}`)["default"](
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
