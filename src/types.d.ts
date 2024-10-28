import { Request } from "express";

interface CustomRequest extends Request {
    authToken: string
}