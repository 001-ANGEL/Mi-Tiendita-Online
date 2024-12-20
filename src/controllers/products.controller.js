import { connectDB } from "../config/db.js";
import sql from "mssql";

//* -------------------getProducts
export const getProducts = async (req, res) => {
  try {
    //Traer la conexión de la base de datos
    const pool = await connectDB();

    //Consultas
    const result = await pool.request().query("SELECT * FROM Productos");
    res.json(result.recordset);
  } catch (error) {
    console.log("ERROR AL OBTENER LOS PRODUCTOS", error);
    res.statust(404).json({ message: "Error al obtener los productos" });
  }
};

//* ------------------getProduct
export const getProduct = async (req, res) => {
  try {
    const pool = await connectDB();
    const result = await pool
      .request()
      .input("idProducto", sql.Int, req.params.id)
      .query(`SELECT * FROM Productos WHERE idProducto = @idProducto`);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    return res.json(result.recordset[0]);
  } catch (error) {
    res.status(404).json({ message: "Error al obtener el producto" });
  }
};

//* ------------------createProduct
export const createProduct = async (req, res) => {
  try {
    const {
      nombre,
      marca,
      codigo,
      stock,
      precio,
      foto,
      descripcion,
      idEstado,
      idCategoria,
    } = req.body;

    if (
      !nombre ||
      !marca ||
      !codigo ||
      !stock ||
      !precio ||
      !idEstado ||
      !idCategoria
    ) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    // Validar que stock no sea negativo
    if (stock < 0) {
      return res
        .status(400)
        .json({ message: "El stock no puede ser negativo" });
    }

    // Validar que el precio no sea negativo
    if (precio < 0) {
      return res
        .status(400)
        .json({ message: "El precio no puede ser negativo" });
    }

    const pool = await connectDB();
    const result = await pool
      .request()
      .input("nombre", sql.VarChar, req.body.nombre)
      .input("marca", sql.VarChar, req.body.marca)
      .input("codigo", sql.VarChar, req.body.codigo)
      .input("stock", sql.Int, req.body.stock)
      .input("precio", sql.Decimal, req.body.precio)
      .input("fecha_creacion", sql.DateTime, new Date())
      .input("foto", sql.NVarChar, req.body.foto)
      .input("descripcion", sql.NVarChar, req.body.descripcion)
      .input("idEstado", sql.Int, req.body.idEstado)
      .input("idCategoria", sql.Int, req.body.idCategoria)
      .query(
        "INSERT INTO Productos (nombre, marca, codigo, stock, precio, fecha_creacion, foto, descripcion, idEstado, idCategoria) VALUES (@nombre, @marca, @codigo, @stock, @precio, @fecha_creacion, @foto, @descripcion, @idEstado, @idCategoria); SELECT SCOPE_IDENTITY() AS idProducto;"
      );

    console.log(result);

    res.json({
      id: result.recordset[0].idProducto,
      nombre: req.body.nombre,
      marca: req.body.marca,
      codigo: req.body.codigo,
      stock: req.body.stock,
      precio: req.body.precio,
      fecha_creacion: new Date(),
      foto: req.body.foto,
      descripcion: req.body.descripcion,
      idEstado: req.body.idEstado,
      idCategoria: req.body.idCategoria,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "Error al crear el producto" });
  }
};

//* ------------------updateProduct
export const updateProduct = async (req, res) => {
  try {
    const pool = await connectDB();

    const result = await pool
      .request()
      .input("nombre", sql.VarChar, req.body.nombre)
      .input("marca", sql.VarChar, req.body.marca)
      .input("codigo", sql.VarChar, req.body.codigo)
      .input("stock", sql.Int, req.body.stock)
      .input("precio", sql.Decimal, req.body.precio)
      .input("fecha_creacion", sql.DateTime, new Date())
      .input("foto", sql.NVarChar, req.body.foto)
      .input("descripcion", sql.NVarChar, req.body.descripcion)
      .input("idEstado", sql.Int, req.body.idEstado)
      .input("idCategoria", sql.Int, req.body.idCategoria)
      .query(
        `UPDATE Productos SET nombre = @nombre, marca = @marca, codigo = @codigo, stock = @stock, precio = @precio, fecha_creacion = @fecha_creacion, foto = @foto, descripcion = @descripcion, idEstado = @idEstado, idCategoria = @idCategoria WHERE idProducto = ${req.params.id};`
      );
    console.log(result);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      id: req.params.id,
      nombre: req.body.nombre,
      marca: req.body.marca,
      codigo: req.body.codigo,
      stock: req.body.stock,
      precio: req.body.precio,
      fecha_creacion: new Date(),
      foto: req.body.foto,
      descripcion: req.body.descripcion,
      idEstado: req.body.idEstado,
      idCategoria: req.body.idCategoria,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "Error al actualizar el producto" });
  }
};
