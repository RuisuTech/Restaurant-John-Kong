# Restaurant John Kong

Sistema de reservas y gestión para restaurante — proyecto educativo de Desarrollo de Interfaces 2 (IDAT).

## Descripción

**John Kong** es una aplicación web para la gestión de reservas, menú, pedidos y pagos en un restaurante. Ofrece una experiencia diferenciada para clientes y administradores, con autenticación, calendario interactivo, escaneo de mesas por QR y panel de control.

## Stack tecnológico

| Capa | Tecnología |
|------|------------|
| Frontend | React 19, Vite 6, Tailwind CSS 3 |
| Routing | React Router DOM 7 |
| Autenticación | Firebase Auth (email + Google) |
| Backend (API) | Vercel Serverless Functions |
| Pagos | Stripe (simulado) |
| Email | EmailJS |
| QR | qrcode-decoder, react-qr-reader |
| Testing | Vitest, Testing Library |
| Despliegue | Vercel |

## Instalación

Requisitos: Node.js ≥ 18, npm ≥ 9.

```bash
git clone https://github.com/RuisuTech/Restaurant-John-Kong.git
cd Restaurant-John-Kong
npm install
```

## Ejecución

```bash
npm run dev
```

Abrir en el navegador: http://localhost:5173

Otros scripts:

```bash
npm run build    # Construir para producción
npm run preview  # Vista previa de la build
npm run lint     # Verificar código con ESLint
npm run test     # Ejecutar pruebas con Vitest
```

## Estructura del proyecto

```
├── api/                        # API serverless (Vercel)
│   ├── reservas.js             # CRUD de reservas
│   ├── reservas/               # Sub-rutas de reservas
│   ├── usuarios.js             # CRUD de usuarios
│   └── usuarios/               # Sub-rutas de usuarios
├── src/
│   ├── assets/                 # Imágenes y recursos estáticos
│   ├── components/
│   │   ├── admin/              # Componentes del panel admin
│   │   ├── cocina/             # Componentes de vista de cocina
│   │   ├── layout/             # Footer, header, layout
│   │   ├── menu/               # Componentes del menú
│   │   ├── reservas/           # Componentes de reserva
│   │   └── ui/                 # ToggleTema, modales, botones
│   ├── context/                # React Context
│   │   ├── AuthContext.jsx     # Estado de autenticación
│   │   ├── CarritoContext.jsx  # Estado del carrito
│   │   ├── MesaContext.jsx     # Estado de mesa seleccionada
│   │   ├── PedidoContext.jsx   # Estado de pedidos
│   │   ├── ProveedorTema.jsx   # Proveedor de tema
│   │   └── TemaContext.jsx     # Contexto de tema (claro/oscuro)
│   ├── data/                   # Datos estáticos (menú, categorías)
│   ├── hooks/                  # Custom hooks
│   │   ├── useCarrito.js
│   │   ├── useMesa.js
│   │   └── useTema.js
│   ├── localdb/                # Base de datos local
│   ├── pages/
│   │   ├── Admin/              # Admin, PanelControl, CalendarioAdmin, Cocina
│   │   ├── Auth/               # Login, Registro, Recuperar, VerificarCodigo, CambiarContrasena
│   │   ├── Cliente/            # Reserva, Menu, Carrito, Pago, Pedido, Historial, EscanearMesa
│   │   ├── Inicio.jsx
│   │   └── Pagina404.jsx
│   ├── routes/                 # Rutas protegidas (RutaPrivada)
│   ├── test/                   # Pruebas
│   ├── utils/                  # api.js, localDB.js
│   ├── App.jsx
│   └── main.jsx
├── public/
├── package.json
├── vite.config.js
├── tailwind.config.js
├── eslint.config.js
└── vercel.json
```

## Funcionalidades

### Cliente
- Registro e inicio de sesión (email/password y Google)
- Reserva de mesa con selección de fecha, hora y cantidad de personas
- Servicio de almuerzo (11:00–16:00) y cena (18:00–23:00)
- Escaneo de código QR para identificar la mesa
- Exploración del menú y carrito de pedidos
- Pago simulado con Stripe
- Seguimiento del estado del pedido
- Historial de reservas

### Administrador
- Panel de control con resumen
- Calendario interactivo con disponibilidad por día/hora
- Gestión de reservas (confirmar, cancelar)
- Vista de cocina para gestionar pedidos

### General
- Tema claro/oscuro
- Rutas protegidas por rol (admin/cliente)
- Validación de reservas duplicadas por fecha + hora + mesa
- Modales personalizados en lugar de alertas nativas
- Calendario con colores: verde (seleccionado), rojo (completo), borde especial (día actual)

## API

La API está desplegada como funciones serverless en Vercel bajo `/api/`.

### `GET /api/reservas`
Retorna todas las reservas.

### `POST /api/reservas`
Crea una reserva. Campos requeridos: `fecha`, `hora`, `mesa`, `usuario`. Verifica duplicados por fecha + hora + mesa.

### `PATCH /api/reservas`
Actualiza el estado de una reserva. Campos requeridos: `id`, `estado`.

### `GET /api/usuarios`
Retorna todos los usuarios registrados.

### `POST /api/usuarios`
Registra un usuario. Campos requeridos: `nombre`, `correo`, `rol`. Verifica duplicados por correo.

## Calendario

| Color | Significado |
|-------|-------------|
| Verde | Día seleccionado |
| Rojo | Todas las horas ocupadas |
| Borde especial | Día actual |
| Rojo (hora) | Hora ocupada, no clicable |

## Pruebas de usabilidad

- Flujo claro y comprensible para reservar
- Alertas reemplazadas por modales más visibles
- Campo numérico personalizado para cantidad de personas (sin límite rígido de 10)

## Créditos

| Integrante | Código | Rol |
|------------|--------|-----|
| Gissel Melani Peña Chavez | iv73043487 | Dev / QA Tester |
| Jose Luis Osorio Guzman | iv73466355 | Dev / Programador Frontend |
| Francisco Xavier Leon Velarde Robles | pt41416014 | Dev / Programador Frontend |
| Jesus Gabriel Colina Martin | iv003901538 | Dev / UI/UX Designer |
| Josled Luis Antonio Roman Huaman | iv72325366 | Dev / UI/UX Designer |

## Enlaces

- Repositorio: https://github.com/RuisuTech/Restaurant-John-Kong
- Figma: https://www.figma.com/design/cJnIk7TdEIpi38S2tTMMvI/React?node-id=0-1
