import { Router } from "express";
import CustSuppController from "../controllers/custSupp.controller";
import {
  CheckItemExistMiddleware,
  CheckUserExistMiddleware,
  ZodValidationMiddleware,
} from "../middlewares";
import db from "../models";
import {
  CreateCustSuppSchema,
  UpdateCustSuppSchema,
} from "../dto/input/custSupp/custSupp.schema";
import { USER_TYPE } from "../common/enums/app_enums";
const { CustSupp, User } = db;

const supplierRouter = Router();

const SupplierController = new CustSuppController(USER_TYPE.SUPPLIER);

supplierRouter
  .get("/get-all", SupplierController.getAll)
  .post(
    "/create",
    ZodValidationMiddleware(CreateCustSuppSchema),
    CheckUserExistMiddleware(),
    SupplierController.create
  )
  .get(
    "/get-by-id/:id",
    CheckItemExistMiddleware(User),
    SupplierController.getByID
  )
  .delete(
    "/delete-by-id/:id",
    CheckItemExistMiddleware(CustSupp),
    SupplierController.softDeleteByID
  )
  .patch(
    "/update-personalInfo-by-id/:id",
    ZodValidationMiddleware(UpdateCustSuppSchema),
    CheckItemExistMiddleware(User),
    CheckUserExistMiddleware(),
    SupplierController.updatePersonalInfoByID
  );

export default supplierRouter;
