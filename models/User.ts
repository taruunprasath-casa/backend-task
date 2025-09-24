import { CreationOptional, DataTypes, InferAttributes, Model } from "sequelize";
import { sequelize } from "../db/db";
import bcrypt from "bcrypt";

export class User extends Model<InferAttributes<User>> {
  declare id?: CreationOptional<number>;
  declare email: string;
  declare password: string;
  declare name: string;
  declare createdAt?: CreationOptional<Date>;
  declare updatedAt?: CreationOptional<Date>;

  async verifyPassword(text: string) {
    return bcrypt.compare(text, this.password);
  }
}

User.init(
  {
    id: {
      type: DataTypes.NUMBER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
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
    modelName: "User",
    tableName: "user",
    timestamps: true,
    hooks: {
      beforeCreate: async (user: User) => {
        if (user.password) {
          const saltRounds = Number(process.env.BCRYPT_ROUNDS) || 10;
          user.password = await bcrypt.hash(user.password, saltRounds);
        }
      },
      beforeUpdate: async (user: User) => {
        if ((user as any).changed && (user as any).changed("password")) {
          const saltRounds = Number(process.env.BCRYPT_ROUNDS) || 10;
          user.password = await bcrypt.hash(user.password, saltRounds);
        }
      },
    },
  }
);
