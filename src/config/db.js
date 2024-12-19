import sql from "mssql";
import dotenv from "dotenv";

dotenv.config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

//Conexion a la base de datos
export async function connectDB() {
  try {
    const pool = await sql.connect(config);
    console.log("Base de datos conectado exitosamente");
    return pool;
  } catch (error) {
    console.log("ERROR EN LA CONEXION", error);
  }
}
