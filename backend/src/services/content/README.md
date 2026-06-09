# Content Service

Servicio de gestión de contenido de videos para Vidalis.AI.

## Endpoints

### `POST /api/vidalis/upload`
Registrar nuevo video para procesamiento.

**Auth:** Required (Bearer token)

**Request:**
```json
{
  "videoData": {
    "artist_id": "artist-123",
    "source_url": "https://...",
    "title": "Mi video",
    "platforms": ["tiktok", "instagram"]
  }
}
```

**Response:**
```json
{
  "id": "video-id",
  "artistId": "artist-123",
  "title": "Mi video",
  "status": "analyzing",
  "hashtags": [],
  "platforms": ["tiktok", "instagram"],
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### `POST /api/vidalis/videos/from-url`
Subir video desde URL remota.

**Auth:** Required

**Request:**
```json
{
  "artist_id": "artist-123",
  "remote_url": "https://...",
  "title": "Mi video"
}
```

**Response:** (mismo que POST /upload)

### `GET /api/vidalis/gallery/:artistId`
Obtener galería de videos del artista.

**Auth:** Required

**Query Parameters:**
- `limit` (default: 20)
- `page` (default: 1)
- `status` (analyzing, processing, ready, published, error)
- `sort` (newest, oldest, viral_score)

**Response:**
```json
{
  "videos": [
    {
      "id": "video-id",
      "artistId": "artist-123",
      "title": "Mi video",
      "status": "ready",
      "viralScore": 85,
      "cloudinaryUrl": "https://...",
      "thumbnailUrl": "https://...",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 42,
  "page": 1,
  "limit": 20
}
```

### `GET /api/vidalis/video/:videoId`
Obtener detalles de un video.

**Auth:** Required

**Response:**
```json
{
  "id": "video-id",
  "artistId": "artist-123",
  "title": "Mi video",
  "status": "ready",
  "viralScore": 85,
  "aiCopy": "Mira este increíble...",
  "hashtags": ["#trending", "#viral"],
  "hookSuggestion": "Start with...",
  "cloudinaryUrl": "https://...",
  "thumbnailUrl": "https://...",
  "platforms": ["tiktok", "instagram"],
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### `PATCH /api/vidalis/video/:videoId`
Actualizar metadatos del video.

**Auth:** Required

**Request:**
```json
{
  "title": "Nuevo título",
  "aiCopy": "Nuevo copy",
  "hashtags": ["#new", "#tags"],
  "platforms": ["tiktok"]
}
```

**Response:** (mismo que GET video)

### `DELETE /api/vidalis/video/:videoId`
Eliminar video.

**Auth:** Required

**Response:** 204 No Content

### `POST /api/vidalis/video/:videoId/retry`
Reintentar procesamiento de video fallido.

**Auth:** Required

**Request:** `{}`

**Response:** (mismo que GET video)

### `GET /api/vidalis/video/:videoId/publish-status`
Obtener estado de publicación.

**Auth:** Required

**Response:**
```json
{
  "videoId": "video-id",
  "status": "ready",
  "postId": "ayrshare-post-id",
  "platforms": ["tiktok", "instagram"],
  "publishedAt": null
}
```

### `GET /api/vidalis/analytics/:videoId`
Obtener analíticas del video.

**Auth:** Required

**Response:**
```json
{
  "id": "video-id",
  "views": 1250,
  "likes": 342,
  "comments": 45,
  "shares": 23,
  "saves": 89,
  "reach": 3400,
  "impressions": 5200,
  "engagementRate": 8.5,
  "history": [
    {
      "snapshot_at": "2024-01-01T00:00:00Z",
      "views": 100,
      "likes": 20
    }
  ],
  "platformBreakdown": {}
}
```

### `GET /api/vidalis/cloudinary-signature`
Obtener firma para upload directo a Cloudinary.

**Auth:** Required

**Query Parameters:**
- `folder` (required)
- `resourceType` (video | image, default: video)

**Response:**
```json
{
  "cloudName": "demo",
  "apiKey": "demo-api-key",
  "folder": "vidalis/videos",
  "timestamp": 1704067200,
  "signature": "generated-signature",
  "resourceType": "video"
}
```

### `POST /api/vidalis/webhook/video-processed`
Webhook para recibir actualizaciones del backend de procesamiento.

**Auth:** None (requiere X-Webhook-Token en producción)

**Request:**
```json
{
  "videoId": "video-id",
  "status": "ready",
  "cloudinaryUrl": "https://...",
  "thumbnailUrl": "https://...",
  "viralScore": 85,
  "aiCopy": "Generated copy",
  "hookSuggestion": "Hook text",
  "hashtags": ["#tag1", "#tag2"]
}
```

**Response:**
```json
{
  "id": "video-id",
  "status": "ready",
  "cloudinaryUrl": "https://...",
  "viralScore": 85
}
```

## Video Status

- **analyzing** - Video siendo analizado
- **processing** - Procesamiento en curso
- **ready** - Listo para publicar (análisis completado)
- **needs_review** - Requiere revisión manual
- **published** - Publicado en redes
- **scheduled** - Programado para publicación futura
- **error** - Error en procesamiento

## Integración con Cloudinary

Para upload directo desde frontend:

1. Llamar `GET /cloudinary-signature` para obtener firma
2. Usar firma con Cloudinary.js para upload directo
3. Backend recibe webhook con URL procesada
4. Video pasa a estado "ready"

## Base de Datos (Próximamente)

Tablas:
- `videos` - Información del video
- `video_snapshots` - Historial de analíticas
- `video_metrics` - Métricas caché
