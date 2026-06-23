import { z } from "zod";


export const IntroCardsZodSchema = z.object({
  title: z.string().min(1, "Tiêu đề là bắt buộc"),
  // description: z.string().min(1, "Mô tả là bắt buộc"),
  slug: z.string().optional(), // Sẽ được tự động tạo nếu không cung cấp
  tags: z.array(z.string()).default([]).optional(), // Mảng các tag, ví dụ: ["giới thiệu", "bài viết"]
  articleURL: z.union([
    z.url({ message: "URL ngoài phải là một địa chỉ web hợp lệ (bắt đầu bằng http:// hoặc https://)" }),
    z.string().startsWith("/", { message: "Đường dẫn nội bộ phải bắt đầu bằng dấu /" })
  ]).optional(),
  image_id: z.number().nullable().optional(),
  isDelete: z.boolean().default(false),
})

export type CreateIntroCardsZodType = z.infer<typeof IntroCardsZodSchema>;

export const UpdateIntroCardsZodSchema = IntroCardsZodSchema.partial();
export type UpdateIntroCardsZodType = z.infer<typeof UpdateIntroCardsZodSchema>;



