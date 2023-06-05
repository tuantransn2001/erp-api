import { Router } from "express";
import DebtController from "../controller/debt-controller";
import { authenticate, checkExist, errorHandler } from "../middlewares";
import db from "../models";
const { User } = db;

const debtRouter = Router();

debtRouter
  .post("/pay", authenticate, DebtController.pay, errorHandler)
  .get(
    "/get-change-logs/:id",
    authenticate,
    checkExist(User),
    DebtController.getAllChangeByUserID,
    errorHandler
  );

export default debtRouter;
