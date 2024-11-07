import { z } from 'zod';


export const BoardSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  columns: z.array(z.string()),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
})

export const NewBoardSchema = z.object({
  name: z.string(),
  columns: z.array(z.string()),
})

export type Board = z.infer<typeof BoardSchema>

export const BoardColumnSchema = z.object({
  id: z.string(),
  boardId: z.string(),
  name: z.string(),
  position: z.number(),
  created_at: z.string().optional(),
})

export type Board_Column = z.infer<typeof BoardColumnSchema>
