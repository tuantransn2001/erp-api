import { STATUS_CODE, STATUS_MESSAGE } from "../../ts/enums/api_enums";
import RestFullAPI from "../../utils/response/apiResponse";
import { Request, Response, NextFunction } from "express";

const checkExist =
  (Model: any) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const foundItem = await Model.findOne({
        where: {
          id,
        },
      });
      if (foundItem) {
        next();
      } else {
        res
          .status(STATUS_CODE.STATUS_CODE_404)
          .send(
            RestFullAPI.onSuccess(
              STATUS_MESSAGE.NOT_FOUND,
              "Check By Middleware"
            )
          );
      }
    } catch (err) {
      next(err);
    }
  };

export default checkExist;
