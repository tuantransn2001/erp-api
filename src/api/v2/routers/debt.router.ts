import { Router } from "express";
import DebtController from "../controller/debt.controller";
import { CheckItemExistMiddleware, errorCatcher } from "../middlewares";
import db from "../models";
const { User } = db;

const debtRouter = Router();

const _DebtController = new DebtController();

debtRouter
  .get(
    "/get-change-logs/:id",
    CheckItemExistMiddleware(User),
    _DebtController.getAllChangeByUserID,
    errorCatcher
  )
  .get(
    "/:id",
    CheckItemExistMiddleware(User),
    _DebtController.getDebtAmount,
    errorCatcher
  );

export default debtRouter;
