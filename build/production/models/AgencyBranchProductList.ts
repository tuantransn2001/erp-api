"use strict";
import { Model } from "sequelize";
import { AgencyBranchProductListAttributes } from "@/src/ts/interfaces/app_interfaces";

export default (sequelize: any, DataTypes: any) => {
  class AgencyBranchProductList
    extends Model<AgencyBranchProductListAttributes>
    implements AgencyBranchProductListAttributes
  {
    id!: string;
    agency_branch_id!: string;
    product_variant_id!: string;
    available_quantity!: number;
    trading_quantity!: number;
    available_to_sell_quantity!: number;
    product_price!: number;
    product_discount!: number;
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ ProductVariantDetail, AgencyBranch }: any) {
      AgencyBranchProductList.belongsTo(AgencyBranch, {
        foreignKey: "agency_branch_id",
      });
      AgencyBranchProductList.belongsTo(ProductVariantDetail, {
        foreignKey: "product_variant_id",
      });
    }
  }
  AgencyBranchProductList.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      agency_branch_id: {
        type: DataTypes.UUID,
      },
      product_variant_id: {
        type: DataTypes.UUID,
      },
      available_quantity: {
        type: DataTypes.INTEGER,
      },
      trading_quantity: {
        type: DataTypes.INTEGER,
      },
      available_to_sell_quantity: {
        type: DataTypes.INTEGER,
      },
      product_price: {
        type: DataTypes.FLOAT,
      },
      product_discount: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "AgencyBranchProductList",
    }
  );
  return AgencyBranchProductList;
};
