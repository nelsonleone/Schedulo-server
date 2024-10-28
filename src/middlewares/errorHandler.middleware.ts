import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../utils/errors/httpError';
import type { ErrorRequestHandler } from "express";


export const errorHandler : ErrorRequestHandler = (err: any, req: Request, res: Response, next: NextFunction) : any => {
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      error: err.message,
      details: err.details,
    })
  }

  console.error(err.stack)
  res.status(500).json({ error: 'Internal server error' })
}
