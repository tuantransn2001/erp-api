import { Router } from "express";
import RoleController from "../controller/role-controller";
import {
  errorHandler,
  checkExist,
  authorize,
  authenticate,
} from "../middlewares";
import db from "../models";
const { Role } = db;

const roleRouter = Router();

roleRouter
  .get("/get-all", authenticate, authorize, RoleController.getAll, errorHandler)
  .post("/create", authenticate, authorize, RoleController.create, errorHandler)
  .patch(
    "/update-by-id/:id",
    checkExist(Role),
    authenticate,
    authorize,
    RoleController.updateByID,
    errorHandler
  )
  .delete(
    "/delete-by-id/:id",
    checkExist(Role),
    authenticate,
    authorize,
    RoleController.deleteByID,
    errorHandler
  );

export default roleRouter;
