import { Router } from "express";
import { authenticate, errorHandler } from "../middlewares";
import ProductController from "../controller/product-controller";
const productRouter = Router();

productRouter
  .get("/get-all", authenticate, ProductController.getAll, errorHandler)
  .post("/create", authenticate, ProductController.create, errorHandler);

export default productRouter;
