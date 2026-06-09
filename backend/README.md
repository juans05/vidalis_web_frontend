# Vidalis.AI Backend - Microservices

Arquitectura de microservicios para Vidalis.AI web.

## 🏗️ Estructura

```
src/
├── api-gateway/        # Gateway principal (enrutador)
├── services/
│   ├── auth/          # Autenticación
│   ├── content/       # Gestión de videos
│   ├── analytics/     # Estadísticas
│   ├── growth/        # Growth Pro
│   └── social/        # Redes sociales
└── shared/            # Código compartido
```

## 🚀 Setup

```bash
npm install
npm run dev
```

## 📝 Servicios

- **Auth Service** (Puerto 3001) - Autenticación y gestión de usuarios
- **Content Service** (Puerto 3002) - Videos y galería
- **Analytics Service** (Puerto 3003) - Estadísticas
- **Growth Service** (Puerto 3004) - IA y Growth Pro
- **Social Service** (Puerto 3005) - Redes sociales
- **API Gateway** (Puerto 3000) - Enrutador principal

## 📋 Development

```bash
npm run lint       # Ejecutar linter
npm run format     # Formatear código
npm run build      # Compilar TypeScript
npm run start      # Iniciar producción
```

## 🔐 Variables de Entorno

Ver `.env.example` para todas las variables requeridas.
