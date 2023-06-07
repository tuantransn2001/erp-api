import { Request, Response, NextFunction } from "express";
import db from "../models";
import { STATUS_CODE, STATUS_MESSAGE } from "../ts/enums/api_enums";
import { handleFormatBranchProduct } from "../utils/format/branchProduct.format";
import RestFullAPI from "../utils/response/apiResponse";
const { AgencyBranchProductList, ProductVariantDetail, ProductVariantPrice } =
  db;

class BranchProductController {
  public static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { price_id } = req.query;

      const foundBranchProductList = await AgencyBranchProductList.findAll({
        attributes: [
          "id",
          "available_quantity",
          "available_to_sell_quantity",
          "product_discount",
        ],
        include: [
          {
            model: ProductVariantDetail,
            attributes: ["id", "product_variant_name", "product_variant_SKU"],
            include: [
              {
                model: ProductVariantPrice,
                as: "Variant_Prices",
                where: { price_id },
                attributes: ["id", "price_value"],
              },
            ],
          },
        ],
      });

      res
        .status(STATUS_CODE.STATUS_CODE_200)
        .send(
          RestFullAPI.onSuccess(
            STATUS_MESSAGE.SUCCESS,
            handleFormatBranchProduct(foundBranchProductList)
          )
        );
    } catch (err) {
      next(err);
    }
  }
}

export default BranchProductController;
