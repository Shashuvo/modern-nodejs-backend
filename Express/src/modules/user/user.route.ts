import { Router } from "express";
import { userController } from "./user.controller";

const router = Router();

// POST a user
router.post("/", userController.createUser);

// GET all users
router.get("/", userController.getAllUser);

// GET a single user
router.get("/:id", userController.getSingleUser);

// Update a user
router.put("/:id", userController.updateUser);

// DELEtE method
router.delete("/:id", userController.deleteUser);

export const userRouter = router;