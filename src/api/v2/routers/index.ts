import { Router } from "express";
import authRouter from "./auth.router";
import staffRouter from "./staff.router";
import agencyBranchRouter from "./agencyBranch.router";
import userAddressRouter from "./userAddress.router";
import tagRouter from "./tag.router";
import roleRouter from "./role.router";
import priceRouter from "./price.router";
import productRouter from "./product.router";
import brandRouter from "./brand.router";
import typeRouter from "./type.router";
import orderRouter from "./order.router";
import debtRouter from "./debt.router";
import swaggerRouter from "./swagger.router";
import paymentRouter from "./payment.router";
import shipperRouter from "./shipper.router";
import custSuppRouter from "./customer.router";
import supplierRouter from "./supplier.router";
import shipmentRouter from "./shipment-router";
const rootRouter = Router();

rootRouter
  .use("/auth", authRouter)
  .use("/customer", custSuppRouter)
  .use("/supplier", supplierRouter)
  .use("/address", userAddressRouter)
  .use("/agency-branch", agencyBranchRouter)
  .use("/staff", staffRouter)
  .use("/tag", tagRouter)
  .use("/role", roleRouter)
  .use("/price", priceRouter)
  .use("/brand", brandRouter)
  .use("/type", typeRouter)
  .use("/product", productRouter)
  .use("/order", orderRouter)
  .use("/swagger", swaggerRouter)
  .use("/debt", debtRouter)
  .use("/payment", paymentRouter)
  .use("/shipper", shipperRouter)
  .use("/shipment", shipmentRouter);

export default rootRouter;
