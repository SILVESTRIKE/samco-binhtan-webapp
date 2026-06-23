import mongoose from 'mongoose';
import { CounterModel } from "./counters.model";
import { MediaDoc } from './medias.model';

export type HeroArticlesDoc = mongoose.Document & {
    _id: number;
    title: string;
    description: string;
    slug: string;
    tags: string[]; // Mảng các tag, ví dụ: ["giới thiệu", "bài viết"]
    articleURL: string | null;
    image_id: number | null;
    isDeleted: boolean;
    created_date: Date;
    updated_date: Date | null;
    image?: MediaDoc;
};

const HeroArticlesSchema = new mongoose.Schema<HeroArticlesDoc>({
    _id: { type: Number },
    title: { type: String, required: true },
    description: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    tags: { type: [String], default: [] }, // Mảng các tag, ví dụ: ["giới thiệu", "bài viết"]
    articleURL: { type: String, default: null },
    image_id: { type: Number, ref: 'Media', default: null },
    isDeleted: { type: Boolean, default: false },
    created_date: { type: Date, default: null },
    updated_date: { type: Date, default: null },
}, {
    timestamps: false,
    collection: "hero_articles",
    toJSON: { virtuals: true, transform: (doc, ret) => { ret.id = ret._id; delete ret._id; delete ret.__v; } }
});

HeroArticlesSchema.virtual('image', {
    ref: 'Media',
    localField: 'image_id',
    foreignField: '_id',
    justOne: true
});

HeroArticlesSchema.pre("save", async function (next) {
    if (this.isNew) {
        if (!this.slug) {
            this.slug = this.title
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

        const counter = await CounterModel.findByIdAndUpdate({ _id: "hero_articles_id" }, { $inc: { seq: 1 } }, { new: true, upsert: true });
        this._id = counter.seq;
        this.created_date = new Date();
    }
    next();
});

HeroArticlesSchema.pre("findOneAndUpdate", async function (next) {
    this.set({ updated_date: new Date() });
    next();
});

export const HeroArticlesModel = mongoose.model<HeroArticlesDoc>('HeroArticles', HeroArticlesSchema);
