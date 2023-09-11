import { z } from "zod";
import { ObjectType } from "../../../ts/types/common";
export const UUIDType = z.string().uuid({ message: "Invalid UUID" });
export const UUIDArrayType = UUIDType.array();
export const StringType = z.string();
export const StringArrayType = StringType.array();
export const DateType = z.date();
export const BooleanType = z.boolean();
export const NumberType = z.number();

export const BaseOmit: ObjectType<boolean> = {
  id: true,
  isDelete: true,
  createAt: true,
  updateAt: true,
};

// ? ================================================
export const BaseSchema = z.object({
  id: UUIDType.optional(),
  isDelete: BooleanType.optional(),
  createAt: DateType.optional(),
  updateAt: DateType.optional(),
});
