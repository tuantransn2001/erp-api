import { Router } from "express";
import { StaffController } from "../controller/staff.controller";
import {
  CheckItemExistMiddleware,
  errorCatcher,
  ZodValidationMiddleware,
} from "../middlewares";
import { CreateStaffSchema } from "../dto/input/staff/staff.schema";
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
  .patch(
    "/update-personal-by-id/:id",
    CheckItemExistMiddleware(Staff),
    _StaffController.updateDetail,
    errorCatcher
  ); // TODO: coding...

export default staffRouter;
