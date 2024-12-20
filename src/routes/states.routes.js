import { Router } from "express";
import {
  getStates,
  getStatus,
  createStatus,
  updateStatus,
} from "../controllers/status.controller.js";

const router = Router();

router.get("/api/estados", getStates);

router.get("/api/estados/:id", getStatus);

router.post("/api/estados", createStatus);

router.put("/api/estados/:id", updateStatus);

export default router;
