import { Router } from "express";
import TagController from "../controllers/tag.controller";
import {
  CheckItemExistMiddleware,
  ZodValidationMiddleware,
} from "../middlewares";
import db from "../models";
import {
  BulkCreateTagItemRowSchema,
  BulkUpdateTagItemRowSchema,
} from "../dto/input/tag/tag.schema";
const { Tag } = db;

const tagRouter = Router();

const _TagController = new TagController();

tagRouter
  .get("/get-all", _TagController.getAll)
  .post(
    "/create",
    ZodValidationMiddleware(BulkCreateTagItemRowSchema),
    _TagController.create
  )
  .patch(
    "/update",
    ZodValidationMiddleware(BulkUpdateTagItemRowSchema),
    _TagController.update
  )
  .delete(
    "/delete-by-id/:id",
    CheckItemExistMiddleware(Tag),
    _TagController.deleteByID
  );

export default tagRouter;
