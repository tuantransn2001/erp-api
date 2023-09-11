"use strict";
import { Model } from "sequelize";
import { ITag } from "../dto/input/tag/tag.interface";

export default (sequelize: any, DataTypes: any) => {
  class Tag extends Model<ITag> implements ITag {
    id!: string;
    tag_title!: string;
    isDelete!: boolean;
    tag_description!: string;
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ CustSuppTag, ProductTagList, OrderTag }: any) {
      Tag.hasMany(CustSuppTag, {
        foreignKey: "tag_id",
      });
      Tag.hasMany(ProductTagList, {
        foreignKey: "tag_id",
      });
      Tag.hasMany(OrderTag, {
        foreignKey: "tag_id",
      });
    }
  }
  Tag.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      tag_title: { type: DataTypes.STRING },
      tag_description: { type: DataTypes.STRING },
      isDelete: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Tag",
      timestamps: true,
    }
  );
  return Tag;
};
