import { Router } from "express";
import RoleController from "../controller/role.controller";
import { errorHandler, checkExist, authorize } from "../middlewares";
import db from "../models";
const { Role } = db;

const roleRouter = Router();

roleRouter
  .get("/get-all", authorize, RoleController.getAll, errorHandler)
  .post("/create", authorize, RoleController.create, errorHandler)
  .patch(
    "/update-by-id/:id",
    checkExist(Role),
    authorize,
    RoleController.updateByID,
    errorHandler
  )
  .delete(
    "/delete-by-id/:id",
    checkExist(Role),
    authorize,
    RoleController.deleteByID,
    errorHandler
  );

export default roleRouter;
