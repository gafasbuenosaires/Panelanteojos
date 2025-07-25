import React from 'react';

const DemoInstructions = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            OptiControl - Panel Demo
          </h1>
          <p className="text-xl text-gray-600">
            Sistema de gestión para empresa de anteojos
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              🚀 Modo Demo
            </h2>
            <p className="text-gray-600 mb-6">
              Puedes probar la interfaz sin configurar Firebase. Usa estos datos de prueba:
            </p>
            
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-xl">
                <h3 className="font-semibold text-blue-900 mb-2">📧 Emails de prueba:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• admin1@opticontrol.com</li>
                  <li>• admin2@opticontrol.com</li>
                  <li>• admin3@opticontrol.com</li>
                  <li>• ... hasta admin6@opticontrol.com</li>
                </ul>
              </div>
              
              <div className="bg-green-50 p-4 rounded-xl">
                <h3 className="font-semibold text-green-900 mb-2">🔑 Contraseña:</h3>
                <p className="text-sm text-green-800">Cualquier contraseña de 3+ caracteres</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              🔧 Configuración Real
            </h2>
            <p className="text-gray-600 mb-6">
              Para usar en producción, sigue estos pasos:
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                  <span className="text-blue-600 text-sm font-bold">1</span>
                </div>
                <p className="text-sm text-gray-700">Crear proyecto en Firebase Console</p>
              </div>
              
              <div className="flex items-start">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                  <span className="text-blue-600 text-sm font-bold">2</span>
                </div>
                <p className="text-sm text-gray-700">Habilitar Authentication y Firestore</p>
              </div>
              
              <div className="flex items-start">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                  <span className="text-blue-600 text-sm font-bold">3</span>
                </div>
                <p className="text-sm text-gray-700">Actualizar src/config/firebase.js</p>
              </div>
              
              <div className="flex items-start">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                  <span className="text-blue-600 text-sm font-bold">4</span>
                </div>
                <p className="text-sm text-gray-700">Configurar emails en AuthContext.jsx</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">✨ Características del Sistema</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                📊
              </div>
              <h3 className="font-semibold mb-2">Dashboard</h3>
              <p className="text-sm text-blue-100">Resumen en tiempo real</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                👥
              </div>
              <h3 className="font-semibold mb-2">Vendedores</h3>
              <p className="text-sm text-blue-100">Gestión de cuentas</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                💰
              </div>
              <h3 className="font-semibold mb-2">Caja</h3>
              <p className="text-sm text-blue-100">Control financiero</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                📋
              </div>
              <h3 className="font-semibold mb-2">Pedidos</h3>
              <p className="text-sm text-blue-100">Seguimiento completo</p>
            </div>
          </div>
          
          <div className="mt-8">
            <a
              href="http://localhost:5174"
              className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
            >
              Probar el Sistema
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoInstructions;
