"use strict";
import { Model } from "sequelize";
<<<<<<<< HEAD:build/production/v1/models/Tag.ts
import { TagAttributes } from "@/src/api/v1/ts/interfaces/app_interfaces";
========
import { TagAttributes } from "@/src/api/v2/ts/interfaces/app_interfaces";
>>>>>>>> dev/api-v2:src/api/v2/models/Tag.ts
export default (sequelize: any, DataTypes: any) => {
  class Tag extends Model<TagAttributes> implements TagAttributes {
    id!: string;
    tag_title!: string;
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
    },
    {
      sequelize,
      modelName: "Tag",
    }
  );
  return Tag;
};
