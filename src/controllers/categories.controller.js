import { connectDB } from "../config/db.js";
import sql from "mssql";

//* -------------------getCategories
export const getCategories = async (res) => {
  try {
    const pool = await connectDB();
    const result = await pool
      .request()
      .query("SELECT * FROM categoriaProductos");
    res.json(result.recordset);
  } catch (error) {
    console.log("ERROR AL OBTENER LAS CATEGORIAS", error);
    res.status(404).json({ message: "Error al obtener las categorias" });
  }
};

//*-------------------getCategoryById

export const getCategoryById = async (req, res) => {
  try {
    const pool = await connectDB();
    const result = await pool
      .request()
      .input("idCategoria", sql.Int, req.params.id)
      .query(
        `SELECT * FROM categoriaProductos WHERE idCategoria = @idCategoria`
      );

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Categoria no encontrada" });
    }

    return res.json(result.recordset[0]);
  } catch (error) {
    console.log("ERROR AL OBTENER UNA CATEGORIA", error);
    res.status(404).json({ message: "Error al obtener la categoria" });
  }
};

//*-------------------createCategory

export const createCategory = async (req, res) => {

try {

    const {nombre, descripcion, idEstado} = req.body;

    if(!nombre || !descripcion || !idEstado){
        return res.status(400).json({message: 'Faltan campos por llenar'});
    }

    const pool = await connectDB();
    const result = await pool
    .request()
    .input('nombre', sql.VarChar, req.body.nombre)
    .input('descripcion', sql.VarChar, req.body.descripcion)
    .input('idEstado', sql.Int, req.body.idEstado)
    .input('fecha_creacion', sql.DateTime, new Date())
    .query('INSERT INTO categoriaProductos (nombre, descripcion, idEstado, fecha_creacion ) VALUES (@nombre, @descripcion, @idEstado, @fecha_creacion); SELECT SCOPE_IDENTITY() AS idCategoria;');

    res.json({
        id: result.recordset[0].idCategoria,
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        idEstado: req.body.idEstado,
        fecha_creacion: new Date()
    });
} catch (error) {
    console.log('ERROR AL CREAR UNA CATEGORIA', error);
    res.status(404).json({message: 'Error al crear la categoria'});
}

};

//*-------------------updateCategory
export const updateCategory = async (req, res) => {

try {
    const {nombre, descripcion, idEstado} = req.body;

    if(!nombre || !descripcion || !idEstado){
        return res.status(400).json({message: 'Faltan campos por llenar'});
    }
  
    const pool = await connectDB();
    const result = await pool
    .request()
    .input('nombre', sql.VarChar, req.body.nombre)
    .input('descripcion', sql.VarChar, req.body.descripcion)
    .input('idEstado', sql.Int, req.body.idEstado)
    .input('fecha_actualizacion', sql.DateTime, new Date())
    .input('idCategoria', sql.Int, req.params.id)
    .query('UPDATE categoriaProductos SET nombre = @nombre, descripcion = @descripcion, idEstado = @idEstado, fecha_actualizacion = @fecha_actualizacion WHERE idCategoria = @idCategoria; SELECT SCOPE_IDENTITY() AS idCategoria;'); ;
  

    if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }

    res.json({
        id: req.params.id,
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        idEstado: req.body.idEstado,
        fecha_actualizacion: new Date()
    });
} catch (error) {
    console.log('ERROR AL ACTUALIZAR UNA CATEGORIA', error);
    res.status(404).json({message: 'Error al actualizar la categoria'});
}
};
