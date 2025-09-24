import express from "express";
import router from "./routes/user";
import { sequelize } from "./db/db";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());
app.use("/users", router);

app.get("/", (_req, res) => {
  res.json({ message: "Server is working" });
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected");

    app.listen(3000, () => console.log("Server is Running on port 3000"));
  })
  .catch((err) => console.error("DB connection failed:", err));
