import { Router } from "express";
import { StaffController } from "../controllers/staff.controller";
import {
  CheckItemExistMiddleware,
  ZodValidationMiddleware,
} from "../middlewares";
import {
  CreateStaffSchema,
  UpdateStaffSchema,
} from "../dto/input/staff/staff.schema";
import db from "../models";
const { Staff } = db;

const staffRouter = Router();

const _StaffController = new StaffController();

staffRouter
  .get("/get-all", _StaffController.getAll)
  .get(
    "/get-by-id/:id",
    CheckItemExistMiddleware(Staff),
    _StaffController.getByID
  )
  .post(
    "/create",
    ZodValidationMiddleware(CreateStaffSchema),
    _StaffController.create
  )
  .delete(
    "/delete-by-id/:id",
    CheckItemExistMiddleware(Staff),
    _StaffController.softDeleteByID
  )
  .patch(
    "/update-personal-by-id/:id",
    CheckItemExistMiddleware(Staff),
    ZodValidationMiddleware(UpdateStaffSchema),
    _StaffController.updateDetail
  );

export default staffRouter;
