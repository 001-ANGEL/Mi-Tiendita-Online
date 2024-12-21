import { Router } from "express";
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
} from "../controllers/users.controller.js";

const router = Router();

router.get("/api/usuarios", getUsers);

router.get("/api/usuarios/:id", getUser);

router.post("/api/usuarios", createUser);

router.put("/api/usuarios/:id", updateUser);

export default router;
