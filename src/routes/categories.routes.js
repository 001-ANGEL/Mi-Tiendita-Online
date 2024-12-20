import { Router } from "express";
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
} from "../controllers/categories.controller.js";

const router = Router();

router.get("/api/categorias", getCategories);

router.get("/api/categorias/:id", getCategoryById);

router.post("/api/categorias", createCategory);

router.put("/api/categorias/:id", updateCategory);

export default router;
