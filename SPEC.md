# MB360 App — Especificación para OpenCode

## Propósito
Mini App de Telegram para la consultora de comunicación MB360 (Madrid). Es una Single Page Application (HTML/CSS/JS puro, SIN frameworks, SIN build step) que se abre dentro de Telegram como Web App. Debe verse y funcionar como una app nativa móvil.

## Identidad visual (MB360)
- **Colores:** Azul marino `#0B1F3A` (fondo principal), azul oscuro `#12263F` (cards/headers), naranja corporativo `#FF7A00` (acentos/CTAs), blanco `#FFFFFF` (texto principal), gris claro `#A8B4C8` (texto secundario), verde `#2ECC71` (éxito/activo), rojo `#E74C3C` (alerta/crisis), ámbar `#F39C12` (vigilancia).
- **Tipografía:** sistema (`-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`). Títulos bold, cuerpo regular.
- **Estilo:** limpio, corporativo, consultora premium. Cards con esquinas redondeadas (12px), sombras sutiles. **Prohibido:** gradientes neón, glassmorphism excesivo, emojis como decoración principal, fondos con patrones.
- **Logo:** texto "MB360" en bold + naranja, con un punto naranja como acento. Sin imagen externa.

## Estructura de archivos (crear todos)
```
/home/currojd/mb360-app/
├── index.html          # Estructura completa SPA
├── css/styles.css      # Todo el CSS (mobile-first, responsive)
├── js/data.js          # Datos demo de la agencia (clientes, noticias, playbooks)
├── js/app.js           # Lógica: router, render, navegación, integración Telegram
└── assets/             # (vacío o solo favicon SVG inline)
```

## Secciones de la app (5 pestañas, bottom nav)

### 1. Inicio (Dashboard)
- Header con "MB360" + selector de sesión/topic (dropdown o chips): **General**, **PLUS ULTRA**, **Cliente B**...
- KPIs: clientes activos, alertas de prensa hoy, crisis activas (con badge rojo si >0)
- Últimas noticias del radar (3-4 items, título + medio + hora)
- Si hay crisis activa: banner rojo destacado arriba del dashboard

### 2. Clientes
- Lista de clientes: nombre, sector, estado (✅ Activo / ⚠️ Vigilancia / 🚨 Crisis) con color
- Al tocar: vista detalle con datos del cliente, últimas acciones, enlaces a playbooks

### 3. Prensa (Radar)
- Buscador por texto
- Lista de noticias: titular, medio, fecha, tono (positivo/neutro/negativo con color)
- Filtro por cliente

### 4. Crisis
- Si hay crisis activa: holding statement listo para copiar (botón "Copiar")
- Playbooks por cliente: lista de pasos (checklist interactivo)
- Checklist: 1. Reconocimiento 2. Empatía/Acción 3. Compromiso temporal (fórmula MB360)

### 5. Notas (Archivo)
- Formulario: cliente (select), título, nota (textarea), botón "Guardar"
- Al guardar: aparece en lista "Notas guardadas" (localStorage) con confirmación visual
- Las notas guardadas se muestran debajo con fecha

## Integración Telegram WebApp (CRÍTICA)
- Detectar `window.Telegram.WebApp`:
  - `Telegram.WebApp.ready()` y `Telegram.WebApp.expand()` al cargar
  - Usar `Telegram.WebApp.themeParams` para bg_color/text_color si disponibles (fallback a los colores MB360)
  - `Telegram.WebApp.MainButton` para acciones principales (ej: "Guardar nota")
  - `Telegram.WebApp.HapticFeedback.impactOccurred('light')` en taps
  - Leer `Telegram.WebApp.initDataUnsafe` para user (first_name) y chat (id) si existen
- **Modo demo:** si NO hay `window.Telegram` (abierto en navegador normal), la app funciona igual con datos demo y muestra un aviso sutil "Modo demo — abre en Telegram para la experiencia completa"
- **Selector de sesión/topic:** debe distinguir visualmente la sesión activa (p.ej. "PLUS ULTRA") y persistirla en localStorage

## Datos demo (js/data.js)
- 3 clientes: Plus Ultra (Aviación, 🚨 crisis), Cliente B (Tecnología, ✅), Cliente C (Alimentación, ⚠️)
- 6-8 noticias de prensa con tono variado (2 positivas, 3 neutras, 2 negativas), medios españoles ficticios (El Confidencial Digital, Expansión, La Razón, Europa Press...)
- 2 playbooks de crisis (Plus Ultra, genérico MB360)
- Notas guardadas: array inicial vacío (se llenan con localStorage)

## Requisitos técnicos
- **Un solo `index.html`** que carga `css/styles.css`, `js/data.js`, `js/app.js` (en ese orden, al final del body)
- **Sin dependencias externas** (sin CDN, sin frameworks, sin fuentes externas)
- Mobile-first: la app se ve en un teléfono (viewport 100dvh), bottom nav fija de 5 iconos SVG inline
- Desktop: centrar la app en un contenedor max-width 480px con sombra (como vista previa de Telegram)
- Todo el texto en español
- Código limpio y comentado en español donde aporte
- HTML válido, CSS sin errores, JS sin errores de consola

## Verificación final (hacerla tú, OpenCode)
1. Abrir `index.html` y comprobar que no hay errores de consola
2. Comprobar que las 5 pestañas navegan correctamente
3. Verificar que el CSS no rompe en móvil (viewport)
4. Asegurar que el modo demo funciona sin Telegram

## IMPORTANTE
- No uses IA de imagen, no generes assets binarios
- No instales nada, no uses npm
- Escribe los 4 archivos completos y funcionales
