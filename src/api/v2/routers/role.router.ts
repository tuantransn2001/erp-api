import { Router } from "express";
import RoleController from "../controller/role.controller";
import {
  errorCatcher,
  CheckItemExistMiddleware,
  ZodValidationMiddleware,
} from "../middlewares";
import db from "../models";
import {
  CreateRoleRowSchema,
  UpdateRoleRowSchema,
} from "../ts/dto/input/common/common.schema";
const { Role } = db;

const roleRouter = Router();

const _RoleController = new RoleController();

roleRouter
  .get("/get-all", _RoleController.getAll, errorCatcher)
  .post(
    "/create",
    ZodValidationMiddleware(CreateRoleRowSchema),
    _RoleController.create,
    errorCatcher
  )
  .patch(
    "/update-by-id/:id",
    ZodValidationMiddleware(UpdateRoleRowSchema),
    CheckItemExistMiddleware(Role),
    _RoleController.updateByID,
    errorCatcher
  )
  .delete(
    "/delete-by-id/:id",
    CheckItemExistMiddleware(Role),
    _RoleController.softDeleteByID,
    errorCatcher
  );

export default roleRouter;
