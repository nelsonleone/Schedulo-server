import { NextFunction, Request, Response } from 'express';
import { BoardSchema } from '../interfaces/board.interface';
import { HttpError } from '../utils/errors/httpError';
import asyncHandler from "express-async-handler"
import { Subtask, Task } from '../interfaces/task.interface';
import { createServerDbClient } from '../lib/supabaseClient';



export const addTaskToBoard = async (req: any, res: Response) => {
    const { boardID } = req.body;
    const { user_id } = req.params;

    try {
        const reqData : Task = req.body;

        const { subtasks, ...rest } = reqData;

        const supabaseClient = await createServerDbClient(req.authToken)

        const { data: taskData, error: taskError } = await supabaseClient
        .from('tasks')
        .insert([{ user_id, board_id: boardID, ...rest }])
        .select('id')
        .single()

      if (taskError) throw taskError;

      const task_id = taskData?.id;

      const subtasksData = subtasks?.map((subtask: Subtask) => ({
        task_id,
        is_completed: subtask.is_completed,
        title: subtask.title,
      }))

      const { error: columnsError } = await supabaseClient
        .from('sub_tasks')
        .insert(subtasksData)

      if (columnsError) throw columnsError;

        res.status(201).json(taskData)
    } catch (err: any | unknown) {
        return res.status(400).json({ errors: err.errors })
    }
}


export const updateTask = async (req: any, res: Response, next: NextFunction) => {
    const { taskID, boardID } = req.body;
    const { user_id } = req.params; 

    try {
        const taskData: Partial<Task> = req.body;

        const supabaseClient = await createServerDbClient(req.authToken)

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