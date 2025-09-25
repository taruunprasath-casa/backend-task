import z from "zod";
import taskData from "../validators/task";

export type TaskData = z.infer<typeof taskData>;
