import { NextFunction, Router } from 'express';
import { createBoard, getUserBoards, updateBoard } from '../controllers/board.controller';
import { validateSchema } from '../middlewares/validate_schema.middleware';
import { NewBoardSchema } from '../interfaces/board.interface';
import { check_role } from '../middlewares/check_role.middleware';
import { EditTaskSchema, NewTaskSchema } from '../interfaces/task.interface';
import { addTaskToBoard, updateTask } from '../controllers/task.controller';

const router = Router()

router.get('/boards/:user_id', check_role , getUserBoards)

router.post("/boards/create/:user_id", check_role, validateSchema(NewBoardSchema), createBoard)
router.post("/tasks/create/:user_id", check_role, validateSchema(NewTaskSchema), addTaskToBoard)


router.patch("/")
router.patch("/boards/update/:user_id",updateBoard)
router.patch("/tasks/update/:task_id", check_role, validateSchema(EditTaskSchema), updateTask)


export default router;
