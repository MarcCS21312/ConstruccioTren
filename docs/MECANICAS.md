# Mecánicas del juego

Referencia completa de todas las mecánicas: terreno, recursos, crafteo, victoria, derrota y estrellas.

→ [Volver al README](../README.md) · [Ver arquitectura](ARQUITECTURA.md)

---

## Tipos de casilla

El mapa es una cuadrícula de celdas. Cada celda tiene un tipo que determina qué se puede hacer con ella.

### Terrenos transitables (pueden tener vía encima)

| Tipo | Color | Acción del jugador | Coste | Resultado |
|---|---|---|---|---|
| **PLA** (llano) | Verde claro | Colocar vía | −1 rail | Casilla → RAIL |
| **NEU** (nieve) | Cian muy claro | Colocar vía de nieve | −1 via_nieve | Casilla → RAIL_NEU |
| **AGUA** (agua) | Azul real | Colocar puente | −1 puente | Casilla → RAIL_PUENTE |

### Obstáculos eliminables

| Tipo | Color | Herramienta | Coste | Obtiene | Casilla tras acción |
|---|---|---|---|---|---|
| **BOSC** (bosque) | Verde oscuro | Hacha 🪓 | −1 tala | +2 🪵 madera | → PLA |
| **PIEDRA** | Gris | Pico ⛏️ | −1 destrucción | +2 🪨 piedra | → PLA |

> La casilla resultante (PLA) puede usarse para colocar vía normal gastando 1 rail.

### Obstáculos permanentes

| Tipo | Color | Descripción |
|---|---|---|
| **MONTANYA** (montaña) | Marrón | Infranqueable. Actúa como borde del mapa. |
| **PARADA** | Naranja pastel | Waypoint obligatorio. No se puede pisar pero la ruta debe pasar por una celda adyacente. |

### Casillas especiales

| Tipo | Color | Descripción |
|---|---|---|
| **INICI** (inicio) | Dorado | Punto de partida. La ruta comienza aquí. |
| **META** | Rojo-naranja | Destino. La ruta termina aquí. |

### Tipos de vía (resultado de colocar)

| Tipo | Color | Sobre qué terreno |
|---|---|---|
| **RAIL** | Marrón oscuro | PLA (llano) |
| **RAIL_PUENTE** | Azul grisáceo | AGUA |
| **RAIL_NEU** | Cian pastel | NEU (nieve) |

---

## Recursos

El jugador gestiona dos categorías de recursos: **herramientas** (limitadas, no recuperables) y **materiales** (acumulables, usables en crafteo).

### Herramientas

Se asignan al inicio del nivel y no se recuperan.

| Herramienta | HUD | Uso |
|---|---|---|
| 🪓 Hacha (tales) | Panel superior izquierdo | Talar bosques → madera |
| ⛏️ Pico (destruccions) | Panel superior izquierdo | Picar piedras → piedra |

Cada uso de herramienta produce siempre **2 unidades** de material.

### Materiales

Se acumulan al usar herramientas. Se consumen en el taller de crafteo.

| Material | HUD | Fuente |
|---|---|---|
| 🪵 Madera | Panel derecho | Talar bosques (2 por tala) |
| 🪨 Piedra | Panel derecho | Picar piedras (2 por pico) |

### Piezas de construcción

Se asignan al inicio o se fabrican en el taller. Se consumen al colocar vías.

| Pieza | HUD | Fuente |
|---|---|---|
| 🛤️ Vía (rail) | Panel izquierdo | Inicio del nivel + crafteo |
| 🌉 Puente | Panel izquierdo | Solo crafteo |
| ❄️ Vía de nieve | Panel izquierdo | Solo crafteo |

---

## Crafteo

El taller se abre con **C** (solo durante el juego, no en pantalla de resultado).

### Recetas disponibles

| Receta | Ingredientes | Resultado | Cuándo usarla |
|---|---|---|---|
| **Vía normal** | 1 🪵 + 1 🪨 | +1 rail | Cuando los rails iniciales no alcanzan |
| **Puente** | 2 🪵 | +1 puente | Para cruzar casillas de agua |
| **Vía de nieve** | 2 🪨 | +1 vía de nieve | Para cruzar casillas de nieve |

### Cómo funciona

1. El taller muestra las 3 recetas con el estado actual de recursos.
2. Si hay ingredientes suficientes, el botón CRAFTEAR está activo.
3. Al craftear se consume el material y se añade la pieza al inventario.
4. La escena se recarga para mostrar los recursos actualizados.

> La receta de Vía normal requiere AMBOS materiales. En niveles sin bosques (nivel 4 Glaciar), la madera es cero y esta receta queda inaccesible.

---

## Colocación de vías

Al hacer clic sobre una casilla transitable, `Joc.colocarRailEn()` enruta automáticamente:

```
Clic en NEU   → jugador.colocarViaNeu()   (consume 1 via_nieve)
Clic en AGUA  → jugador.colocarPuente()   (consume 1 puente)
Clic en PLA   → jugador.colocarRail()     (consume 1 rail)
```

Después de cada colocación exitosa:
1. Se incrementa el contador `accionsUsades`
2. Se verifica victoria
3. Si no hay victoria, se verifica si hay derrota

---

## Victoria

La victoria se evalúa con BFS (búsqueda en anchura) desde INICI tras cada colocación.

**Condiciones necesarias (todas):**

1. Existe un camino continuo de vías (RAIL, RAIL_PUENTE, RAIL_NEU) desde INICI hasta META, moviéndose en las 4 direcciones ortogonales.
2. Cada casilla PARADA del mapa tiene al menos una casilla de vía en una celda ortogonalmente adyacente.

Si se cumplen ambas condiciones → victoria inmediata.

Al ganar se desbloquea el nivel siguiente en localStorage.

---

## Derrota

La derrota se evalúa después de cada colocación de vía (no después de talar/picar).

**Condición:** el jugador no puede hacer ninguna acción productiva.

```
Sin piezas disponibles:
  rails = 0  Y  puentes = 0  Y  vias_nieve = 0
  
  Y no se puede craftear ninguna pieza:
    madera < 1 (sin posibilidad de puente o vía)
    piedra < 2 (sin posibilidad de vía de nieve)
    madera < 1 O piedra < 1 (sin posibilidad de rail)
    
  Y no se puede recolectar más material:
    (tales = 0 O no hay BOSC en el mapa)
    Y (destruccions = 0 O no hay PIEDRA en el mapa)

→ DERROTA AUTOMÁTICA
```

---

## Sistema de estrellas

Las estrellas se calculan al finalizar la partida basándose en `accionsUsades` (número de vías colocadas, no incluye talas ni picadas).

| Resultado | Condición |
|---|---|
| ⭐⭐⭐ 3 estrellas | Victoria con `accionsUsades ≤ llindars[0]` |
| ⭐⭐ 2 estrellas | Victoria con `accionsUsades ≤ llindars[1]` |
| ⭐ 1 estrella | Victoria por encima de ambos umbrales |
| 0 estrellas | Derrota |

### Umbrales por nivel

| Nivel | 3 estrellas (≤) | 2 estrellas (≤) | Acciones mínimas posibles |
|---|---|---|---|
| 1 — Decisiones | 6 | 8 | 6 (camino óptimo) |
| 2 — Elige sabiamente | 9 | 11 | 9 |
| 3 — Lago profundo | 14 | 17 | 14 |
| 4 — Glaciar | 11 | 13 | 11 (5 rails + 6 vías nieve) |
| 5 — El infierno | 18 | 22 | 18 |

---

## Diseño de los niveles

### Nivel 1 — Decisiones (5×7)

```
T T T T T T T
I o B o R o T
T o T T T o T
T B R B R o M
T T T T T T T
```

- **Mecánica:** dos rutas posibles. La corta requiere destrucciones en el orden correcto. La larga pasa por bosques que parecen un atajo pero gastan más rails.
- **Reto:** gestión básica de recursos en un solo camino evidente.

### Nivel 2 — Elige sabiamente (6×7)

```
T T T T T T T
I o B o o B T
T o T R T o T
T R T o T R T
T o T B T o T
T o o o o o M
```

- **Mecánica:** hay más bosques y piedras que herramientas disponibles. Hay que elegir exactamente cuáles 3 talar y cuáles 3 picar para que cuadre el material.
- **Reto:** el exceso de opciones obliga a calcular antes de actuar.

### Nivel 3 — Lago profundo (7×8)

```
T T T T T T T T
I o o o o o o T
T o T T T T o T
T A A A A A o T
T A A A A A o T
T o T T T T o T
T B o R B R o M
```

- **Mecánica:** el lago 2×5 parece cruzable con puentes, pero la madera que dan los bosques no alcanza para todos. La única solución es rodearlo por el corredor sur.
- **Reto:** reconocer que el camino aparentemente más corto (cruzar) es una trampa de recursos.

### Nivel 4 — Glaciar (7×8)

```
T T T T T T T T
I o o T T R T T
T T o T T T T T
T R N N T T R T
T R T N N T T T
T R T T N N o T
T T T T R T o M
```

- **Mecánica:** sin bosques — no hay madera, por lo tanto ni puentes ni vías normales extras. El camino son 5 PLAs (railsInicials = 5) + 6 NEU (requieren 6 vías de nieve = 12 piedra = 6 destrucciones). Las 6 piedras del mapa son exactamente las que se necesitan.
- **Reto:** economía al milímetro. Un rail o una vía mal colocados = derrota. El camino es lineal pero no evidente a primera vista.

### Nivel 5 — El infierno (8×9)

```
T T T T T T T T T
I o o o o T B R T
T o T T o T T T T
T S o T o A A o T
T T o T o A A o T
T o o o o T T o T
T o T T T T N S T
T o o o o o N o M
```

- **Mecánica:** dos Paradas en extremos opuestos del mapa. Hay tres rutas aparentes hacia la Meta, pero sólo una toca ambas Paradas con los recursos disponibles. Las otras dos llegan a Meta sin pasar por las Paradas (no cuenta como victoria).
- **Reto:** entender la mecánica de Parada y deducir cuál de las tres rutas satisface todas las condiciones.

---

## Progreso y desbloqueo

- El nivel 1 siempre está disponible.
- Completar el nivel N desbloquea el nivel N+1.
- El progreso se guarda en `localStorage` con la clave `'construccio_tren_max_nivel'`.
- Borrar el localStorage reinicia el progreso al nivel 1.
- La pantalla de selección muestra candado 🔒 en los niveles bloqueados e impide acceder a ellos.
