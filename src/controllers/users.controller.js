import { connectDB } from "../config/db.js";
import sql from "mssql";
import bcrypt from "bcryptjs";
import dayjs from "dayjs";

//* Funciones

const validateFields = (req, res) => {
  const {
    nombre_completo,
    correo_electronico,
    contrasena,
    fecha_nacimiento,
    idRol,
    idEstado,
  } = req.body;

  if (
    !nombre_completo ||
    !correo_electronico ||
    !contrasena ||
    !fecha_nacimiento ||
    !idRol ||
    !idEstado
  ) {
    return res.status(400).json({ message: "Faltan campos por llenar" });
  }

  if (typeof idRol !== "number" || typeof idEstado !== "number") {
    return res.status(400).json({ message: "Los campos no son validos" });
  }
};

const validateEmail = async (correo_electronico) => {
  try {
    //Verificar si el correo ya esta registrado
    const pool = await connectDB();
    const checkEmail = await pool
      .request()
      .input("correo_electronico", sql.NVarChar, correo_electronico)
      .query(
        "SELECT * FROM Usuarios WHERE correo_electronico = @correo_electronico"
      );

    if (checkEmail.recordset.length > 0) {
      return { status: 400, message: "El correo ya está registrado" };
    }

    return null;
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al validar el correo" });
  }
};

const bcryptPassword = (password) => {
  try {
    const salt = 10;
    return bcrypt.hash(password, salt);
  } catch (error) {
    console.log(error);
  }
};

// const formatDate = () => {

// };

//* CRUD

export const getUsers = async (req, res) => {
  try {
    const pool = await connectDB();
    const result = await pool.request().query("SELECT * FROM Usuarios");
    res.json(result.recordset);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "No se puede obtener los usuarios" });
  }
};

export const getUser = async (req, res) => {
  try {
    const pool = await connectDB();
    const result = await pool
      .request()
      .input("idUsuario", sql.Int, req.params.id)
      .query("SELECT * FROM Usuarios WHERE idUsuario = @idUsuario");

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "No se puede obtener el usuario" });
  }
};

export const createUser = async (req, res) => {
  try {
    const validation = validateFields(req, res);
    if (validation) {
      res.status(validation.status).json({ message: validation.message });
    }

    const { correo_electronico, contrasena } = req.body;

    //Conexion a la base de datos
    const pool = await connectDB();

    const emailValidation = await validateEmail(correo_electronico);
    if (emailValidation) {
      return res
        .status(emailValidation.status)
        .json({ message: emailValidation.message });
    }

    //Hashear contrasena
    const hashPassword = await bcryptPassword(contrasena);

    //Formateear fecha de nacimiento
    const fecha_nacimiento = dayjs(req.body.fecha_nacimiento);
    if (!fecha_nacimiento.isValid()) {
      return res.status(400).json({ message: "Fecha de nacimiento invalida" });
    }

    //Cambiar el fomato si es necesario
    const formattedDate = fecha_nacimiento.format("YYYY-MM-DD");

    //Agregar usuario a la base de datos
    const result = await pool
      .request()
      .input("nombre_completo", sql.NVarChar, req.body.nombre_completo)
      .input("correo_electronico", sql.NVarChar, correo_electronico)
      .input("contrasena", sql.NVarChar, hashPassword)
      .input("fecha_nacimiento", sql.Date, formattedDate)
      .input("fecha_creacion", sql.Date, new Date())
      .input("idRol", sql.Int, req.body.idRol)
      .input("idEstado", sql.Int, req.body.idEstado)
      .query(
        "INSERT INTO Usuarios (nombre_completo, correo_electronico, contrasena, fecha_nacimiento, fecha_creacion, idRol, idEstado) VALUES (@nombre_completo, @correo_electronico, @contrasena, @fecha_nacimiento, @fecha_creacion, @idRol, @idEstado); SELECT SCOPE_IDENTITY() AS idUsuario"
      );

    // Obtener el nuevo usuario con las fechas formateadas para devolverlas
    const newUser = {
      idUsuario: result.recordset[0].idUsuario,
      nombre_completo: req.body.nombre_completo,
      correo_electronico: correo_electronico,
      contrasena: hashPassword,
      fecha_nacimiento: fecha_nacimiento.format("DD-MM-YYYY"),
      fecha_creacion: dayjs().format("DD-MM-YYYY"),
      idRol: req.body.idRol,
      idEstado: req.body.idEstado,
    };

    //Respuesta con el nuevo usuario
    res.json(newUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "No se puede crear el usuario" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const validation = validateFields(req, res);
    if (validation) {
      return res
        .status(validation.status)
        .json({ message: validation.message });
    }

    const pool = await connectDB();

    const currentUser = await pool
    .request()
    .input("idUsuario", sql.Int, req.params.id)
    .query("SELECT correo_electronico, contrasena FROM Usuarios WHERE idUsuario = @idUsuario");

  if (currentUser.recordset.length === 0) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }

  const { correo_electronico: currentEmail } = currentUser.recordset[0];

  // Validar si el correo fue cambiado
  if (req.body.correo_electronico !== currentEmail) {
    const emailExists = await pool
      .request()
      .input("correo_electronico", sql.NVarChar, req.body.correo_electronico)
      .query("SELECT idUsuario FROM Usuarios WHERE correo_electronico = @correo_electronico");

    if (emailExists.recordset.length > 0) {
      return res.status(400).json({ message: "El correo ya está en uso por otro usuario" });
    }
  }


    // Obtener la contrasena actual para verificar si la contraseña cambio
    const currentPassword = await pool
      .request()
      .input("idUsuario", sql.Int, req.params.id)
      .query("SELECT contrasena FROM Usuarios WHERE idUsuario = @idUsuario");

    if (currentPassword.recordset.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Comprobar si la contraseña debe hashearse
    let contrasenaAlmacenar = req.body.contrasena;
    if (req.body.contrasena !== currentPassword.recordset[0].contrasena) {
      contrasenaAlmacenar = await bcryptPassword(req.body.contrasena);
    }


    const result = await pool
      .request()
      .input("nombre_completo", sql.NVarChar, req.body.nombre_completo)
      .input("correo_electronico", sql.NVarChar, req.body.correo_electronico)
      .input("contrasena", sql.NVarChar, contrasenaAlmacenar)
      .input("fecha_nacimiento", sql.Date, req.body.fecha_nacimiento)
      .input("idRol", sql.Int, req.body.idRol)
      .input("idEstado", sql.Int, req.body.idEstado)
      .input("fecha_actualizacion", sql.Date, new Date())
      .input("idUsuario", sql.Int, req.params.id)
      .query(
        "UPDATE Usuarios SET nombre_completo = @nombre_completo, correo_electronico = @correo_electronico, contrasena = @contrasena, fecha_nacimiento = @fecha_nacimiento, fecha_actualizacion = @fecha_actualizacion, idRol = @idRol, idEstado = @idEstado WHERE idUsuario = @idUsuario"
      );

    //Devolver la contrasena hasheado
    const updateUser = {
      idUsuario: req.params.id,
      nombre_completo: req.body.nombre_completo,
      correo_electronico: req.body.correo_electronico,
      contrasena: req.body.contrasena,
      fecha_nacimiento: dayjs(req.body.fecha_nacimiento).format("DD-MM-YYYY"),
      fecha_creacion: dayjs().format("DD-MM-YYYY"),
      idRol: req.body.idRol,
      idEstado: req.body.idEstado,
    };

    //Respuesta con el usuario actualizado
    res.json(updateUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "No se pudo actualizar el usuario" });
  }
};
