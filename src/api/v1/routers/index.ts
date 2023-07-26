import { Router } from "express";
import authRouter from "./auth-router";
import customerRouter from "./customer-router";
import staffRouter from "./staff-router";
import agencyBranchRouter from "./agencyBranch-router";
import userAddressRouter from "./userAddress-router";
import tagRouter from "./tag-router";
import roleRouter from "./role-router";
import priceRouter from "./price-router";
import productRouter from "./product-router";
import supplierRouter from "./supplier-router";
import brandRouter from "./brand-router";
import typeRouter from "./type-router";
import orderRouter from "./order-router";
import debtRouter from "./debt-router";
import swaggerRouter from "./swagger-router";
import paymentRouter from "./payment-router";
import shipperRouter from "./shipper-router";
const rootRouter = Router();

rootRouter
  .use("/auth", authRouter)
  .use("/customer", customerRouter)
  .use("/address", userAddressRouter)
  .use("/agency-branch", agencyBranchRouter)
  .use("/staff", staffRouter)
  .use("/tag", tagRouter)
  .use("/role", roleRouter)
  .use("/price", priceRouter)
  .use("/supplier", supplierRouter)
  .use("/brand", brandRouter)
  .use("/type", typeRouter)
  .use("/product", productRouter)
  .use("/order", orderRouter)
  .use("/swagger", swaggerRouter)
  .use("/debt", debtRouter)
  .use("/payment", paymentRouter)
  .use("/shipper", shipperRouter);

export default rootRouter;
