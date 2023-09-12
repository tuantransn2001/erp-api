import { Router } from "express";
import authRouter from "./auth.router";
import agencyBranchRouter from "./agencyBranch.router";
import userAddressRouter from "./userAddress.router";
import tagRouter from "./tag.router";
import roleRouter from "./role.router";
import priceRouter from "./price.router";
import brandRouter from "./brand.router";
import typeRouter from "./type.router";
import debtRouter from "./debt.router";
import paymentRouter from "./payment.router";
import shipperRouter from "./shipper.router";
import custSuppRouter from "./customer.router";
import supplierRouter from "./supplier.router";
import staffRouter from "./staff.router";
import productRouter from "./product.router";
const rootRouter = Router();

rootRouter
  .use("/auth", authRouter) // ? Done
  .use("/customer", custSuppRouter) // ? Done
  .use("/supplier", supplierRouter) // ? Done
  .use("/address", userAddressRouter) // ? Done
  .use("/agency-branch", agencyBranchRouter) // ? Done
  .use("/tag", tagRouter) // ? Done
  .use("/role", roleRouter) // ? Done
  .use("/price", priceRouter) // ? Done
  .use("/brand", brandRouter) // ? Done
  .use("/type", typeRouter) // ? Done
  .use("/debt", debtRouter) // ? Done
  .use("/payment", paymentRouter) // ? Done
  .use("/shipper", shipperRouter) // ? Done
  .use("/staff", staffRouter) // ? Done
  .use("/product", productRouter); // TODO: doing...
export default rootRouter;
