import { Router } from "express";
import task from "../controllers/task";
import { auth } from "../middlewares/auth";

const router = Router();

router.post("/", auth, task.createTask);

router.get("/", auth, task.getAllTask);

router.get("/:id", auth, task.getTaskById);

router.put("/:id", auth, task.updateTask);

router.patch("/:id/status", auth, task.updateTaskStatus);

router.delete("/:id", auth, task.deleteTask);

export default router;
