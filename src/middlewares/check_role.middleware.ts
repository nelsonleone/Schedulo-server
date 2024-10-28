import { NextFunction, Request, Response } from "express";
import { HttpError } from "../utils/errors/httpError";
import { CustomRequest } from "../types";


export const check_role = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const authHeader = req.headers.authorization;
        const authToken = authHeader && authHeader.split(" ")[1]

        if (!authToken){
            throw new HttpError(401,"Unauthourized request")
        }

        (req as CustomRequest).authToken = authToken;
        next()
    }
    catch(err: any){
        next(err)
    }
}