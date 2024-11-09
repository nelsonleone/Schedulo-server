import { NextFunction, Request, Response } from 'express';
import { EditTask, NewTask, Subtask, Task } from '../interfaces/task.interface';
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


export const updateTask = expressAsyncHandler(
    async (req: any, res: Response): Promise<any> => {
        const { board_id, is_completed, position, subtasks } = req.body;
        const { task_id } = req.params;

        try {
            const supabaseClient = await createServerDbClient(req.authToken)

            const { data: taskUpdateData, error: taskError } = await supabaseClient
                .from("tasks")
                .update({ board_id, is_completed, position })
                .eq("id", task_id)
                .select()

            if (taskError) {
                console.error("Task update error:", taskError)
                throw taskError;
            }


            if (subtasks) {
                for (const subtask of subtasks) {
                    const { id, is_completed } = subtask;

                    const { data: subtaskUpdateData, error: subtaskError } = await supabaseClient
                        .from("sub_tasks")
                        .update({ is_completed })
                        .eq("id", id)
                        .eq("task_id", task_id)
                        .select()

                    if (subtaskError) {
                        console.error(`Error updating subtask ID ${id}:`, subtaskError)
                        throw subtaskError;
                    }
                }
            }

            res.status(200).json({ message: "Task and subtasks updated successfully" })
        } catch (err: any) {
            console.error("Error in updateTask:", err)
            res.status(400).json({ error: "Failed to update task or subtasks" })
        }
    }
)



export const deleteTask = expressAsyncHandler(
    async (req: any, res: Response): Promise<any> => {
        const { task_id } = req.params;

        try {
            const supabaseClient = await createServerDbClient(req.authToken)

            const {  error: taskError } = await supabaseClient
                .from("tasks")
                .delete()
                .eq("id", task_id)
                .select()

            if (taskError) {
                console.error("Task update error:", taskError)
                throw taskError;
            }

            res.status(200).json({ message: "Task deleted successfully" })
        } catch (err: any) {
            console.error("Error in deleteTask:", err)
            res.status(400).json({ error: "Failed to delete" })
        }
    }
)