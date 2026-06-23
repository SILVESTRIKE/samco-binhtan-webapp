import mongoose from "mongoose";
import { CounterModel } from "./counters.model";
import { CategoryDoc } from "./categories.model";
// <<< VÔ HIỆU HÓA - Tạm thời không cần ProductDoc
// import { ProductDoc } from './products.model';

// Schema con cho nội dung của một mục menu
const ContentSchema = new mongoose.Schema(
  {
    contentType: {
      type: String,
      required: true,
      enum: ["url", "category"],
      //enum: ["url", "category", "product_list"],

      default: "url",
    },
    url: { type: String, default: null },
    category_code: { type: String, ref: "Category", default: null },
    // product_ids: [{ type: Number, ref: 'Product' }],
  },
  { _id: false }
);

export interface NavbarItemDoc extends mongoose.Document {
  _id: number;
  title: string;
  titleKey: string;
  order: number;
  group: string;
  type: "link" | "button" | "mega_menu_trigger";
  target: "_self" | "_blank";
  parent_id: number | null;
  content: {
    contentType: "url" | "category";
    // contentType: "url" | "category" | "product_list";

    url?: string | null;
    category_code?: string | null;
    // product_ids?: number[];
    category?: CategoryDoc;
    // products?: ProductDoc[];
  };
  isDeleted?: boolean;
  created_date: Date;
  updated_date: Date | null;
}

const navbarItemSchema = new mongoose.Schema<NavbarItemDoc>(
  {
    _id: { type: Number },
    title: { type: String, required: true },
    titleKey: { type: String, required: true },

    order: { type: Number, default: 0 },
    group: { type: String, required: true, index: true },
    type: {
      type: String,
      enum: ["link", "button", "mega_menu_trigger"],
      default: "link",
    },
    target: { type: String, enum: ["_self", "_blank"], default: "_self" },
    parent_id: { type: Number, default: null, index: true },
    content: ContentSchema,
    isDeleted: { type: Boolean, default: false },
    created_date: { type: Date, default: Date.now, required: true },
    updated_date: { type: Date, default: null },
  },
  {
    timestamps: false,
    collection: "navbar_items",
    toJSON: { virtuals: true, transform: (doc, ret) => { ret.id = ret._id; delete ret.__v; delete ret._id} },
    toObject: { virtuals: true },
  }
);

// Virtual để populate thông tin category
ContentSchema.virtual("category", {
  ref: "Category",
  localField: "category_code",
  foreignField: "code",
  justOne: true,
});

// <<< VÔ HIỆU HÓA - Tạm ẩn virtual products
// ContentSchema.virtual('products', {
//     ref: 'Product',
//     localField: 'product_ids',
//     foreignField: '_id',
//     justOne: false
// });

// --- HOOKS (giữ nguyên) ---
navbarItemSchema.pre("save", async function (next) {
  if (this.isNew) {
    const counter = await CounterModel.findByIdAndUpdate(
      { _id: "navbar_item_id" },
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

navbarItemSchema.pre("findOneAndUpdate", async function (next) {
  this.set({ updated_date: new Date() });
  next();
});

export const NavbarItemModel = mongoose.model<NavbarItemDoc>(
  "NavbarItem",
  navbarItemSchema
);

