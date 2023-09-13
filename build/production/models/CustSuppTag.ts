"use strict";
import { Model } from "sequelize";
import { ICustSuppTag } from "../dto/input/custSuppTag/custSuppTag.interface";

export default (sequelize: any, DataTypes: any) => {
  class CustSuppTag extends Model<ICustSuppTag> implements ICustSuppTag {
    id!: string;
    custSupp_id!: string;
    tag_id!: string;
    isDelete!: boolean;
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Tag, CustSupp }: any) {
      CustSuppTag.belongsTo(Tag, {
        foreignKey: "tag_id",
      });
      CustSuppTag.belongsTo(CustSupp, {
        foreignKey: "custSupp_id",
      });
    }
  }
  CustSuppTag.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      custSupp_id: { type: DataTypes.UUID },
      tag_id: { type: DataTypes.UUID },
      isDelete: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "CustSuppTag",
      timestamps: true,
    }
  );
  return CustSuppTag;
};
