import { Router } from "express";
import SupplierController from "../controller/supplier-controller";
import { authenticate, checkExist, errorHandler } from "../middlewares";
import db from "../models";
const { User } = db;
const supplierRouter = Router();

supplierRouter
  .get("/get-all", authenticate, SupplierController.getAll, errorHandler)
  .get(
    "/get-by-id/:id",
    authenticate,
    checkExist(User),
    SupplierController.getByID,
    errorHandler
  );

export default supplierRouter;
