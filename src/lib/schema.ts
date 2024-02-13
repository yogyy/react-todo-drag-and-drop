import { z } from "zod";

const formSchema = z.object({
  task: z
    .string()
    .min(2, {
      message: "task must be at least 2 characters.",
    })
    .max(100),
});

export { formSchema };
