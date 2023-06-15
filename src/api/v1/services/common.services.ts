import { isEmpty } from "../common";
import { STATUS_CODE, STATUS_MESSAGE } from "../ts/enums/api_enums";
import HttpException from "../utils/exceptions/http.exception";
import RestFullAPI from "../utils/response/apiResponse";

interface UpdateDataAttributes {
  TagJunctionModel: any;
  queryCondition: { [key: string]: string };
  updateTags: Array<string>;
}

class CommonServices {
  public static async updateTags({
    TagJunctionModel,
    queryCondition,
    updateTags,
  }: UpdateDataAttributes) {
    await TagJunctionModel.destroy({
      where: queryCondition,
    });

    if (!isEmpty(updateTags)) {
      const newOrderTagRowArr = updateTags.map((tag_id: string) => ({
        ...queryCondition,
        tag_id,
      }));
      return await TagJunctionModel.bulkCreate(newOrderTagRowArr)
        .then(() => {
          return {
            statusCode: STATUS_CODE.STATUS_CODE_200,
            data: RestFullAPI.onSuccess(STATUS_MESSAGE.SUCCESS),
          };
        })
        .catch((err: HttpException) => {
          return {
            statusCode: STATUS_CODE.STATUS_CODE_500,
            data: RestFullAPI.onSuccess(STATUS_MESSAGE.SERVER_ERROR, {
              message: err.message,
            }),
          };
        });
    }
  }
}

export default CommonServices;
