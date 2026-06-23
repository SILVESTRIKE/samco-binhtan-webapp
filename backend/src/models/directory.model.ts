import mongoose from "mongoose";
import { CounterModel } from "./counters.model";

export type DirectoryDoc = mongoose.Document & {
  _id: number;
  name: string;
  parent_id: number | null;
  creator_id: number;
  isDeleted: boolean;
  created_date: Date;
  updated_date: Date | null;
};

const directorySchema = new mongoose.Schema<DirectoryDoc>(
  {
    _id: { type: Number },
    name: { type: String, required: [true, "Tên thư mục là bắt buộc"] },
    parent_id: { type: Number, default: null, index: true },
    creator_id: { type: Number, required: true },
    isDeleted: { type: Boolean, default: false },
    created_date: { type: Date, default: null },
    updated_date: { type: Date, default: null },
  },
  {
    timestamps: false,
    collection: "directories",
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
     toObject: {
        virtuals: true
    }
  }
);

directorySchema.pre("save", async function (next) {
  if (this.isNew) {
    const counter = await CounterModel.findByIdAndUpdate(
      { _id: "directory_id" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this._id = counter.seq;
    this.created_date = new Date();
  }
  next();
});

directorySchema.pre("findOneAndUpdate", async function (next) {
  this.set({ updated_date: new Date() });
  next();
});

export const DirectoryModel = mongoose.model<DirectoryDoc>(
  "Directory",
  directorySchema
);
