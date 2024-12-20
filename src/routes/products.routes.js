import { Router } from "express";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
} from "../controllers/products.controller.js";

const router = Router();

router.get("/api/productos", getProducts);

router.get("/api/productos/:id", getProduct);

router.post("/api/productos", createProduct);

router.put("/api/productos/:id", updateProduct);


export default router;
