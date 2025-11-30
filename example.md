# Ejemplo de Markdown

Este es un archivo de ejemplo para probar el **Markdown Dark Previewer** con _syntax highlighting_ y checkboxes.

## Características principales

- ✅ Tema oscuro elegante al estilo GitHub
- ✅ Actualización en tiempo real (sin guardar)
- ✅ Syntax highlighting completo
- ✅ Checkboxes nativos
- ✅ Soporte completo de Markdown

### Ejemplo de código JavaScript

```javascript
function saludar(nombre) {
  console.log(`¡Hola, ${nombre}!`);
  return `Saludos desde ${nombre}`;
}

const resultado = saludar("Mundo");
console.log(resultado);
```

### Ejemplo de código Python

```python
def calcular_fibonacci(n):
    """Calcula los primeros n números de Fibonacci"""
    fib = [0, 1]
    for i in range(2, n):
        fib.append(fib[i-1] + fib[i-2])
    return fib

print(calcular_fibonacci(10))
```

### Tabla de ejemplo

| Columna 1 | Columna 2 | Columna 3 |
| --------- | --------- | --------- |
| Dato 1    | Dato 2    | Dato 3    |
| Dato 4    | Dato 5    | Dato 6    |

### Lista de tareas

- [x] Crear la extensión
- [x] Implementar el preview con tema oscuro
- [x] Agregar syntax highlighting
- [x] Implementar checkboxes
- [x] Actualización en tiempo real
- [ ] Publicar en el marketplace
- [ ] Agregar más temas

> **Nota:** Presiona `Ctrl+Shift+V` para abrir el preview en tema oscuro.

---

---

## Más ejemplos de código

### TypeScript

```typescript
interface Usuario {
  id: number;
  nombre: string;
  email: string;
}

class GestorUsuarios {
  private usuarios: Usuario[] = [];

  agregarUsuario(usuario: Usuario): void {
    this.usuarios.push(usuario);
    console.log(`Usuario ${usuario.nombre} agregado`);
  }
}
```

### JSON

```json
{
  "name": "markdown-dark-preview",
  "version": "1.0.0",
  "description": "Preview de Markdown con tema oscuro",
  "features": ["syntax-highlighting", "live-update", "checkboxes"]
}
```

---

_Hecho con ❤️ para Visual Studio Code_
