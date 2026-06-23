import mongoose, { Schema, Types } from "mongoose";
export interface CounterAttrs{
    seq: number; // Current sequence value
}

export interface CounterDoc extends mongoose.Document, CounterAttrs{
    _id: string;
}

export interface CounterModel extends mongoose.Model<CounterDoc> {
    build(attrs: CounterAttrs): CounterDoc;
}

const counterSchema = new mongoose.Schema<CounterDoc>(
    {
        _id: { type: String, required: true },
        seq: { type: Number, default: 0 }
    },
    {
        collection: "counters",
        timestamps: true,
    }
);

counterSchema.statics.build = (attrs: CounterAttrs) => {
    return new CounterModel(attrs);
};

export const CounterModel = mongoose.model<CounterDoc, CounterModel>("Counter", counterSchema);
