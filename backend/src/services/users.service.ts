import bcrypt from "bcryptjs";
import { UserModel, UserDoc } from "../models/users.model";
import { OtpModel } from "../models/otp.model";
import { EmailService } from "./email.service";
import { UserRegisterType, UpdateUserType } from "../types/users.type";
import { NotFoundError, BadRequestError } from "../errors";

export class UserService {
    static async getAll(): Promise<UserDoc[]> {
        return UserModel.find({ isDeleted: false }).select("-password");
    }

    static async getById(id: number): Promise<UserDoc | null> {
        return UserModel.findOne({ _id: id, isDeleted: false }).select("-password");
    }

    static async getByEmail(email: string, includePassword: boolean = false): Promise<UserDoc | null> {
        const query = UserModel.findOne({ email, isDeleted: false });
        if (!includePassword) {
            query.select("-password");
        }
        return query;
    }

    static async createUser(data: UserRegisterType): Promise<UserDoc> {
        const existingUser = await UserModel.findOne({ email: data.email });
        if (existingUser) {
            throw new BadRequestError("Email đã tồn tại");
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);
        const newUser = new UserModel({
            username: data.username,
            email: data.email,
            password: hashedPassword,
            role: "user",
            verify: true, // Auto-verified for local demo
        });

        await newUser.save();

        // Send OTP bypassed for local demo
        // await this.sendOtp(data.email);

        return newUser;
    }

    static async updateUser(id: number, data: UpdateUserType): Promise<UserDoc | null> {
        const updateData: Partial<UpdateUserType> = { ...data };

        if (data.password) {
            updateData.password = await bcrypt.hash(data.password, 10);
        }

        return UserModel.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true }
        ).select("-password");
    }

    static async deleteUser(id: number): Promise<UserDoc | null> {
        return UserModel.findByIdAndUpdate(
            id,
            { isDeleted: true },
            { new: true }
        );
    }

    static async sendOtp(email: string): Promise<void> {
        const user = await UserModel.findOne({ email, isDeleted: false });
        if (!user) {
            throw new NotFoundError("Không tìm thấy người dùng");
        }

        if (user.verify) {
            throw new BadRequestError("Tài khoản này đã được xác thực");
        }

        // Generate 6-digit OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Remove any existing OTP for this user
        await OtpModel.deleteMany({ userId: user._id });

        // Save new OTP
        await new OtpModel({ userId: user._id, otp: otpCode }).save();

        // Send email (Logged in console for local demo)
        console.log(`[OTP Bypass] Simulated OTP for ${email}: ${otpCode}`);
        // await EmailService.sendOtpEmail(email, otpCode);
    }

    static async verifyOtp(email: string, otp: string): Promise<void> {
        const user = await UserModel.findOne({ email, isDeleted: false });
        if (!user) {
            throw new NotFoundError("Email không hợp lệ");
        }

        const otpRecord = await OtpModel.findOne({ userId: user._id, otp: otp });
        if (!otpRecord) {
            throw new BadRequestError("OTP không hợp lệ hoặc đã hết hạn");
        }

        // Update user verification status
        await UserModel.findByIdAndUpdate(user._id, { verify: true });

        // Delete used OTP
        await OtpModel.deleteOne({ _id: otpRecord._id });
    }
}
