import { z } from 'zod';

const attributeSchema = z.object({
    key: z.string().min(1, "Attribute key is required"),
    name: z.string().min(1, "Attribute name is required"),
    value: z.string().min(1, "Attribute value is required")
});

const optionValueSchema = z.object({
    name: z.string().min(1, "Name is required"),
    value: z.string().min(1, "Value is required"),
    price_adjustment: z.number().default(0),
    image_url: z.url("URL is required").nullable().optional(),
});

const configurableOptionSchema = z.object({
    name: z.string().min(1, "Name is required"),
    type: z.enum(['color', 'select', 'checkbox']),
    values: z.array(optionValueSchema),
});

const selectedOptionSchema = z.object({
    option_name: z.string().min(1),
    option_value: z.string().min(1),
});
export const variantZodSchema = z.object({
    sku: z.string().min(1, "SKU is required"),
    final_price: z.number().min(0, "Price cannot be negative").optional(),
    stock_quantity: z.number().int().min(0).default(0),
    variant_media_ids: z.array(z.number()).nullable().optional(),
    selected_options: z.array(selectedOptionSchema),
});

export type VariantZodType = z.infer<typeof variantZodSchema>;


export const createProductZodSchema = z.object({
    name: z.string().min(1, "Product name is required"),
    slug: z.string().nullable().optional(),
    type: z.enum(['xe-may', 'o-to', 'phu-kien']),
    category_code: z.string().min(1, "Category code is required"),
    base_price: z.number().min(0, "Price must be non-negative").nullable().default(null),
    status: z.string().min(1, "Product status is required").default('Mới'), // Default status is 'Mới'
    tags: z.array(z.string()).default([]), // Mảng các tag, ví dụ: ["hoc-sinh", "ca-tinh"]

    attributes: z.array(attributeSchema).default([]),
    configurable_options: z.array(configurableOptionSchema).optional(),
    variants: z.array(variantZodSchema).default([]),

    main_image_id: z.number().nullable().optional(),
    gallery_image_ids: z.array(z.number()).default([]).nullable().optional(),
    article_url: z.url("Article URL must be a valid URL").nullable().optional(),
    isDeleted: z.boolean().default(false),
});

export type ProductZodType = z.infer<typeof createProductZodSchema>;

export const updateProductZodSchema = createProductZodSchema.partial();
export type UpdateProductZodType = z.infer<typeof updateProductZodSchema>;
