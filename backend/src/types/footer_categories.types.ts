import { z } from "zod";

export const FooterItemBaseSchema = z
  .object({
    
    title: z.string().nullable().optional(),
    titleKey: z.string().min(1, "Title key không được để trống"),
    content: z.string().nullable().optional(),

    type: z.enum(["LINK", "HEADING", "STATIC_TEXT", "BRAND_LOGO"]),
    group: z.string().min(1, "Group là bắt buộc"),
    column: z.union([z.literal(1), z.literal(2), z.literal(3)]),
    order: z.number().int().default(0),
    parent_id: z.number().int().positive().nullable().optional(),

    url: z.string().nullable().optional(),
    target: z.enum(["_self", "_blank"]).default("_self"),
    iconKey: z.string().nullable().optional(),
    logo_id: z.number().int().positive().nullable().optional(), 
  })
  .strict() 
  .refine(
    (data) => {
      
      if (data.type === "LINK") return !!data.url;
      return true;
    },
    {
      message: "URL là bắt buộc khi type là 'LINK'",
      path: ["url"], 
    }
  )
  .refine(
    (data) => {
      
      if (data.type === "BRAND_LOGO") return !!data.logo_id;
      return true;
    },
    {
      message: "Logo ID là bắt buộc khi type là 'BRAND_LOGO'",
      path: ["logo_id"],
    }
  );

export const CreateFooterItemSchema = FooterItemBaseSchema;
export type CreateFooterItemType = z.infer<typeof CreateFooterItemSchema>;

export const UpdateFooterItemSchema = FooterItemBaseSchema.partial(); 
export type UpdateFooterItemType = z.infer<typeof UpdateFooterItemSchema>;

export const SearchColumnQuerySchema = z.object({
  group: z.string().optional(),
  
  column: z.enum(["1", "2", "3"]).transform(Number).optional(),
  page: z
    .string()
    .optional()
    .default("1")
    .transform(Number)
    .refine((n) => n > 0, "Trang phải là số dương"),
  limit: z
    .string()
    .optional()
    .default("10")
    .transform(Number)
    .refine((n) => n > 0, "Giới hạn phải là số dương"),
});

export type SearchColumnQueryType = z.infer<typeof SearchColumnQuerySchema>;

export const FooterItemParamsSchema = z.object({
  id: z.string().transform((val, ctx) => {
    const parsed = parseInt(val, 10);
    if (isNaN(parsed)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "ID phải là một số",
      });
      return z.NEVER;
    }
    return parsed;
  }),
});
export type FooterItemParamsType = z.infer<typeof FooterItemParamsSchema>;
