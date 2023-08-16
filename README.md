# basic-backend-project

## Pasos para Ejecutar la Aplicación Backend en MongoDB

### 1. Clona el repositorio

```sh-session
git clone <URL del repositorio>
cd basic-backend-project
```

### 2. Instala las dependencias
```sh-session
npm install
```

### 3. Configura las variables de entorno

Crea un archivo .env en la raíz del proyecto y configura las variables de entorno necesarias, como la cadena de conexión a la base de datos de MongoDB y otros valores sensibles.

```sh-session
MONGODB_URI=<cadena-de-conexión-a-tu-base-de-datos>
```

### 4. Inicia el servidor
```sh-session
npm start
```

### 5. Prueba la aplicación

Utiliza herramientas como Postman o cURL para enviar solicitudes HTTP a las rutas definidas en el servidor. Puedes probar los endpoints como "GET /users/all", "POST /branches", etc.

Recuerda adaptar las rutas y los nombres de las variables de acuerdo con tu implementación y requisitos específicos.

¡Listo! Ahora tienes la aplicación backend funcionando en tu entorno local.
