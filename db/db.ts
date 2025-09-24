import { Sequelize } from "sequelize";

export const sequelize = new Sequelize("tasks", "taruun", "123456", {
  host: "localhost",
  port: 5433,
  dialect: "postgres",
  define: {
    underscored: true,
  },
});
