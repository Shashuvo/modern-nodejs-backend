import { Router } from "express";
import { userController } from "./user.controller";

const router = Router();

// POST a user
router.post("/", userController.createUser)

export const userRouter = router;