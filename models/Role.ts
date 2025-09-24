import { CreationOptional, DataTypes, InferAttributes, Model } from "sequelize";
import { sequelize } from "../db/db";

export class Role extends Model<InferAttributes<Role>> {
  declare id?: CreationOptional<number>;
  declare name: string;
}

Role.init(
  {
    id: {
      type: DataTypes.NUMBER,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Role",
    tableName: "role",
  }
);
