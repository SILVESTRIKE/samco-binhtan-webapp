import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { UserService } from "../services/users.service";
import { NotAuthorizedError } from "../errors";
import { UserDoc } from "../models/users.model";

// Extend Express Request to include user
declare global {
    namespace Express {
        interface Request {
            user?: UserDoc;
        }
    }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new NotAuthorizedError("Token không được cung cấp");
    }

    const token = authHeader.split(" ")[1];
    const decoded = AuthService.verifyToken(token, process.env.JWT_SECRET!);

    if (!decoded) {
        throw new NotAuthorizedError("Token không hợp lệ hoặc đã hết hạn");
    }

    // Attach user info to request
    UserService.getById(decoded.userId)
        .then(function (user) {
            if (!user) {
                throw new NotAuthorizedError("Người dùng không tồn tại");
            }
            req.user = user;
            next();
        })
        .catch(next);
}

// Convenience wrapper for async version
export async function authMiddlewareAsync(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new NotAuthorizedError("Token không được cung cấp");
        }

        const token = authHeader.split(" ")[1];
        const decoded = AuthService.verifyToken(token, process.env.JWT_SECRET!);

        if (!decoded) {
            throw new NotAuthorizedError("Token không hợp lệ hoặc đã hết hạn");
        }

        const user = await UserService.getById(decoded.userId);
        if (!user) {
            throw new NotAuthorizedError("Người dùng không tồn tại");
        }

        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
}
