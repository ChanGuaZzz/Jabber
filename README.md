# Jabber

Jabber es una aplicación web para conectarse y chatear con personas de todo el mundo. Únete a una sala y comienza tu conversación global ahora.

## Instalación

### Backend

1. Clona el repositorio:
    ```sh
    git clone https://github.com/tu-usuario/jabber.git
    cd jabber/BackEnd
    ```

2. Instala las dependencias:
    ```sh
    ./install_dep.bat
    ```

3. Configura las variables de entorno en el archivo `.env`:
    ```env
    mysql_user=tu_usuario
    mysql_password=tu_contraseña
    mysql_host=localhost
    mysql_port=3306
    mysql_db=jabber
    origins=http://localhost:5173
    ```

4. Inicia el servidor:
    ```sh
    python src/app.py
    ```

### Frontend

1. Ve al directorio del frontend:
    ```sh
    cd ../FrontEnd
    ```

2. Instala las dependencias:
    ```sh
    npm install
    ```

3. Inicia la aplicación:
    ```sh
    npm run dev
    ```

## Uso

1. Abre tu navegador y ve a [https://jabberweb.onrender.com/login](https://jabberweb.onrender.com/login).
2. Regístrate o inicia sesión con tus credenciales.
3. Únete a una sala y comienza a chatear.

## Estructura del Proyecto
