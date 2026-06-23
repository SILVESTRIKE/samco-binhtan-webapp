import mongoose from "mongoose";
import { CounterModel } from "./counters.model";
import { MediaDoc } from "./medias.model";
export interface FooterItemDoc extends mongoose.Document {
  _id: number;
  title: string | null;
  titleKey: string;
  content?: string;
  order: number;
  logo_id?: number | null; // Ảnh logo nếu có
  iconKey?: string;
  column: 1 | 2 | 3;
  group: string;
  type: "LINK" | "HEADING" | "STATIC_TEXT" | "BRAND_LOGO";
  displayBehavior: "collapsible" | "expanded";
  target: "_self" | "_blank";
  parent_id: number | null;
  url?: string | null;
  isDeleted: boolean;
  created_date: Date;
  updated_date: Date | null;
  media_logo?: MediaDoc;
}

const footerItemSchema = new mongoose.Schema<FooterItemDoc>(
  {
    _id: { type: Number },
    title: { type: String, default: null },
    titleKey: { type: String, required: true },
    content: { type: String, default: null },
    order: { type: Number, default: 0 },
    logo_id: { type: Number, ref: "Media", default: null }, // Ảnh logo nếu có
    iconKey: { type: String }, // Ảnh icon nếu có
    column: { type: Number, enum: [1, 2, 3], required: true },
    group: { type: String, required: true, index: true },
    type: {
      type: String,
      enum: ["LINK", "HEADING", "STATIC_TEXT", "BRAND_LOGO"],
      default: "LINK",
    },
    displayBehavior: {
      type: String,
      enum: ["collapsible", "expanded"],
      default: "collapsible",
    },
    url: { type: String, default: null },
    target: { type: String, enum: ["_self", "_blank"], default: "_self" },
    parent_id: { type: Number, default: null, index: true },
    isDeleted: { type: Boolean, default: false },
    created_date: { type: Date, default: Date.now, required: true },
    updated_date: { type: Date, default: null },
  },
  {
    timestamps: false,
    collection: "footer_items",
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret.__v;
        delete ret._id;
      },
    },
    toObject: { virtuals: true },
  }
);

footerItemSchema.virtual("media_logo", {
  ref: "Media",
  localField: "logo_id",
  foreignField: "_id",
  justOne: true,
});

footerItemSchema.pre("save", async function (next) {
  if (this.isNew) {
    const counter = await CounterModel.findByIdAndUpdate(
      { _id: "footer_item_id" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this._id = counter.seq;
    this.created_date = new Date();
  } else {
    this.updated_date = new Date();
  }
  next();
});

footerItemSchema.pre("findOneAndUpdate", async function (next) {
  this.set({ updated_date: new Date() });
  next();
});

export const FooterItemModel = mongoose.model<FooterItemDoc>(
  "FooterItem",
  footerItemSchema
);
