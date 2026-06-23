import mongoose from 'mongoose';
import { CounterModel } from './counters.model';
import { MediaDoc } from './medias.model';

export type ServiceDoc = mongoose.Document & {
    _id: number;
     title: string;
    slug: string; 
    description: string;
    urlDetail: string | null; 
    image_id: number | null; // Tham chiếu đến MediaModel
    isDeleted: boolean; 
    created_date: Date;
    updated_date: Date | null;
    image?: MediaDoc;
};

const serviceSchema = new mongoose.Schema<ServiceDoc>(
    {
        _id: { type: Number },
        title: { type: String, required: true, unique: true, trim: true },
        slug: { type: String, required: true, unique: true, trim: true },
        description: { type: String, required: true },
        urlDetail: { type: String, required: false, default: null },
        image_id: { type: Number, ref: 'Media', default: null }, // Thêm vào schema
        isDeleted: { type: Boolean, default: false },
        created_date: { type: Date, default: null },
        updated_date: { type: Date, default: null },
    },
    {
        timestamps: false,
        collection: 'services',
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
            }
        }
    }
);

serviceSchema.virtual('image', {
    ref: 'Media',
    localField: 'image_id',
    foreignField: '_id',
    justOne: true
});

serviceSchema.pre('save', async function (next) {
    const doc = this as ServiceDoc;
    if (doc.isNew) {
    // Tự động tạo slug từ name nếu nó chưa có
    if (!doc.slug) {
        doc.slug = doc.title
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

    const counter = await CounterModel.findByIdAndUpdate(
        { _id: "service_id" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true });
        doc._id = counter.seq;
        doc.created_date = new Date();
    }
    next();
});
serviceSchema.pre("findOneAndUpdate", async function (next) {
    this.set({ updated_date: new Date() });
    next();
});
export const ServiceModel = mongoose.model<ServiceDoc>('Service', serviceSchema);