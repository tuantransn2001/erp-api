import RestFullAPI from "../../../utils/response/apiResponse";
import { v4 as uuidv4 } from "uuid";
import { reduce as reduceAsync } from "awaity";
import {
  BulkCreateAsyncPayload,
  CreateAsyncPayload,
  GetByIdAsyncPayload,
  HardDeleteByIDAsyncPayload,
} from "../baseModelHelper/shared/baseModelHelper.interface";
import {
  CreateUserRoleDTO,
  CreateUserRoleRowDTO,
} from "../../../dto/input/userRole/userRole.interface";
import db from "../../../models";
import { BaseModelHelper } from "../baseModelHelper/baseModelHelper";
import { handleServerResponse } from "../../../utils/response/handleServerResponse";
import { STATUS_CODE } from "../../../common/enums/api_enums";
import { handleError } from "../../../utils/handleError/handleError";
import { ServerError } from "../../../common/types/common";
import { isNullOrFalse } from "../../../common/helper";
import { CreateUserAgencyBranchInChargeRowDTO } from "../../../dto/input/userAgencyBranchInCharge/userAgencyBranchInCharge.interface";
const { UserRole, UserAgencyBranchInCharge, User } = db;
export class UserRoleModelHelper {
  public static async hardDeleteAsync(user_id: string) {
    const getUserIncludeRoleData: GetByIdAsyncPayload = {
      Model: User,
      where: { id: user_id, isDelete: isNullOrFalse },
      include: [
        {
          model: UserRole,
          attributes: ["id"],
          include: [{ model: UserAgencyBranchInCharge, attributes: ["id"] }],
        },
      ],
    };

    const { statusCode, data: userIncludeRoleData } =
      await BaseModelHelper.getOneAsync(getUserIncludeRoleData);

    const shouldDelete = statusCode === STATUS_CODE.OK;

    if (shouldDelete) {
      {
        const { userRoleIDArray, userAgencyBranchInChargeIDArray } =
          userIncludeRoleData.data.dataValues.UserRole.reduce(
            (result, staffRoleData) => {
              const id: string = staffRoleData.dataValues.id;

              const userAgencyInChargeListArr =
                staffRoleData.dataValues.User_Agency_Branch_InCharge;

              result.staffRoleIDArray.push(id);

              userAgencyInChargeListArr.forEach((userAgencyBranch) => {
                result.staffAgencyBranchInChargeIDArray.push(
                  userAgencyBranch.dataValues.id
                );
              });

              return result;
            },
            {
              staffRoleIDArray: [],
              staffAgencyBranchInChargeIDArray: [],
            }
          );

        const hardDeleteUserAgencyBranchInChargeData: HardDeleteByIDAsyncPayload =
          {
            Model: UserAgencyBranchInCharge,
            where: {
              id: userAgencyBranchInChargeIDArray,
            },
          };
        const hardDeleteUserRoleData: HardDeleteByIDAsyncPayload = {
          Model: UserRole,
          where: {
            id: userRoleIDArray,
          },
        };

        const hardDeleteUserAgencyBranchInChargeRes =
          await BaseModelHelper.hardDeleteAsync(
            hardDeleteUserAgencyBranchInChargeData
          );
        const hardDeleteUserRoleRes = await BaseModelHelper.hardDeleteAsync(
          hardDeleteUserRoleData
        );

        const { statusCode, data } = await RestFullAPI.onArrayPromiseSuccess([
          hardDeleteUserAgencyBranchInChargeRes,
          hardDeleteUserRoleRes,
        ]);

        return handleServerResponse(statusCode, data);
      }
    }
    return handleServerResponse(STATUS_CODE.OK);
  }

  public static async createAsync(
    { roles }: CreateUserRoleDTO,
    user_id: string
  ) {
    try {
      const bulkCreateUserRoleWithAgencyBranchInChargeRes = await reduceAsync(
        roles,
        async (res, role) => {
          const user_role_id = uuidv4();
          const createUserRoleData: CreateAsyncPayload<CreateUserRoleRowDTO> = {
            Model: UserRole,
            dto: { id: user_role_id, user_id, role_id: role.role_id },
          };

          const createUserRoleRes = await BaseModelHelper.createAsync(
            createUserRoleData
          );

          const bulkCreateUserRoleAgencyBranchInChargeData: BulkCreateAsyncPayload<CreateUserAgencyBranchInChargeRowDTO> =
            {
              Model: UserAgencyBranchInCharge,
              dto: role.agencyBranches_inCharge_ids.map((agency_branch_id) => ({
                agency_branch_id,
                user_role_id,
              })),
            };

          const bulkCreateUserRoleAgencyBranchInChargeRes =
            await BaseModelHelper.bulkCreateAsyncPayload(
              bulkCreateUserRoleAgencyBranchInChargeData
            );

          res.push([
            createUserRoleRes,
            bulkCreateUserRoleAgencyBranchInChargeRes,
          ]);

          return res.flat(1);
        },
        []
      );

      const { statusCode, data } = RestFullAPI.onChainSuccess(
        bulkCreateUserRoleWithAgencyBranchInChargeRes
      );

      return handleServerResponse(statusCode, data);
    } catch (err) {
      return handleServerResponse(
        STATUS_CODE.INTERNAL_SERVER_ERROR,
        handleError(err as ServerError)
      );
    }
  }

  public static async updateAsync(
    { roles }: CreateUserRoleDTO,
    user_id: string
  ) {
    try {
      const hardDeleteOldUserRoleRes =
        UserRoleModelHelper.hardDeleteAsync(user_id);
      const createNewUserRoleRes = UserRoleModelHelper.createAsync(
        { roles },
        user_id
      );
      console.log("create new user role:::", await createNewUserRoleRes);
      const { statusCode, data } = await RestFullAPI.onArrayPromiseSuccess([
        hardDeleteOldUserRoleRes,
        createNewUserRoleRes,
      ]);

      return handleServerResponse(statusCode, data);
    } catch (err) {
      return handleServerResponse(
        STATUS_CODE.INTERNAL_SERVER_ERROR,
        handleError(err as ServerError)
      );
    }
  }
}
