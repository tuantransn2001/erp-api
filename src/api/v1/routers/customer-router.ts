import { Router } from "express";
import CustomerController from "../controller/customer-controller";
import {
  authenticate,
  checkExist,
  checkUserExist,
  errorHandler,
} from "../middlewares";
import db from "../models";
const { User } = db;
const customerRouter = Router();

customerRouter
  .get("/get-all", authenticate, CustomerController.getAll, errorHandler)
  .get(
    "/get-by-id/:id",
    authenticate,
    checkExist(User),
    CustomerController.getByID,
    errorHandler
  )
  .post(
    "/create",
    authenticate,
    checkUserExist(),
    CustomerController.create,
    errorHandler
  )

  .delete(
    "/delete-by-id/:id",
    authenticate,
    checkExist(User),
    CustomerController.deleteByID,
    errorHandler
  )
  .patch(
    "/update-personalInfo-by-id/:id",
    authenticate,
    checkExist(User),
    checkUserExist(),
    CustomerController.updatePersonalInfoByID,
    errorHandler
  );

export default customerRouter;
