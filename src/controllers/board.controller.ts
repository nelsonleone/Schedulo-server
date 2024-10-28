import { Request, Response, NextFunction } from 'express';
import { createServerDbClient } from '../lib/supabaseClient';
import { HttpError } from '../utils/errors/httpError';
import expressAsyncHandler from 'express-async-handler';


export const getUserBoards = expressAsyncHandler(
  async (req: any, res: Response): Promise<void> => {
    const { user_id } = req.params;

    const supabaseClient = await createServerDbClient(req.authToken)

    const { data: boards, error } = await supabaseClient
    .from('boards')
    .select(`
      *,
      board_columns(
        *
      ),
      tasks(
        *,
        sub_tasks(*)
      )
    `)
    .eq('user_id', user_id)

    
    if (error) {
      throw new HttpError(400, 'Failed to fetch boards', error)
    }

    res.status(200).json(boards)
  }
)




export const createBoard = expressAsyncHandler(
  async (req: any, res: Response, next: NextFunction) : Promise<void> => {
    const { user_id, name, columns } = req.body;

    const supabaseClient = await createServerDbClient(req.authToken)

    const { data, error } = await supabaseClient
      .from('boards')
    .insert([{ user_id: user_id, name, columns }])
  
    if (error) {
      throw new HttpError(400, 'Failed to create board', error)
    }
  
    res.status(201).json(data)
  }
)





export const updateBoard = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {

  }
)



export const deleteBoard = expressAsyncHandler(
  async (req: any, res: Response) : Promise<any> => {
    
    const { user_id } = req.params;
    const { boardId } = req.body;

    if (user_id){
      return res.status(400).json({ error: "No user Id was provided" })
    }

    const supabaseClient = await createServerDbClient(req.authToken)

    const { error } = await supabaseClient
      .from("boards")
      .delete()
      .eq("id", boardId)
      .eq("userId", user_id ) 

    if (error) {
      return res.status(404).json({ error: "Board not found or you don't have permission." })
    }

    res.status(204).send()
  }
)
