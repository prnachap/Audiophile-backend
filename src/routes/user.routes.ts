import express from 'express';
import { createUserHandler } from '../contoller/user.controller';
import { validateResource } from '../middleware/validateResource';
import { createUserSchema } from '../schema/user.schema';

const userRouter = express.Router();

userRouter.post('/register', validateResource(createUserSchema), createUserHandler);

export default userRouter;
