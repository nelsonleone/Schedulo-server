import z from "zod";


export const SubtaskSchema = z.object({
    id: z.string(),
    title: z.string(),
    is_completed: z.boolean(),
})

export type Subtask = z.infer<typeof SubtaskSchema>;

export const TaskSchema = z.object({
    id: z.string(),
    board_id: z.string(),
    title: z.string(),
    description: z.string().optional(),
    position: z.number(),
    due_date: z.string().optional(),
    subtasks: z.array(SubtaskSchema).optional(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
})

export const NewTaskSchema = z.object({
    title: z.string(),
    description: z.string().optional(),
    position: z.number(),
    due_date: z.string().optional(),
    subtasks: z.array(z.string()).optional(),
})

export type Task = z.infer<typeof TaskSchema>;
export type NewTask = z.infer<typeof NewTaskSchema>;
