import { Request, Response, NextFunction } from "express";
import db from "../models";
import { map as mapSync } from "awaity";
import { BaseModelHelper } from "../services/helpers/baseModelHelper/baseModelHelper";
import {
  BulkCreateAsyncPayload,
  GetAllAsyncPayload,
  SoftDeleteByIDAsyncPayload,
  UpdateAsyncPayload,
} from "../services/helpers/baseModelHelper/shared/baseModelHelper.interface";
import {
  BulkCreateTagRowDTO,
  UpdateTagRowDTO,
} from "../dto/input/tag/tag.interface";
import RestFullAPI from "../utils/response/apiResponse";
const { Tag } = db;
class TagController {
  public async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const getTypeAllData: GetAllAsyncPayload = {
        ...BaseModelHelper.getPagination(req),
        Model: Tag,
      };

      const { statusCode, data } = await BaseModelHelper.getAllAsync(
        getTypeAllData
      );

      res.status(statusCode).send(data);
    } catch (err) {
      next(err);
    }
  }
  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { tags } = req.body;

      const bulkCreateTagData: BulkCreateAsyncPayload<BulkCreateTagRowDTO> = {
        Model: Tag,
        dto: tags,
      };

      const { statusCode, data } = await BaseModelHelper.bulkCreateAsyncPayload(
        bulkCreateTagData
      );

      res.status(statusCode).send(data);
    } catch (err) {
      next(err);
    }
  }
  public async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { tags } = req.body;

      const bulkUpdateTagPromiseResult = await mapSync(
        tags,
        async ({ id, ...rest }) => {
          const updateSingleTagData: UpdateAsyncPayload<UpdateTagRowDTO> = {
            Model: Tag,
            where: {
              id,
            },
            dto: { ...rest },
          };
          const updateSingleTagRes = await BaseModelHelper.updateAsync(
            updateSingleTagData
          );

          return updateSingleTagRes;
        }
      );

      const { statusCode, data } = await RestFullAPI.onArrayPromiseSuccess(
        bulkUpdateTagPromiseResult
      );
      res.status(statusCode).send(data);
    } catch (err) {
      next(err);
    }
  }
  public async deleteByID(req: Request, res: Response, next: NextFunction) {
    try {
      const softDeleteTagPayload: SoftDeleteByIDAsyncPayload = {
        Model: Tag,
        id: req.params.id,
      };

      const { statusCode, data } = await BaseModelHelper.softDeleteAsync(
        softDeleteTagPayload
      );

      res.status(statusCode).send(data);
    } catch (err) {
      next(err);
    }
  }
}

export default TagController;
