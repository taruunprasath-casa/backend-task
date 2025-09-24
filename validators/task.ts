import z from "zod";

const taskData = z.object({
  name: z.string(),
  description: z.string(),
  estimatedDate: z.coerce.date().optional(),
});

export default { taskData };
