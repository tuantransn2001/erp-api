import { Router } from "express";
import UserAddressController from "../controller/userAddress.controllers";
import { checkExist, errorHandler } from "../middlewares";
import db from "../models";
const { User, UserAddress } = db;
const userAddressRouter = Router();

userAddressRouter
  .post(
    "/add/:id",
    checkExist(User),
    UserAddressController.addNewAddressByUserID,
    errorHandler
  )
  .patch(
    "/update/:id",
    checkExist(UserAddress),
    UserAddressController.updateAddressByID,
    errorHandler
  )
  .delete(
    "/delete/:id",
    checkExist(UserAddress),
    UserAddressController.deleteAddressByID,
    errorHandler
  );

export default userAddressRouter;
