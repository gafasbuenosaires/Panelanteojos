# Panel de Control - Empresa de Anteojos

Sistema de gestión web para empresa de anteojos con React, Firebase y Tailwind CSS. Diseñado para 3 administradores (dueños) con acceso completo en tiempo real.

## 🚀 Características

- ✅ **Autenticación segura** con Firebase Auth (solo 3 emails autorizados)
- ✅ **Dashboard en tiempo real** con resumen de caja y vendedores
- ✅ **Gestión de vendedores** con cuentas corrientes y cobros
- ✅ **Control de caja** con ingresos/egresos categorizados
- ✅ **Gestión de pedidos** con seguimiento de estados
- ✅ **Diseño responsive** con Tailwind CSS
- ✅ **Tiempo real** con Firestore
- ✅ **Fácil de mantener** con estructura modular

## 🛠️ Tecnologías

- **Frontend**: React 18 + Vite
- **Backend**: Firebase (Firestore + Authentication)
- **Estilos**: Tailwind CSS
- **Iconos**: Heroicons
- **Navegación**: React Router DOM

## 📦 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repo-url>
   cd malnacont
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar Firebase**
   
   Actualizar `src/config/firebase.js` con tu configuración:
   ```javascript
   const firebaseConfig = {
     apiKey: "tu-api-key",
     authDomain: "tu-proyecto.firebaseapp.com",
     projectId: "tu-proyecto-id",
     storageBucket: "tu-proyecto.appspot.com",
     messagingSenderId: "123456789",
     appId: "tu-app-id"
   };
   ```

4. **Configurar emails autorizados**
   
   En `src/contexts/AuthContext.jsx`, actualizar:
   ```javascript
   const ALLOWED_EMAILS = [
     'dueno1@empresa.com',
     'dueno2@empresa.com', 
     'dueno3@empresa.com'
   ];
   ```

5. **Iniciar desarrollo**
   ```bash
   npm run dev
   ```

## 🔥 Deploy a Firebase Hosting

1. **Instalar Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login a Firebase**
   ```bash
   firebase login
   ```

3. **Inicializar proyecto**
   ```bash
   firebase init hosting
   ```
   - Seleccionar tu proyecto Firebase
   - Public directory: `dist`
   - Configure as SPA: `Yes`

4. **Build y Deploy**
   ```bash
   npm run build
   firebase deploy
   ```

## 📊 Estructura de Datos

### Firestore Collections

#### `vendedores`
```javascript
{
  nombre: "Juan Pérez",
  email: "juan@email.com",
  saldo: 15000,
  fechaCreacion: timestamp
}
```

#### `movimientos_caja`
```javascript
{
  tipo: "ingreso", // "ingreso" | "egreso"
  monto: 25000,
  descripcion: "Venta del día",
  categoria: "venta",
  fecha: timestamp
}
```

#### `pedidos`
```javascript
{
  cliente: "Cliente ABC",
  descripcion: "Anteojos graduados",
  monto: 35000,
  estado: "pendiente", // "pendiente" | "en_proceso" | "completado" | "cancelado"
  fechaCreacion: timestamp,
  fechaEntrega: date
}
```

## 🎯 Funcionalidades

### Dashboard
- Total en caja actual
- Saldo total de vendedores
- Últimos movimientos
- Resumen de ingresos/egresos

### Vendedores
- Ver saldo de cada vendedor
- Registrar cobros (cada 15 días)
- Historial de movimientos

### Caja
- Registrar ingresos/egresos
- Categorías predefinidas
- Historial ordenado por fecha

### Pedidos
- Crear nuevos pedidos
- Cambiar estados
- Seguimiento de entregas

## 🔐 Seguridad

- Solo 3 emails específicos pueden acceder
- Autenticación con Firebase Auth
- Validación en frontend y backend
- Reglas de seguridad en Firestore

## 📱 Responsive Design

- Optimizado para desktop y móvil
- Navegación adaptable
- Cards responsivos
- Tablas con scroll horizontal

## 🤝 Contribución

1. Fork el proyecto
2. Crear feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto es de uso privado para la empresa de anteojos.

## 🆘 Soporte

Para soporte técnico, contactar a los desarrolladores o revisar la documentación de Firebase.+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
