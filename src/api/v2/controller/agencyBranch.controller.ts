import { NextFunction, Request, Response } from "express";
import db from "../models";
const { AgencyBranch } = db;
import { STATUS_CODE, STATUS_MESSAGE } from "../ts/enums/api_enums";
import RestFullAPI from "../utils/response/apiResponse";
import { AgencyBranchService } from "../services/agencyBranch.services";
import {
  CreateAsyncPayload,
  GetAllAsyncPayload,
  UpdateAsyncPayload,
} from "../services/helpers/shared/baseModelHelper.interface";
import HttpException from "../utils/exceptions/http.exception";
import { CreateAgencyBranchDTO } from "../ts/dto/input/agencyBranch/agencyBranch.interface";
import { BaseModelHelper } from "../services/helpers/baseModelHelper";

const _AgencyBranchService = new AgencyBranchService();

class AgencyBranchController {
  public async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const getAllAsyncData: GetAllAsyncPayload = {
        ...BaseModelHelper.getPagination(req),
        Model: AgencyBranch,
      };
      const { statusCode, data } = await _AgencyBranchService.getAll(
        getAllAsyncData
      );
      res.status(statusCode).send(data);
    } catch (err) {
      next(err);
    }
  }
  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const createAsyncData: CreateAsyncPayload<CreateAgencyBranchDTO> = {
        Model: AgencyBranch,
        dto: req.body,
      };
      const { statusCode, data } = await _AgencyBranchService.create(
        createAsyncData
      );
      res.status(statusCode).send(data);
    } catch (err) {
      next(err);
    }
  }
  public async updateByID(req: Request, res: Response, next: NextFunction) {
    try {
      const updateAsyncData: UpdateAsyncPayload<CreateAgencyBranchDTO> = {
        Model: AgencyBranch,
        dto: req.body,
        where: { id: req.params.id },
      };

      const { statusCode, data } = await _AgencyBranchService.update(
        updateAsyncData
      );
      res.status(statusCode).send(data);
    } catch (err) {
      next(err);
    }
  }
  public async checkAgencyBranchExistByCode(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { agency_branch_code } = req.body;
      const targetAgencyCode: string = agency_branch_code;

      const foundAgencyBranch = await AgencyBranch.findOne({
        where: {
          agency_branch_code: targetAgencyCode,
        },
      });

      if (foundAgencyBranch) {
        res.status(STATUS_CODE.BAD_REQUEST).send(
          RestFullAPI.onFail(STATUS_MESSAGE.BAD_REQUEST, {
            message:
              "Agency Branch has been already exists! Please check CN_code and try again!",
          } as HttpException)
        );
      } else {
        next();
      }
    } catch (err) {
      next(err);
    }
  }
}

export default AgencyBranchController;
