import { Request, Response, NextFunction } from 'express';
import { createServerDbClient } from '../lib/supabaseClient';
import { HttpError } from '../utils/errors/httpError';
import expressAsyncHandler from 'express-async-handler';
import { Board, Board_Column } from '../interfaces/board.interface';


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
    res.status(200).json(boardsData)
  }
)




export const createBoard = expressAsyncHandler(
  async (req: any, res: Response, next: NextFunction): Promise<void> => {
    const { name, columns } = req.body;
    const { user_id } = req.params;

    const supabaseClient = await createServerDbClient(req.authToken)

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
  async (req: any, res: Response, next: NextFunction): Promise<void> => {
    const { board_id, columns, name } = req.body;
    const { user_id } = req.params;
  
    try {

      const supabaseClient = await createServerDbClient(req.authToken)

      const { data: boardData, error: boardError } = await supabaseClient
      .from('boards')
      .update({ name })
      .eq('id', board_id)
      .eq('user_id', user_id)
      .select('id')
      .single()

      if (boardError) throw boardError;
  
      const existingColumns = columns.filter((column: Board_Column) => column.id.trim())
      const newColumns = columns.filter((column: Board_Column) => !column.id.trim())


      // Update existing columns
      for (const column of existingColumns) {
          const { id, name } = column;
          const { error: updateError } = await supabaseClient
              .from('board_columns')
              .update({ name })
              .eq('id', id)
              .eq('board_id', board_id)
  
          if (updateError) throw updateError;
      }
  
      // Insert new columns
      if (newColumns.length > 0) {
        const columnsToInsert = newColumns.map((column: Board_Column) => ({
          name: column.name,
          position: column.position,
          board_id,
        }))
  
        const { error: insertError } = await supabaseClient
          .from('board_columns')
          .insert(columnsToInsert)
  
        if (insertError) throw insertError;
      }


      const existingColumnIds = existingColumns.map((column: Board_Column) => column.id)

      console.log(existingColumnIds)

      const { error: deleteError } = await supabaseClient
        .from('board_columns')
        .delete()
        .eq('board_id', board_id)
        .not('id', 'in', `(${existingColumnIds.join(",")})`)

      if (deleteError) throw deleteError;
  
      res.status(200).json({ message: "Board columns updated successfully" })
    }
    catch (err) {
      console.error("Error updating board columns:", err)
      res.status(500).json({ error: "Failed to update board columns" })
    }
  }
)



export const deleteBoard = expressAsyncHandler(
  async (req: any, res: Response) : Promise<any> => {
    
    const { user_id } = req.params;
    const { board_id } = req.query;

    if (!user_id){
      return res.status(400).json({ error: "No user Id was provided" })
    }
    if (!board_id){
      return res.status(400).json({ error: "No board Id was provided in query" })
    }

    const supabaseClient = await createServerDbClient(req.authToken)

    const { error } = await supabaseClient
      .from("boards")
      .delete()
      .eq("id", board_id)
      .eq("user_id", user_id ) 

    if (error) {
      console.log(error)
      return res.status(404).json({ error: "Board not found or you don't have permission." })
    }

    res.status(201).send()
  }
)
