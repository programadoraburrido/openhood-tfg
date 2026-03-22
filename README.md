# OpenHood - Mecanica Asistida 2.0

OpenHood es una aplicacion web de gestion vehicular que ayuda al usuario mediante herramientas inteligentes, incluyendo un asistente de diagnostico y un analizador comparativo de presupuestos para optimizar el mantenimiento y el gasto del vehiculo.

## Equipo de Desarrollo (IES El Cañaveral)
* Jose Manuel Ferron Bravo: Identidad y Garaje (Usuarios, Vehiculos, Contexto IA).
* Roberto Sanchez: Operativa Financiera (Presupuestos, Reparaciones, IA Comparador).
* Facundo Sola Milencoff: Asistencia y Mercado (Buscador Talleres, Chatbot IA).

## Tecnologias Utilizadas
* Frontend: React.js (Vite), Tailwind CSS.
* Backend: Node.js, Express.js.
* Base de Datos: MySQL (con Sequelize / Prisma).
* Inteligencia Artificial: Integracion con APIs de LLMs (OpenAI / Gemini).

## Estructura del Proyecto
* /frontend: Aplicacion cliente en React.
* /backend: API RESTful en Node.js.
* /database: Scripts de inicializacion y modelos de la base de datos.
* /docs: Documentacion, diagramas ER, y recursos del TFG.

## Instalacion y Ejecucion en Local

### 1. Clonar el repositorio
git clone https://github.com/programadoraburrido/openhood-tfg.git
cd openhood-tfg

### 2. Levantar el Frontend
cd frontend
npm install
npm run dev

### 3. Levantar el Backend
cd backend
npm install
npm start