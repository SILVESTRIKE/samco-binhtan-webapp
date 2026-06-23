import { z } from "zod";

// --- Schemas for Content ---
const UrlContentSchema = z.object({
  contentType: z.literal("url"),
  url: z.string().nullable(),
});

const CategoryContentSchema = z.object({
  contentType: z.literal("category"),
  category_code: z.string().min(1, "Mã danh mục là bắt buộc"),
});

// const ProductListContentSchema = z.object({
//   contentType: z.literal("product_list"),
//   product_ids: z
//     .array(z.number().int().positive())
//     .min(1, "Cần ít nhất một ID sản phẩm"),
// });

// Sử dụng discriminatedUnion để Zod hiểu được schema nào cần áp dụng
const ContentZodSchema = z.discriminatedUnion("contentType", [
  UrlContentSchema,
  CategoryContentSchema,
  // ProductListContentSchema,
]);

// --- Main Schemas ---
export const CreateNavbarItemSchema = z
  .object({
    title: z.string().min(1, "Tiêu đề không được để trống"),
    titleKey: z.string().min(1, "Translation key là bắt buộc"),

    order: z.number().int().optional().default(0),
    group: z.string().min(1, "Nhóm menu là bắt buộc"),
    type: z.enum(["link", "button", "mega_menu_trigger"]).default("link"),
    target: z.enum(["_self", "_blank"]).optional().default("_self"),
    parent_id: z.number().int().positive().nullable().optional(),
    isActive: z.boolean().optional().default(true),
    content: ContentZodSchema,
  })
  .strict();

export type CreateNavbarItemType = z.infer<typeof CreateNavbarItemSchema>;

export const UpdateNavbarItemSchema = CreateNavbarItemSchema.partial();
export type UpdateNavbarItemType = z.infer<typeof UpdateNavbarItemSchema>;

// --- Params and Query Schemas (Giữ nguyên) ---
export const GetByIdParamsSchema = z.object({
  id: z.string().transform((val, ctx) => {
    const parsed = parseInt(val, 10);
    if (isNaN(parsed) || parsed <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "ID phải là một số nguyên dương.",
      });
      return z.NEVER;
    }
    return parsed;
  }),
});

export const GetNavbarItemsPaginatedQuerySchema = z.object({
  page: z.string().optional().default("1").transform(Number),
  limit: z.string().optional().default("20").transform(Number),
  group: z.string().optional(),
});
