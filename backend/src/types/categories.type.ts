import z from "zod";

export const categoryZodSchema = z.object({
    _id: z.number().int().optional(),
    code: z.string().min(1, "Code is required"),
    name: z.string().min(1, "Name is required"),
    slug: z.string().optional(),
    parent_code: z.string().nullable().optional(),
    display_order: z.number().int().default(0),
    isDeleted: z.boolean().default(false),
    created_date: z.date().nullable().optional(),
    updated_date: z.date().nullable().optional()
});

export type CategoryZodType = z.infer<typeof categoryZodSchema>;