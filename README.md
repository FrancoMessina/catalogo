# Anime Figures Store - Catálogo Online

Catálogo web responsive para figuras coleccionables de anime. Los clientes pueden ver los productos y contactarte directamente por WhatsApp.

## Características

- Diseño moderno con estética anime (colores vibrantes, gradientes, animaciones)
- Totalmente responsive (móvil, tablet, desktop)
- Botón de contacto por WhatsApp con mensaje predefinido
- Fácil de agregar y modificar productos
- Sin dependencias externas (HTML, CSS y JavaScript vanilla)
- Preparado para desplegar en GitHub Pages

## Estructura del Proyecto

```
anime-catalog/
├── index.html          # Página principal
├── css/
│   └── styles.css      # Estilos con tema anime
├── js/
│   └── app.js          # Lógica de la aplicación
├── data/
│   └── products.json   # Base de datos de productos
├── images/
│   └── products/       # Imágenes de tus figuras
└── README.md           # Este archivo
```

## Configuración Inicial

### 1. Configurar tu número de WhatsApp

Edita el archivo `data/products.json` y cambia el número de WhatsApp en la sección `config`:

```json
{
  "config": {
    "storeName": "Tu Nombre de Tienda",
    "whatsapp": "5491123456789",  // Tu número con código de país
    "currency": "ARS"
  }
}
```

**Formato del número:** Código de país + número sin espacios ni guiones
- Argentina: `5491123456789`
- México: `521234567890`
- Chile: `56912345678`

### 2. Agregar tus productos

En el mismo archivo `data/products.json`, agrega tus productos en el array `products`:

```json
{
  "id": 1,
  "name": "Nombre del Producto - Serie",
  "price": 45000,
  "currency": "ARS",
  "image": "images/products/mi-figura.jpg",
  "category": "figuras",
  "available": true
}
```

**Campos:**
- `id`: Número único para cada producto
- `name`: Nombre completo del producto
- `price`: Precio (solo número, sin símbolos)
- `currency`: Moneda (ARS, USD, etc.)
- `image`: Ruta a la imagen del producto
- `category`: Categoría (para futuro filtrado)
- `available`: `true` si está disponible, `false` si está agotado

### 3. Agregar imágenes de productos

Coloca las imágenes de tus productos en la carpeta `images/products/`.

**Recomendaciones:**
- Formato: JPG o PNG
- Tamaño recomendado: 400x400px o 600x600px
- Imágenes cuadradas para mejor visualización
- Nombres sin espacios: `goku-ultra-instinct.jpg`

## Despliegue en GitHub Pages

### Paso 1: Crear repositorio

1. Ve a [github.com](https://github.com) y crea una cuenta si no tienes
2. Crea un nuevo repositorio (ej: `anime-catalog`)
3. No marques "Initialize with README"

### Paso 2: Subir archivos

Desde la terminal (Git Bash en Windows):

```bash
cd anime-catalog
git init
git add .
git commit -m "Initial commit - Catálogo de figuras anime"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/anime-catalog.git
git push -u origin main
```

### Paso 3: Activar GitHub Pages

1. Ve a tu repositorio en GitHub
2. Settings → Pages
3. Source: selecciona "main" branch
4. Guarda los cambios

Tu sitio estará disponible en: `https://TU_USUARIO.github.io/anime-catalog`

## Personalización

### Cambiar colores

En `css/styles.css`, modifica las variables CSS al inicio del archivo:

```css
:root {
    --primary: #8b5cf6;        /* Color principal (púrpura) */
    --secondary: #ec4899;      /* Color secundario (rosa) */
    --bg-dark: #0f0f1a;        /* Fondo oscuro */
    --bg-card: #1a1a2e;        /* Fondo de tarjetas */
}
```

### Cambiar nombre de la tienda

1. En `data/products.json`: modifica `config.storeName`
2. En `index.html`: cambia el texto en el logo y el `<title>`

## Escalabilidad Futura

El catálogo está preparado para agregar:

- **Nuevas categorías**: Solo agrega categorías en el JSON y descomenta los links en el nav
- **Búsqueda**: Puedes agregar un input que filtre productos por nombre
- **Ordenamiento**: Botones para ordenar por precio o nombre
- **Más páginas**: Páginas de detalle de producto, sobre nosotros, etc.

## Soporte

Si tienes dudas o problemas, contáctame por WhatsApp o abre un issue en GitHub.

---

Hecho con ❤️ para emprendedores de anime
