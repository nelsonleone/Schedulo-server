import z from "zod";


export const SubtaskSchema = z.object({
    id: z.string(),
    title: z.string(),
    isCompleted: z.boolean(),
})

export type Subtask = z.infer<typeof SubtaskSchema>;

export const TaskSchema = z.object({
    id: z.string(),
    boardId: z.string(),
    userId: z.string(),
    title: z.string(),
    description: z.string().optional(),
    position: z.number(),
    dueDate: z.date().optional(),
    subtasks: z.array(SubtaskSchema).optional(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
})

export type Task = z.infer<typeof TaskSchema>;
