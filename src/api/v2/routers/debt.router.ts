import { Router } from "express";
import DebtController from "../controllers/debt.controller";
import { CheckItemExistMiddleware } from "../middlewares";
import db from "../models";
const { User } = db;

const debtRouter = Router();

const _DebtController = new DebtController();

debtRouter
  .get(
    "/get-change-logs/:id",
    CheckItemExistMiddleware(User),
    _DebtController.getAllChangeByUserID
  )
  .get("/:id", CheckItemExistMiddleware(User), _DebtController.getDebtAmount);

export default debtRouter;
