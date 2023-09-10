import { z } from "zod";
import { StringType } from "../common/common.schema";

export const LoginSchema = z.object({
  phone: z.string().nonempty({ message: "email is required!" }),
  password: z.string().nonempty({ message: "password is required!" }),
});

export const GetMeSchema = z.object({
  currentUserID: StringType,
});
