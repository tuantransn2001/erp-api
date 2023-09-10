import { Router } from "express";
import { StaffController } from "../controller/staff.controller";
import {
  CheckItemExistMiddleware,
  errorCatcher,
  ZodValidationMiddleware,
} from "../middlewares";
import { CreateStaffSchema } from "../ts/dto/input/common/common.schema";
import db from "../models";
const { Staff } = db;

const staffRouter = Router();

const _StaffController = new StaffController();

staffRouter
  .get("/get-all", _StaffController.getAll, errorCatcher)
  .get(
    "/get-by-id/:id",
    CheckItemExistMiddleware(Staff),
    _StaffController.getByID,
    errorCatcher
  )
  .post(
    "/create",
    ZodValidationMiddleware(CreateStaffSchema),
    _StaffController.create,
    errorCatcher
  )
  .delete(
    "/delete-by-id/:id",
    CheckItemExistMiddleware(Staff),
    _StaffController.softDeleteByID,
    errorCatcher
  )
  .patch("/update/:id", CheckItemExistMiddleware(Staff), errorCatcher); // TODO: coding...

export default staffRouter;
