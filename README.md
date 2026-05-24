# Construcción del Tren

Puzzle de construcción de vías de tren en 2D. Conecta el punto de **Inicio** con la **Meta** gestionando una economía de recursos estricta: herramientas limitadas, materiales que se agotan y recetas de crafteo que hay que usar con cabeza. Cada nivel tiene una única solución óptima, o varias rutas con costes distintos en estrellas.

---

## Inicio rápido

```bash
npm install
npm run dev
```

Abre `http://localhost:5173` en el navegador.

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo con hot-reload |
| `npm run build` | Build de producción en `/dist` |
| `npm run preview` | Vista previa del build |

---

## Cómo se juega

### Objetivo

Construir un camino de vías desde la casilla **Inicio** (dorada) hasta la **Meta** (rojo-naranja). Si el nivel tiene **Paradas** (naranja), la ruta debe pasar por una celda adyacente a cada una antes de llegar a la meta.

### Controles

| Acción | Control |
|---|---|
| Colocar vía / talar bosque / picar piedra | Clic izquierdo sobre la casilla |
| Abrir taller de crafteo | Botón ⚒ en el HUD o tecla **C** |
| Abrir guía de casillas | Botón 📖 en el HUD o tecla **G** |
| Pausar / menú | Botón ⏸ o tecla **ESC** |

### Tipos de casilla

| Casilla | Qué hacer | Efecto |
|---|---|---|
| Llano | Clic → colocar vía | −1 rail |
| Bosque | Clic → talar (🪓) | −1 uso de hacha, +2 🪵 |
| Piedra | Clic → picar (⛏️) | −1 uso de pico, +2 🪨 |
| Agua | Clic → colocar puente | −1 puente (craftear antes) |
| Nieve | Clic → colocar vía de nieve | −1 vía nieve (craftear antes) |
| Montaña | — | Infranqueable |
| Parada | — | Waypoint obligatorio: la ruta debe pasar adyacente |

> Usa la guía in-game (**G**) para ver todos los tipos con sus colores exactos.

### Recetas de crafteo

Abre el taller con **C** para fabricar piezas usando los materiales recolectados.

| Receta | Coste | Resultado |
|---|---|---|
| Vía normal | 1 🪵 + 1 🪨 | +1 rail |
| Puente | 2 🪵 | +1 puente (para cruzar agua) |
| Vía de nieve | 2 🪨 | +1 vía de nieve (para cruzar nieve) |

### Sistema de estrellas

Las estrellas miden la eficiencia: cuantas menos acciones de colocación uses, mejor puntuación. Cada nivel tiene sus propios umbrales.

- **3 estrellas** — camino óptimo, sin desperdicios
- **2 estrellas** — solución válida con alguna acción de más
- **1 estrella** — victoria por los pelos
- **0 estrellas** — derrota

---

## La campaña

Cinco niveles con dificultad progresiva. El progreso se guarda automáticamente en el navegador. Completar un nivel desbloquea el siguiente.

| # | Nombre | Tamaño | Mecánica principal | Dificultad |
|---|---|---|---|---|
| 1 | Decisiones | 5×7 | Dos rutas posibles — elige qué destruir | ★☆☆ |
| 2 | Elige sabiamente | 6×7 | Más obstáculos que herramientas disponibles | ★★☆ |
| 3 | Lago profundo | 7×8 | El lago parece cruzable con puentes, pero no llega la madera | ★★☆ |
| 4 | Glaciar | 7×8 | Sin bosques ni madera — todo el camino es nieve | ★★★ |
| 5 | El infierno | 8×9 | Dos paradas, lago y nieve — sólo una ruta toca ambas | ★★★ |

---

## Tecnología

- **[Phaser 4](https://phaser.io/)** — motor de juegos 2D con Canvas/WebGL
- **[Vite](https://vitejs.dev/)** — empaquetador y servidor de desarrollo
- **JavaScript ES Modules** — sin framework adicional
- Resolución fija: **800 × 600 px**
- Sin backend — progreso guardado en `localStorage`

---

## Documentación técnica

| Documento | Contenido |
|---|---|
| [docs/ARQUITECTURA.md](docs/ARQUITECTURA.md) | Estructura de carpetas, clases del dominio, flujo de escenas |
| [docs/MECANICAS.md](docs/MECANICAS.md) | Mecánicas completas: recursos, crafteo, victoria, derrota, estrellas |
