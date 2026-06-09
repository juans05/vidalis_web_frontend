# 🚀 Plan de Integración - Backend Real + Frontend Web

## 📋 Estado Actual

### Backend Real (D:\Github\marketingDigitalBackend)
- ✅ Upload-Post API integrada completamente
- ✅ Supabase configurado y con datos reales
- ✅ N8N webhooks para procesamiento de videos
- ✅ AI Services (Gemini, Anthropic, Groq)
- ✅ Cloudinary para almacenamiento
- ✅ Endpoints REST implementados para móvil

### Frontend Web (D:\Vidalis_proyecto\Vidalis)
- ✅ React + TypeScript + Vite
- ✅ 7 páginas funcionales
- ✅ Zustand para state management
- ✅ Recharts para visualizaciones
- ✅ Llamadas a API mock (Maps en memoria)

**Problema:** El frontend web llama a backend web mock, no al backend real.

---

## 🎯 Objetivo: Conectar TODO

Hacer que el frontend web use:
1. Backend REAL (D:\Github\marketingDigitalBackend)
2. Supabase REAL
3. Upload-Post API REAL
4. N8N REAL para scoring
5. AI Services REAL

---

## 📅 Plan Actualizado (Realista)

### Fase A: Integración de Credenciales (1 día)

**Backend Web:**
```
D:\Vidalis_proyecto\Vidalis\backend\
├── .env → Copiar credenciales de D:\Github\marketingDigitalBackend\.env
├── src/config/supabase.ts → Crear cliente Supabase real
└── src/config/uploadpost.ts → Crear cliente Upload-Post real
```

**Actions:**
1. [ ] Copiar `.env` (SUPABASE_URL, SUPABASE_ANON_KEY, UPLOAD_POST_API_KEY, etc.)
2. [ ] Crear `src/config/supabase.ts` con cliente real
3. [ ] Crear `src/config/uploadpost.ts` con cliente real
4. [ ] Crear `src/config/ai.ts` para servicios IA

### Fase B: Reemplazar Backend Mock (2 días)

**Auth Service:**
```
[ ] Reemplazar Maps en memory con queries Supabase
    - Usuarios → supabase.from('users')
    - Sessions → manejar con JWT
    - Plans → supabase.from('subscriptions')
```

**Content Service:**
```
[ ] Reemplazar Maps con Supabase
    - Videos → supabase.from('videos')
    - Snapshots → supabase.from('post_metrics_snapshots')
    - usar Cloudinary para URLs reales
```

**Analytics Service:**
```
[ ] Datos desde Supabase (no generar aleatorios)
    - Stats desde post_metrics_snapshots aggregados
    - Growth data desde scoring_history
```

**Growth Service:**
```
[ ] Conectar a AI Services reales
    - aiService.refineCopy() → llamar Gemini/Anthropic/Groq
    - Insights desde N8N en lugar de mock
    - Viral score desde scoring_accuracy
```

### Fase C: Implementar Social Service (1-2 días)

**Copiar de backend real:**
```
[ ] Copiar uploadPostService.js → backend web
    backend/src/services/social/uploadPostService.ts

[ ] Adaptar a TypeScript y Express patterns

[ ] Crear Social Service router:
    POST   /api/vidalis/social/connect/:artistId
    POST   /api/vidalis/social/publish/:videoId
    POST   /api/vidalis/social/schedule/:videoId
    GET    /api/vidalis/social/status/:artistId
    GET    /api/vidalis/social/platforms/:artistId
    GET    /api/vidalis/social/analytics/:videoId
```

**Frontend:**
```
[ ] Crear página: ConnectSocialPage (similar a mobile)
[ ] Crear página: PublishPage (video → platforms → publicar)
[ ] Crear página: SchedulerPage (programar publicaciones)
[ ] Integrar con Social Service endpoints
```

### Fase D: Testing (1 día)

```
[ ] Test login con Supabase real
[ ] Test upload de video → N8N webhook
[ ] Test scoring de viral
[ ] Test publicación a redes
[ ] Test analytics desde Upload-Post
[ ] Test AI refinement de copy
```

---

## 📊 Timeline

| Fase | Tarea | Días | Dificultad |
|------|-------|------|-----------|
| A | Credenciales | 0.5 | 🟢 Fácil |
| B1 | Auth → Supabase | 0.5 | 🟢 Fácil |
| B2 | Content → Supabase | 0.5 | 🟢 Fácil |
| B3 | Analytics → Real | 0.5 | 🟢 Fácil |
| B4 | Growth → AI Real | 1 | 🟡 Medio |
| C1 | Social Service | 1 | 🟡 Medio |
| C2 | Social Frontend | 1 | 🟡 Medio |
| D | Testing | 1 | 🟡 Medio |
| **Total** | | **~6-7 días** | |

---

## 🔧 Cambios Específicos Necesarios

### Backend Web - Auth Service

**Cambio 1: Usar Supabase para usuarios**

```typescript
// backend/src/services/auth/auth-service.ts

// ANTES:
const users: Map<string, User> = new Map();

// DESPUÉS:
async login(request: LoginRequest) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', request.email)
    .single();
  
  if (error || !data) throw new AuthError('Invalid credentials');
  
  const isValidPassword = await bcrypt.compare(
    request.password, 
    data.password
  );
  if (!isValidPassword) throw new AuthError('Invalid credentials');
  
  return this.createSession(data);
}
```

### Backend Web - Social Service

**Nuevo archivo: Social Service Router**

```typescript
// backend/src/services/social/router.ts

import { Router } from 'express';
import { SocialService } from './social-service';
import { authMiddleware } from '../../shared/auth-middleware';

export const createSocialRouter = (): Router => {
  const router = Router();
  const socialService = new SocialService();

  router.post('/connect/:artistId', authMiddleware, async (req, res) => {
    const result = await socialService.getConnectUrl(req.params.artistId);
    res.json(result);
  });

  router.post('/publish/:videoId', authMiddleware, async (req, res) => {
    const result = await socialService.publishPost(req.params.videoId, req.body);
    res.json(result);
  });

  // ... más endpoints
  
  return router;
};
```

### Frontend - Social Integration

**Nuevo archivo: ConnectSocialPage**

```typescript
// frontend/src/features/social/pages/ConnectSocialPage.tsx

export function ConnectSocialPage(): JSX.Element {
  const user = useAuthStore((s) => s.user);
  const [connectUrl, setConnectUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/vidalis/social/connect/${user?.artistId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await response.json();
      setConnectUrl(data.url);
      // Redirigir a URL de conexión
      window.location.href = data.url;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1>Conectar Redes Sociales</h1>
      <button onClick={handleConnect} disabled={loading}>
        {loading ? 'Conectando...' : 'Conectar Redes'}
      </button>
    </div>
  );
}
```

---

## 🚨 Cosas Críticas a Recordar

### 1. Variables de Entorno
```env
# Copiar EXACTO de backend real .env:
SUPABASE_URL=
SUPABASE_ANON_KEY=
UPLOAD_POST_API_KEY=
GEMINI_API_KEY=
ANTHROPIC_API_KEY=
N8N_VIRAL_SCORE_URL=
N8N_WEBHOOK_URL=
```

### 2. Supabase Schema
Las tablas YA EXISTEN en Supabase. No crear nuevas, usar las existentes:
- `users` → login/registro
- `videos` → galería
- `post_metrics_snapshots` → analíticas
- `artists` → perfiles con `ayrshare_profile_key` (Upload-Post profile ID)

### 3. Upload-Post API
- No es Ayrshare, es Upload-Post
- Base URL: `https://api.upload-post.com/api`
- Auth: `Apikey {UPLOAD_POST_API_KEY}`
- Reutiliza campo `ayrshare_profile_key` de DB

### 4. N8N Webhooks
- Recibe eventos de procesamiento de videos
- Calcula viral score automáticamente
- Actualiza `scoring_history` en Supabase

---

## ✅ Checklist Final

- [ ] .env actualizado con credenciales reales
- [ ] Supabase client funcionando
- [ ] Upload-Post client funcionando
- [ ] Auth Service usando Supabase
- [ ] Content Service usando Supabase + Cloudinary real
- [ ] Analytics desde post_metrics_snapshots real
- [ ] Growth Service conectado a AI Services real
- [ ] Social Service implementado
- [ ] Frontend usando endpoints reales
- [ ] Test end-to-end: login → upload → scoring → publicar
- [ ] Test desde frontend web → backend real → Upload-Post → Redes

---

## 🎯 Resultado Esperado

Después de esta integración:

1. **Frontend web completamente funcional** con datos reales
2. **Publicación directa a redes sociales** (TikTok, Instagram, YouTube, Facebook)
3. **Scoring de viral score** en tiempo real desde N8N
4. **Analytics reales** desde Upload-Post
5. **AI Services reales** para generación de insights

**Todo sin crear backend duplicado - reutilizando lo que ya existe en backend real.**

