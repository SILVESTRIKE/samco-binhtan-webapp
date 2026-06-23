import { z } from 'zod';

export const BannerIntroduceZodSchema = z.object({
    _id: z.number().int().optional(),
    media_id: z.number().int(),
    BannerPath: z.string(),
    BannerSlug: z.string(),
    isDisplay: z.boolean().default(true),
    start_date: z.coerce.date().nullable().optional(),
    end_date: z.coerce.date().nullable().optional(),
    isdeleted: z.boolean().default(false),
    created_date: z.date().nullable().optional(),
    updated_date: z.date().nullable().optional(),
});

export type BannerIntroduceZodType = z.infer<typeof BannerIntroduceZodSchema>;