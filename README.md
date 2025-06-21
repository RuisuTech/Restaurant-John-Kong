# 🗓️ John Khon – Aplicación Web de Reservas

**John Khon** es una aplicación web de reservas desarrollada como proyecto educativo. Está enfocada en ofrecer una experiencia clara y rápida para **clientes** y **administradores**, usando únicamente tecnologías frontend.

## 🚀 Objetivo

Permitir que los **clientes** puedan registrarse, iniciar sesión y realizar reservas de fechas disponibles, y que los **administradores** puedan gestionar visualmente las reservas a través de un calendario.

---

## 👨‍💻 Tecnologías Usadas

- [React.js](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router DOM](https://reactrouter.com/)
- Almacenamiento en `localStorage` (simulado)

---

## 🧠 Funcionalidades

### 👤 Cliente

- Registro
- Inicio de sesión
- Recuperación de contraseña (simulada)
- Realizar reserva
- Consultar historial

### 🛠️ Administrador

- Inicio de sesión
- Visualización de reservas en un calendario

---

## 📁 Estructura de Carpetas (propuesta)

```bash
    /src
        ├── /assets
        ├── /components
        ├── /pages
        │ ├── /Cliente
        │ └── /Admin
        ├── /controllers
        ├── /models
        ├── /routes
        ├── /styles
        ├── App.jsx
        └── main.jsx
```



---

## ⚙️ Instalación y Ejecución Local

1. Clona el repositorio:

   ```bash
   git clone https://github.com/tu-usuario/john-khon.git
    npm install
   npm run dev
   ```

## 🧪 Estado del Proyecto

- [x] Diseño UI en Figma
- [x] Configuración del entorno (React + Vite)
- [ ] Autenticación básica con `localStorage`
- [ ] Formularios funcionales
- [ ] Lógica de reservas
- [ ] Calendario para administrador

---

## 🧑‍🤝‍🧑 Equipo de Desarrollo

    | Nombre       | Rol                  |
    | ------------ | -------------------- |
    | Integrante 1 | Coordinación general |
    | Integrante 2 | UI / Componentes     |
    | Integrante 3 | Lógica / Controlador |
    | Integrante 4 | Rutas y navegación   |

---

## 🔀 Flujo de Trabajo con Git

1. Crea una nueva rama desde `main`:

   ```bash
   git checkout -b feat/nombre-de-la-tarea
   git add .
   git commit -m "feat: añade formulario de reserva"
   git push origin feat/nombre-de-la-tarea
   ```
