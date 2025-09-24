import z from "zod";
import user from "../validators/user";

export type UserData = z.infer<typeof user.userData>;

export interface userTaskData {
  task_id: number;
  user_id: number;
  role_id: number;
}
