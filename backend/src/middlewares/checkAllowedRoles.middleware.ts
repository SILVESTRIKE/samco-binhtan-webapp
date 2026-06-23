import axios from "axios";
import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../errors/BadRequestError";

export const checkAllowedRolesMiddleware = (allowedRoles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) =>{
        /*
        An example of the response from the backend when fetching permissions:
        {
            "success": true,
            "data": [
                "AM_ADMIN",
                "AM_DEPARTMENT_VIEW",
                "AM_INVENTORY_WRITE",
                "AM_WAREHOUSE_WRITE",
                "CHECKING_TOOL_ADMIN",
                "DW_DELETE",
                "DW_READ",
                "DW_WRITE",
                "HR_ADMIN",
                "HR_AREA",
                "HR_EMPLOYEE",
                "HR_RECRUITMENT",
                "HR_SALARY",
                "HR_VIEW_MEMBER_PROFILE",
                "PERMISSION_MANGEMENT",
                "WORKFLOW_ADMIN"
            ]
        }
         */
        if (!req.token) {
            throw new BadRequestError("No token provided");
        }
        const {data} = await axios.get(process.env.BACKEND_URL + '/authenticate/getMyPermissions',{
            headers:{
                Authorization: `Bearer ${req.token}`
            }
        });

        if (!data.success) {
            throw new BadRequestError("Failed to fetch user permissions");
        }
        const userPermissions = data.data;
        const hasPermission = allowedRoles.some(role => userPermissions.includes(role));
        if (!hasPermission) {
            throw new BadRequestError("User does not have the required permissions");
        }
        
        next();
    }
}