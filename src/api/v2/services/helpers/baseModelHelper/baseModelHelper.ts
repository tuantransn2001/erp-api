import { Request } from "express";
import { isEmpty, isNullOrFalse } from "../../../common/helper";
import { STATUS_CODE, STATUS_MESSAGE } from "../../../common/enums/api_enums";
import { ServerError } from "../../../common/types/common";
import HttpException from "../../../utils/exceptions/http.exception";
import { handleError } from "../../../utils/handleError/handleError";
import RestFullAPI from "../../../utils/response/apiResponse";
import { handleServerResponse } from "../../../utils/response/handleServerResponse";
import { URLSearchParam } from "../../../utils/searchParam/urlSearchParam";
import { map as asyncMap } from "awaity";
import {
  BulkCreateAsyncPayload,
  CreateAsyncPayload,
  GetAllAsyncPayload,
  GetByIdAsyncPayload,
  HardDeleteByIDAsyncPayload,
  ModifyJunctionPayload,
  MultipleSoftDeleteByIDAsyncPayload,
  SoftDeleteByIDAsyncPayload,
  UpdateAsyncPayload,
} from "./shared/baseModelHelper.interface";

export class BaseModelHelper {
  public static getPagination(req: Request) {
    const { page_number, page_size, search } = req.query;
    const getAllAsyncData: Omit<GetAllAsyncPayload, "Model"> = {
      page_number: +`${page_number}` ?? 1,
      page_size: +`${page_size}` ?? 5,
      search: search ? `${search}` : "",
    };

    return getAllAsyncData;
  }
  public static async getAllAsync(payload: GetAllAsyncPayload): Promise<any> {
    const { Model, page_size, page_number, include, where, search, ...rest } =
      payload;
    const _skip = (page_number - 1) * page_size;
    const _limit = page_size;
    const _where = search
      ? {
          ...where,
          ...URLSearchParam.urlParamsToObj(search as string),
        }
      : { ...where };

    const _include = include ? include : [];

    const options = {
      where: { ..._where, isDelete: isNullOrFalse },
      limit: _limit,
      offset: _skip,
      include: _include,
      ...rest,
    };

    return await Model.findAll(options)
      .then((response) => {
        if (isEmpty(response)) {
          return handleServerResponse(
            STATUS_CODE.NOT_FOUND,
            RestFullAPI.onFail(STATUS_MESSAGE.NOT_FOUND)
          );
        }

        return handleServerResponse(
          STATUS_CODE.OK,
          RestFullAPI.onSuccess(STATUS_MESSAGE.SUCCESS, response)
        );
      })
      .catch((err) => {
        console.log({ err });
        return handleServerResponse(
          STATUS_CODE.INTERNAL_SERVER_ERROR,
          handleError(err as ServerError)
        );
      });
  }
  public static async getOneAsync(payload: GetByIdAsyncPayload): Promise<any> {
    const { Model, ...rest } = payload;

    return await Model.findOne({ ...rest })
      .then((response) => {
        if (!response) {
          return handleServerResponse(
            STATUS_CODE.NOT_FOUND,
            RestFullAPI.onFail(STATUS_MESSAGE.NOT_FOUND, {
              message: `Check by middleware!!`,
            } as HttpException)
          );
        }

        return handleServerResponse(
          STATUS_CODE.OK,
          RestFullAPI.onSuccess(STATUS_MESSAGE.SUCCESS, response)
        );
      })
      .catch((err) => {
        return handleServerResponse(
          STATUS_CODE.INTERNAL_SERVER_ERROR,
          handleError(err as ServerError)
        );
      });
  }
  public static async createAsync(
    payload: CreateAsyncPayload<any>
  ): Promise<any> {
    return await payload.Model.create(payload.dto)
      .then((response) => {
        return handleServerResponse(
          STATUS_CODE.CREATED,
          RestFullAPI.onSuccess(STATUS_MESSAGE.SUCCESS, response)
        );
      })
      .catch((err) => {
        return handleServerResponse(
          STATUS_CODE.INTERNAL_SERVER_ERROR,
          handleError(err as ServerError)
        );
      });
  }
  public static async bulkCreateAsyncPayload(
    payload: BulkCreateAsyncPayload<any>
  ): Promise<any> {
    return await payload.Model.bulkCreate(payload.dto)
      .then((response) => {
        return handleServerResponse(
          STATUS_CODE.CREATED,
          RestFullAPI.onSuccess(STATUS_MESSAGE.SUCCESS, response)
        );
      })
      .catch((err) => {
        return handleServerResponse(
          STATUS_CODE.INTERNAL_SERVER_ERROR,
          handleError(err as ServerError)
        );
      });
  }
  public static async updateAsync(
    payload: UpdateAsyncPayload<any>
  ): Promise<any> {
    const { Model, dto, ...rest } = payload;
    return await Model.update(dto, { ...rest })
      .then((response) => {
        return handleServerResponse(
          STATUS_CODE.ACCEPTED,
          RestFullAPI.onSuccess(STATUS_MESSAGE.ACCEPTED, response)
        );
      })
      .catch((err) => {
        return handleServerResponse(
          STATUS_CODE.INTERNAL_SERVER_ERROR,
          handleError(err as ServerError)
        );
      });
  }
  public static async softDeleteByIdAsync(payload: SoftDeleteByIDAsyncPayload) {
    return await payload.Model.update(
      { isDelete: true },
      { where: { id: payload.id } }
    )
      .then((response) => {
        return handleServerResponse(
          STATUS_CODE.OK,
          RestFullAPI.onSuccess(STATUS_MESSAGE.ACCEPTED, response)
        );
      })
      .catch((err) => {
        return handleServerResponse(
          STATUS_CODE.INTERNAL_SERVER_ERROR,
          handleError(err as ServerError)
        );
      });
  }
  public static async multipleSoftDeleteAsync({
    Model,
    ids,
  }: MultipleSoftDeleteByIDAsyncPayload) {
    const multipleSoftDeleteResult = await asyncMap(ids, async (id: string) => {
      const softDeleteByIdAsyncData: SoftDeleteByIDAsyncPayload = {
        Model: Model,
        id,
      };

      const { statusCode, data } = await BaseModelHelper.softDeleteByIdAsync(
        softDeleteByIdAsyncData
      );

      return { statusCode, data };
    });

    const isDeleteSuccess = multipleSoftDeleteResult.every(
      ({ statusCode }) => statusCode === STATUS_CODE.OK
    );

    if (!isDeleteSuccess) {
      return handleServerResponse(
        STATUS_CODE.INTERNAL_SERVER_ERROR,
        handleError({
          message: STATUS_MESSAGE.SERVER_ERROR,
        } as HttpException)
      );
    }

    return handleServerResponse(
      STATUS_CODE.OK,
      RestFullAPI.onSuccess(STATUS_MESSAGE.SUCCESS)
    );
  }
  public static async hardDeleteAsync(payload: HardDeleteByIDAsyncPayload) {
    const { Model, where } = payload;
    return await Model.destroy({ where })
      .then((response) => {
        return handleServerResponse(
          STATUS_CODE.OK,
          RestFullAPI.onSuccess(STATUS_MESSAGE.ACCEPTED, response)
        );
      })
      .catch((err) => {
        return handleServerResponse(
          STATUS_CODE.INTERNAL_SERVER_ERROR,
          handleError(err as ServerError)
        );
      });
  }
  public static async createJunctionRecord(
    payload: ModifyJunctionPayload
  ): Promise<any> {
    try {
      const { attrs, ownerQuery, JunctionModel } = payload;

      if (!isEmpty(attrs)) {
        const newTagRecords = attrs.map((attr) => ({
          ...attr,
          ...ownerQuery,
        }));
        await JunctionModel.bulkCreate(newTagRecords);
      }

      return handleServerResponse(
        STATUS_CODE.OK,
        RestFullAPI.onSuccess(STATUS_MESSAGE.SUCCESS)
      );
    } catch (err) {
      return handleError(err as ServerError);
    }
  }
  public static async updateJunctionRecord({
    JunctionModel,
    ownerQuery,
    attrs,
  }: ModifyJunctionPayload): Promise<any> {
    try {
      const isAcceptUpdateTag = attrs !== undefined && !isEmpty(attrs);

      if (isAcceptUpdateTag) {
        await JunctionModel.destroy({
          where: ownerQuery,
        });

        await BaseModelHelper.createJunctionRecord({
          JunctionModel,
          attrs,
          ownerQuery,
        });
      }

      return handleServerResponse(
        STATUS_CODE.ACCEPTED,
        RestFullAPI.onSuccess(STATUS_MESSAGE.SUCCESS)
      );
    } catch (err) {
      return handleError(err as ServerError);
    }
  }
}
