import { Router } from "express";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
} from "../controllers/products.controller.js";

const router = Router();

router.get("/productos", getProducts);

router.get("/productos/:id", getProduct);

router.post("/productos", createProduct);

router.put("/productos/:id", updateProduct);


export default router;
