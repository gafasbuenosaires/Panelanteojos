<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Panel de Control - Empresa de Anteojos

Este es un sistema de gestión para una empresa de anteojos desarrollado con React, Firebase y Tailwind CSS.

## Arquitectura del Proyecto

- **Frontend**: React 18 con Vite
- **Backend**: Firebase (Firestore + Authentication)
- **Estilos**: Tailwind CSS
- **Iconos**: Heroicons
- **Navegación**: React Router DOM

## Estructura de Datos en Firestore

### Colecciones:

1. **vendedores**
   - nombre (string)
   - email (string) 
   - saldo (number)
   - fechaCreacion (timestamp)

2. **movimientos_caja**
   - tipo (string): 'ingreso' | 'egreso'
   - monto (number)
   - descripcion (string)
   - categoria (string)
   - fecha (timestamp)

3. **movimientos_vendedores**
   - vendedorId (string)
   - vendedorNombre (string)
   - monto (number)
   - tipo (string): 'cobro' | 'venta' | 'ajuste'
   - descripcion (string)
   - fecha (timestamp)

4. **pedidos**
   - cliente (string)
   - descripcion (string)
   - monto (number)
   - estado (string): 'pendiente' | 'en_proceso' | 'completado' | 'cancelado'
   - fechaCreacion (timestamp)
   - fechaEntrega (date, opcional)

## Autenticación

- Solo 3 emails están permitidos (configurados en AuthContext.jsx)
- Usar Firebase Authentication con email/password
- Los emails permitidos se definen en ALLOWED_EMAILS

## Funcionalidades Principales

1. **Dashboard**: Resumen de caja, vendedores y movimientos recientes
2. **Vendedores**: Gestión de vendedores y cobros quincenales
3. **Caja**: Registro de ingresos/egresos con categorías
4. **Pedidos**: Gestión de pedidos con estados

## Convenciones de Código

- Usar componentes funcionales con hooks
- Formatear moneda en pesos argentinos (ARS)
- Tiempo real con onSnapshot de Firestore
- Responsive design con Tailwind CSS
- Estados de carga para mejor UX

## Configuración de Firebase

Actualizar `src/config/firebase.js` con las credenciales reales del proyecto Firebase.
