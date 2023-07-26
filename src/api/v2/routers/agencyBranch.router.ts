import { Router } from "express";
const agencyBranchRouter = Router();
import AgencyController from "../controller/agencyBranch.controller";
import db from "../models";
const { AgencyBranch } = db;
import { checkExist, errorHandler } from "../middlewares";

agencyBranchRouter
  .get("/get-all", AgencyController.getAll, errorHandler)
  .post(
    "/create",
    AgencyController.checkAgencyBranchExistByCode,
    AgencyController.create,
    errorHandler
  )
  .patch(
    "/update-by-id/:id",

    checkExist(AgencyBranch),
    AgencyController.checkAgencyBranchExistByCode,
    AgencyController.updateByID,
    errorHandler
  );
export default agencyBranchRouter;
