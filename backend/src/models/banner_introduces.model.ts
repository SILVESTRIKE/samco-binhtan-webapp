import mongoose from 'mongoose';
import { BannerIntroduceZodType } from '../types/banner_introduces.types';
import { CounterModel } from "./counters.model";
import { MediaDoc } from './medias.model';

export type BannerIntroduceDoc = mongoose.Document & {
    _id: number;
    media_id: number;
    BannerPath: string;
    BannerSlug: string;
    isDisplay: boolean;
    start_date?: Date | null;
    end_date?: Date | null;
    isdeleted?: boolean;
    created_date?: Date | null;
    updated_date?: Date | null;
    media?: MediaDoc | null;
};

interface BannerIntroduceModel extends mongoose.Model<BannerIntroduceDoc> {
    build(attrs: BannerIntroduceZodType): BannerIntroduceDoc;
}

const BannerIntroduceSchema = new mongoose.Schema<BannerIntroduceDoc>({
    _id: { type: Number },
    media_id: {
        type: Number,
        ref: 'Media',
        required: true
    },
    BannerSlug: { type: String, },
    BannerPath: { type: String, },
    isDisplay: { type: Boolean, default: false },
    start_date: { type: Date, default: null },
    end_date: { type: Date, default: null },
    isdeleted: { type: Boolean, default: false },
    created_date: { type: Date, default: null },
    updated_date: { type: Date, default: null },
},
    {
        timestamps: false,
        collection: "banner_introduce",
        toJSON: {
            virtuals: true,
            transform(doc, ret) {
                ret.id = ret._id;
                ret.isdeleted = ret.__v;
            }
        },
        toObject: {
            virtuals: true
        }
    }
);

BannerIntroduceSchema.statics.build = function (attrs: BannerIntroduceZodType) {
    return new BannerIntroduceModel(attrs);
};

BannerIntroduceSchema.virtual('media', {
    ref: 'Media',
    localField: 'media_id',
    foreignField: '_id',
    justOne: true
});

BannerIntroduceSchema.pre("save", async function (next) {
    const doc = this as BannerIntroduceDoc;
    if (doc.isNew) {
        const counter = await CounterModel.findByIdAndUpdate(
            { _id: "banner_introduce_id" },
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

BannerIntroduceSchema.pre("findOneAndUpdate", async function (next) {
    this.set({ updated_date: new Date() });
    next();
});

export const BannerIntroduceModel = mongoose.model<BannerIntroduceDoc, BannerIntroduceModel>('BannerIntroduce', BannerIntroduceSchema);