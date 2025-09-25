import { z } from "zod";

const taskData = z.object({
  name: z.string(),
  description: z.string(),
  status: z.enum([
    "Created",
    "In Progress",
    "Scheduled",
    "Completed",
    "Terminated",
  ]),
  estimatedDate: z.coerce.date().optional(),
});

export default taskData;
