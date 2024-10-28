import { NextFunction, Request, Response } from 'express';
import { supabaseClient } from '../lib/supabaseClient';
import { BoardSchema } from '../interfaces/board.interface';
import { HttpError } from '../utils/errors/httpError';
import asyncHandler from "express-async-handler"
import { Task } from '../interfaces/task.interface';



export const addTaskToBoard = async (req: Request, res: Response) => {
    const { boardID } = req.body;
    const { userID } = req.params;

    try {
        const taskData: Task = req.body;

        const { data: task, error } = await supabaseClient
            .from("tasks")
            .insert({ ...taskData, boardID, userID })
            .eq("board_id",boardID)

        if (error) {
            return res.status(500).json({ error: error.message })
        }

        res.status(201).json(task);
    } catch (err: any | unknown) {
        return res.status(400).json({ errors: err.errors })
    }
}


export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
    const { taskID, boardID } = req.body;
    const { user_id } = req.params; 

    try {
        const taskData: Partial<Task> = req.body;

        const { data: updatedTask, error } = await supabaseClient
            .from("tasks")
            .update(taskData)
            .eq("id", taskID)
            .eq("board_id", boardID)
            .eq("userId", user_id)

        if (error) {
            return res.status(404).json({ error: "Task not found or you don't have permission." })
        }

        res.json(updatedTask)
    } catch (err: any | unknown) {
        next(err)
    }
}