# Instrucciones de Instalación y Uso

## 📦 Instalación

### Paso 1: Instalar dependencias

Abre una terminal en el directorio del proyecto y ejecuta:

```bash
npm install
```

### Paso 2: Compilar la extensión

```bash
npm run compile
```

## 🚀 Probar la extensión

### Opción 1: Modo desarrollo (recomendado)

1. Abre el proyecto en Visual Studio Code
2. Presiona `F5` para iniciar una nueva ventana de VSCode con la extensión cargada
3. En la nueva ventana, abre el archivo `example.md` que se incluye
4. Presiona `Ctrl+Shift+V` para ver el preview en tema oscuro

### Opción 2: Instalar localmente

1. Compila la extensión:

   ```bash
   npm run compile
   ```

2. Crea el paquete VSIX (requiere vsce):

   ```bash
   npm install -g @vscode/vsce
   vsce package
   ```

3. Instala el archivo `.vsix` generado:
   - En VSCode, ve a Extensiones (`Ctrl+Shift+X`)
   - Haz clic en el menú de tres puntos (...)
   - Selecciona "Instalar desde VSIX..."
   - Selecciona el archivo `.vsix` generado

## 💡 Uso

1. **Abrir el preview:**

   - Abre cualquier archivo Markdown (`.md`)
   - Presiona `Ctrl+Shift+V` (o `Cmd+Shift+V` en Mac)
   - Se abrirá una pestaña con el preview en tema oscuro

2. **Actualizar el preview:**

   - ¡Los cambios se reflejan en tiempo real mientras escribes!
   - No necesitas guardar el archivo, el preview se actualiza automáticamente

3. **Usando la paleta de comandos:**
   - Presiona `Ctrl+Shift+P`
   - Escribe "Abrir Preview de Markdown (Tema Oscuro)"
   - Presiona Enter

## 🔧 Desarrollo

Para trabajar en la extensión:

```bash
# Modo watch (recompila automáticamente al guardar)
npm run watch
```

Luego presiona `F5` para iniciar el debug.

## 🐛 Solución de problemas

**Problema:** No se muestra el preview al presionar `Ctrl+Shift+V`

**Solución:** Asegúrate de que:

- El archivo actual es un archivo Markdown (`.md`)
- La extensión está compilada correctamente
- No hay errores en la consola de desarrollo

**Problema:** El preview no se actualiza al guardar

**Solución:**

- Guarda el archivo con `Ctrl+S`
- Si no funciona, cierra y vuelve a abrir el preview

## 📝 Estructura del proyecto

```
markdown-dark-previewer/
├── src/
│   ├── extension.ts          # Punto de entrada de la extensión
│   └── previewProvider.ts    # Lógica del preview y estilos
├── out/                       # Archivos compilados
├── .vscode/
│   ├── launch.json           # Configuración de debug
│   └── tasks.json            # Tareas de build
├── package.json              # Configuración de la extensión
├── tsconfig.json             # Configuración de TypeScript
├── example.md                # Archivo de ejemplo
└── README.md                 # Documentación
```
