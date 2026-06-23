import mongoose from 'mongoose';
import { CategoryZodType } from '../types/categories.type';
import { CounterModel } from "./counters.model";

export type CategoryDoc = mongoose.Document & {
    _id: number;
    code: string;
    name: string;
    slug: string;
    parent_code: string | null;
    ancestors: string[];
    isDeleted?: boolean;
    created_date?: Date | null;
    updated_date?: Date | null;
}

interface CategoryModel extends mongoose.Model<CategoryDoc> {
    build(attrs: CategoryZodType): CategoryDoc;
}

const CategorySchema = new mongoose.Schema<CategoryDoc>({
    _id: { type: Number },
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    slug: { type: String, unique: true },
    parent_code: { type: String, default: null, index: true }, // `index: true` để tìm kiếm nhanh hơn
    ancestors: { type: [String], default: [] },
    isDeleted: { type: Boolean, default: false },
    created_date: { type: Date, default: null },
    updated_date: { type: Date, default: null },
},
    {
        timestamps: false,
        collection: "categories",
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
            }
        }
    }
);

CategorySchema.statics.build = function (attrs: CategoryZodType) {
    return new CategoryModel(attrs);
};

CategorySchema.pre("save", async function (next) {
    const doc = this as CategoryDoc;

    if (!doc.slug) {
        doc.slug = doc.name
            .toLowerCase()
            .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, "a")
            .replace(/[èéẹẻẽêềếệểễ]/g, "e")
            .replace(/[ìíịỉĩ]/g, "i")
            .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, "o")
            .replace(/[ùúụủũưừứựửữ]/g, "u")
            .replace(/[ỳýỵỷỹ]/g, "y")
            .replace(/đ/g, "d")
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-');
    }

    if (doc.isNew) {
        const counter = await CounterModel.findByIdAndUpdate(
            { _id: "category_id" },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        if (counter) {
            doc._id = counter.seq;
            doc.created_date = new Date();
        }
    }
    next();
});



CategorySchema.pre("findOneAndUpdate", async function (next) {
    this.set({ updated_date: new Date() });
    next();
});

export const CategoryModel = mongoose.model<CategoryDoc, CategoryModel>('Category', CategorySchema);