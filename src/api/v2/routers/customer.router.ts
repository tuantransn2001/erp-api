import { Router } from "express";
import CustSuppController from "../controllers/custSupp.controller";
import {
  CheckItemExistMiddleware,
  CheckUserExistMiddleware,
  ZodValidationMiddleware,
} from "../middlewares";
import db from "../models";
import { USER_TYPE } from "../ts/enums/app_enums";
import {
  CreateCustSuppSchema,
  UpdateCustSuppSchema,
} from "../dto/input/custSupp/custSupp.schema";
const { CustSupp, User } = db;
const customerRouter = Router();

const CustomerController = new CustSuppController(USER_TYPE.CUSTOMER);

customerRouter
  .get("/get-all", CustomerController.getAll)
  .post(
    "/create",
    ZodValidationMiddleware(CreateCustSuppSchema),
    CheckUserExistMiddleware(),
    CustomerController.create
  )
  .get(
    "/get-by-id/:id",
    CheckItemExistMiddleware(User),
    CustomerController.getByID
  )
  .delete(
    "/delete-by-id/:id",
    CheckItemExistMiddleware(CustSupp),
    CustomerController.softDeleteByID
  )
  .post(
    "/delete-multiple",
    CheckItemExistMiddleware(User),
    CustomerController.multipleSoftDeleteCustomer
  )
  .patch(
    "/update-personalInfo-by-id",
    ZodValidationMiddleware(UpdateCustSuppSchema),
    CheckItemExistMiddleware(User),
    CheckUserExistMiddleware(),
    CustomerController.updatePersonalInfoByID
  );

export default customerRouter;
