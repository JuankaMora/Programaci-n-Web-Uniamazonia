# Entregable API REST - Rick and Morty

Aplicacion web desarrollada con React y Vite que consume la API publica de Rick and Morty para visualizar personajes de la serie. La aplicacion implementa navegacion con React Router y permite filtrar personajes por especie.

## Funcionalidades

- Consulta de personajes desde la API publica de Rick and Morty.
- Visualizacion de personajes en tarjetas.
- Cada tarjeta muestra imagen, nombre, especie, estado y genero.
- Navegacion entre vistas usando `react-router-dom`.
- Vista de todos los personajes.
- Vista para filtrar personajes por especie.
- Manejo basico de estados de carga y errores.
- Interfaz responsiva para computador, tablet y movil.

## Tecnologias utilizadas

- React
- Vite
- JavaScript ES6+
- React Router DOM
- CSS
- Fetch API

## API utilizada

Endpoint principal:

```txt
https://rickandmortyapi.com/api/character
```

Ejemplo de filtro por especie:

```txt
https://rickandmortyapi.com/api/character?species=Human
```

## Rutas de la aplicacion

```txt
/                         Inicio / Todos los personajes
/filtrar-especie          Vista de filtrado por especie
/filtrar-especie/:species Personajes filtrados por especie
/404                      Pagina de error
```

## Instalacion

Clonar el repositorio:

```bash
git clone URL_DEL_REPOSITORIO
```

Entrar a la carpeta del proyecto:

```bash
cd Entregable2_JuanMora
```

Instalar dependencias:

```bash
npm install
```

## Ejecucion en desarrollo

```bash
npm run dev
```

Abrir en el navegador:

```txt
http://localhost:5173
```

## Compilar para produccion

```bash
npm run build
```

El proyecto compilado se genera en la carpeta:

```txt
dist
```

## Vista previa de produccion

```bash
npm run preview
```

## Deploy

El proyecto puede desplegarse en Vercel estandar de Vite:

```txt
Build command: npm run build
Output directory: dist
```

URL del deploy:

```txt
https://programaci-n-web-uniamazonia.vercel.app
```

## Autor

Juan Carlos Mora Rojas
