import { connectDB } from "../config/db.js";
import sql from "mssql";

const validateStatusFields = (req, res) => {
  const { nombre_estado, descripcion } = req.body;
  if (!nombre_estado || !descripcion) {
    return res.status(400).json({ message: "Faltan campos por llenar" });
  }
};

export const getStates = async (req, res) => {
  try {
    const pool = await connectDB();
    const result = await pool.request().query("SELECT * FROM Estados");
    return res.json(result.recordset[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al obtener los estados" });
  }
};

export const getStatus = async (req, res) => {
  try {
    const pool = await connectDB();
    const result = await pool
      .request()
      .input("idEstado", sql.Int, req.params.id)
      .query("SELECT * FROM Estados WHERE idEstado = @idEstado");

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Estado no encontrado" });
    }
    res.json(result.recordset[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al obtener el estado" });
  }
};

export const createStatus = async (req, res) => {
  try {
    const validate = validateStatusFields(req, res);
    if (validate) {
      return { status: 400, message: "Faltan campos por llenar" };
    }

    const pool = await connectDB();
    const result = await pool
      .request()
      .input("nombre_estado", sql.VarChar, req.body.nombre_estado)
      .input("descripcion", sql.VarChar, req.body.descripcion)
      .query(
        "INSERT INTO Estados (nombre_estado, descripcion) VALUES (@nombre_estado, @descripcion); SELECT SCOPE_IDENTITY() AS idEstado;"
      );
    res.json({
      id: result.recordset[0].idEstado,
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al crear el estado" });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const validate = validateStatusFields(req, res);
    if (validate) {
      return { status: 400, message: "Faltan campos por llenar" };
    }
    const pool = await connectDB();
    const result = await pool
      .request()
      .input("nombre_estado", sql.VarChar, req.body.nombre_estado)
      .input("descripcion", sql.VarChar, req.body.descripcion)
      .input("idEstado", sql.Int, req.params.id)
      .query(
        "UPDATE Estados SET nombre_estado = @nombre_estado, descripcion = @descripcion WHERE idEstado = @idEstado"
      );

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "Estado no encontrado" });
    }

    res.json({
      id: req.params.id,
      nombre_estado: req.body.nombre_estado,
      descripcion: req.body.descripcion,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al actualizar el estado" });
  }
};
