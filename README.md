# Mi-Tiendita-Online
Proyecto para una tiendita online usando NodeJs, React y Sql server

## Configuración

Este proyecto utiliza variables de entorno para conectarse a la base de datos SQL Server. Para configurar tu entorno local, sigue estos pasos:

1. Crea un archivo `.env` en la raíz del proyecto.
2. Copia las siguientes variables al archivo `.env`:

```plaintext
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_SERVER=localhost
DB_DATABASE=nombre_base_de_datos