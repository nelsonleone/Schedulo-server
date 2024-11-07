import { Request, Response, NextFunction } from 'express';
import { createServerDbClient } from '../lib/supabaseClient';
import { HttpError } from '../utils/errors/httpError';
import expressAsyncHandler from 'express-async-handler';


export const getUserBoards = expressAsyncHandler(
  async (req: any, res: Response): Promise<void> => {
    const { user_id } = req.params;
    
    const supabaseClient = await createServerDbClient(req.authToken)

    const { data: boardsData, error } = await supabaseClient
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

    console.log(boardsData)
    res.status(200).json(boardsData)
  }
)




export const createBoard = expressAsyncHandler(
  async (req: any, res: Response, next: NextFunction): Promise<void> => {
    const { name, columns } = req.body;
    const { user_id } = req.params;

    const supabaseClient = await createServerDbClient(req.authToken);

    try {
      const { data: boardData, error: boardError } = await supabaseClient
        .from('boards')
        .insert([{ user_id, name }])
        .select('id')
        .single()

      if (boardError) throw boardError;

      const boardId = boardData?.id;

      const columnsData = columns.map((column: string, index: number) => ({
        board_id: boardId,
        name: column,
        position: index,
      }))

      const { error: columnsError } = await supabaseClient
        .from('board_columns')
        .insert(columnsData)

      if (columnsError) throw columnsError;

      res.status(201).json({ board: boardData, columns: columnsData })
    } catch (error) {
      console.log(error)
      next(error)
    }
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
