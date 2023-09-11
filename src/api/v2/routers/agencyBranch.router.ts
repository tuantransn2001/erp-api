import { Router } from "express";
const agencyBranchRouter = Router();

import db from "../models";
const { AgencyBranch } = db;
import {
  CheckItemExistMiddleware,
  errorCatcher,
  ZodValidationMiddleware,
} from "../middlewares";
import { CreateAgencyBranchSchema } from "../dto/input/agencyBranch/agencyBranch.schema";
import AgencyBranchController from "../controller/agencyBranch.controller";

const _AgencyBranchController = new AgencyBranchController();

agencyBranchRouter
  .get("/get-all", _AgencyBranchController.getAll, errorCatcher)
  .post(
    "/create",
    ZodValidationMiddleware(CreateAgencyBranchSchema),
    _AgencyBranchController.checkAgencyBranchExistByCode,
    _AgencyBranchController.create,
    errorCatcher
  )
  .patch(
    "/update-by-id/:id",
    ZodValidationMiddleware(CreateAgencyBranchSchema),
    CheckItemExistMiddleware(AgencyBranch),
    _AgencyBranchController.checkAgencyBranchExistByCode,
    _AgencyBranchController.updateByID,
    errorCatcher
  );
export default agencyBranchRouter;
