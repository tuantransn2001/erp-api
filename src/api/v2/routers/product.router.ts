import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { CreateProductSchema } from "../dto/input/product/product.schema";
import {
  CheckItemExistMiddleware,
  errorCatcher,
  ZodValidationMiddleware,
} from "../middlewares";
import db from "../models";
const { ProductVariantDetail, Products } = db;
const productRouter = Router();

const _ProductController = new ProductController();

productRouter
  .get(
    "/variant/get-all",
    _ProductController.getAllProductVariant,
    errorCatcher
  )
  .get(
    "/get-by-id/:id",
    CheckItemExistMiddleware(Products),
    _ProductController.getProductById,
    errorCatcher
  ) // TODO: coding...
  .get(
    "/variant/get-by-id/:id",
    CheckItemExistMiddleware(ProductVariantDetail),
    _ProductController.getProductVariantById,
    errorCatcher
  )
  .post(
    "/create",
    ZodValidationMiddleware(CreateProductSchema),
    _ProductController.create,
    errorCatcher
  )
  .delete(
    "/variant/delete-by-id/:id",
    CheckItemExistMiddleware(ProductVariantDetail),
    _ProductController.softDeleteProductVariantById,
    errorCatcher
  ); // TODO: coding...

export default productRouter;
