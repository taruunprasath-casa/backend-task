import { Request, Response } from "express";
import taskDataSchema from "../validators/task";
import taskService from "../services/task";

const createTask = async (req: Request, res: Response) => {
  try {
    const taskData = taskDataSchema.parse(req.body);
    const createdTask = await taskService.createTask(taskData);
    res.status(201).json(createdTask);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Task creation failed";
    res.status(400).json({ error: message });
  }
};

const getAllTask = async (_req: Request, res: Response) => {
  try {
    const task = await taskService.getAllTask();
    res.json(task);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Error";
    res.status(500).json({ error: message });
  }
};

const getTaskById = async (req: Request, res: Response) => {
  try {
    const task = await taskService.getTaskById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: "Task Not Found" });
    }
    res.json(task);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Error";
    res.status(500).json({ error: message });
  }
};

const updateTask = async (req: Request, res: Response) => {
  try {
    const updatedTask = await taskService.updateTask(req.params.id, req.body);
    res.json({ message: "Task updated successfully", task: updatedTask });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ error: message });
  }
};

const updateTaskStatus = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const allowedStatuses = ["Created", "Scheduled", "Completed", "Terminated"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedTask = await taskService.updateTaskStatus(id, status);
    res.json({
      message: "Task status updated successfully",
      task: updatedTask,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ error: message });
  }
};

const deleteTask = async (req: Request, res: Response) => {
  try {
    await taskService.deleteTask(req.params.id);
    res.json({ message: "Task Deleted Successfully" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ error: message });
  }
};

export default {
  createTask,
  getAllTask,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
};
