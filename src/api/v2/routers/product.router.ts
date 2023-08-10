import { Router } from "express";
import { checkExist, errorHandler } from "../middlewares";
import ProductController from "../controller/product.controller";
import model from "../models";
const { ProductVariantDetail } = model;
const productRouter = Router();

productRouter
  .get("/get-all", ProductController.getAllProductVariant, errorHandler)
  .get(
    "/get-by-id/:id",
    checkExist(ProductVariantDetail),
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
