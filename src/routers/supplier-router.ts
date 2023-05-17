import { Router } from "express";
import SupplierController from "../controller/supplier-controller";
import { authenticate, errorHandler } from "../middlewares";

const supplierRouter = Router();

supplierRouter.get(
  "/get-all",
  authenticate,
  SupplierController.getAll,
  errorHandler
);

export default supplierRouter;
