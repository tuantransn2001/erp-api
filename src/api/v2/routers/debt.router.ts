import { Router } from "express";
import DebtController from "../controller/debt.controller";
import { checkExist, errorHandler } from "../middlewares";
import db from "../models";
const { User } = db;

const debtRouter = Router();

debtRouter
  .get(
    "/get-change-logs/:id",

    checkExist(User),
    DebtController.getAllChangeByUserID,
    errorHandler
  )
  .get(
    "/:id",

    checkExist(User),
    DebtController.getDebtAmount,
    errorHandler
  );

export default debtRouter;
