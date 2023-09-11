import { Router } from "express";
import CustSuppController from "../controller/custSupp.controller";
import {
  CheckItemExistMiddleware,
  CheckUserExistMiddleware,
  errorCatcher,
  ZodValidationMiddleware,
} from "../middlewares";
import db from "../models";
import { USER_TYPE } from "../ts/enums/app_enums";
import {
  CreateCustSuppSchema,
  UpdateCustSuppSchema,
} from "../dto/input/custSupp/custSupp.schema";
const { CustSupp, User } = db;
const custSuppRouter = Router();

const CustomerController = new CustSuppController(USER_TYPE.CUSTOMER);

custSuppRouter
  .get("/get-all", CustomerController.getAll, errorCatcher)
  .post(
    "/create",
    ZodValidationMiddleware(CreateCustSuppSchema),
    CheckUserExistMiddleware(),
    CustomerController.create,
    errorCatcher
  )
  .get(
    "/get-by-id/:id",
    CheckItemExistMiddleware(User),
    CustomerController.getByID,
    errorCatcher
  )
  .delete(
    "/delete-by-id/:id",
    CheckItemExistMiddleware(CustSupp),
    CustomerController.softDeleteByID,
    errorCatcher
  )
  .patch(
    "/update-personalInfo-by-id/:id",
    ZodValidationMiddleware(UpdateCustSuppSchema),
    CheckItemExistMiddleware(User),
    CheckUserExistMiddleware(),
    CustomerController.updatePersonalInfoByID,
    errorCatcher
  );

export default custSuppRouter;
