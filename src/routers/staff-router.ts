import { Router } from "express";
const staffRouter = Router();
import StaffController from "../controller/staff-controller";
import db from "../models";
const { User } = db;
import {
  checkExist,
  checkUserExist,
  authenticate,
  authorize,
  errorHandler,
} from "../middlewares";

staffRouter
  .get("/get-all", authenticate, StaffController.getAll, errorHandler)
  .post(
    "/create",
    authenticate,
    authorize,
    checkUserExist(),
    StaffController.create,
    errorHandler
  )
  .get("/get-by-id/:id", authenticate, StaffController.getByID, errorHandler)
  .patch(
    "/update-personal-by-id/:id",
    authenticate,
    checkExist(User),
    checkUserExist(),
    StaffController.updateByID,
    errorHandler
  )
  .delete(
    "/delete-by-id/:id",
    authenticate,
    checkExist(User),
    StaffController.deleteByID,
    errorHandler
  )
  .patch(
    "/update-role-by-id/:id",
    authenticate,
    checkExist(User),
    StaffController.updateRoleByID,
    errorHandler
  );
export default staffRouter;
