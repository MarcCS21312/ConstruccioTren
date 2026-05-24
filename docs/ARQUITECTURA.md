# Arquitectura del proyecto

Descripción técnica de la estructura de archivos, las clases del dominio y el flujo de navegación entre escenas.

→ [Volver al README](../README.md) · [Ver mecánicas](MECANICAS.md)

---

## Estructura de carpetas

```
ConstruccioTren/
├── index.html              # Punto de entrada HTML — contiene #gameCanvas
├── package.json            # Scripts y dependencias
├── src/
│   ├── main.js             # Configura Phaser.Game (800×600) y registra las 7 escenas
│   ├── styles/
│   │   ├── main.css        # Importa los otros tres
│   │   ├── base.css        # Reset y variables CSS
│   │   ├── layout.css      # Estructura de la página (body, #gameCanvas)
│   │   └── canvas.css      # Estilos del canvas de Phaser
│   ├── constants/
│   │   ├── tiposCasella.js # Enum TIPOS_CASILLA (string keys para cada tipo de terreno)
│   │   ├── colors.js       # COLORS_CASELLA — color hex por tipo de casilla
│   │   └── ui.js           # UI_COLORS, UI_DEPTH, UI_STYLES (paleta y estilos compartidos)
│   ├── config/
│   │   ├── campana.js      # Array CAMPANA con los 5 niveles de la campaña
│   │   ├── receptes.js     # Array RECEPTES con las 3 recetas de crafteo
│   │   ├── progreso.js     # Persistencia de progreso en localStorage
│   │   └── nivells.js      # NIVELL_PROVA (nivel de sandbox, no aparece en campaña)
│   ├── classes/
│   │   ├── index.js        # Barrel: re-exporta todas las clases y TIPOS_CASILLA
│   │   ├── Casella.js      # Una celda del mapa con tipo mutable
│   │   ├── Mapa.js         # Matriz de Casella + BFS para validar victoria
│   │   ├── Jugador.js      # Recursos del jugador y acciones (talar, picar, colocar)
│   │   ├── Nivell.js       # Config inmutable de un nivel
│   │   ├── Joc.js          # Orquestador: une Mapa + Jugador + estrelllas + estado
│   │   ├── SistemaEstrelles.js  # Calcula 0-3 estrellas según acciones usadas
│   │   ├── SistemaCrafteig.js   # Verifica y aplica recetas de crafteo
│   │   ├── Boto.js         # Componente Button reutilizable
│   │   └── obstaculos.js   # Jerarquía de obstáculos (Piedra, Agua, Montanya)
│   ├── scenes/
│   │   ├── MenuScene.js        # Menú principal
│   │   ├── LevelSelectScene.js # Selección de nivel con scroll y progreso
│   │   ├── PlayScene.js        # Escena de juego principal
│   │   ├── PauseScene.js       # Overlay de pausa
│   │   ├── CraftingScene.js    # Overlay del taller de crafteo
│   │   ├── GuideScene.js       # Overlay de guía de casillas
│   │   └── ExitScene.js        # Pantalla de despedida
│   └── ui/
│       ├── HUD.js          # Panel de estado (3 zonas: top, left, right)
│       └── ScrollView.js   # Componente de scroll genérico para listas
└── docs/
    ├── ARQUITECTURA.md     # Este archivo
    └── MECANICAS.md        # Mecánicas detalladas del juego
```

---

## Flujo de escenas

```
MenuScene
  ├─ JUGAR ──────────────► LevelSelectScene
  │                           ├─ Nivel desbloqueado → PlayScene(index)
  │                           └─ ESC / VOLVER ──────► MenuScene
  └─ SALIR ──────────────► ExitScene
                               └─ VOLVER AL MENÚ ───► MenuScene

PlayScene  (jugando)
  ├─ ESC ────────────────► PauseScene (overlay — pausa PlayScene)
  │                           ├─ CONTINUAR ─────────► resume PlayScene
  │                           ├─ REINICIAR ─────────► PlayScene(mismo index)
  │                           └─ MENÚ PRINCIPAL ────► MenuScene
  │
  ├─ C ──────────────────► CraftingScene (overlay)
  │                           ├─ Craftear receta ───► (actualiza Jugador, cierra)
  │                           ├─ C / cerrar ────────► resume PlayScene
  │                           └─ ESC ───────────────► PauseScene
  │
  ├─ G ──────────────────► GuideScene (overlay)
  │                           └─ G / ESC ───────────► resume PlayScene
  │
  └─ Resultado
       ├─ Victoria (nivel normal)
       │     ├─ SIGUIENTE NIVEL ──────► PlayScene(index + 1)
       │     └─ SELECCIONAR NIVEL ───► LevelSelectScene
       │
       ├─ Victoria (último nivel)
       │     ├─ MENÚ PRINCIPAL ───────► MenuScene
       │     └─ NIVELES ─────────────► LevelSelectScene
       │
       └─ Derrota
             ├─ REINTENTAR ──────────► PlayScene(mismo index)
             └─ SELECCIONAR NIVEL ───► LevelSelectScene
```

Las escenas overlay (Pausa, Crafteo, Guía) se lanzan con `scene.launch()` sobre PlayScene pausada. Al cerrar, hacen `scene.resume('PlayScene')`.

---

## Clases del dominio

### `Casella` — una celda del mapa

Almacena el tipo de terreno actual y un obstáculo asociado.

```
Casella
  ├── tipus: TIPOS_CASILLA          tipo actual del terreno
  ├── obstacle: Piedra|Agua|Montanya|null
  ├── canviarTipus(nouTipus)        cambia tipo y sincroniza obstáculo
  ├── esConstruible()               true si es PLA o NEU
  ├── esDestruible()                delega a obstacle.destruible
  └── esFranqueable()               delega a obstacle.franqueable
```

### `Mapa` — la cuadrícula

Matriz de `Casella` con lógica de búsqueda y validación de victoria.

```
Mapa
  ├── caselles: Casella[][]
  ├── mida: { files, columnes }
  ├── obtenirCasella(fila, col)     acceso seguro (null si fuera de rango)
  ├── reiniciar(mapaInicial)        reconstruye desde array 2D de tipos
  ├── trobarPosicio(tipus)          primera casilla de ese tipo
  ├── contarTipus(tipus)            cuenta ocurrencias (usado en derrota)
  └── comprovarCami()               BFS victoria:
                                      1. camino RAIL desde INICI a META
                                      2. cada PARADA tiene RAIL adyacente
```

### `Jugador` — recursos y acciones

```
Jugador
  ├── rails, puentes, vias_nieve    piezas disponibles para colocar
  ├── talesDisponibles              usos de hacha restantes
  ├── destruccionsDisponibles       usos de pico restantes
  ├── madera, piedra                materiales acumulados
  ├── inventari[]
  ├── talarArbre(casella)           BOSC → PLA · -1 tala · +2 madera
  ├── destruirObstacle(casella)     PIEDRA → PLA · -1 pico · +2 piedra
  ├── colocarRail(casella)          PLA → RAIL · -1 rail
  ├── colocarPuente(casella)        AGUA → RAIL_PUENTE · -1 puente
  └── colocarViaNeu(casella)        NEU → RAIL_NEU · -1 via_nieve
```

### `Joc` — orquestador

Une el mapa, el jugador y el sistema de estrellas. Es el único punto de entrada para las acciones que cambian el estado de la partida.

```
Joc
  ├── estat: 'inactiu'|'jugant'|'victoria'|'derrota'
  ├── mapa: Mapa
  ├── jugador: Jugador
  ├── sistemaEstrelles: SistemaEstrelles
  ├── accionsUsades: number
  ├── iniciarJoc(nivell)            crea Mapa + Jugador + SistemaEstrelles
  ├── colocarRailEn(fila, col)      enruta automáticamente según terreno:
  │                                   NEU → colocarViaNeu
  │                                   AGUA → colocarPuente
  │                                   PLA  → colocarRail
  │                                 tras colocar: comprueba victoria y derrota
  ├── comprovarVictoria()           delega a mapa.comprovarCami()
  └── finalitzarPartida()           fija estat + calcula estrellas
```

**Lógica de derrota** (se evalúa tras cada colocación):

```
sin piezas disponibles (rails=0, puentes=0, vias_nieve=0)
  Y no se puede craftear (falta madera o piedra para cualquier receta)
  Y no se puede recolectar (sin tales ni destruccions, o sin BOSC/PIEDRA en mapa)
  → derrota automática
```

### `SistemaEstrelles`

```
SistemaEstrelles(llindars: [number, number])
  llindars[0]  → máximo acciones para 3 estrellas
  llindars[1]  → máximo acciones para 2 estrellas
  calcularEstrelles({ victoria, accionsUsades }) → 0|1|2|3
```

### `SistemaCrafteig`

```
SistemaCrafteig
  ├── potCraftejar(jugador, recepta)   comprueba si hay materiales
  └── aplicar(jugador, recepta)        resta ingredientes, suma efectos
```

### `Button` (`Boto.js`)

Botón reutilizable con hover y fondo redondeado. Utilizado en todas las escenas.

```
new Button(scene, x, y, texto, colorBase, colorHover, callback, ancho?, alto?)
  → button.container   (Phaser Container con fons + text)
```

El container se añade a la DisplayList de la escena. `fons` (Graphics) y `text` son hijos del container, no aparecen directamente en la lista.

---

## Componentes UI

### `HUD` (`src/ui/HUD.js`)

Panel de estado en tres zonas fijas, siempre visible durante el juego.

```
Panel TOP (altura 68 px)
  │  Zona izquierda: ⛏️ pico · 🪓 hacha
  │  Zona derecha:   ⚒ Crafteo [C] · 📖 Guía [G] · ⏸ Pausa [ESC]

Panel LEFT (ancho 112 px)
  │  🛤️ Vía · 🌉 Puente · ❄️ Nieve

Panel RIGHT (ancho 112 px)
       🪵 Madera · 🪨 Piedra
```

Constantes exportadas usadas por `PlayScene` para calcular el espacio disponible del mapa:

```js
export const PANEL_ALT = 68   // altura del panel top
export const SIDE_W    = 112  // ancho de los paneles laterales
```

### `ScrollView` (`src/ui/ScrollView.js`)

Componente genérico de scroll para listas de objetos Phaser.

```js
const sv = new ScrollView(scene, {
  top,            // Y inicio de la zona visible
  bottom,         // Y fin de la zona visible
  itemHeight,     // altura de cada ítem (para cálculo de visibilidad)
  barX,           // X de la barra lateral
  contentHeight,  // altura total del contenido
  scrollSpeed,    // velocidad de la rueda (defecto: 0.4)
})
sv.setItems([{ yInicial, elements }])
sv.enable()
```

- Oculta/muestra ítems (`setVisible`) cuando salen de `[top, bottom]`
- Dibuja barra lateral con track + thumb proporcional (Phaser Graphics, depth 11)
- El scroll se limita con `Phaser.Math.Clamp`

---

## Persistencia

Archivo: `src/config/progreso.js`  
Clave localStorage: `'construccio_tren_max_nivel'`

```js
getMaxDesbloqueado()          // número del nivel más alto accesible (0 por defecto)
desbloquearNivel(index)       // actualiza si index > actual
```

Se llama a `desbloquearNivel(nivelIndex + 1)` desde `PlayScene.mostrarResultat()` al ganar.

---

## Configuración de niveles (`src/config/campana.js`)

Cada nivel es un objeto con esta forma:

```js
{
  nom: string,
  mapaInicial: TIPOS_CASILLA[][],   // mapa 2D con abreviaturas (o, I, M, B, R, A, N, T, S)
  railsInicials: number,
  limitsAccions: {
    tales: number,          // usos de hacha disponibles
    destruccions: number,   // usos de pico disponibles
  },
  llindarsEstrelles: [number, number],  // [max para 3★, max para 2★]
}
```

Abreviaturas usadas en los mapas:

| Abrev. | Tipo | Descripción |
|---|---|---|
| `o` | PLA | Llano |
| `I` | INICI | Inicio |
| `M` | META | Meta |
| `B` | BOSC | Bosque |
| `R` | PIEDRA | Piedra |
| `A` | AGUA | Agua |
| `N` | NEU | Nieve |
| `T` | MONTANYA | Montaña (borde/obstáculo) |
| `S` | PARADA | Waypoint obligatorio |
