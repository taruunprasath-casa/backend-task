import { TaskData } from "../interfaces/task";
import { Task } from "../models/Task";

class TaskService {
  private intervals: Map<string, NodeJS.Timeout> = new Map();

  async createTask(task: TaskData) {
    const newTask = await Task.create({
      name: task.name,
      description: task.description,
      status: "Created",
      estimatedDate: task.estimatedDate,
    });

    if (!newTask?.id) {
      throw new Error("Task creation failed: id is undefined");
    }

    this.startSchedulingTimer(newTask.id.toString());
    return newTask;
  }

  private startSchedulingTimer(taskId: string) {
    const cooldown = 30_000;
    const createdAt = Date.now();

    const interval = setInterval(async () => {
      try {
        const task = await Task.findByPk(taskId);
        if (!task) {
          return this.stopTimer(taskId, interval);
        }

        if (Date.now() - createdAt >= cooldown && task.status === "Created") {
          await task.update({ status: "Scheduled" });
          console.log(`Task ${taskId} auto-scheduled`);
          this.stopTimer(taskId, interval);
        }
      } catch (err) {
        console.error("Error in scheduler:", err);
        this.stopTimer(taskId, interval);
      }
    }, 5_000);

    this.intervals.set(taskId, interval);
  }

  private stopTimer(taskId: string, interval: NodeJS.Timeout) {
    clearInterval(interval);
    this.intervals.delete(taskId);
  }

  async cancelTaskSchedule(taskId: string) {
    const interval = this.intervals.get(taskId);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(taskId);
      console.log(`Scheduling for task ${taskId} cancelled`);
    }
  }

  async deleteTask(id: string) {
    await this.cancelTaskSchedule(id);
    const task = await Task.findByPk(id);
    if (!task) throw new Error("Task Not Found");
    await task.destroy();
    return true;
  }

  async getAllTask() {
    return Task.findAll();
  }

  async getTaskById(id: string) {
    return Task.findByPk(id);
  }

  async updateTask(id: string, taskData: TaskData) {
    const task = await Task.findByPk(id);
    if (!task) throw new Error("Task Not Found");
    return task.update(taskData);
  }

  async updateTaskStatus(
    id: string,
    newStatus: "Created" | "Scheduled" | "Completed" | "Terminated"
  ) {
    const task = await Task.findByPk(id);
    if (!task) throw new Error("Task Not Found");

    task.status = newStatus;
    await task.save();
    return task;
  }
}

export default new TaskService();
