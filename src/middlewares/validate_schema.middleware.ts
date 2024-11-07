import { NextFunction, Request, Response } from "express";
import { Schema, ZodError } from "zod";



export const validateSchema : any = (schema: Schema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body)
            next()
        } catch (err) {
            if (err instanceof ZodError) {
                return res.status(400).json({ errors: err.errors })
            }
            next(err)
        }
    }
}