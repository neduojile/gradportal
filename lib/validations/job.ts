import { z } from "zod";

export const jobSchema = z.object({
  title: z.string().min(3, "Job title must be at least 3 characters."),
  company: z.string().min(2, "Company name is required."),
  category: z.string().min(2, "Category is required."),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters."),
  requirements: z.string().min(10, "Requirements are required."),
  skills: z.string().optional(),
  location: z.string().min(2, "Location is required."),
  salary: z.string().optional(),
  employmentType: z.enum([
    "FULL_TIME",
    "PART_TIME",
    "CONTRACT",
    "INTERNSHIP",
    "REMOTE",
  ]),
  deadline: z.string().min(1, "Deadline is required."),
  featured: z.boolean().default(false),
});

export type JobSchema = z.infer<typeof jobSchema>;
