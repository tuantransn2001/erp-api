import { z } from "zod";
import { ShipperSchema } from "./shipper.schema";

export type IShipper = z.infer<typeof ShipperSchema>;
