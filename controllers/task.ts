import { NextFunction, Request, Response } from "express";
import task from "../validators/task";
import taskService from "../services/task";

const createTask = async (req: Request, res: Response) => {
  try {
    const taskData = task.taskData.parse(req.body);
    const createdTask = await taskService.createTask(taskData);
    res.status(201).json(createdTask);
  } catch (error) {
    res.status(500).json({ error: "Task creation failed" });
  }
};

const getAllTask = async (req: Request, res: Response) => {
  try {
    const task = await taskService.getAllTask();
    res.json(task);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknow Error";
    res.status(500).json({ error: message });
  }
};

const getTaskById = async (req: Request, res: Response) => {
  try {
    const task = await taskService.getTaskById(req.params.id);
    res.status(200).json(task);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknow Error";
    res.status(500).json({ message: message, error: error });
  }
};

const updateTask = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const taskData = req.body;
  try {
    const updatedTask = await taskService.updateTask(id, taskData);
    res.json({ message: "Task updated successfully", task: updatedTask });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ message, error: err });
    next(err);
  }
};

const deleteTask = async (req: Request, res: Response) => {
  try {
    await taskService.deleteTask(req.params.id);
    res.json({ message: "Task Deleted Sucessfully" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown Message";
    res.status(400).json({ error: message });
  }
};

export default { createTask, getAllTask, getTaskById, updateTask, deleteTask };
