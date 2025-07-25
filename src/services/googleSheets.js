// Servicio para integración con Google Sheets
// Este servicio maneja la conexión y lectura de datos desde Google Sheets

class GoogleSheetsService {
  constructor() {
    this.spreadsheetId = null;
    this.apiKey = null;
    this.range = 'Pedidos!A1:O1000'; // Rango específico para la hoja "Pedidos"
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
