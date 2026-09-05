# NexusInterno

Sistema interno para la gestión de proyectos de desarrollo, contabilidad y movimientos financieros.

## Stack

- **Frontend:** React 19 + Vite + Tailwind CSS + React Router
- **Backend:** Node.js + Express + Mongoose (MongoDB)
- **Dev:** `concurrently` para levantar ambos servidores a la vez

## Estructura

```
├── backend/          # API Express + conexión a MongoDB
│   └── src/
│       ├── config/   # Configuración de la base de datos
│       ├── controllers/
│       ├── middlewares/
│       ├── models/   # Project y Movement
│       ├── routes/
│       └── utils/
├── frontend/         # SPA React + Vite + Tailwind
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/ # Cliente de la API
│       └── styles/
└── package.json      # Scripts raíz
```

## Funcionalidades

- Gestión de proyectos: creación, edición, detalle y eliminación, con cuentas asociadas (MongoDB, Cloudinary, Dominio, etc.).
- Estados de proyecto: `pendiente`, `en-progreso` y `finalizado`.
- Contabilidad mensual: movimientos de ingreso y egreso, con detalle por concepto y categoría.
- Registro de gastos vinculados a proyectos.
- Diseño mobile-first con layout móvil.

## Requisitos

- Node.js 18+
- MongoDB (local o Atlas)

## Instalación

```bash
# Instalar dependencias de raíz, frontend y backend
npm run install:all
```

## Configuración del backend

Crear el archivo `backend/.env` con la variable de conexión a MongoDB:

```
MONGODB_URI=mongodb://127.0.0.1:27017/nexusinterno
PORT=5000
```

## Uso

```bash
# Levantar frontend y backend juntos
npm run dev

# O por separado
npm run dev:frontend
npm run dev:backend
```

El frontend corre en `http://localhost:5173` y la API en `http://localhost:5000`.