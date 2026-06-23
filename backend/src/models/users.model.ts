import mongoose from "mongoose";
import { CounterModel } from "./counters.model";

export interface UserDoc extends mongoose.Document {
    _id: number;
    username: string;
    email: string;
    password: string;
    role: "user" | "admin";
    verify: boolean;
    isDeleted: boolean;
    created_date: Date;
    updated_date: Date | null;
}

const userSchema = new mongoose.Schema<UserDoc>(
    {
        _id: { type: Number },
        username: { type: String, required: true },
        email: { type: String, required: true, unique: true, index: true },
        password: { type: String, required: true },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
            required: true
        },
        verify: { type: Boolean, default: false },
        isDeleted: { type: Boolean, default: false },
        created_date: { type: Date, default: null },
        updated_date: { type: Date, default: null },
    },
    {
        timestamps: false,
        collection: "users",
        toJSON: {
            virtuals: true,
            transform: (doc, ret) => {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
                delete ret.password; // Never expose password
            },
        },
        toObject: {
            virtuals: true,
        },
    }
);

userSchema.pre("save", async function (next) {
    if (this.isNew) {
        const counter = await CounterModel.findByIdAndUpdate(
            { _id: "user_id" },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        this._id = counter.seq;
        this.created_date = new Date();
    }
    next();
});

userSchema.pre("findOneAndUpdate", async function (next) {
    this.set({ updated_date: new Date() });
    next();
});

export const UserModel = mongoose.model<UserDoc>("User", userSchema);
