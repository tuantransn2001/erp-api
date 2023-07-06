import { Router } from "express";
import CustSuppController from "../controller/custSupp.controller";
import { checkExist, checkUserExist, errorHandler } from "../middlewares";
import db from "../models";
import { USER_TYPE } from "../ts/enums/app_enums";
const { CustSupp, User } = db;
const supplierRouter = Router();

supplierRouter
  .get(
    "/get-all",
    CustSuppController.getAll({ user_type: USER_TYPE.SUPPLIER }),
    errorHandler
  )
  .post(
    "/create",
    checkUserExist(),
    CustSuppController.create({ user_type: USER_TYPE.SUPPLIER }),
    errorHandler
  )
  .get(
    "/get-by-id/:id",
    checkExist(User),
    CustSuppController.getByID,
    errorHandler
  )
  .delete(
    "/delete-by-id/:id",
    checkExist(CustSupp),
    CustSuppController.deleteByID,
    errorHandler
  )
  .patch(
    "/update-personalInfo-by-id/:id",
    checkExist(CustSupp),
    checkUserExist(),
    CustSuppController.updatePersonalInfoByID,
    errorHandler
  );

export default supplierRouter;
