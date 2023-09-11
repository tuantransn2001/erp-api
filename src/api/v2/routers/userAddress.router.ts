import { Router } from "express";
import UserAddressController from "../controller/userAddress.controllers";
import {
  CheckItemExistMiddleware,
  errorCatcher,
  ZodValidationMiddleware,
} from "../middlewares";
import db from "../models";
import {
  CreateUserAddressSchema,
  UpdateUserAddressSchema,
} from "../dto/input/userAddress/userAddress.schema";
const { User, UserAddress } = db;
const userAddressRouter = Router();

const _UserAddressController = new UserAddressController();

userAddressRouter
  .post(
    "/add/:id",
    ZodValidationMiddleware(CreateUserAddressSchema),
    CheckItemExistMiddleware(User),
    _UserAddressController.create,
    errorCatcher
  )
  .patch(
    "/update/:id",
    ZodValidationMiddleware(UpdateUserAddressSchema),
    CheckItemExistMiddleware(UserAddress),
    _UserAddressController.update,
    errorCatcher
  )
  .delete(
    "/delete/:id",
    CheckItemExistMiddleware(UserAddress),
    _UserAddressController.softDeleteByID,
    errorCatcher
  );

export default userAddressRouter;
