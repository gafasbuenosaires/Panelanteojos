# 🔧 Configuración para Escritura Automática en Google Sheets

## 📋 PROBLEMA ACTUAL:
- Tu API Key actual solo tiene permisos de **LECTURA**
- Para **escritura automática** necesitas una **Service Account** de Google

## 🚀 SOLUCIÓN AUTOMÁTICA:

### OPCIÓN 1: Service Account (RECOMENDADA)

1. **Ve a Google Cloud Console**: https://console.cloud.google.com/
2. **Crea un proyecto** o selecciona uno existente
3. **Habilita Google Sheets API**:
   - Ve a "APIs y servicios" > "Biblioteca"
   - Busca "Google Sheets API"
   - Haz clic en "Habilitar"

4. **Crea una Service Account**:
   - Ve a "APIs y servicios" > "Credenciales"
   - Clic en "Crear credenciales" > "Cuenta de servicio"
   - Nombra tu cuenta: `panel-anteojos-service`
   - Clic en "Crear y continuar"

5. **Genera clave JSON**:
   - Entra a la Service Account creada
   - Ve a "Claves" > "Agregar clave" > "Crear nueva clave"
   - Selecciona "JSON" y descarga el archivo

6. **Comparte Google Sheets con la Service Account**:
   - Abre tu Google Sheets
   - Clic en "Compartir"
   - Agrega el email de la Service Account (termina en @*.iam.gserviceaccount.com)
   - Dale permisos de "Editor"

### OPCIÓN 2: API Key con permisos de escritura

1. **Ve a Google Cloud Console**: https://console.cloud.google.com/
2. **Ve a "APIs y servicios" > "Credenciales"**
3. **Edita tu API Key actual**
4. **En "Restricciones de API" agrega**:
   - Google Sheets API (read)
   - Google Sheets API (write)

## 🔄 IMPLEMENTACIÓN EN CÓDIGO:

Una vez que tengas la Service Account:

```javascript
// En googleSheets.js - agregar soporte para Service Account
const GOOGLE_SERVICE_ACCOUNT = {
  client_email: 'panel-anteojos-service@tu-proyecto.iam.gserviceaccount.com',
  private_key: '-----BEGIN PRIVATE KEY-----\nTU_CLAVE_PRIVADA\n-----END PRIVATE KEY-----\n'
};
```

## ✅ RESULTADO:
- Cambias estado en el programa → Se actualiza AUTOMÁTICAMENTE en Google Sheets
- Sin mensajes molestos
- Sin pasos manuales
- Completamente automático

## 📧 Si necesitas ayuda:
Mándame el archivo JSON de la Service Account y lo configuro en el código.
