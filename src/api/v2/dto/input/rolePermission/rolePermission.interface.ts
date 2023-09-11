import { z } from "zod";
import { RolePermissionSchema } from "./rolePermission.schema";

export type IRolePermission = z.infer<typeof RolePermissionSchema>;
