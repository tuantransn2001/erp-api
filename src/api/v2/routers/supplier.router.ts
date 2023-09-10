import { Router } from "express";
import CustSuppController from "../controller/custSupp.controller";
import {
  CheckItemExistMiddleware,
  CheckUserExistMiddleware,
  errorCatcher,
  ZodValidationMiddleware,
} from "../middlewares";
import db from "../models";
import {
  CreateCustSuppSchema,
  UpdateCustSuppSchema,
} from "../ts/dto/input/custSupp/custSupp.schema";
import { USER_TYPE } from "../ts/enums/app_enums";
const { CustSupp, User } = db;

const supplierRouter = Router();

const SupplierController = new CustSuppController(USER_TYPE.SUPPLIER);

supplierRouter
  .get("/get-all", SupplierController.getAll, errorCatcher)
  .post(
    "/create",
    ZodValidationMiddleware(CreateCustSuppSchema),
    CheckUserExistMiddleware(),
    SupplierController.create,
    errorCatcher
  )
  .get(
    "/get-by-id/:id",
    CheckItemExistMiddleware(User),
    SupplierController.getByID,
    errorCatcher
  )
  .delete(
    "/delete-by-id/:id",
    CheckItemExistMiddleware(CustSupp),
    SupplierController.softDeleteByID,
    errorCatcher
  )
  .patch(
    "/update-personalInfo-by-id/:id",
    ZodValidationMiddleware(UpdateCustSuppSchema),
    CheckItemExistMiddleware(User),
    CheckUserExistMiddleware(),
    SupplierController.updatePersonalInfoByID,
    errorCatcher
  );

export default supplierRouter;
