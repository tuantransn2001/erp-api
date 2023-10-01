import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { CreateProductSchema } from "../dto/input/product/product.schema";
import {
  CheckItemExistMiddleware,
  ZodValidationMiddleware,
} from "../middlewares";
import db from "../models";
const { ProductVariantDetail, Products } = db;
const productRouter = Router();

const _ProductController = new ProductController();

productRouter
  .get("/variant/get-all", _ProductController.getAllProductVariant)
  .get(
    "/get-by-id/:id",
    CheckItemExistMiddleware(Products),
    _ProductController.getProductById
  ) // TODO: coding...
  .get(
    "/variant/get-by-id/:id",
    CheckItemExistMiddleware(ProductVariantDetail),
    _ProductController.getProductVariantById
  )
  .post(
    "/create",
    ZodValidationMiddleware(CreateProductSchema),
    _ProductController.create
  )
  .delete(
    "/variant/delete-by-id/:id",
    CheckItemExistMiddleware(ProductVariantDetail),
    _ProductController.softDeleteProductVariantById
  ); // TODO: coding...

export default productRouter;
