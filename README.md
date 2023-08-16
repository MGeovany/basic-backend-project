# basic-backend-project

## Pasos para Ejecutar la Aplicación Backend en MongoDB


### 2. Instala las dependencias
```sh-session
npm install
```

### 3. Configura las variables de entorno

Crea un archivo .env en la raíz del proyecto y configura las variables de entorno necesarias, como la cadena de conexión a la base de datos de MongoDB y otros valores sensibles.

```sh-session
MONGODB_URI=mongodb+srv://tuUsuario:tuContrasena@mongocluster.tb6hfxj.mongodb.net/nombreBasedeDatos?retryWrites=true&w=majority

```

### 4. Inicia el servidor
```sh-session
npm start
```

### 5. Prueba la aplicación

Utiliza herramientas como Postman o cURL para enviar solicitudes HTTP a las rutas definidas en el servidor. Puedes probar los endpoints como "GET /users/all", "POST /branches", etc.

Recuerda adaptar las rutas y los nombres de las variables de acuerdo con tu implementación y requisitos específicos.

¡Listo! Ahora tienes la aplicación backend funcionando en tu entorno local.

[![Run in Postman](https://run.pstmn.io/button.svg)](https://god.gw.postman.com/run-collection/20768145-75d605bc-a105-4c01-aea1-98f8a1031578?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D20768145-75d605bc-a105-4c01-aea1-98f8a1031578%26entityType%3Dcollection%26workspaceId%3D542a7199-4150-4dff-9503-f07a302e32a5)
