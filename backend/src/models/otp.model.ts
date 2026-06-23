import mongoose from "mongoose";

export interface OtpDoc extends mongoose.Document {
    userId: number;
    otp: string;
    createdAt: Date;
}

const otpSchema = new mongoose.Schema<OtpDoc>(
    {
        userId: {
            type: Number,
            ref: "User",
            unique: true, // Each user can only have one OTP at a time
            required: true,
        },
        otp: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: false,
        collection: "otps",
    }
);

// TTL index - automatically delete OTP documents after 60 seconds
otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 });

export const OtpModel = mongoose.model<OtpDoc>("Otp", otpSchema);
