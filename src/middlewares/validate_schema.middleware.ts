import { NextFunction, Request, Response } from "express";
import { Schema, ZodError } from "zod";

export const validateSchema: any = (schema: Schema<any>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body)
            next()
        } catch (err) {
            if (err instanceof ZodError) {
                console.log(err)
                const formattedErrors = err.format()
                return res.status(400).json({ errors: formattedErrors })
            }
            next(err)
        }
    }
}
