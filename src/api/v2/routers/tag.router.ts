import { Router } from "express";
import TagController from "../controller/tag.controller";
import { errorHandler, checkExist } from "../middlewares";
import db from "../models";
const { Tag } = db;

const tagRouter = Router();

tagRouter
  .get("/get-all", TagController.getAll, errorHandler)
  .post("/create", TagController.create, errorHandler)
  .patch(
    "/update-by-id/:id",
    checkExist(Tag),
    TagController.updateByID,
    errorHandler
  )
  .delete(
    "/delete-by-id/:id",
    checkExist(Tag),
    TagController.deleteByID,
    errorHandler
  );

export default tagRouter;
