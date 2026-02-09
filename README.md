# spuff.xyz — Galería de diseños 3D

Web estática para exponer diseños 3D con contacto por WhatsApp para compra e impresión 3D bajo demanda.

**100% frontend:** HTML, CSS y JavaScript. Sin npm, sin build, sin backend.

## Contenido

- **Galería de diseños 3D** con estética oscura moderna
- **WhatsApp:** 623 963 086
- **Admin:** añadir proyectos, fotos y archivos

## Panel de administración

URL: `spuff.xyz/admin-panelx7k9m2p4q8r1s5t0u3v6w2y4z8a1b`

- Crear, editar y eliminar proyectos
- Imágenes: sube a [imgbb](https://imgbb.com), [imgur](https://imgur.com), etc. y pega la URL
- Archivos (STL): sube a Drive, Dropbox, etc. y pega la URL
- Los datos se guardan en `localStorage`
- Exportar/Importar JSON para respaldo

## Desplegar en GitHub Pages

1. Sube este repositorio a GitHub
2. **Settings → Pages**
3. Source: **Deploy from a branch**
4. Branch: `main`, carpeta: **/ (root)**
5. Guarda y espera el despliegue

Listo. No hace falta instalar nada.

## Estructura

```
index.html                              # Página principal
admin-panelx7k9m2p4q8r1s5t0u3v6w2y4z8a1b.html
css/style.css
js/app.js
js/admin.js
```
