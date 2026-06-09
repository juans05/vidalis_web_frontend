# 🔐 Credenciales de Prueba - Vidalis.AI

**Última actualización:** Junio 7, 2026

---

## 📋 Cómo Crear Usuario de Prueba

### Opción 1: Desde el Frontend (Recomendado)

1. **Inicia el backend:**
```bash
cd D:\Github\marketingDigitalBackend
npm start
# Escucha en http://localhost:3001
```

2. **Inicia el frontend:**
```bash
cd D:\Vidalis_proyecto\Vidalis\frontend
npm run dev
# Abre http://localhost:5173
```

3. **Accede a la landing page y haz clic en "Empezar Gratis"**

4. **Crea una cuenta nueva con estos datos:**
```
Nombre: Test Artist
Email: test@vidalis.dev
Contraseña: Test123456!
Tipo de Cuenta: Artist (o Agency)
Fecha de Nacimiento: 01/01/1990
```

5. **¡Listo!** El usuario se creará en Supabase automáticamente.

---

### Opción 2: Directo con cURL (Si tienes Postman/Thunder Client)

```bash
# Registrar nuevo usuario
curl -X POST http://localhost:3001/api/vidalis/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@vidalis.dev",
    "password": "Test123456!",
    "name": "Test Artist",
    "account_type": "artist",
    "birth_date": "1990-01-01"
  }'
```

**Respuesta esperada:**
```json
{
  "token": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "email": "test@vidalis.dev",
    "name": "Test Artist",
    "account_type": "artist"
  }
}
```

---

## ✅ Credenciales Sugeridas para Pruebas

### Usuario Artist
```
Email:       test@vidalis.dev
Contraseña:  Test123456!
Nombre:      Test Artist
Tipo:        Artist
```

### Usuario Agency
```
Email:       agency@vidalis.dev
Contraseña:  Agency123456!
Nombre:      Test Agency
Tipo:        Agency
```

---

## 🎯 Flujo de Prueba Completo

### 1. Login
- URL: `http://localhost:5173/login`
- Email: `test@vidalis.dev`
- Contraseña: `Test123456!`

### 2. Dashboard
- Debería llegar a `http://localhost:5173/dashboard`
- Verá sus videos (vacío al principio)

### 3. Subir Video
- Click "Upload" en el dashboard
- Selecciona un video local (o pega URL)
- Sistema enviará a Cloudinary
- N8N procesará automáticamente
- Viral score se calculará

### 4. Ver Analytics
- Click "Analytics"
- Debería mostrar datos en tiempo real desde Supabase
- Desglose por plataforma
- Crecimiento de últimos 30 días

### 5. Growth Pro
- Click "Growth"
- Verá insights desde AI (Anthropic)
- Best times para publicar
- Strategy recommendations

### 6. Conectar Redes Sociales
- Click "Connect Social"
- Selecciona plataformas (TikTok, Instagram, YouTube, etc.)
- Serás redirigido a Upload-Post para OAuth
- Después de autorizar, verás plataformas conectadas

### 7. Publicar Video
- Desde Gallery, selecciona un video
- Click "Publish"
- Elige plataformas
- Video se publica en redes reales vía Upload-Post API

---

## 🔍 Verificaciones de Datos Reales

### En Supabase (via CLI o Dashboard)
```sql
-- Ver usuarios creados
SELECT id, email, name, account_type FROM users LIMIT 10;

-- Ver videos subidos
SELECT id, artist_id, title, status, viral_score_real FROM videos LIMIT 10;

-- Ver métricas de posts
SELECT * FROM post_metrics_snapshots LIMIT 10;
```

---

## 📊 Endpoints para Pruebas Manuales

### Authentication
```bash
# Login
curl -X POST http://localhost:3001/api/vidalis/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@vidalis.dev","password":"Test123456!"}'

# Register
curl -X POST http://localhost:3001/api/vidalis/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test2@vidalis.dev",
    "password":"Test123456!",
    "name":"Test 2",
    "account_type":"artist",
    "birth_date":"1990-01-01"
  }'
```

### Content
```bash
# Get gallery
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3001/api/vidalis/gallery/{artistId}

# Get video analytics
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3001/api/vidalis/analytics/{videoId}
```

### Analytics
```bash
# Get stats
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3001/api/vidalis/stats/{agencyId}
```

### Growth
```bash
# Get insights
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3001/api/vidalis/artists/{artistId}/growth/insights

# Get best time
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3001/api/vidalis/artists/{artistId}/growth/best-time

# Get strategy
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3001/api/vidalis/artists/{artistId}/growth/strategy
```

---

## ⚠️ Notas Importantes

1. **Base de datos:** Usa Supabase real en `https://ufqrpaihteaddevmexbl.supabase.co`
2. **Contraseñas:** Las que uses se hashean con bcrypt en Supabase
3. **Tokens:** JWT con expiración de 7 días
4. **Refresh token:** Válido por 30 días
5. **APIs externas reales:** Upload-Post, N8N, Cloudinary, AI Services

---

## 🚀 Acceso Rápido

| Recurso | URL |
|---------|-----|
| Landing Page | http://localhost:5173/ |
| Login | http://localhost:5173/login |
| Dashboard | http://localhost:5173/dashboard |
| Backend API | http://localhost:3001/api/vidalis |
| Supabase | https://app.supabase.com (credenciales en .env) |

---

## 📞 Soporte

Si encuentras errores:
1. Verifica que backend y frontend estén corriendo
2. Revisa la consola del navegador (F12)
3. Revisa logs del backend
4. Confirma VITE_API_URL apunta a http://localhost:3001/api/vidalis

**¡Listo para probar!** 🎉
