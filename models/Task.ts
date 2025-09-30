import { CreationOptional, DataTypes, InferAttributes, Model } from "sequelize";
import { sequelize } from "../db/db";
export class Task extends Model<InferAttributes<Task>> {
  declare id?: CreationOptional<number>;
  declare name: string;
  declare description: string;
  declare estimatedDate?: string;
  declare status: string;
  declare createdAt?: CreationOptional<Date>;
  declare updatedAt?: CreationOptional<Date>;
}

Task.init(
  {
    id: {
      type: DataTypes.NUMBER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    estimatedDate: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "estimated_date",
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE(3),
      defaultValue: sequelize.literal("current_timestamp(3)"),
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE(3),
      defaultValue: sequelize.literal("current_timestamp(3)"),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Task",
    tableName: "task",
    timestamps: false,
  }
);
