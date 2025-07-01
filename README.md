# IDAT - Desarrollo de Interfaces 2  
## Sistema de Reservas — Restaurant John Khon

## 1. Prerrequisitos
Para ejecutar este proyecto localmente, asegúrate de tener instalado lo siguiente:

- **Node.js ≥ 18**
- **npm ≥ 9**

## 2. Instalación
Clona el repositorio y ejecuta la instalación de dependencias con los siguientes comandos:

```bash
git clone https://github.com/RuisuTech/Restaurant-John-Khon.git
cd Restaurant-John-Khon
npm install
```

## 3. Ejecución en modo desarrollo
Para iniciar el servidor de desarrollo y acceder a la aplicación:

```bash
npm run dev
```

Luego abre tu navegador en:  
👉 **http://localhost:5173**

## 4. Estructura de carpetas (abreviada)

```
src/
├── assets/          # Imágenes y fondo
├── components/      # Botones, calendario, horarios, cajas, modales
├── context/         # Contexto global de usuario
├── hooks/           # Custom hooks (si se añaden)
├── pages/
│   ├── admin/       # Panel de control, calendario
│   └── cliente/     # Reservas, historial
├── routes/          # Rutas protegidas y públicas
├── utils/           # Funciones reutilizables (fechas, validaciones)
├── App.jsx
└── main.jsx
```

## 5. Créditos

| Integrante                             | Código      | Rol                         |
|----------------------------------------|-------------------------------------------|
| Gissel Melani Peña Chavez              | iv73043487  | Dev / QA Tester             |
| Jose Luis Osorio Guzman                | iv73466355  | Dev / Programador Frontend  |
| Francisco Xavier Leon Velarde Robles   | pt41416014  | Dev / Programador Frontend  |
| Jesus Gabriel Colina Martin            | iv003901538 | Dev / UI/UX Designer        |
| Josled Luis Antonio Roman Huaman       | iv72325366  | Dev / UI/UX Designer        |

---

## 📌 Descripción del proyecto

**John Khon** es una aplicación web para la gestión de reservas en un restaurante, desarrollada como proyecto educativo.  
Está centrada en brindar una experiencia intuitiva tanto para clientes como para administradores, usando solamente tecnologías de frontend.

**Objetivo**:  
Resolver el problema de organización de reservas y evitar la sobreposición de horarios, brindando al usuario la posibilidad de elegir entre servicio de almuerzo o cena, con horarios y estados claros.

---

## 🎯 ¿Cómo funciona la reserva de horas?

Los clientes pueden reservar un servicio de:

- 🥗 **Almuerzo**: 11:00 a 16:00
- 🌙 **Cena**: 18:00 a 23:00

Cada reserva incluye:

- Tipo de servicio
- Número de personas
- Fecha y hora
- Comentario adicional

El sistema muestra solo las horas disponibles y evita que se pueda reservar en una hora ya ocupada.  
Se verifica cada reserva antes de confirmarla para evitar duplicados por fecha + hora.

---

## 📅 Interfaz del calendario

- 🟩 El día seleccionado se pinta de **verde**
- 🟥 Un día se pinta **rojo** solo si **todas las horas están ocupadas**
- 🟦 El día actual tiene un borde especial
- Las horas ya ocupadas se muestran en rojo y no son clicables

---

## 💻 Wireframes y prototipo interactivo

Incluye el diseño base del sistema.  
[Insertar aquí capturas clave de Figma]

🔗 Enlace Figma: [https://www.figma.com/design/cJnIk7TdEIpi38S2tTMMvI/React?node-id=0-1&t=phlTGt8lnfz7CUB7-1]

---

## 💾 Código fuente

🔗 Repositorio GitHub: [https://github.com/RuisuTech/Restaurant-John-Khon]

---

## 🧪 Pruebas de Usabilidad

Durante la realización de la **Tarea 02**, se llevaron a cabo pruebas con usuarios reales para evaluar la experiencia de uso. Los principales hallazgos fueron:

- ✅ **Flujo claro y comprensible:** Los usuarios comprendieron fácilmente el proceso paso a paso para realizar una reserva.
- ⚠️ **Alertas poco visibles:** Algunos usuarios no notaron los mensajes de alerta del sistema.  
  👉 *Solución:* Se reemplazaron los `alert()` por modales más llamativos y accesibles visualmente.
- ⚠️ **Límite rígido de personas:** El sistema solo permitía seleccionar hasta 10 personas.  
  👉 *Solución:* Se añadió un campo numérico personalizado para ingresar cualquier cantidad superior.

---

## 🐛 Problemas Detectados y Soluciones

| Problema                                                      | Solución Implementada                                                 |
|---------------------------------------------------------------|-----------------------------------------------------------------------|
| Se podían realizar reservas duplicadas en la misma hora       | Se implementó una validación que evita guardar fecha + hora repetidas |
| Los mensajes `alert()` eran poco notorios                     | Se reemplazaron por modales personalizados y más visibles             |
| El calendario marcaba en rojo cualquier día con una reserva   | Se mejoró la lógica para marcar en rojo solo si **todas las horas**   |
|                                                               |    del día están ocupadas                                             |

---

## 🔐 Usuarios por defecto

```js
export const usuarios = [
  {
    nombre: "Administrador General",
    correo: "admin@correo.com",
    password: "admin123",
    rol: "admin",
  },
  {
    nombre: "Cliente Ejemplo",
    correo: "cliente@correo.com",
    password: "cliente123",
    rol: "cliente",
  }
];
```

---

## ✅ Estado del proyecto

- ✔️ Funcionalidad completa de reservas y estados
- ✔️ Vista diferenciada para clientes y administrador
- ✔️ Validación de disponibilidad por hora
- ✔️ Calendario interactivo con colores
- ✔️ Flujo completo de confirmación

---

¡Gracias por visitar el proyecto!