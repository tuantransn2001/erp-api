import { Request, Response, NextFunction } from "express";
import ProductServices from "../services/product.services";

class ProductController {
  public static async getAllProduct(
    _: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { statusCode, data } = await ProductServices.getAllProduct();

      res.status(statusCode).send(data);
    } catch (err) {
      next(err);
    }
  }
  public static async getAllBranchProductVariant(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { price_id } = req.query;

      const { statusCode, data } =
        await ProductServices.getAllBranchProductVariant({ price_id });

      res.status(statusCode).send(data);
    } catch (err) {
      next(err);
    }
  }
  public static async getAllProductVariant(
    _: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { statusCode, data } = await ProductServices.getAllProductVariant();
      res.status(statusCode).send(data);
    } catch (err) {
      next(err);
    }
  }
  public static async getVariantByID(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const { statusCode, data } = await ProductServices.getVariantByID({ id });
      res.status(statusCode).send(data);
    } catch (err) {
      next(err);
    }
  }
  public static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        product_name,
        product_classify,
        brand_id,
        type_id,
        tagIDList,
        properties,
        product_SKU,
        product_weight,
        product_weight_calculator_unit,
        product_variant_prices,
      } = req.body;

      const { statusCode, data } = await ProductServices.create({
        product_name,
        product_classify,
        brand_id,
        type_id,
        tagIDList,
        properties,
        product_SKU,
        product_weight,
        product_weight_calculator_unit,
        product_variant_prices,
      });

      res.status(statusCode).send(data);
    } catch (err) {
      next(err);
    }
  }
}

export default ProductController;
