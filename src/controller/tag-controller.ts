const { v4: uuidv4 } = require("uuid");
import { Request, Response, NextFunction } from "express";
import db from "../models";
import { TagAttributes } from "@/src/ts/interfaces/app_interfaces";
const { Tag, CustomerTag } = db;
import { handleFormatUpdateDataByValidValue } from "../../src/common";
class TagController {
  public static async getAll(_: Request, res: Response, next: NextFunction) {
    try {
      const tagList = await Tag.findAll();
      res.status(200).send({
        status: "Success",
        data: tagList,
      });
    } catch (err) {
      next(err);
    }
  }
  public static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { tag_title, tag_description } = req.body;

      const foundTag = await Tag.findOne({
        where: {
          tag_title,
        },
      });

      if (foundTag) {
        res.status(409).send({
          status: "Conflict",
          message: "Tag is already exist!",
        });
      } else {
        const tagID: string = uuidv4();
        const newTagRow: TagAttributes = {
          id: tagID,
          tag_title,
          tag_description,
        };

        await Tag.create(newTagRow);
        res.status(201).send({
          status: "Success",
          message: "Create tag successfully!",
        });
      }
    } catch (err) {
      next(err);
    }
  }
  public static async updateByID(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const { tag_title, tag_description } = req.body;

      const foundTag = await Tag.findOne({
        where: {
          id,
        },
      });

      const tagRowUpdate: TagAttributes = handleFormatUpdateDataByValidValue(
        {
          tag_title,
          tag_description,
        },
        foundTag.dataValues
      );

      await Tag.update(tagRowUpdate, {
        where: {
          id,
        },
      });

      res.status(202).send({
        status: "Success",
        message: "Update tag success",
      });
    } catch (err) {
      next(err);
    }
  }
  public static async deleteByID(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;

      await CustomerTag.destroy({
        where: {
          tag_id: id,
        },
      });
      await Tag.destroy({
        where: {
          id,
        },
      });

      res.status(201).send({
        status: "Success",
        message: "Delete tag successfully!",
      });
    } catch (err) {
      next(err);
    }
  }
}

export default TagController;
