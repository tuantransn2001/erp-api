import { Router } from "express";
const staffRouter = Router();
import StaffController from "../controller/staff.controller";
import db from "../models";
const { Staff } = db;
import { checkExist, checkUserExist, errorHandler } from "../middlewares";

staffRouter
  .get("/get-all", StaffController.getAll, errorHandler)
  .post("/create", checkUserExist(), StaffController.create, errorHandler)
  .get("/get-by-id/:id", StaffController.getByID, errorHandler)
  .patch(
    "/update-personal-by-id/:id",
    checkUserExist(),
    checkExist(Staff),
    StaffController.updateByID,
    errorHandler
  )
  .delete(
    "/delete-by-id/:id",
    checkExist(Staff),
    StaffController.deleteByID,
    errorHandler
  );

export default staffRouter;
