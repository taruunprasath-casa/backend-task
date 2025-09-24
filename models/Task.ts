import { CreationOptional, DataTypes, InferAttributes, Model } from "sequelize";
import { sequelize } from "../db/db";

export class Task extends Model<InferAttributes<Task>> {
  declare id?: CreationOptional<number>;
  declare name: string;
  declare descripition: string;
  declare estimatedDate?: Date;
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
    descripition: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    estimatedDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "estimated_date",
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
