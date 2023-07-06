import { Router } from "express";
const seedRouter = Router();
import { authorize } from "../middlewares";
const { SeedDataController } = require("../controller/seed-data-controller");

seedRouter
  .post("/start", authorize, SeedDataController.start)
  .delete("/reset", authorize, SeedDataController.reset);
export default seedRouter;
