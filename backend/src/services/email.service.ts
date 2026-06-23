import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export class EmailService {
    static async sendOtpEmail(to: string, otp: string): Promise<void> {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: to,
            subject: "Mã OTP xác thực tài khoản",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Xác thực tài khoản của bạn</h2>
                    <p>Mã OTP của bạn là:</p>
                    <div style="background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #333;">
                        ${otp}
                    </div>
                    <p style="color: #666; margin-top: 20px;">Mã này sẽ hết hạn sau 1 phút.</p>
                    <p style="color: #999; font-size: 12px;">Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.</p>
                </div>
            `,
        };

        try {
            const info = await transporter.sendMail(mailOptions);
            console.log("[EMAIL] Sent OTP to:", to);
            console.log("[EMAIL] OTP:", otp);
        } catch (error) {
            console.error("[EMAIL] Error sending email:", error);
            throw new Error("Không thể gửi email");
        }
    }
}
