import axios from "axios";
import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../errors/BadRequestError";
export const getAuthMiddleware = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const { username, password } = req.body;
        /*
        An example of the response
        {
            "success": true,
            "token": <token>
        }
         */
        const response = await axios.post(`${process.env.BACKEND_URL}/authenticate/authenticate`,
            null,
            {
                params: {
                    username,
                    password
                }
            });
        
        const {token, success} = response.data;
        if (!success || response.status !== 200 || !token) {
            throw new BadRequestError("Authentication failed");
        }
        req.token = token;
        next();
    }
}