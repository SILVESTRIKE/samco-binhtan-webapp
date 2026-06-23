import { z } from "zod";

export const CreateServiceZodSchema  = z.object({
    _id: z.number().int().optional(),

    title: z.string({
    }).min(1, "Service title cannot be null."),

    slug: z.string().optional(),
    image_id: z.number().nullable().optional(), 
    description: z.string()
        .min(1, "Description cannot be null."),

    urlDetail: z.string().nullable().default(null),
});

export type CreateServiceZodType = z.infer<typeof CreateServiceZodSchema>;

export const UpdateServiceZodSchema = CreateServiceZodSchema.partial();
export type UpdateServiceZodType = z.infer<typeof UpdateServiceZodSchema>;
