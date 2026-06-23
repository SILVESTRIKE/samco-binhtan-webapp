import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/users.service";
import { AuthService } from "../services/auth.service";
import {
    UserRegisterSchema,
    UserLoginSchema,
    SendOtpSchema,
    VerifyOtpSchema,
    UpdateUserSchema
} from "../types/users.type";
import { BadRequestError, NotFoundError, NotAuthorizedError } from "../errors";

export class UserController {
    static async register(req: Request, res: Response, next: NextFunction) {
        try {
            const validationResult = UserRegisterSchema.safeParse(req.body);
            if (!validationResult.success) {
                throw new BadRequestError(validationResult.error.message);
            }

            const newUser = await UserService.createUser(validationResult.data);

            res.status(201).json({
                success: true,
                message: "Tài khoản đã được tạo. OTP đã được gửi đến email của bạn để xác thực.",
                data: {
                    id: newUser._id,
                    username: newUser.username,
                    email: newUser.email,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const validationResult = UserLoginSchema.safeParse(req.body);
            if (!validationResult.success) {
                throw new BadRequestError(validationResult.error.message);
            }

            const { email, password } = validationResult.data;
            const { user, accessToken } = await AuthService.login(email, password, res);

            res.status(200).json({
                success: true,
                message: "Đăng nhập thành công!",
                data: {
                    user: {
                        id: user._id,
                        username: user.username,
                        email: user.email,
                        role: user.role,
                    },
                    accessToken,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    static async refresh(req: Request, res: Response, next: NextFunction) {
        try {
            const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
            if (!refreshToken) {
                throw new NotAuthorizedError("Refresh token không được cung cấp");
            }

            const accessToken = await AuthService.refreshAccessToken(refreshToken, res);

            res.status(200).json({
                success: true,
                data: { accessToken },
            });
        } catch (error) {
            next(error);
        }
    }

    static async logout(req: Request, res: Response, next: NextFunction) {
        try {
            const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
            await AuthService.logout(refreshToken, res);

            res.status(200).json({
                success: true,
                message: "Đăng xuất thành công",
            });
        } catch (error) {
            next(error);
        }
    }

    static async sendOtp(req: Request, res: Response, next: NextFunction) {
        try {
            const validationResult = SendOtpSchema.safeParse(req.body);
            if (!validationResult.success) {
                throw new BadRequestError(validationResult.error.message);
            }

            await UserService.sendOtp(validationResult.data.email);

            res.status(200).json({
                success: true,
                message: "OTP đã được gửi đến email của bạn",
            });
        } catch (error) {
            next(error);
        }
    }

    static async verifyOtp(req: Request, res: Response, next: NextFunction) {
        try {
            const validationResult = VerifyOtpSchema.safeParse(req.body);
            if (!validationResult.success) {
                throw new BadRequestError(validationResult.error.message);
            }

            const { email, otp } = validationResult.data;
            await UserService.verifyOtp(email, otp);

            res.status(200).json({
                success: true,
                message: "Xác thực tài khoản thành công. Bạn có thể đăng nhập.",
            });
        } catch (error) {
            next(error);
        }
    }

    static async getProfile(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                throw new NotAuthorizedError("Yêu cầu đăng nhập");
            }

            res.status(200).json({
                success: true,
                data: {
                    id: req.user._id,
                    username: req.user.username,
                    email: req.user.email,
                    role: req.user.role,
                    verify: req.user.verify,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    static async updateUser(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = parseInt(req.params.id, 10);
            if (isNaN(userId)) {
                throw new BadRequestError("ID không hợp lệ");
            }

            // Users can only update their own profile unless admin
            if (req.user?._id !== userId && req.user?.role !== "admin") {
                throw new NotAuthorizedError("Bạn không có quyền thực hiện hành động này");
            }

            const validationResult = UpdateUserSchema.safeParse(req.body);
            if (!validationResult.success) {
                throw new BadRequestError(validationResult.error.message);
            }

            const updatedUser = await UserService.updateUser(userId, validationResult.data);
            if (!updatedUser) {
                throw new NotFoundError("Không tìm thấy người dùng");
            }

            res.status(200).json({
                success: true,
                message: "Cập nhật thành công",
                data: {
                    id: updatedUser._id,
                    username: updatedUser.username,
                    email: updatedUser.email,
                    role: updatedUser.role,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    static async deleteUser(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = parseInt(req.params.id, 10);
            if (isNaN(userId)) {
                throw new BadRequestError("ID không hợp lệ");
            }

            // Users can only delete their own account unless admin
            if (req.user?._id !== userId && req.user?.role !== "admin") {
                throw new NotAuthorizedError("Bạn không có quyền thực hiện hành động này");
            }

            const deletedUser = await UserService.deleteUser(userId);
            if (!deletedUser) {
                throw new NotFoundError("Không tìm thấy người dùng");
            }

            res.status(200).json({
                success: true,
                message: "Xóa tài khoản thành công",
            });
        } catch (error) {
            next(error);
        }
    }

    static async getAllUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await UserService.getAll();

            res.status(200).json({
                success: true,
                data: users.map(function (user) {
                    return {
                        id: user._id,
                        username: user.username,
                        email: user.email,
                        role: user.role,
                        verify: user.verify,
                    };
                }),
            });
        } catch (error) {
            next(error);
        }
    }
}
