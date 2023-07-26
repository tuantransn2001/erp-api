import { Router } from "express";
import { authenticate, checkExist, errorHandler } from "../middlewares";
import ProductController from "../controller/product-controller";
import model from "../models";
import BranchProductController from "../controller/branchProduct-controller";
const { Products } = model;
const productRouter = Router();

productRouter
  .get("/get-all", authenticate, ProductController.getAll, errorHandler)
  .get(
    "/get-by-id/:id",
    authenticate,
    checkExist(Products),
    ProductController.getByID,
    errorHandler
  )
  .post("/create", authenticate, ProductController.create, errorHandler)
  .get("/branch/get-all", BranchProductController.getAll)
  .get("/import/get-all", ProductController.ImportProduct().getAll);

export default productRouter;
