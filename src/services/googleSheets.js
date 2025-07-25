// Servicio para integración con Google Sheets
// Este servicio maneja la conexión y lectura de datos desde Google Sheets

// Configuración de Service Account para escritura automática
const SERVICE_ACCOUNT = {
  type: "service_account",
  project_id: "mi-proyecto-460112",
  private_key_id: "28d79b1c01eb5ec9d06a319656d70b9fd0286d06",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC24rcvEY49Tclc\nFikX3ARKC6+wJ/9DiFhmNRCdy210UEhDL3/akgqGSMX19xyOH3IOZd9X1kofoe26\nPRh+h5EbCHifT04DzCLnmPcdznBNaWeE6SXHxbaUdEk8FQ+prWiv3XWgTwy4BJyh\ndSqZ4N7mLYmgJ8f1MDLNYejdoJwDd/VMqrN52TwN+cF5PcHsAv951Dyqw5FzgxTM\nXfQSsWU7FCrOXuN3QnT6MohHITZsc4DoM4OMCbqJadha/XAGvyZQDEK6SkO3WVD/\nWHzXzxB8TmeSCmyDWfHINgm5Q/mCYwJChHw1HARxP5K8x08D8dh3mWA4jqQN9ise\nrZqnNjTHAgMBAAECggEAJSl6eakCkzhsMzcZkIyXnogzYgMunoVlGRetUbMVga4S\nkPxk6YAFfXXqK+nTtplzLrPKp2mW1EiuKsrhYEyh0rFs+Uo/GwxvB0qQ5FCfh0tk\nyqApmid1y0K54uiQrzTacen5TeLiPb5KKZDKYExOXs1gCtgqjIsHt64uiGJrcVSk\n6tUaLqkScIyBi28tg68vGK5cryyqmwqXvpnyPEMJFOTc1mpfBVdm1Gr6nGPZ8394\nVpFWXrb2fjLWtyOcw+DIsc5r35uImrG5Xfir17kLCepRtIVlCKKVqeagS8KQxkg3\n+Sq60BtfVsuo7xn2W+96athBw/nEcMfcWusWm4NE2QKBgQD7SXZ40RdP25c/F7se\nB1lnhzYabbmh3477fdz1KQIJMfsFAlfaQ3Do9nXJPCqAxZbqW6eutYL6LLbYfXcG\npcoidLvtxujdoXHrWB0Q9ayPYFXT/nS3Qj1H+DVlz3M1aOruRN3tkBTtA5Rx2Whk\naGsxyO+PAykNGDAYfeDajMDWXQKBgQC6UNQNrkAkfZuLNKXb1h21Pzvk9nF1eb98\n9TJ9a0QHIGEHl2ibNfalJKvAiQDuEPLGdA/IdP+4oZIg/OkqM2MATucbuL2mBMnj\nRAmxlJHozUg6GA1nA5DEj/aaED77ywST/ja79SrH9Hu1jGfJ8tyXwjNjcAmirQap\nSY4Id+z9cwKBgQC5TI/PQahmG/Co9s/lsdesrxknXfhANMGUFFkGc6nrq+6F4Bd2\nfLrbHzr2HKbe9FV4FgRNoc2mu6hNdh96SHEI/XnDOiVnoXCG8h/k7LTFuW0w+XeJ\n14+m7ZI6tEIphWeQMjpQvymfKT+iwIXpXNKHELwOgm8YF9kHhnNz1c0xhQKBgBAf\nRGo2pNhDgj0mfh+qxIFVinJCnQjEUzyV3xuZN5bCR4Mnp+aeYcxigvYzJMB0+P0R\nN/hpn2Mzn/h4yhhbv/pb2YW9k7OVAH9I+OnD6GhTsydLw4Uhetp3dqhYNYsGQ0wn\nGEdlbKFG15mbH7QK7um25Ul6fWr1O/lUIxU6g2hfAoGAWGzoVhHyOo0PHx+L/Z2E\ngOa1np/wpdjIathLp+5lKxEB0IjP4GoTrOwzOWp1yXxwPplgfDLGIRKLQwm0F5CX\n2oglwNk5s63usTAnl88jHGAm0G8e8SqlU9c4wrumSGKQp0EG0aeYTn61+VTCFdSU\ns+83lu3cJhc9+nD+CaWhAQ8=\n-----END PRIVATE KEY-----\n",
  client_email: "gafasbuenosaires@mi-proyecto-460112.iam.gserviceaccount.com",
  client_id: "104037729538289621769",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/gafasbuenosaires%40mi-proyecto-460112.iam.gserviceaccount.com",
  universe_domain: "googleapis.com"
};

class GoogleSheetsService {
  constructor() {
    this.spreadsheetId = null;
    this.apiKey = null;
    this.range = 'Pedidos!A1:O1000'; // Rango específico para la hoja "Pedidos"
    this.accessToken = null;
    this.tokenExpiry = 0;
  }

  // Función para generar JWT usando Web Crypto API
  async generateJWT() {
    const header = {
      alg: 'RS256',
      typ: 'JWT'
    };

    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iss: SERVICE_ACCOUNT.client_email,
      scope: 'https://www.googleapis.com/auth/spreadsheets',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now
    };

    const encoder = new TextEncoder();
    
    // Codificar header y payload
    const encodedHeader = btoa(JSON.stringify(header)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    const encodedPayload = btoa(JSON.stringify(payload)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    
    const message = `${encodedHeader}.${encodedPayload}`;
    
    // Preparar la clave privada
    const privateKeyPem = SERVICE_ACCOUNT.private_key
      .replace(/-----BEGIN PRIVATE KEY-----/, '')
      .replace(/-----END PRIVATE KEY-----/, '')
      .replace(/\s/g, '');
    
    try {
      // Convertir la clave privada desde base64
      const binaryKey = atob(privateKeyPem);
      const keyArray = new Uint8Array(binaryKey.length);
      for (let i = 0; i < binaryKey.length; i++) {
        keyArray[i] = binaryKey.charCodeAt(i);
      }

      // Importar la clave privada
      const cryptoKey = await crypto.subtle.importKey(
        'pkcs8',
        keyArray,
        {
          name: 'RSASSA-PKCS1-v1_5',
          hash: 'SHA-256'
        },
        false,
        ['sign']
      );

      // Firmar el mensaje
      const signature = await crypto.subtle.sign(
        'RSASSA-PKCS1-v1_5',
        cryptoKey,
        encoder.encode(message)
      );

      // Codificar la firma
      const signatureArray = new Uint8Array(signature);
      const signatureBase64 = btoa(String.fromCharCode(...signatureArray))
        .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

      return `${message}.${signatureBase64}`;
    } catch (error) {
      console.error('Error generando JWT:', error);
      throw new Error('No se pudo generar JWT para autenticación');
    }
  }

  // Obtener access token usando Service Account
  async getAccessToken() {
    console.log('🔑 DIAGNÓSTICO TOKEN: Iniciando obtención de access token');
    console.log('🔑 TOKEN ACTUAL:', this.accessToken ? 'EXISTE' : 'NO EXISTE');
    console.log('🔑 EXPIRY TIME:', this.tokenExpiry);
    console.log('🔑 CURRENT TIME:', Date.now());
    console.log('🔑 TOKEN VÁLIDO:', this.accessToken && Date.now() < this.tokenExpiry);
    
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      console.log('🔑 USANDO TOKEN EXISTENTE');
      return this.accessToken;
    }

    console.log('🔑 GENERANDO NUEVO TOKEN');
    try {
      console.log('🔑 PASO 1: Generando JWT...');
      console.log('🔑 SERVICE ACCOUNT:', {
        client_email: SERVICE_ACCOUNT.client_email,
        project_id: SERVICE_ACCOUNT.project_id,
        private_key_length: SERVICE_ACCOUNT.private_key.length
      });
      
      const jwt = await this.generateJWT();
      console.log('🔑 PASO 1 OK: JWT generado, longitud:', jwt.length);
      
      console.log('🔑 PASO 2: Intercambiando JWT por access token...');
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
      });

      console.log('🔑 PASO 2 RESPUESTA:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('🔑 ERROR EN TOKEN:', error);
        throw new Error(`Error obteniendo access token: ${error}`);
      }

      const data = await response.json();
      console.log('🔑 PASO 2 OK: Token response:', {
        access_token_length: data.access_token?.length,
        token_type: data.token_type,
        expires_in: data.expires_in
      });
      
      this.accessToken = data.access_token;
      this.tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000; // 1 minuto antes de expirar

      console.log('🔑 ÉXITO TOTAL: Access token configurado');
      console.log('🔑 NUEVO EXPIRY:', new Date(this.tokenExpiry));
      return this.accessToken;
    } catch (error) {
      console.error('🔑 ERROR TOTAL:', error);
      throw error;
    }
  }

  // Configurar el servicio con los datos necesarios
  configure(config) {
    this.spreadsheetId = config.spreadsheetId;
    this.apiKey = config.apiKey;
    this.range = config.range || this.range;
  }

  // Método para obtener datos de la hoja de cálculo
  async getPedidos() {
    try {
      console.log('GoogleSheetsService.getPedidos() iniciado');
      console.log('spreadsheetId:', this.spreadsheetId);
      console.log('apiKey:', this.apiKey ? 'Configurada' : 'No configurada');
      console.log('range:', this.range);
      
      if (!this.spreadsheetId || !this.apiKey) {
        throw new Error('Configuración incompleta. Necesitas spreadsheetId y apiKey.');
      }

      const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/${this.range}?key=${this.apiKey}`;
      console.log('URL de Google Sheets:', url);
      
      const response = await fetch(url);
      console.log('Respuesta de Google Sheets:', response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`Error al obtener datos: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Datos recibidos de Google Sheets:', data);
      
      if (!data.values || data.values.length === 0) {
        console.log('No hay valores en la respuesta');
        return [];
      }

      // Convertir los datos de la hoja en objetos de pedidos
      const pedidos = this.convertirDatosAPedidos(data.values);
      console.log('Pedidos convertidos:', pedidos.length, pedidos);
      return pedidos;
      
    } catch (error) {
      console.error('Error al obtener pedidos de Google Sheets:', error);
      throw error;
    }
  }

  // Convertir los datos crudos de la hoja en objetos estructurados
  convertirDatosAPedidos(values) {
    console.log('convertirDatosAPedidos iniciado con', values.length, 'filas');
    if (values.length === 0) return [];

    // Asumimos que la primera fila contiene los headers
    const headers = values[0];
    console.log('Headers encontrados:', headers);
    const pedidos = [];

    // Mapeo de columnas específicas de tu hoja "Pedidos"
    const columnMap = {
      id: this.findColumnIndex(headers, ['ID Cliente', 'id', 'ID']),
      cliente: this.findColumnIndex(headers, ['Razón Social', 'cliente', 'razon social']),
      fecha: this.findColumnIndex(headers, ['FECHA', 'fecha']),
      vendedor: this.findColumnIndex(headers, ['VENDEDOR', 'vendedor']),
      optica: this.findColumnIndex(headers, ['Óptica', 'optica']),
      cuit: this.findColumnIndex(headers, ['CUIT', 'cuit']),
      bruto: this.findColumnIndex(headers, ['BRUTO', 'bruto']),
      iva: this.findColumnIndex(headers, ['IVA', 'iva']),
      descuentos: this.findColumnIndex(headers, ['DESCUENTOS', 'descuentos']),
      total: this.findColumnIndex(headers, ['TOTAL', 'total']),
      pago: this.findColumnIndex(headers, ['PAGO', 'pago']),
      saldo: this.findColumnIndex(headers, ['SALDO', 'saldo']),
      modelos: this.findColumnIndex(headers, ['MODELOS', 'modelos']),
      estado: this.findColumnIndex(headers, ['ESTADO', 'estado']),
      detallePago: this.findColumnIndex(headers, ['DETALLE DE PAGO', 'detalle de pago', 'detalle pago'])
    };
    
    console.log('Mapeo de columnas:', columnMap);

    // Procesar cada fila (saltando el header)
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      
      // Solo procesar filas que tengan datos
      if (row.some(cell => cell && cell.trim())) {
        // Generar un ID único combinando múltiples campos para evitar duplicados incorrectos
        const idCliente = this.getCellValue(row, columnMap.id);
        const fecha = this.getCellValue(row, columnMap.fecha);
        const vendedor = this.getCellValue(row, columnMap.vendedor);
        const total = this.getCellValue(row, columnMap.total);
        
        // Crear un ID único basado en múltiples campos
        const idUnico = idCliente && fecha 
          ? `${idCliente}-${fecha}-${vendedor || ''}-${total || ''}`.replace(/\s/g, '')
          : `row-${i}`;
        
        const pedido = {
          id: idUnico, // Usar ID único generado
          idCliente: idCliente, // Mantener el ID original del cliente por separado
          cliente: this.getCellValue(row, columnMap.cliente) || 'Cliente no especificado',
          descripcion: this.getCellValue(row, columnMap.modelos) || 'Sin descripción',
          monto: this.parseNumber(this.getCellValue(row, columnMap.total)) || 0,
          estado: this.normalizeEstado(this.getCellValue(row, columnMap.estado)),
          fechaCreacion: this.parseDate(this.getCellValue(row, columnMap.fecha)),
          fechaEntrega: null, // No hay columna específica para fecha de entrega
          origen: 'google_sheets',
          
          // Campos adicionales específicos de tu sistema
          vendedor: this.getCellValue(row, columnMap.vendedor) || '',
          optica: this.getCellValue(row, columnMap.optica) || '',
          cuit: this.getCellValue(row, columnMap.cuit) || '',
          bruto: this.parseNumber(this.getCellValue(row, columnMap.bruto)) || 0,
          iva: this.parseNumber(this.getCellValue(row, columnMap.iva)) || 0,
          descuentos: this.parseNumber(this.getCellValue(row, columnMap.descuentos)) || 0,
          pago: this.parseNumber(this.getCellValue(row, columnMap.pago)) || 0,
          saldo: this.parseNumber(this.getCellValue(row, columnMap.saldo)) || 0,
          modelos: this.getCellValue(row, columnMap.modelos) || '',
          detallePago: this.getCellValue(row, columnMap.detallePago) || ''
        };

        console.log('Pedido procesado con ID único:', idUnico, pedido);
        pedidos.push(pedido);
      }
    }

    return pedidos;
  }

  // Buscar el índice de una columna por nombres posibles
  findColumnIndex(headers, possibleNames) {
    for (const name of possibleNames) {
      const index = headers.findIndex(header => 
        header && header.toLowerCase().includes(name.toLowerCase())
      );
      if (index !== -1) return index;
    }
    return -1; // No encontrado
  }

  // Obtener valor de celda de forma segura
  getCellValue(row, columnIndex) {
    if (columnIndex === -1 || !row[columnIndex]) return '';
    return row[columnIndex].toString().trim();
  }

  // Parsear números desde texto
  parseNumber(value) {
    if (!value) return 0;
    
    // Remover caracteres no numéricos excepto puntos y comas
    const cleanValue = value.toString().replace(/[^\d.,]/g, '');
    
    // Manejar diferentes formatos de números
    const normalizedValue = cleanValue.replace(',', '.');
    const number = parseFloat(normalizedValue);
    
    return isNaN(number) ? 0 : number;
  }

  // Parsear fechas desde texto
  parseDate(value) {
    if (!value) return null;
    
    try {
      const date = new Date(value);
      return isNaN(date.getTime()) ? null : date.toISOString().split('T')[0];
    } catch {
      return null;
    }
  }

  // Normalizar estados a valores conocidos
  normalizeEstado(value) {
    if (!value) return 'pendiente';
    
    const estado = value.toLowerCase().trim();
    
    const estadosMap = {
      'pendiente': 'pendiente',
      'pending': 'pendiente',
      'proceso': 'en_proceso',
      'en proceso': 'en_proceso',
      'en_proceso': 'en_proceso',
      'in progress': 'en_proceso',
      'completado': 'completado',
      'complete': 'completado',
      'terminado': 'completado',
      'finished': 'completado',
      'entregado': 'completado',
      'delivered': 'completado',
      'cancelado': 'cancelado',
      'cancelled': 'cancelado',
      'canceled': 'cancelado',
      'anulado': 'cancelado',
      'pagado': 'completado',
      'paid': 'completado',
      'facturado': 'en_proceso',
      'enviado': 'en_proceso',
      'shipped': 'en_proceso'
    };

    return estadosMap[estado] || 'pendiente';
  }

  // Método para actualizar el estado de un pedido en Google Sheets automáticamente
  async updatePedidoEstado(idCliente, fecha, nuevoEstado) {
    try {
      console.log('🔄 INICIO: Actualizando estado automáticamente en Google Sheets');
      console.log('📋 DATOS:', { idCliente, fecha, nuevoEstado });
      console.log('🔧 CONFIGURACIÓN:', { 
        spreadsheetId: this.spreadsheetId, 
        apiKey: this.apiKey ? 'CONFIGURADA' : 'NO CONFIGURADA',
        serviceAccount: SERVICE_ACCOUNT.client_email 
      });
      
      if (!this.spreadsheetId) {
        throw new Error('spreadsheetId no configurado');
      }

      // Buscar el pedido en los datos actuales para encontrar la fila exacta
      const valuesUrl = `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/${this.range}?key=${this.apiKey}`;
      const response = await fetch(valuesUrl);
      const sheetData = await response.json();
      
      if (sheetData.values && sheetData.values.length > 0) {
        const headers = sheetData.values[0];
        const estadoColumnIndex = this.findColumnIndex(headers, ['ESTADO', 'estado']);
        const idColumnIndex = this.findColumnIndex(headers, ['ID Cliente', 'id', 'ID']);
        const fechaColumnIndex = this.findColumnIndex(headers, ['FECHA', 'fecha']);
        
        console.log('📊 Índices de columnas:', { estadoColumnIndex, idColumnIndex, fechaColumnIndex });
        
        // Buscar la fila que coincida
        for (let i = 1; i < sheetData.values.length; i++) {
          const row = sheetData.values[i];
          const rowIdCliente = this.getCellValue(row, idColumnIndex);
          const rowFecha = this.getCellValue(row, fechaColumnIndex);
          
          if (rowIdCliente === idCliente && rowFecha === fecha) {
            const estadoActual = this.getCellValue(row, estadoColumnIndex);
            console.log(`✅ Pedido encontrado en fila ${i + 1}:`, {
              id: rowIdCliente,
              fecha: rowFecha,
              estadoActual,
              estadoNuevo: nuevoEstado
            });
            
            // Actualizar usando Service Account con OAuth2
            const filaGoogleSheets = i + 1; // Google Sheets empieza en 1
            const columnaEstado = String.fromCharCode(65 + estadoColumnIndex); // A, B, C, etc.
            const rango = `Pedidos!${columnaEstado}${filaGoogleSheets}`;
            
            console.log('📝 Actualizando rango con OAuth2:', rango, 'con estado:', nuevoEstado);
            
            try {
              // Obtener access token
              console.log('🔑 PASO 1: Obteniendo access token para OAuth2...');
              console.log('🔑 SERVICE ACCOUNT EMAIL:', SERVICE_ACCOUNT.client_email);
              console.log('🔑 PROJECT ID:', SERVICE_ACCOUNT.project_id);
              
              const accessToken = await this.getAccessToken();
              console.log('✅ PASO 1 COMPLETADO: Access token obtenido:', accessToken ? 'SÍ' : 'NO');
              
              if (!accessToken) {
                throw new Error('No se pudo obtener access token');
              }
              
              // URL para actualizar usando OAuth2
              const updateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/${rango}?valueInputOption=RAW`;
              console.log('🌐 PASO 2: URL de actualización:', updateUrl);
              console.log('🎯 PASO 2: Rango objetivo:', rango);
              console.log('📝 PASO 2: Nuevo estado:', nuevoEstado);
              
              const requestBody = {
                values: [[nuevoEstado]]
              };
              console.log('📦 PASO 2: Cuerpo de la petición:', JSON.stringify(requestBody, null, 2));
              
              const requestHeaders = {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
              };
              console.log('🔒 PASO 2: Headers (sin token):', {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer [OCULTO]'
              });
              
              console.log('🚀 PASO 3: Enviando petición PUT a Google Sheets...');
              const updateResponse = await fetch(updateUrl, {
                method: 'PUT',
                headers: requestHeaders,
                body: JSON.stringify(requestBody)
              });
              
              console.log('📡 PASO 3 RESPUESTA:', {
                status: updateResponse.status,
                statusText: updateResponse.statusText,
                ok: updateResponse.ok,
                headers: Object.fromEntries(updateResponse.headers.entries())
              });
              
              if (updateResponse.ok) {
                const responseData = await updateResponse.json();
                console.log('🎉 ÉXITO TOTAL: Estado actualizado automáticamente en Google Sheets');
                console.log('📄 RESPUESTA COMPLETA:', JSON.stringify(responseData, null, 2));
                console.log('✅ RESULTADO: Sincronización bidireccional funcionando correctamente');
                alert('✅ ÉXITO: Estado actualizado automáticamente en Google Sheets');
                return { 
                  success: true, 
                  message: 'Estado actualizado automáticamente en Google Sheets',
                  automatic: true
                };
              } else {
                console.error('❌ FALLO COMPLETO: Response status:', updateResponse.status);
                console.error('❌ FALLO COMPLETO: Response text:', updateResponse.statusText);
                console.error('❌ FALLO COMPLETO: Response headers:', Object.fromEntries(updateResponse.headers.entries()));
                
                let errorData;
                let errorText;
                try {
                  errorText = await updateResponse.text();
                  console.error('❌ FALLO COMPLETO: Response body (text):', errorText);
                  
                  try {
                    errorData = JSON.parse(errorText);
                    console.error('❌ FALLO COMPLETO: Response body (JSON):', errorData);
                  } catch (jsonError) {
                    console.error('❌ FALLO COMPLETO: No se pudo parsear JSON:', jsonError);
                    errorData = { error: { message: errorText || `HTTP ${updateResponse.status}` } };
                  }
                } catch (textError) {
                  console.error('❌ FALLO COMPLETO: No se pudo leer response text:', textError);
                  errorData = { error: { message: `HTTP ${updateResponse.status}` } };
                }
                
                // Diagnóstico específico por código de error
                if (updateResponse.status === 403) {
                  console.error('🚫 DIAGNÓSTICO: Error 403 - Forbidden');
                  console.error('🚫 CAUSA PROBABLE: Service Account sin permisos de escritura');
                  console.error('🚫 SERVICE ACCOUNT:', SERVICE_ACCOUNT.client_email);
                  console.error('🚫 SPREADSHEET ID:', this.spreadsheetId);
                  console.error('💡 SOLUCIÓN REQUERIDA: Compartir Google Sheets con Service Account como Editor');
                  
                  alert(`🚫 ERROR 403: Sin permisos de escritura

📋 SERVICE ACCOUNT: ${SERVICE_ACCOUNT.client_email}
📊 SPREADSHEET: ${this.spreadsheetId}

💡 SOLUCIÓN:
1. Abre tu Google Sheets
2. Haz clic en "Compartir"
3. Agrega: ${SERVICE_ACCOUNT.client_email}
4. Selecciona "Editor"
5. Enviar

⚠️ Sin este paso, no funcionará la sincronización automática.`);
                  
                  throw new Error(`COMPARTIR REQUERIDO: ${SERVICE_ACCOUNT.client_email} necesita permisos de Editor`);
                  
                } else if (updateResponse.status === 401) {
                  console.error('🚫 DIAGNÓSTICO: Error 401 - Unauthorized');
                  console.error('🚫 CAUSA PROBABLE: Token de acceso inválido o expirado');
                  console.error('🚫 ACCESS TOKEN EXISTE:', !!this.accessToken);
                  console.error('🚫 TOKEN EXPIRY:', new Date(this.tokenExpiry));
                  console.error('💡 SOLUCIÓN: Regenerar token de acceso');
                  
                  alert('🚫 ERROR 401: Problema de autenticación con Google API');
                  throw new Error('Token de acceso inválido - Verificar Service Account');
                  
                } else if (updateResponse.status === 400) {
                  console.error('🚫 DIAGNÓSTICO: Error 400 - Bad Request');
                  console.error('🚫 CAUSA PROBABLE: Formato de petición incorrecto');
                  console.error('🚫 RANGO:', rango);
                  console.error('🚫 DATOS:', requestBody);
                  console.error('💡 SOLUCIÓN: Verificar formato de datos');
                  
                  alert('🚫 ERROR 400: Formato de datos incorrecto');
                  throw new Error('Formato de petición inválido');
                  
                } else if (updateResponse.status === 404) {
                  console.error('🚫 DIAGNÓSTICO: Error 404 - Not Found');
                  console.error('🚫 CAUSA PROBABLE: Spreadsheet ID o rango incorrecto');
                  console.error('🚫 SPREADSHEET ID:', this.spreadsheetId);
                  console.error('🚫 RANGO:', rango);
                  console.error('💡 SOLUCIÓN: Verificar ID de hoja y rango');
                  
                  alert('🚫 ERROR 404: Google Sheets no encontrado - Verificar ID');
                  throw new Error('Google Sheets no encontrado');
                  
                } else {
                  console.error('🚫 DIAGNÓSTICO: Error desconocido:', updateResponse.status);
                  console.error('🚫 DETALLES COMPLETOS:', {
                    status: updateResponse.status,
                    statusText: updateResponse.statusText,
                    errorData: errorData,
                    errorText: errorText
                  });
                  
                  alert(`🚫 ERROR ${updateResponse.status}: ${errorData?.error?.message || 'Error desconocido'}

Revisa la consola del navegador para más detalles.`);
                  throw new Error(`Error ${updateResponse.status}: ${errorData?.error?.message || 'Error desconocido'}`);
                }
              }
              
            } catch (authError) {
              console.error('❌ Error de autenticación OAuth2:', authError);
              throw new Error(`Error de autenticación: ${authError.message}`);
            }
          }
        }
        
        throw new Error(`No se encontró el pedido con ID ${idCliente} y fecha ${fecha} en Google Sheets`);
      }
      
    } catch (error) {
      console.error('❌ Error al actualizar estado en Google Sheets:', error);
      throw error;
    }
  }

  // Método para validar la configuración
  isConfigured() {
    return !!(this.spreadsheetId && this.apiKey);
  }

  // Método para probar la conexión
  async testConnection() {
    try {
      const pedidos = await this.getPedidos();
      return {
        success: true,
        message: `Conexión exitosa. Se encontraron ${pedidos.length} pedidos.`,
        count: pedidos.length
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        count: 0
      };
    }
  }
}

export default new GoogleSheetsService();
