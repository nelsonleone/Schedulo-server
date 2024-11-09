import { NextFunction, Router } from 'express';
import { createBoard, deleteBoard, getUserBoards, updateBoard } from '../controllers/board.controller';
import { validateSchema } from '../middlewares/validate_schema.middleware';
import { EditBoardSchema, NewBoardSchema } from '../interfaces/board.interface';
import { check_role } from '../middlewares/check_role.middleware';
import { EditTaskSchema, NewTaskSchema } from '../interfaces/task.interface';
import { addTaskToBoard, deleteTask, updateTask } from '../controllers/task.controller';

const router = Router()

router.get('/boards/:user_id', check_role , getUserBoards)

router.post("/boards/create/:user_id", check_role, validateSchema(NewBoardSchema), createBoard)
router.post("/tasks/create/:user_id", check_role, validateSchema(NewTaskSchema), addTaskToBoard)


router.patch("/boards/update/:user_id", check_role, validateSchema(EditBoardSchema), updateBoard)
router.patch("/tasks/update/:task_id", check_role, validateSchema(EditTaskSchema), updateTask)


router.delete("/tasks/delete/:task_id", check_role, deleteTask)
router.delete("/boards/delete/:user_id", check_role, deleteBoard)


export default router;
