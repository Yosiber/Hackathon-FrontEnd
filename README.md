# 🏥 HealthCare & Pharmacy Management - FrontEnd

Un sistema integral moderno diseñado durante una Hackathon para la administración eficiente del inventario de farmacia, entrega de medicamentos y control de recuentos de tickets en el sector salud. 

## 🚀 Tecnologías Principales

Este proyecto ha sido desarrollado como una SPA (Single Page Application) priorizando el rendimiento, la facilidad de mantenimiento y una UI estética usando las herramientas más recientes del ecosistema Front-End:

- **Core & Build Tools:** [React 19](https://react.dev/) y [Vite 8](https://vitejs.dev/)
- **Estilos:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Gestión de Formularios:** [React Hook Form](https://react-hook-form.com/) acoplado con [Zod](https://zod.dev/) para la estricta validación de esquemas.
- **Rutas:** [React Router DOM](https://reactrouter.com/)
- **Componentes UI e Iconografía:** [Headless UI](https://headlessui.com/), [Radix UI](https://www.radix-ui.com/) y [Lucide React](https://lucide.dev/).
- **Peticiones HTTP:** [Axios](https://axios-http.com/)
- **Gráficos y Estadísticas:** [Chart.js](https://www.chartjs.org/) con `react-chartjs-2`.

---

## 💻 Características y Módulos

### 1. 🎫 Gestión de Tickets y Despacho (`/tickets`)
- **Control de Cola de Atención:** Los clientes / usuarios pueden solicitar medicamentos usando la plataforma.
- **Retro-compatibilidad Dinámica:** Interfaz resistente a datos provenientes de esquemas antiguos gracias a cálculos en memoria (`fulfillmentStatus` & logic mapping).
- **Asistencia Reactiva de Inventario:** Permite filtrar entre "En Espera" (medicamentos agotados), "Entrega Parcial" (listos a medias) y "Completados".
- **Privilegios de Access Control:** Los clientes solo pueden visualizar los tickets bajo su cuenta, mientras los `Administradores` o `Empleados` gestionan, validan y pueden procesar la base de datos entera.

### 2. 🔔 Sistema de Notificaciones Inteligente (`/notifications`)
- Módulo nativo acoplado al perfil del usuario.
- Funcionalidad delegada por R.B.A.C (Control de Acceso Basado en Roles) que restringe la creación de notificaciones manuales o globales solo a los Administradores.
- Vinculación a medicamentos y transacciones específicas en el BackEnd.

### 3. 📦 Inventario (Medication Tracker)
- Conexión con un catálogo de base de datos en tiempo real.
- Reconocimiento de estados automáticos de acuerdo a la capa analítica de stock físico (AGOTADO, BAJO STOCK, DISPONIBLE).

### 4. 🌙 Interfaz Resiliente (Dark Mode y Responsive)
- Preparado con variables de tailwind para ser navegado cómodamente en móviles, tablets y escritorios, integrando paletas oscuras de forma transparente.

---

## ¡Como usar?
- Como usuario te registras como lo harias en cualquier pagina web norma.
- En caso de querer usar el administrador registrarse como
  
   - Email: coraje.salud@gmail.com
   -  Contraseña: FEKYL20231SoFTWARE_

## 🛠 Instalación y Configuración

Sigue estos pasos si deseas ejecutar este proyecto localmente. Asegúrate de tener **Node.js** instalado en tu computadora.

1. **Clonar este repositorio:**
   ```bash
   git clone https://github.com/Yosiber/Hackathon-FrontEnd.git
   cd Hackathon-FrontEnd
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```
   
3. **Configurar el Entorno:**
   Asegúrate de preparar o enlazar tus variables de entorno apuntando a tu URL del BackEnd de NestJS en tu archivo `.env`.

4. **Levantar el entorno de Desarrollo (Vite):**
   ```bash
   npm run dev
   ```

5. El servidor se expondrá de manera predeterminda, típicamente en `http://localhost:5173`. 

---

## 🧪 Comandos Adicionales

- `npm run build`: Genera el bundle robusto de producción listo en el directorio `/dist`.
- `npm run preview`: Si simulaste un build, corre localmente el entorno optimizado antes de subir a un servidor productivo o Vercel.
- `npm run lint`: Realiza un chequeo estático para mantener las buenas prácticas en el formato del código usando `ESlint`.

---

> _Proyecto desarrollado en equipo y con apoyo del asistente inteligente bajo metodologías ágiles._
