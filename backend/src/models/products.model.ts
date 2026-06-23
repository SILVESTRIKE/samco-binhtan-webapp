import mongoose from 'mongoose';
import { ProductZodType } from '../types/products.type';
import { CounterModel } from "./counters.model";
import { CategoryDoc } from './categories.model';
import { MediaDoc } from './medias.model';
// CHÚ THÍCH KIẾN TRÚC TỔNG QUAN
// Model Product được thiết kế theo một kiến trúc linh hoạt để hỗ trợ nhiều loại sản phẩm
// 1. `attributes`: Dùng để lưu thông số kỹ thuật CỐ ĐỊNH, chỉ để hiển thị (ví dụ: quãng đường, động cơ).
// 2. `configurable_options`: Là định nghĩa các "nhóm lựa chọn"
//    (như Phiên bản, Màu sắc) và các "giá trị lựa chọn" bên trong (như Eco, Plus, Đỏ, Xanh).
//    Mỗi lựa chọn có thể tác động đến giá. Giao diện (UI) sẽ đọc trường này để render ra các bước cho người dùng.
// 3. `variants`: Là danh sách các SKU (Stock Keeping Unit) cuối cùng có thể bán được. Mỗi variant là
//    một sự kết hợp cụ thể của các lựa chọn từ `configurable_options` và có một mức giá, số lượng tồn kho,
//    và mã SKU riêng biệt.

const AttributeSchema = new mongoose.Schema({
    key: { type: String, required: true }, // Ví dụ: 'range_per_charge'
    name: { type: String, required: true }, // Ví dụ: 'Quãng đường di chuyển'
    value: { type: String, required: true }, // Ví dụ: '471 km'
}, { _id: false });

const OptionValueSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Tên hiển thị: "Bản Plus", "Màu Đỏ"
    value: { type: String, required: true }, // Giá trị để máy đọc: "plus", "crimson-red"
    price_adjustment: { type: Number, default: 0 }, // Mức chênh lệch giá so với giá gốc
    media_id: { type: Number, ref: 'Media', default: null }, // Ảnh riêng cho lựa chọn này
}, { _id: false });

const ConfigurableOptionSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Tên nhóm: "Phiên bản"
    type: { type: String, enum: ['color', 'select', 'checkbox'], default: 'select' }, // Giúp UI biết cách render
    values: [OptionValueSchema],
}, { _id: false });

const SelectedOptionSchema = new mongoose.Schema({
    option_name: { type: String, required: true }, // Ví dụ: "Phiênbish"
    option_value: { type: String, required: true }, // Ví dụ: "plus"
}, { _id: false });

const VariantSchema = new mongoose.Schema({
    sku: { type: String, required: true, unique: true, index: true },
    final_price: { type: Number, required: true }, // Giá cuối cùng của SKU này
    stock_quantity: { type: Number, required: true, default: 0 },
    variant_media_ids: {
        type: [Number], ref: 'Media', default: null
    }, // Ảnh đại diện riêng cho SKU này
    selected_options: [SelectedOptionSchema], // Chỉ rõ SKU này được tạo từ những lựa chọn nào
}, {
    _id: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

export interface ProductDoc extends mongoose.Document {
    _id: number;
    name: string;
    slug: string;
    type: string;
    category_code: string;
    base_price: number;
    status: 'Mới' | 'Bán chạy' | 'Hết hàng'; // Trạng thái của sản phẩm (ví dụ: 'Mới', 'Bán chay', 'Đã bán', 'Hết hàng')
    tags: string[]; // Mảng các tag, ví dụ: ["hoc-sinh", "ca-tinh"]
    attributes: { key: string; name: string; value: string }[];
    configurable_options: {
        name: string;
        type: 'color' | 'select' | 'checkbox';
        values: { name: string; value: string; price_adjustment: number; media_id: number | null }[];
    }[];
    variants: {
        sku: string;
        final_price: number;
        stock_quantity: number;
        variant_media_ids: number[] | null;
        selected_options: { option_name: string; option_value: string }[];
        variant_medias?: MediaDoc[];
    }[];
    main_image_id: number | null;
    gallery_image_ids: number[] | null; // Mảng các ID ảnh trong thư viện, có thể null nếu không có ảnh
    listImage: MediaDoc[]; // Mảng các ảnh liên quan đến sản phẩm
    articleURL?: string | null;

    isDeleted: boolean;
    created_date: Date;
    updated_date: Date | null;
    category?: CategoryDoc;
    main_image?: MediaDoc;
    gallery_images?: MediaDoc[];
};

interface ProductModel extends mongoose.Model<ProductDoc> {
    build(attrs: ProductZodType): ProductDoc;
}
// SCHEMA CHÍNH
const productSchema = new mongoose.Schema<ProductDoc>({
    _id: { type: Number },
    name: { type: String, required: true, index: true },
    slug: { type: String, unique: true },
    type: {
        type: String,
        required: true,
        index: true,
        enum: {
            values: ['xe-may', 'o-to', 'phu-kien'],
            message: 'Giá trị "{VALUE}" không hợp lệ. Loại sản phẩm phải là "xe-may", "o-to", hoặc "phu-kien".'
        }
    },
    base_price: { type: Number, required: true, default: 0 }, 
    category_code: { type: String, required: true, index: true },
    status: { type: String, default: 'Mới' },
    tags: { type: [String], default: [] },
    attributes: [AttributeSchema],
    configurable_options: [ConfigurableOptionSchema],
    variants: [VariantSchema],
    main_image_id: { type: Number, ref: 'Media', default: null },
    gallery_image_ids: [{ type: Number, ref: 'Media' }],
    articleURL: { type: String, default: null },
    isDeleted: { type: Boolean, default: false },
    created_date: { type: Date, default: null },
    updated_date: { type: Date, default: null },
}, {
    timestamps: false,
    collection: "products",
    toJSON: {
        virtuals: true,
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    },
    toObject: {
        virtuals: true 
    }
});
productSchema.virtual('main_image', {
    ref: 'Media',
    localField: 'main_image_id',
    foreignField: '_id',
    justOne: true
});

// Virtual cho thư viện ảnh (gallery_images)
productSchema.virtual('gallery_images', {
    ref: 'Media',
    localField: 'gallery_image_ids',
    foreignField: '_id',
    justOne: false
});

productSchema.virtual('category', {
    ref: 'Category',
    localField: 'category_code',
    foreignField: 'code',
    justOne: true
});

VariantSchema.virtual('variant_medias', {
    ref: 'Media',
    localField: 'variant_media_ids',
    foreignField: '_id',
    justOne: false
});

productSchema.statics.build = function (attrs: ProductZodType) {
    return new ProductModel(attrs);
};

productSchema.pre("save", async function (next) {
    // Tự động tạo slug nếu chưa có
    if (!this.slug) {
        this.slug = this.name
            .toLowerCase()
            .replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ặ|ẵ|â|ấ|ầ|ẩ|ậ|ẫ/g, "a")
            .replace(/đ/g, "d")
            .replace(/é|è|ẻ|ẹ|ẽ|ê|ế|ề|ể|ệ|ễ/g, "e")
            .replace(/í|ì|ỉ|ị|ĩ/g, "i")
            .replace(/ó|ò|ỏ|ọ|õ|ô|ố|ồ|ổ|ộ|ỗ|ơ|ớ|ờ|ở|ợ|ỡ/g, "o")
            .replace(/ú|ù|ủ|ụ|ũ|ư|ứ|ừ|ử|ự|ữ/g, "u")
            .replace(/ý|ỳ|ỷ|ỵ|ỹ/g, "y")
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-');
    }

    if (this.isNew) {
        const counter = await CounterModel.findByIdAndUpdate(
            { _id: "product_id" },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        this._id = counter.seq;
        this.created_date = new Date();
    }
    next();
});

productSchema.pre("findOneAndUpdate", async function (next) {
    this.set({ updated_date: new Date() });
    next();
});

export const ProductModel = mongoose.model<ProductDoc, ProductModel>('Product', productSchema)
