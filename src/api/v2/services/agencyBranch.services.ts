import db from "../models";
import { CreateAgencyBranchDTO } from "../dto/input/agencyBranch/agencyBranch.interface";

import { BaseModelHelper } from "./helpers/baseModelHelper";
import {
  CreateAsyncPayload,
  GetAllAsyncPayload,
  UpdateAsyncPayload,
} from "./helpers/shared/baseModelHelper.interface";
const { AgencyBranch } = db;

export class AgencyBranchService {
  private async handleEnableIsDefaultCN() {
    const updateData: UpdateAsyncPayload<CreateAgencyBranchDTO> = {
      Model: AgencyBranch,
      dto: {
        isDefaultCN: false,
      },
      where: {
        isDefaultCN: true,
      },
    };
    await BaseModelHelper.updateAsync(updateData);
  }

  public async getAll(payload: GetAllAsyncPayload) {
    return await BaseModelHelper.getAllAsync(payload);
  }

  public async create(payload: CreateAsyncPayload<CreateAgencyBranchDTO>) {
    if (payload.dto.isDefaultCN) {
      this.handleEnableIsDefaultCN();
    }
    return await BaseModelHelper.createAsync(payload);
  }

  public async update(payload: UpdateAsyncPayload<CreateAgencyBranchDTO>) {
    if (payload.dto.isDefaultCN) {
      this.handleEnableIsDefaultCN();
    }

    return await BaseModelHelper.updateAsync(payload);
  }
}
