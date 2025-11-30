# 🚀 Guía Rápida - Markdown Dark Previewer

## Instalación en 3 pasos

1. **Instalar dependencias:**

   ```bash
   npm install
   ```

2. **Compilar el proyecto:**

   ```bash
   npm run compile
   ```

3. **Probar la extensión:**
   - Presiona `F5` en VSCode
   - Se abrirá una nueva ventana con la extensión cargada
   - Abre el archivo `example.md`
   - Presiona `Ctrl+Shift+V` para ver el preview

## ✨ Nuevas Características

### 🎨 Syntax Highlighting

Todos los bloques de código ahora tienen colores de syntax highlighting con el tema GitHub Dark. Prueba con diferentes lenguajes:

```javascript
const ejemplo = "JavaScript";
```

```python
ejemplo = "Python"
```

```typescript
const ejemplo: string = "TypeScript";
```

### ✅ Checkboxes

Las listas de tareas se renderizan correctamente:

- [x] Tarea completada
- [ ] Tarea pendiente

### ⚡ Actualización en Vivo

¡Los cambios se reflejan instantáneamente mientras escribes! No necesitas guardar el archivo.

## 🎯 Uso Básico

1. **Abrir preview:** `Ctrl+Shift+V` (o `Cmd+Shift+V` en Mac)
2. **Edita tu Markdown:** Los cambios se verán en tiempo real
3. **Disfruta:** Tema oscuro elegante al estilo GitHub

## 🛠️ Comandos útiles

```bash
# Compilar una vez
npm run compile

# Compilar en modo watch (recompila automáticamente)
npm run watch

# Empaquetar la extensión
npm install -g @vscode/vsce
vsce package
```

## 📦 Dependencias incluidas

- `markdown-it` - Parser de Markdown potente y extensible
- `highlight.js` - Syntax highlighting para más de 190 lenguajes
- `markdown-it-task-lists` - Soporte para checkboxes (task lists)

## 🌈 Colores del tema GitHub Dark

El preview usa los colores oficiales del tema GitHub Dark:

- **Keywords** (function, class, etc.): `#ff7b72` (rojo)
- **Strings**: `#a5d6ff` (azul claro)
- **Functions**: `#d2a8ff` (púrpura)
- **Variables**: `#79c0ff` (azul)
- **Comments**: `#8b949e` (gris)

## 🎓 Ejemplos

Abre `example.md` para ver ejemplos de:

- Syntax highlighting en JavaScript, Python y TypeScript
- Tablas con estilo GitHub
- Checkboxes funcionales
- Blockquotes
- Y mucho más...

---

**¡Feliz escritura en Markdown!** 🎉
