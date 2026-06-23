import mongoose from 'mongoose';
import { CounterModel } from "./counters.model";

export type MediaDoc = mongoose.Document & {
    _id: number;
    name: string;
    mediaPath: string; // Đường dẫn vật lý của file trên server/cloud
    mediaURL: string | null; // URL công khai để truy cập (trường ảo)
    description: string | null;
    type: string | null; 
    creator_id: number;
    directory_id: number | null; 
    isDeleted: boolean;
    created_date: Date; 
    updated_date: Date | null;
}

const mediaSchema = new mongoose.Schema<MediaDoc>({
    _id: { type: Number },

    name: {
        type: String,
        required: [true, "Tên media là bắt buộc"],
    },

    mediaPath: {
        type: String,
        required: [true, "Đường dẫn media là bắt buộc"],
    },

    description: { type: String, default: null },
    type: { type: String, default: null },
    creator_id: { type: Number, required: true },
    directory_id: { type: Number, default: null, index: true },
    isDeleted: { type: Boolean, default: false },
    created_date: { type: Date, default: null },
    updated_date: { type: Date, default: null },
}, {
    timestamps: false,
    collection: "medias",
    toJSON: {
        virtuals: true,
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            delete ret.mediaPath; 
        }
    },
    toObject: { 
        virtuals: true
    }
});


mediaSchema.pre("save", async function (next) {
    if (this.isNew) {
        const counter = await CounterModel.findByIdAndUpdate(
            { _id: "media_id" },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        this._id = counter.seq;
        this.created_date = new Date();
    }
    next();
});

mediaSchema.pre("findOneAndUpdate", async function (next) {
    this.set({ updated_date: new Date() });
    next();
});

export const MediaModel = mongoose.model<MediaDoc>("Media", mediaSchema);