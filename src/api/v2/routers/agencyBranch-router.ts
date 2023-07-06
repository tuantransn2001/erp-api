import { Router } from "express";
const agencyBranchRouter = Router();
import AgencyController from "../controller/agencyBranch.controller";
import db from "../models";
const { AgencyBranch } = db;
import { authorize, checkExist, errorHandler } from "../middlewares";

agencyBranchRouter
  .get(
    "/get-all",

    authorize,
    AgencyController.getAll,
    errorHandler
  )
  .post(
    "/create",

    authorize,
    AgencyController.checkAgencyBranchExistByCode,
    AgencyController.create,
    errorHandler
  )
  .patch(
    "/update-by-id/:id",

    authorize,
    checkExist(AgencyBranch),
    AgencyController.checkAgencyBranchExistByCode,
    AgencyController.updateByID,
    errorHandler
  );
export default agencyBranchRouter;
