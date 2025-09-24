import z from "zod";

const taskData = z.object({
  name: z.string(),
  description: z.string(),
  estimatedDate: z.coerce.date().optional(),
  users: z
    .object({
      userId: z.number(),
      roleId: z.number(),
    })
    .array(),
});

export default {taskData};