import { z } from "zod";

const userData = z.object({
  name: z.string().min(1, { message: "User Name Cannot Be Empty" }),
  email: z.string().min(1, { message: "Enter Valid Email Address" }),
  password: z.string().min(1, { message: "Enter Your Password" }),
});

export default { userData };
