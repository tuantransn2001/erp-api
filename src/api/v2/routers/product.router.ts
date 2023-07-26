import { Router } from "express";
import { checkExist, errorHandler } from "../middlewares";
import ProductController from "../controller/product.controller";
import model from "../models";
const { Products } = model;
const productRouter = Router();

productRouter
  .get("/get-all", ProductController.getAllProduct, errorHandler)
  .get(
    "/get-by-id/:id",
    checkExist(Products),
    ProductController.getVariantByID,
    errorHandler
  )
  .post("/create", ProductController.create, errorHandler)
  .get(
    "/branch/get-all",
    ProductController.getAllBranchProductVariant,
    errorHandler
  )
  .get("/import/get-all", ProductController.getAllProductVariant, errorHandler);

export default productRouter;
