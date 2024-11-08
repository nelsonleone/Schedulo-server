import { NextFunction, Request, Response } from 'express';
import { NewTask, Subtask, Task } from '../interfaces/task.interface';
import { createServerDbClient } from '../lib/supabaseClient';
import expressAsyncHandler from 'express-async-handler';



export const addTaskToBoard = expressAsyncHandler(
    async (req: any, res: Response) : Promise<any> => {
        const { board_id } = req.body;

        try {
            const reqData : NewTask = req.body;
    
            const { subtasks, ...rest } = reqData;

            console.log(reqData)
    
            const supabaseClient = await createServerDbClient(req.authToken)
    
            const { data: taskData, error: taskError } = await supabaseClient
            .from('tasks')
            .insert([{ board_id, is_completed: false, ...rest }])
            .select('id')
            .single()
    
          if (taskError) throw taskError;
    
          const task_id = taskData?.id;
    
          const subtasksData = subtasks?.map((subtask) => ({
            task_id,
            is_completed: false,
            title: subtask,
          }))
    
          const { error: columnsError } = await supabaseClient
            .from('sub_tasks')
            .insert(subtasksData)  
    
          if (columnsError) throw columnsError;
    
            res.status(201).json(taskData)
        } catch (err: any | unknown) {
            console.log(err)
            return res.status(400).json({ errors: err.errors })
        }
    }
)


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