import { v4 as uuidv4 } from "uuid";
import {
  CustSuppAttributes,
  CustSuppTagAttributes,
  StaffAttributes,
  TagAttributes,
  UserAddressAttributes,
  UserAttributes,
} from "../ts/interfaces/entities_interfaces";
import { STATUS_CODE, STATUS_MESSAGE } from "../ts/enums/api_enums";
import RestFullAPI from "../utils/response/apiResponse";
import HttpException from "../utils/exceptions/http.exception";
import {
  handleFormatUpdateDataByValidValue,
  handleValidateClientRequestBeforeModify,
  randomStringByCharsetAndLength,
} from "../common";
import {
  CUSTSUPP_STATUS,
  ENTITIES_FORMAT_TYPE,
  MODIFY_STATUS,
} from "../ts/enums/app_enums";
import CommonServices from "./common.services";
import { handleError } from "../utils/handleError/handleError";
import {
  GetByIdPayload,
  GetEntitiesFormatPayload,
  ObjectType,
} from "../ts/types/common";
import { CreateCustSuppDTO, UpdateCustSuppDTO } from "../ts/dto/custSupp.dto";
import db from "../models";
const { User, CustSupp, UserAddress, CustSuppTag, Tag, Staff } = db;

interface GetAllPayload {
  user_type: string;
}

interface QueryStaffAttributes extends StaffAttributes {
  User: {
    dataValues: UserAttributes;
  };
}
interface QueryTagAttributes extends CustSuppTagAttributes {
  Tag: {
    dataValues: TagAttributes;
  };
}
interface QueryCustSuppAttributes extends CustSuppAttributes {
  CustSuppTags: QueryTagAttributes[];
  Staff: { dataValues: QueryStaffAttributes };
}

interface UserCustSuppQueryAttributes extends UserAttributes {
  CustSupp: {
    dataValues: QueryCustSuppAttributes;
  };
  UserAddresses: {
    dataValues: UserAddressAttributes;
  }[];
}

interface CustSuppListSourceAttributes {
  dataValues: UserCustSuppQueryAttributes;
}

class CustSuppServices {
  private static custSuppList: CustSuppListSourceAttributes[];
  private static custSuppItem: CustSuppListSourceAttributes;

  private static getCustSuppFormat({ format_type }: GetEntitiesFormatPayload) {
    switch (format_type) {
      case ENTITIES_FORMAT_TYPE.P_LIST: {
        const custSuppSource = [...CustSuppServices.custSuppList];

        return custSuppSource.map((custSupp) => {
          const {
            id: user_id,
            user_code,
            user_phone,
            user_type,
            user_name,
            createdAt,
          } = custSupp.dataValues;
          const { status, id: custSupp_id } =
            custSupp.dataValues.CustSupp.dataValues;
          return {
            user_id,
            user_type,
            user_code,
            createdAt: createdAt as Date,
            [user_type]: {
              id: custSupp_id,
              phone: user_phone,
              name: user_name,
              status,
            },
          };
        });
      }
      case ENTITIES_FORMAT_TYPE.P_ITEM: {
        const custSuppItemSource = { ...CustSuppServices.custSuppItem };
        const {
          id: user_id,
          user_name,
          user_phone,
          user_email,
          user_code,
          user_type,
          createdAt,
          updatedAt,
        } = custSuppItemSource.dataValues;
        const { id, staff_in_charge_note, status } =
          custSuppItemSource.dataValues.CustSupp.dataValues;

        const tagList: TagAttributes[] =
          custSuppItemSource.dataValues.CustSupp.dataValues.CustSuppTags.map(
            ({ id, tag_id, createdAt, updatedAt, Tag }: QueryTagAttributes) => {
              return {
                id,
                tag_id,
                tag_title: Tag.dataValues.tag_title,
                tag_description: Tag.dataValues.tag_description,
                createdAt,
                updatedAt,
              };
            }
          );

        const address_list: Partial<UserAddressAttributes>[] =
          custSuppItemSource.dataValues.UserAddresses.map(
            (address: { dataValues: UserAddressAttributes }) => {
              const {
                id,
                user_province,
                user_district,
                user_specific_address,
                createdAt,
                updatedAt,
              } = address.dataValues;

              return {
                id,
                user_province,
                user_district,
                user_specific_address,
                createdAt,
                updatedAt,
              };
            }
          );

        const getStaffInCharge = () => {
          const isStaffInChargeExist: boolean =
            custSuppItemSource.dataValues.CustSupp.dataValues.Staff === null
              ? false
              : true;
          const { id: staff_id } =
            custSuppItemSource.dataValues.CustSupp.dataValues.Staff.dataValues;
          const { id: user_staff_id, user_name: staff_name } =
            custSuppItemSource.dataValues.CustSupp.dataValues.Staff.dataValues
              .User.dataValues;
          return isStaffInChargeExist
            ? {
                staff_id,
                user_staff_id,
                staff_name,
                staff_in_charge_note,
              }
            : null;
        };

        return {
          user_id,
          user_type,
          user_code,
          createdAt,
          updatedAt,
          [user_type]: {
            id,
            status,
            name: user_name,
            phone: user_phone,
            email: user_email,
          },
          address_list,
          tagList,
          staffInCharge: getStaffInCharge(),
        };
      }
      default: {
        return {
          message: `format_type: ${format_type} is in-valid! ${Object.values(
            ENTITIES_FORMAT_TYPE
          )}`,
        };
      }
    }
  }
  public static async getAll({ user_type }: GetAllPayload) {
    try {
      const custSuppList = await User.findAll({
        where: {
          isDelete: null,
          user_type,
        },
        attributes: [
          "id",
          "user_name",
          "user_code",
          "user_phone",
          "user_type",
          "createdAt",
        ],
        include: [
          {
            model: CustSupp,
            attributes: ["id", "status", "createdAt"],
          },
        ],
      });
      CustSuppServices.custSuppList = custSuppList;
      return {
        statusCode: STATUS_CODE.STATUS_CODE_200,
        data: RestFullAPI.onSuccess(
          STATUS_MESSAGE.SUCCESS,
          CustSuppServices.getCustSuppFormat({
            format_type: ENTITIES_FORMAT_TYPE.P_LIST,
          })
        ),
      };
    } catch (err) {
      return {
        statusCode: STATUS_CODE.STATUS_CODE_500,
        data: handleError(err as Error),
      };
    }
  }
  public static async getByID({ id }: GetByIdPayload) {
    try {
      const foundCustSupp = await User.findOne({
        where: { isDelete: null, id },
        attributes: [
          "id",
          "user_name",
          "user_phone",
          "user_email",
          "user_code",
          "user_type",
          "createdAt",
          "updatedAt",
        ],
        separate: true,
        include: [
          {
            model: UserAddress,
          },
          {
            model: CustSupp,
            attributes: ["id", "staff_in_charge_note", "status"],
            include: [
              {
                model: Staff,
                attributes: ["id"],
                include: [
                  {
                    model: User,
                    attributes: ["id", "user_name"],
                  },
                ],
              },
              {
                model: CustSuppTag,
                attributes: ["id", "tag_id"],
                separate: true,
                include: [
                  {
                    model: Tag,
                    attributes: ["id", "tag_title"],
                  },
                ],
              },
            ],
          },
        ],
      });
      CustSuppServices.custSuppItem = foundCustSupp;
      return {
        statusCode: STATUS_CODE.STATUS_CODE_200,
        data: RestFullAPI.onSuccess(
          STATUS_MESSAGE.SUCCESS,
          CustSuppServices.getCustSuppFormat({
            format_type: ENTITIES_FORMAT_TYPE.P_ITEM,
          })
        ),
      };
    } catch (err) {
      return {
        statusCode: STATUS_CODE.STATUS_CODE_500,
        data: handleError(err as Error),
      };
    }
  }
  public static async create(payload: CreateCustSuppDTO) {
    try {
      const { user_name, user_phone, user_email, user_type } = payload;

      const { status, message: missArgMessage } =
        handleValidateClientRequestBeforeModify(
          {
            user_name,
            user_phone,
            user_email,
          },
          [undefined]
        );

      switch (status) {
        case MODIFY_STATUS.ACCEPT: {
          const { address_list, tags } = payload;

          const newUserRow: UserAttributes = {
            id: uuidv4(),
            user_code: payload.user_code
              ? payload.user_code
              : randomStringByCharsetAndLength("alphabetic", 5, true),
            user_phone: user_phone as string,
            user_email: user_email as string,
            user_name: user_name as string,
            user_type: user_type as string,
            user_password: null,
            isDelete: null,
          };

          const newCustSuppRow: CustSuppAttributes = {
            id: uuidv4(),
            user_id: newUserRow.id,
            staff_id: payload.staff_id ? payload.staff_id : null,
            staff_in_charge_note: payload.staff_in_charge_note
              ? payload.staff_in_charge_note
              : null,
            status: CUSTSUPP_STATUS.TRADING,
          };

          await User.create(newUserRow);
          await CustSupp.create(newCustSuppRow);
          await CommonServices.createJunctionRecord({
            JunctionModel: UserAddress,
            ownerQuery: { user_id: newUserRow.id },
            attrs: address_list.map(
              ({ user_province, user_district, user_specific_address }) => ({
                user_id: newUserRow.id,
                user_province,
                user_district,
                user_specific_address,
              })
            ),
          });
          await CommonServices.createJunctionRecord({
            JunctionModel: CustSuppTag,
            ownerQuery: { custSupp_id: newCustSuppRow.id },
            attrs: tags.map((tag_id) => ({ tag_id })),
          });

          return {
            statusCode: STATUS_CODE.STATUS_CODE_200,
            data: RestFullAPI.onSuccess(STATUS_MESSAGE.SUCCESS),
          };
        }
        case MODIFY_STATUS.DENY: {
          return {
            statusCode: STATUS_CODE.STATUS_CODE_406,
            data: RestFullAPI.onFail(STATUS_MESSAGE.NOT_ACCEPTABLE, {
              message: missArgMessage,
            } as HttpException),
          };
        }
      }
    } catch (err) {
      const { message } = err as HttpException;
      return {
        statusCode: STATUS_CODE.STATUS_CODE_500,
        data: RestFullAPI.onFail(STATUS_MESSAGE.SERVER_ERROR, {
          message,
        } as HttpException),
      };
    }
  }
  public static async updateDetail(payload: UpdateCustSuppDTO) {
    try {
      const { custSupp_id } = payload;

      const foundCustSupp = await CustSupp.findOne({
        where: {
          id: custSupp_id,
        },
        include: [
          {
            model: User,
          },
        ],
      });

      const custSuppID = foundCustSupp.dataValues.id;
      const userID = foundCustSupp.dataValues.User.dataValues.id;

      // ? ========================================================================
      // ? ========================= Update User Table ============================
      // ? ========================================================================
      const { user_code, user_name, user_phone, user_email } = payload;

      const updateUserRecordData: UserAttributes =
        handleFormatUpdateDataByValidValue(
          {
            user_code,
            user_name,
            user_phone,
            user_email,
          },
          foundCustSupp.dataValues.User.dataValues
        );
      await User.update(updateUserRecordData, {
        where: {
          id: userID,
        },
      });

      // ? ========================================================================
      // ? =================== Update CustSupp/Supplier Table =====================
      // ? ========================================================================
      const { status, staff_id, staff_in_charge_note } = payload;
      const updateCustSuppRecordData: CustSuppAttributes =
        handleFormatUpdateDataByValidValue(
          {
            status,
            staff_id,
            staff_in_charge_note,
          },
          foundCustSupp.dataValues
        );
      await CustSupp.update(updateCustSuppRecordData, {
        where: {
          id: custSuppID,
        },
      });

      // ? ========================================================================
      // ? ============================= Update Tags ==============================
      // ? ========================================================================
      const { tags } = payload;
      await CommonServices.updateJunctionRecord({
        JunctionModel: CustSuppTag,
        ownerQuery: {
          custSupp_id: custSuppID,
        },
        attrs: tags?.map((tag_id) => ({ tag_id })) as ObjectType<string>[],
      });

      return {
        statusCode: STATUS_CODE.STATUS_CODE_200,
        data: RestFullAPI.onSuccess(STATUS_MESSAGE.SUCCESS),
      };
    } catch (err) {
      return {
        statusCode: STATUS_CODE.STATUS_CODE_500,
        data: handleError(err as Error),
      };
    }
  }
}

export default CustSuppServices;
