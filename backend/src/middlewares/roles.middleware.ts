import { Request, Response, NextFunction } from "express";
import { NotAuthorizedError } from "../errors";

/**
 * Middleware factory that accepts an array of allowed roles
 * Usage: checkAllowedRolesMiddleware(['ADMIN', 'EDITOR'])
 */
export function checkAllowedRolesMiddleware(allowedRoles: string[]) {
    return function (req: Request, res: Response, next: NextFunction) {
        if (!req.user) {
            throw new NotAuthorizedError("Yêu cầu đăng nhập");
        }

        // Check if user's role matches any allowed role (case-insensitive)
        const userRole = req.user.role.toUpperCase();
        const hasPermission = allowedRoles.some(function (role) {
            return role.toUpperCase() === userRole;
        });

        if (!hasPermission) {
            throw new NotAuthorizedError(`Vai trò '${req.user.role}' không có quyền truy cập`);
        }

        next();
    };
}

/**
 * Spread-style middleware factory (alternative syntax)
 * Usage: requireRoles('ADMIN', 'EDITOR')
 */
export function requireRoles(...allowedRoles: string[]) {
    return checkAllowedRolesMiddleware(allowedRoles);
}

/**
 * Admin-only shortcut middleware
 */
export function adminOnly(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
        throw new NotAuthorizedError("Yêu cầu đăng nhập");
    }

    if (req.user.role !== "admin") {
        throw new NotAuthorizedError("Chỉ admin mới có quyền truy cập");
    }

    next();
}
