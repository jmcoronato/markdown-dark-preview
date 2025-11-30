# Markdown Dark Previewer

Una extensión de Visual Studio Code para previsualizar archivos Markdown con un hermoso tema oscuro al estilo GitHub.

## Características

- 🌙 **Tema oscuro elegante** al estilo GitHub
- ⚡ **Actualización en vivo** - Los cambios se reflejan mientras escribes, sin guardar
- 🎨 **Syntax highlighting** completo para bloques de código con colores GitHub Dark
- ✅ **Checkboxes** renderizados correctamente con estilo nativo
- ⌨️ **Atajo de teclado** intuitivo: `Ctrl+Shift+V` (o `Cmd+Shift+V` en Mac)
- 📝 **Soporte completo de Markdown** incluyendo tablas, código, listas, imágenes y más
- 🎨 **Renderizado profesional** con la misma apariencia que GitHub

## Uso

1. Abre un archivo Markdown (`.md`) en el editor
2. Presiona `Ctrl+Shift+V` (Windows/Linux) o `Cmd+Shift+V` (Mac)
3. Se abrirá una nueva pestaña con el preview en tema oscuro
4. ¡Edita tu archivo y los cambios se verán en tiempo real automáticamente!

También puedes usar el comando desde la paleta de comandos:

- Presiona `Ctrl+Shift+P` (o `Cmd+Shift+P` en Mac)
- Escribe "Abrir Preview de Markdown (Tema Oscuro)"
- Presiona Enter

## Instalación

### Desde el marketplace de VSCode

1. Abre Visual Studio Code
2. Ve a la vista de extensiones (`Ctrl+Shift+X`)
3. Busca "Markdown Dark Previewer"
4. Haz clic en "Instalar"

### Instalación manual

1. Clona este repositorio
2. Ejecuta `npm install` para instalar las dependencias
3. Ejecuta `npm run compile` para compilar el código TypeScript
4. Presiona `F5` para abrir una nueva ventana de VSCode con la extensión cargada

## Desarrollo

```bash
# Instalar dependencias
npm install

# Compilar el código
npm run compile

# Modo watch para desarrollo
npm run watch
```

## Requisitos

- Visual Studio Code 1.80.0 o superior

## Características de Markdown soportadas

- Encabezados (H1-H6)
- Negrita y cursiva
- Listas ordenadas y desordenadas
- Checkboxes (task lists) con rendering nativo
- Enlaces e imágenes
- Bloques de código con **syntax highlighting** completo
  - JavaScript, TypeScript, Python, Java, C++, C#, Go, Rust, PHP, Ruby, y muchos más
- Código inline
- Blockquotes
- Tablas
- Líneas horizontales
- Strikethrough

### Syntax Highlighting

El preview incluye syntax highlighting completo usando el tema **GitHub Dark**, con soporte para más de 190 lenguajes de programación incluyendo:

- JavaScript / TypeScript
- Python
- Java / C++ / C# / Go / Rust
- HTML / CSS / SCSS
- JSON / YAML / XML
- Bash / PowerShell
- SQL
- Y muchos más...

## Créditos

Estilos inspirados en el tema oscuro de GitHub.

## Licencia

MIT
