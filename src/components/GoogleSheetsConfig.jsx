// Componente para configurar la conexión con Google Sheets
import { useState } from 'react';

function GoogleSheetsConfig({ onConfigSave, currentConfig, onTestConnection }) {
  const [config, setConfig] = useState({
    spreadsheetId: currentConfig?.spreadsheetId || '',
    apiKey: currentConfig?.apiKey || '',
    range: currentConfig?.range || 'Sheet1!A1:Z1000',
    ...currentConfig
  });

  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const handleSave = () => {
    if (!config.spreadsheetId || !config.apiKey) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    onConfigSave(config);
    alert('Configuración guardada exitosamente');
  };

  const handleTestConnection = async () => {
    if (!config.spreadsheetId || !config.apiKey) {
      alert('Por favor completa la configuración antes de probar');
      return;
    }

    setIsTestingConnection(true);
    setTestResult(null);

    try {
      const result = await onTestConnection(config);
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        message: error.message
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const extractSpreadsheetId = (url) => {
    // Extraer ID de una URL de Google Sheets
    const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : url;
  };

  const handleUrlChange = (url) => {
    const id = extractSpreadsheetId(url);
    setConfig({
      ...config,
      spreadsheetId: id
    });
  };

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
      border: '1px solid #e2e8f0',
      marginBottom: '24px'
    }}>
      <div style={{
        backgroundColor: '#f0f9ff',
        padding: '20px 24px',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <h3 style={{
          margin: 0,
          fontSize: '18px',
          fontWeight: '600',
          color: '#0f172a'
        }}>
          📊 Configuración de Google Sheets
        </h3>
        <p style={{
          margin: '8px 0 0 0',
          fontSize: '14px',
          color: '#6b7280'
        }}>
          Conecta tu hoja de Google Sheets para importar pedidos automáticamente
        </p>
      </div>

      <div style={{ padding: '24px' }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: '500',
            color: '#374151'
          }}>
            URL o ID de Google Sheets *
          </label>
          <input
            type="text"
            value={config.spreadsheetId}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder="https://docs.google.com/spreadsheets/d/[ID]/... o solo el ID"
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              fontFamily: 'monospace'
            }}
          />
          <p style={{
            margin: '4px 0 0 0',
            fontSize: '12px',
            color: '#6b7280'
          }}>
            Puedes pegar la URL completa o solo el ID del spreadsheet
          </p>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: '500',
            color: '#374151'
          }}>
            API Key de Google Sheets *
          </label>
          <input
            type="password"
            value={config.apiKey}
            onChange={(e) => setConfig({...config, apiKey: e.target.value})}
            placeholder="AIza..."
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              fontFamily: 'monospace'
            }}
          />
          <p style={{
            margin: '4px 0 0 0',
            fontSize: '12px',
            color: '#6b7280'
          }}>
            <a href="https://console.cloud.google.com/apis/credentials" target="_blank" style={{ color: '#3b82f6' }}>
              Obtén tu API Key aquí
            </a>
          </p>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: '500',
            color: '#374151'
          }}>
            Rango de celdas
          </label>
          <input
            type="text"
            value={config.range}
            onChange={(e) => setConfig({...config, range: e.target.value})}
            placeholder="Sheet1!A1:Z1000"
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              fontFamily: 'monospace'
            }}
          />
          <p style={{
            margin: '4px 0 0 0',
            fontSize: '12px',
            color: '#6b7280'
          }}>
            Especifica el rango de celdas a leer (ej: Sheet1!A1:F100)
          </p>
        </div>

        {/* Resultado del test */}
        {testResult && (
          <div style={{
            padding: '12px',
            borderRadius: '8px',
            backgroundColor: testResult.success ? '#ecfdf5' : '#fef2f2',
            border: `1px solid ${testResult.success ? '#d1fae5' : '#fecaca'}`,
            marginBottom: '20px'
          }}>
            <p style={{
              margin: 0,
              fontSize: '14px',
              color: testResult.success ? '#065f46' : '#dc2626',
              fontWeight: '500'
            }}>
              {testResult.success ? '✅ ' : '❌ '}
              {testResult.message}
            </p>
          </div>
        )}

        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={handleTestConnection}
            disabled={isTestingConnection}
            style={{
              padding: '10px 20px',
              backgroundColor: '#f3f4f6',
              color: '#374151',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: isTestingConnection ? 'not-allowed' : 'pointer',
              opacity: isTestingConnection ? 0.6 : 1
            }}
          >
            {isTestingConnection ? '🔄 Probando...' : '🔗 Probar Conexión'}
          </button>

          <button
            onClick={handleSave}
            style={{
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            💾 Guardar Configuración
          </button>
        </div>

        {/* Instrucciones */}
        <div style={{
          marginTop: '24px',
          padding: '16px',
          backgroundColor: '#f8fafc',
          borderRadius: '8px',
          border: '1px solid #e2e8f0'
        }}>
          <h4 style={{
            margin: '0 0 12px 0',
            fontSize: '14px',
            fontWeight: '600',
            color: '#374151'
          }}>
            📋 Instrucciones de configuración:
          </h4>
          <ol style={{
            margin: 0,
            paddingLeft: '20px',
            fontSize: '13px',
            color: '#6b7280',
            lineHeight: '1.5'
          }}>
            <li>Asegúrate de que tu Google Sheet sea público o compartido</li>
            <li>La primera fila debe contener los headers (Cliente, Descripción, Monto, Estado, etc.)</li>
            <li>Obtén una API Key desde Google Cloud Console</li>
            <li>Habilita la API de Google Sheets en tu proyecto</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default GoogleSheetsConfig;
