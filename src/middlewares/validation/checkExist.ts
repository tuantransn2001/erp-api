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
          .status(404)
          .send({ status: "Not found", message: "Check By Middleware" });
      }
    } catch (err) {
      res.status(500).send({
        status: "err",
        message: "Check exist middleware is working wrong!",
      });
    }
  };

export default checkExist;
