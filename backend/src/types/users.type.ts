import { z } from "zod";

// ============= Enums =============
export const UserRoleEnum = z.enum(["user", "admin"]);
export type UserRole = z.infer<typeof UserRoleEnum>;

// ============= User Registration =============
export const UserRegisterSchema = z.object({
    username: z.string()
        .min(3, "Tên người dùng phải có ít nhất 3 ký tự")
        .max(50, "Tên người dùng không được vượt quá 50 ký tự"),
    email: z.string()
        .email("Định dạng email không hợp lệ"),
    password: z.string()
        .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
        .max(100, "Mật khẩu không được vượt quá 100 ký tự"),
});
export type UserRegisterType = z.infer<typeof UserRegisterSchema>;

// ============= User Login =============
export const UserLoginSchema = z.object({
    email: z.string()
        .email("Định dạng email không hợp lệ"),
    password: z.string()
        .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});
export type UserLoginType = z.infer<typeof UserLoginSchema>;

// ============= Send OTP =============
export const SendOtpSchema = z.object({
    email: z.string()
        .email("Định dạng email không hợp lệ"),
});
export type SendOtpType = z.infer<typeof SendOtpSchema>;

// ============= Verify OTP =============
export const VerifyOtpSchema = z.object({
    email: z.string()
        .email("Định dạng email không hợp lệ"),
    otp: z.string()
        .length(6, "Mã OTP phải có đúng 6 ký tự")
        .regex(/^[0-9]{6}$/, "Mã OTP chỉ được chứa 6 chữ số"),
});
export type VerifyOtpType = z.infer<typeof VerifyOtpSchema>;

// ============= Update User =============
export const UpdateUserSchema = z.object({
    username: z.string()
        .min(3, "Tên người dùng phải có ít nhất 3 ký tự")
        .max(50, "Tên người dùng không được vượt quá 50 ký tự")
        .optional(),
    password: z.string()
        .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
        .max(100, "Mật khẩu không được vượt quá 100 ký tự")
        .optional(),
});
export type UpdateUserType = z.infer<typeof UpdateUserSchema>;

// ============= User ID Params =============
export const UserIdParamsSchema = z.object({
    id: z.string().transform((val, ctx) => {
        const parsed = parseInt(val, 10);
        if (isNaN(parsed) || parsed <= 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "ID phải là một số nguyên dương",
            });
            return z.NEVER;
        }
        return parsed;
    }),
});
export type UserIdParamsType = z.infer<typeof UserIdParamsSchema>;
