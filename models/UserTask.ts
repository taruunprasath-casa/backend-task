import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  Model,
} from "sequelize";
import { User } from "./User";
import { Task } from "./Task";
import { Role } from "./Role";
import { sequelize } from "../db/db";

export class UserTask extends Model<InferAttributes<UserTask>> {
  declare user_id: ForeignKey<User["id"]>;
  declare task_id: ForeignKey<Task["id"]>;
  declare role_id: ForeignKey<Role["id"]>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

UserTask.init(
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    task_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    role_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
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
    modelName: "Usertask",
    tableName: "user_tasks",
    timestamps: false,
  }
);

UserTask.belongsTo(Task, { foreignKey: "task_id" });
UserTask.belongsTo(User, { foreignKey: "user_id" });
UserTask.belongsTo(Role, { foreignKey: "role_id" });

Role.hasMany(UserTask, { foreignKey: "role_id" });

Task.hasMany(UserTask, { foreignKey: "task_id" });
