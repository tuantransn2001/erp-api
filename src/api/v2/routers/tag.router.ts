import { Router } from "express";
import TagController from "../controllers/tag.controller";
import {
  errorCatcher,
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
  .get("/get-all", _TagController.getAll, errorCatcher)
  .post(
    "/create",
    ZodValidationMiddleware(BulkCreateTagItemRowSchema),
    _TagController.create,
    errorCatcher
  )
  .patch(
    "/update",
    ZodValidationMiddleware(BulkUpdateTagItemRowSchema),
    _TagController.update,
    errorCatcher
  )
  .delete(
    "/delete-by-id/:id",
    CheckItemExistMiddleware(Tag),
    _TagController.deleteByID,
    errorCatcher
  );

export default tagRouter;
