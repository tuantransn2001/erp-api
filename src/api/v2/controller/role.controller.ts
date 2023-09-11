import { Request, Response, NextFunction } from "express";
import db from "../models";
const { Role } = db;
import {
  CreateAsyncPayload,
  GetAllAsyncPayload,
  SoftDeleteByIDAsyncPayload,
  UpdateAsyncPayload,
} from "../services/helpers/shared/baseModelHelper.interface";
import { BaseModelHelper } from "../services/helpers/baseModelHelper";
import {
  CreateRoleRowDTO,
  UpdateRoleRowDTO,
} from "../dto/input/role/role.interface";
class RoleController {
  public async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const getAllRoleData: GetAllAsyncPayload = {
        ...BaseModelHelper.getPagination(req),
        Model: Role,
        attributes: [
          "id",
          "role_title",
          "role_description",
          "createdAt",
          "updatedAt",
        ],
      };

      const { statusCode, data } = await BaseModelHelper.getAllAsync(
        getAllRoleData
      );

      res.status(statusCode).send(data);
    } catch (err) {
      next(err);
    }
  }
  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { role_title, role_description } = req.body;
      const createRoleData: CreateAsyncPayload<CreateRoleRowDTO> = {
        Model: Role,
        dto: { role_title, role_description },
      };

      const { statusCode, data } = await BaseModelHelper.createAsync(
        createRoleData
      );
      res.status(statusCode).send(data);
    } catch (err) {
      next(err);
    }
  }
  public async updateByID(req: Request, res: Response, next: NextFunction) {
    try {
      const { role_title, role_description } = req.body;

      const updateRoleData: UpdateAsyncPayload<UpdateRoleRowDTO> = {
        Model: Role,
        dto: { role_title, role_description },
        where: { id: req.params.id },
      };

      const { statusCode, data } = await BaseModelHelper.updateAsync(
        updateRoleData
      );
      res.status(statusCode).send(data);
    } catch (err) {
      next(err);
    }
  }
  public async softDeleteByID(req: Request, res: Response, next: NextFunction) {
    try {
      const deleteRoleData: SoftDeleteByIDAsyncPayload = {
        Model: Role,
        id: req.params.id,
      };

      const { statusCode, data } = await BaseModelHelper.softDeleteAsync(
        deleteRoleData
      );
      res.status(statusCode).send(data);
    } catch (err) {
      next(err);
    }
  }
}

export default RoleController;
