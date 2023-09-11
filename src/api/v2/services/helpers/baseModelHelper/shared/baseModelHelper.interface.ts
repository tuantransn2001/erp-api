import { ObjectType } from "../../../../ts/types/common";

export interface CreateAsyncPayload<T> {
  Model: any;
  dto: T;
}

export interface BulkCreateAsyncPayload<T> {
  Model: any;
  dto: T[];
}

export interface GetAllAsyncPayload {
  Model: any;
  page_size: number;
  page_number: number;
  include?: ObjectType<any>[];
  separate?: boolean;
  attributes?: string[];
  where?: ObjectType<any>;
  search?: string;
  order?: any[];
}

export interface GetByIdAsyncPayload
  extends Omit<GetAllAsyncPayload, "page_size" | "page_number"> {}

export interface UpdateAsyncPayload<T> extends CreateAsyncPayload<Partial<T>> {
  where: ObjectType<string | boolean>;
}

export interface BulkUpdateAsyncPayload<T>
  extends Omit<UpdateAsyncPayload<T>, "dto"> {
  dto: T[];
}

export interface SoftDeleteByIDAsyncPayload {
  Model: any;
  id: string;
}

export interface HardDeleteByIDAsyncPayload
  extends Omit<SoftDeleteByIDAsyncPayload, "id"> {
  where: ObjectType<any> | string[];
}

export interface ModifyJunctionPayload {
  JunctionModel: any;
  attrs: ObjectType<string>[];
  ownerQuery: { [key: string]: string };
}
