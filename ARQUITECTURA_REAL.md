# 🏗️ Vidalis.AI - Arquitectura Real

## ✅ Lo Que YA Existe (Backend Real)

**Ubicación:** `D:\Github\marketingDigitalBackend`

### 1. **Upload-Post Integration** ✅
- **Archivo:** `src/services/uploadPostService.js`
- **Features implementadas:**
  - ✅ Crear perfiles (sub-cuentas para artistas)
  - ✅ Generar URL de conexión de redes sociales
  - ✅ Publicar en múltiples plataformas (TikTok, Instagram, YouTube, Facebook, LinkedIn)
  - ✅ Programar publicaciones
  - ✅ Obtener analíticas de perfiles
  - ✅ Obtener métricas de posts
  - ✅ Calcular viral score (1-10) desde engagement
  - ✅ Snapshots de métricas en Supabase

**Base URL:** `https://api.upload-post.com/api`  
**Auth:** `Authorization: Apikey {UPLOAD_POST_API_KEY}`

### 2. **Social Publisher Router** ✅
- **Archivo:** `src/services/socialPublisher.js`
- **Decide entre:**
  - Upload-Post (default para TikTok, YouTube, LinkedIn)
  - Meta API directa (Instagram, Facebook con control directo)
- **Reutiliza:** Campo `ayrshare_profile_key` de DB → guarda profileKey de Upload-Post

### 3. **Supabase** ✅
- **URL:** `https://ufqrpaihteaddevmexbl.supabase.co`
- **Tablas principales:**
  - `videos` - Información de videos con `viral_score_real`, `analytics_4h`
  - `artists` - Perfiles de artistas con `ayrshare_profile_key`, `publish_mode`
  - `agencies` - Agencias (para cuentas de múltiples artistas)
  - `post_metrics_snapshots` - Historial de métricas por plataforma
  - `post_metrics_sna...` - Agregación de métricas
  - `scoring_accuracy` - Tracking de precisión de viral score
  - `scoring_history` - Historial de scoring
  - `scoring_calibrat...` - Calibración del modelo
  - `analytics_insights_log` - Log de insights generados
  - `app_config` - Configuración pública de la app
  - `sparks_transactions` - Transacciones de créditos

### 4. **N8N Webhooks** ✅
- **Viral Score:** `https://n8n.suizalabgroup.com/webhook/viral-score`
- **Upload Webhook:** `https://n8n.suizalabgroup.com/webhook/vidalis-upload`
- **Purpose:** Procesamiento de videos e cálculo de scoring en tiempo real

### 5. **Cloudinary** ✅
- **Cloud Name:** `do4rokki9`
- **Para:** Almacenamiento y delivery de videos
- **Firma de upload:** Ya implementada en `cloudinaryService.js`

### 6. **AI Services** ✅
- **Gemini API** - Para IA por defecto
- **Anthropic (Claude)** - Alternativa
- **Groq API** - Alternativa rápida
- **Modo actual:** `AI_MODE=internal`
- **Archivo:** `src/services/aiService.js`
- **Features:** Refinar copy, generar insights, scoring calibración

---

## 📝 Lo Que FALTA para Web

### Fase 1: Conectar Backend Real al Frontend Web

El frontend que construí está en `D:\Vidalis_proyecto\Vidalis` pero usa datos mock.

**Necesario:**
1. Cambiar endpoints del frontend para usar credenciales reales de Supabase
2. Usar `UPLOAD_POST_API_KEY` real
3. Conectar con N8N webhooks para scoring
4. Integrar AI services (Gemini/Anthropic)

### Fase 2: Implementar Endpoints Social Service en Backend Web

**Backend web actual:** `D:\Vidalis_proyecto\Vidalis\backend`

**Necesario crear endpoints** que envolvan `uploadPostService.js`:

```javascript
// POST /api/vidalis/social/connect/:artistId
// → Llamar uploadPostService.createProfile() + generateConnectUrl()

// POST /api/vidalis/social/publish-now/:videoId
// → Llamar uploadPostService.publishPost() con texto, platforms, mediaUrl

// POST /api/vidalis/social/schedule/:videoId
// → Llamar uploadPostService.schedulePost()

// GET /api/vidalis/social/status/:artistId
// → Llamar uploadPostService.getActivePlatforms()

// GET /api/vidalis/analytics/:videoId
// → Llamar uploadPostService.getPostAnalytics() + saveMetricsSnapshot()
```

### Fase 3: Sincronizar BD

**Cambio necesario:**
- Backend web debe usar Supabase en lugar de Maps
- Ya hay schema en Supabase, solo falta:
  - Crear `supabase.js` cliente en backend web
  - Reemplazar todas las Maps con queries Supabase

---

## 🔄 Plan Actualizado (Correcto)

### Opción A: Rápido (3-5 días)

1. **Integrar credenciales reales** (SUPABASE, UPLOAD_POST, N8N, AI)
   - Actualizar `.env` del backend web
   - Usar Supabase client en lugar de Maps

2. **Crear Social Service endpoints**
   - Envoltura de `uploadPostService.js`
   - POST /connect, /publish-now, /schedule
   - GET /status, /analytics

3. **Test end-to-end**
   - Web frontend → Backend web → Upload-Post → Redes reales

### Opción B: Completo (5-7 días)

Opción A + 

4. **Migration de BD** (Maps → Supabase)
   - Implementar Prisma con Supabase (o Supabase client directo)
   - Eliminar datos mock

5. **Testing suite**
   - Unit tests para endpoints
   - E2E tests con Supabase real

---

## 📊 Tabla de Compatibilidad

| Componente | Backend Real | Backend Web | Status |
|-----------|-------------|------------|--------|
| Supabase | ✅ Conectado | ❌ Mock (Maps) | Necesita conectar |
| Upload-Post | ✅ Integrado | ❌ No existe | Necesita endpoints |
| N8N | ✅ Webhooks activos | ❌ No existe | Necesita recibir |
| Cloudinary | ✅ Configurado | ✅ Tengo servicio | OK |
| AI Services | ✅ 3 opciones | ❌ Mock | Necesita integrar |
| Auth | ✅ Implementado | ✅ Tengo | OK |
| Content | ✅ Implementado | ✅ Tengo | OK |
| Analytics | ✅ Implementado | ✅ Tengo | OK |
| Growth | ✅ Implementado | ✅ Tengo | OK |

---

## 🎯 Próximo Paso

**Recomendación:** Opción A (rápido)

1. Copiar `uploadPostService.js` del backend real
2. Crear Social Service endpoints en backend web
3. Actualizar frontend para llamar esos endpoints
4. Test manual de publicación a redes reales

**Tiempo estimado:** 1-2 días

---

## 📚 Archivos Clave a Copiar/Integrar

```
De: D:\Github\marketingDigitalBackend
A: D:\Vidalis_proyecto\Vidalis\backend\src\services\social\

- uploadPostService.js
- socialPublisher.js
- aiService.js (parcial - refine copy)
- instagramService.js (si quieren publicar directo en Instagram)
```

---

## 🔑 Variables de Entorno Necesarias

```env
# Upload-Post
UPLOAD_POST_API_KEY=eyJhbGci...

# Supabase
SUPABASE_URL=https://ufqrpaihteaddevmexbl.supabase.co
SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

# AI Services (elige uno o más)
GEMINI_API_KEY=AIzaSy...
ANTHROPIC_API_KEY=sk-ant-api03-...
GROQ_API_KEY=gsk_...

# N8N Webhooks
N8N_VIRAL_SCORE_URL=https://n8n.suizalabgroup.com/webhook/viral-score
N8N_WEBHOOK_URL=https://n8n.suizalabgroup.com/webhook/vidalis-upload

# Cloudinary
CLOUDINARY_CLOUD_NAME=do4rokki9
CLOUDINARY_API_KEY=216776255384154
CLOUDINARY_API_SECRET=KlsdZdmXNWHaxA0rthQ_S4bMk1U
```

---

## ✨ Conclusión

El backend real YA TIENE TODO. El frontend web que construí es un buen skeleton que solo necesita:
1. Conectarse a credenciales reales
2. Llamar endpoints que envolvan los servicios existentes
3. Usar Supabase en lugar de datos mock

**El trabajo de integración es mucho menor de lo que parecía.** Es principalmente "pegamento" entre lo que ya existe en backend real y el nuevo frontend web.

