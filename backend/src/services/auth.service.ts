import jwt, { Secret, SignOptions } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Response } from "express";
import mongoose from "mongoose";
import { UserService } from "./users.service";
import { UserDoc } from "../models/users.model";
import { RefreshTokenModel } from "../models/refreshToken.model";
import { BadRequestError, NotAuthorizedError } from "../errors";

interface TokenPayload {
    userId: number;
    username: string;
    role: string;
}

export class AuthService {
    private static readonly ACCESS_TOKEN_EXPIRES = "15m";
    private static readonly REFRESH_TOKEN_EXPIRES = "7d";
    private static readonly REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days in ms

    static async login(email: string, password: string, res: Response): Promise<{ user: UserDoc; accessToken: string }> {
        const user = await UserService.getByEmail(email, true);
        if (!user) {
            throw new BadRequestError("Email hoặc mật khẩu không đúng");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new BadRequestError("Email hoặc mật khẩu không đúng");
        }

        if (!user.verify) {
            // Send new OTP if account not verified
            await UserService.sendOtp(user.email).catch(function (err) { console.log(err.message); });
            throw new BadRequestError("Tài khoản chưa được xác thực. OTP mới đã được gửi đến email của bạn.");
        }

        const payload: TokenPayload = {
            userId: user._id,
            username: user.username,
            role: user.role,
        };

        // Create access token
        const accessToken = this.createToken(
            payload,
            process.env.JWT_SECRET!,
            this.ACCESS_TOKEN_EXPIRES
        );

        // Create refresh token with unique JTI (JWT ID)
        const jti = new mongoose.Types.ObjectId().toString();
        const refreshTokenPayload = { userId: user._id, jti };
        
        const refreshToken = jwt.sign(refreshTokenPayload, process.env.JWT_REFRESH_SECRET!, {
            expiresIn: this.REFRESH_TOKEN_EXPIRES
        });

        // Store hashed refresh token in database
        const expiresAt = new Date();
        expiresAt.setSeconds(expiresAt.getSeconds() + 7 * 24 * 60 * 60); // 7 days
        
        const hashedToken = await bcrypt.hash(refreshToken, 10);
        await RefreshTokenModel.create({
            user: user._id,
            jti,
            token: hashedToken,
            expiresAt,
        });

        // Set refresh token as httpOnly cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: this.REFRESH_TOKEN_MAX_AGE,
        });

        return { user, accessToken };
    }

    static createToken(payload: TokenPayload, secret: string, expiresIn: string): string {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (jwt.sign as any)({ ...payload }, secret, { expiresIn });
    }

    static verifyToken(token: string, secret: string): any {
        try {
            return jwt.verify(token, secret);
        } catch (error) {
            return null;
        }
    }

    static async refreshAccessToken(oldRefreshToken: string, res: Response): Promise<string> {
        // 1. Decode and verify the refresh token
        const decoded = this.verifyToken(oldRefreshToken, process.env.JWT_REFRESH_SECRET!);
        if (!decoded || !decoded.jti || !decoded.userId) {
            throw new NotAuthorizedError("Refresh token không hợp lệ hoặc đã hết hạn");
        }

        // 2. Find the token entry in database
        const dbToken = await RefreshTokenModel.findOne({ jti: decoded.jti });
        
        // 3. If token is not found in database, check if it's a compromised reuse attempt
        if (!dbToken) {
            // Revoke all tokens for this user as a security measure
            await RefreshTokenModel.deleteMany({ user: decoded.userId });
            throw new NotAuthorizedError("Phiên đăng nhập không hợp lệ");
        }

        // 4. Check if token was already used (reuse detection)
        if (dbToken.used) {
            // Delete all sessions for the compromised user
            await RefreshTokenModel.deleteMany({ user: decoded.userId });
            throw new NotAuthorizedError("Phát hiện hành vi đáng ngờ. Tất cả phiên đăng nhập đã bị hủy. Vui lòng đăng nhập lại.");
        }

        // 5. Check if user still exists
        const user = await UserService.getById(decoded.userId);
        if (!user) {
            throw new NotAuthorizedError("Người dùng không tồn tại");
        }

        // 6. Rotate token: Mark the old one as used
        dbToken.used = true;
        await dbToken.save();

        // 7. Create new access token
        const payload: TokenPayload = {
            userId: user._id,
            username: user.username,
            role: user.role,
        };
        const newAccessToken = this.createToken(
            payload,
            process.env.JWT_SECRET!,
            this.ACCESS_TOKEN_EXPIRES
        );

        // 8. Create new refresh token
        const newJti = new mongoose.Types.ObjectId().toString();
        const newRefreshTokenPayload = { userId: user._id, jti: newJti };
        const newRefreshToken = jwt.sign(newRefreshTokenPayload, process.env.JWT_REFRESH_SECRET!, {
            expiresIn: this.REFRESH_TOKEN_EXPIRES
        });

        // 9. Store new hashed refresh token in database
        const expiresAt = new Date();
        expiresAt.setSeconds(expiresAt.getSeconds() + 7 * 24 * 60 * 60); // 7 days
        const hashedToken = await bcrypt.hash(newRefreshToken, 10);
        await RefreshTokenModel.create({
            user: user._id,
            jti: newJti,
            token: hashedToken,
            expiresAt,
        });

        // 10. Update refresh token cookie
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: this.REFRESH_TOKEN_MAX_AGE,
        });

        return newAccessToken;
    }

    static async logout(oldRefreshToken: string | undefined, res: Response): Promise<void> {
        if (oldRefreshToken) {
            try {
                const decoded = this.verifyToken(oldRefreshToken, process.env.JWT_REFRESH_SECRET!);
                if (decoded && decoded.jti) {
                    // Delete token from DB
                    await RefreshTokenModel.deleteOne({ jti: decoded.jti });
                }
            } catch (error) {
                // Ignore decoding errors on logout
            }
        }

        // Clear cookie
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });
    }
}
