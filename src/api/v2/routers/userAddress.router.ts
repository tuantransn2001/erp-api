import { Router } from "express";
import UserAddressController from "../controllers/userAddress.controllers";
import {
  CheckItemExistMiddleware,
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
    _UserAddressController.create
  )
  .patch(
    "/update/:id",
    ZodValidationMiddleware(UpdateUserAddressSchema),
    CheckItemExistMiddleware(UserAddress),
    _UserAddressController.update
  )
  .delete(
    "/delete/:id",
    CheckItemExistMiddleware(UserAddress),
    _UserAddressController.softDeleteByID
  );

export default userAddressRouter;
