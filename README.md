# 🎯 Feria Ocupacional - CVDP Tec de Monterrey SLP

Plataforma interactiva estilo Kahoot para la Feria de Salud y Bienestar - Esfera Ocupacional.

## ✨ Características

### 🎮 Quiz en Vivo (Kahoot-style)
- Pantalla de presentador para proyector
- Jugadores se unen con código de sala
- Sincronización en tiempo real con WebSockets
- Sistema de puntos con bonus por velocidad y rachas
- Leaderboard en vivo

### 🎯 Test Vocacional
- 12 preguntas basadas en modelo RIASEC
- Resultados personalizados con carreras recomendadas
- Visualización de perfil completo

### 🖼️ Collage con IA (placeholder)
- Subida de foto del usuario
- Selección de profesión
- Generación de imagen con IA (requiere integrar Replicate API)

### 📚 Recursos
- Guía para crear CV profesional
- Mitos vs Realidades de la universidad
- Explorador de carreras con salarios
- Tips para preparatoria
- Contacto CVDP

---

## 🚀 Instalación

```bash
# 1. Entrar a la carpeta del proyecto
cd feria-ocupacional

# 2. Instalar dependencias
npm install

# 3. Ejecutar en modo desarrollo
npm run dev:all
```

Esto iniciará:
- **Frontend (Next.js)**: http://localhost:3000
- **Backend (Socket.io)**: http://localhost:3001

---

## 📱 Rutas disponibles

| Ruta | Descripción |
|------|-------------|
| `/` | Landing page principal |
| `/host` | Pantalla del presentador (proyector) |
| `/play` | Pantalla del jugador (celular) |
| `/test` | Test vocacional individual |
| `/results` | Generador de collage con IA |
| `/recursos` | Recursos útiles (CV, mitos, carreras) |

---

## 🎮 Cómo usar el Quiz

### Para el Presentador:
1. Abre `/host` en el proyector
2. Click en "CREAR SALA"
3. Comparte el código de sala con los participantes
4. Espera a que todos se conecten
5. Click en "INICIAR JUEGO"
6. Después de cada pregunta, click en "SIGUIENTE"

### Para los Jugadores:
1. Abren `/play` en su celular
2. Ingresan el código de sala
3. Escriben su nombre
4. Click en "ENTRAR"
5. Esperan a que inicie el juego
6. ¡Responden lo más rápido posible!

---

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 14 + React 18
- **Styling**: Tailwind CSS
- **Animaciones**: Framer Motion
- **Real-time**: Socket.io
- **State**: Zustand (disponible)

---

## 📦 Estructura del Proyecto

```
feria-ocupacional/
├── app/
│   ├── globals.css      # Estilos globales
│   ├── layout.js        # Layout principal
│   ├── page.js          # Landing page
│   ├── host/page.js     # Pantalla presentador
│   ├── play/page.js     # Pantalla jugador
│   ├── test/page.js     # Test vocacional
│   ├── results/page.js  # Generador collage IA
│   └── recursos/page.js # Recursos útiles
├── server.js            # Servidor WebSocket
├── tailwind.config.js   # Configuración Tailwind
└── package.json         # Dependencias
```

---

## 🌐 Deploy para Producción

### Opción 1: Vercel + Railway
1. **Frontend en Vercel**:
   ```bash
   vercel deploy
   ```

2. **Backend en Railway**:
   - Sube solo el `server.js` y crea un nuevo proyecto
   - Configura la variable `SOCKET_PORT=3001`

3. **Configurar URL**:
   - Crea archivo `.env.local`:
   ```
   NEXT_PUBLIC_SOCKET_URL=https://tu-backend.railway.app
   ```

### Opción 2: VPS (todo junto)
```bash
# Build de producción
npm run build

# Iniciar ambos servicios
npm run dev:all
```

---

## 🎨 Personalización

### Cambiar preguntas del Quiz:
Edita el array `quizQuestions` en `server.js`

### Cambiar preguntas del Test Vocacional:
Edita el array `vocationalQuestions` en `app/test/page.js`

### Cambiar carreras recomendadas:
Edita el objeto `careersByType` en `app/test/page.js`

### Cambiar colores:
Edita `tailwind.config.js` en la sección `colors`

---

## 🔮 Para integrar IA real (Collage)

1. Crear cuenta en [Replicate](https://replicate.com)
2. Obtener API key
3. Crear archivo `app/api/generate/route.js`:

```javascript
import Replicate from 'replicate';

export async function POST(request) {
  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });
  
  const { image, prompt } = await request.json();
  
  const output = await replicate.run(
    "tencentarc/photomaker:ddfc2b08d209f9fa8c1uj...",
    { input: { image, prompt } }
  );
  
  return Response.json({ image: output });
}
```

---

## 📞 Contacto CVDP

Centro de Vinculación y Desarrollo Profesional  
Tec de Monterrey Campus San Luis Potosí

---

Hecho con 💜 para la Feria de Salud y Bienestar 2025
