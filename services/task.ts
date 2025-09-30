import { TaskData } from "../interfaces/task";
import { Task } from "../models/Task";

class TaskService {
  private intervals: Map<string, NodeJS.Timeout> = new Map();
  private waitingQueue: string[] = [];
  private maxConcurrent = 3;
  private activeCount = 0;

  async createTask(task: TaskData | TaskData[]) {
    const tasks = Array.isArray(task) ? task : [task];
    const createdTasks: Task[] = [];

    for (const taskData of tasks) {
      const newTask = await Task.create({
        name: taskData.name,
        description: taskData.description,
        status: "Created",
        estimatedDate: taskData.estimatedDate,
      });

      if (!newTask?.id) {
        throw new Error("Task creation failed: id is undefined");
      }

      const taskId = newTask.id.toString();
      this.enqueueTask(taskId);
      createdTasks.push(newTask);
    }

    return Array.isArray(task) ? createdTasks : createdTasks[0];
  }

  private enqueueTask(taskId: string) {
    if (this.activeCount < this.maxConcurrent) {
      this.startSchedulingTimer(taskId);
    } else {
      this.waitingQueue.push(taskId);
      console.log(`Task ${taskId} added to waiting queue`);
    }
  }

  private startSchedulingTimer(taskId: string) {
    this.activeCount++;
    console.log(
      `Task ${taskId} moved into scheduling pipeline. Active: ${this.activeCount}`
    );

    const cooldown = 10_000;
    const createdAt = Date.now();

    const interval = setInterval(async () => {
      try {
        const task = await Task.findByPk(taskId);
        if (!task) {
          return this.cleanupTask(taskId);
        }
        if (Date.now() - createdAt >= cooldown && task.status === "Created") {
          await task.update({ status: "Scheduled" });
          console.log(`Task ${taskId} auto-scheduled`);
          this.cleanupTask(taskId);
        }
      } catch (err) {
        console.error(`Error in scheduler for task ${taskId}:`, err);
        this.cleanupTask(taskId);
      }
    }, 5_000);

    this.intervals.set(taskId, interval);
  }

  private cleanupTask(taskId: string) {
    const interval = this.intervals.get(taskId);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(taskId);
    }
    console.log(`Task ${taskId} removed from scheduler`);
    this.releaseSlot();
  }

  private releaseSlot() {
    this.activeCount = Math.max(0, this.activeCount - 1);
    console.log(`Slot released. Active: ${this.activeCount}`);

    const nextTaskId = this.waitingQueue.shift();
    if (nextTaskId) {
      console.log(`Starting next queued task: ${nextTaskId}`);
      this.startSchedulingTimer(nextTaskId);
    }
  }

  async completeTask(taskId: string) {
    const task = await Task.findByPk(taskId);
    if (!task) throw new Error("Task Not Found");

    await task.update({ status: "Completed" });
    this.cleanupTask(taskId);

    return task;
  }

  async cancelTaskSchedule(taskId: string) {
    if (this.intervals.has(taskId)) {
      this.cleanupTask(taskId);
      console.log(`Scheduling for task ${taskId} cancelled`);
    } else {
      const index = this.waitingQueue.indexOf(taskId);
      if (index !== -1) {
        this.waitingQueue.splice(index, 1);
        console.log(`Task ${taskId} removed from waiting queue`);
      }
    }
  }

  async deleteTask(id: string) {
    await this.cancelTaskSchedule(id);

    const task = await Task.findByPk(id);
    if (!task) throw new Error("Task Not Found");

    await task.destroy();
    console.log(`Task ${id} deleted`);
    return true;
  }

  async updateTaskStatus(
    id: string,
    newStatus: "Created" | "Scheduled" | "Completed" | "Terminated"
  ) {
    const task = await Task.findByPk(id);
    if (!task) throw new Error("Task Not Found");

    await task.update({ status: newStatus });

    if (newStatus === "Completed" || newStatus === "Terminated") {
      this.cleanupTask(id.toString());
    }

    return task;
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
}

export default new TaskService();
