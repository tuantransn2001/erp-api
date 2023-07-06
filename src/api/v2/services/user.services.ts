import { STATUS_CODE, STATUS_MESSAGE } from "../ts/enums/api_enums";
import { handleError } from "../utils/handleError/handleError";
import RestFullAPI from "../utils/response/apiResponse";
import db from "../models";
const { CustSupp, Staff, User } = db;

interface DeletePayload {
  id: string;
  user_type: string;
}

const Model = {
  customer: CustSupp,
  supplier: CustSupp,
  staff: Staff,
};

class UserServices {
  public static async delete(payload: DeletePayload) {
    try {
      const { id, user_type } = payload;

      const foundModelItem = await Model[user_type].findOne({
        attributes: ["id", "user_id"],
        where: {
          id,
        },
        include: [
          {
            attributes: ["id"],
            model: User,
          },
        ],
      });
      const userID = foundModelItem.dataValues.User.dataValues.id;

      await User.update(
        {
          isDelete: true,
        },
        {
          where: {
            id: userID,
          },
        }
      );
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

export default UserServices;
