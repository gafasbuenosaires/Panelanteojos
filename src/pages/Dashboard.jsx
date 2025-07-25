import React, { useState, useEffect } from 'react';
import { useDemoData } from '../data/demoData';
import {
  CurrencyDollarIcon,
  UsersIcon,
  TrendingUpIcon,
  TrendingDownIcon,
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { vendedores, movimientosCaja, stats } = useDemoData();
  const [loading, setLoading] = useState(true);

  // Simular carga
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Obtener los últimos 5 movimientos
  const recentMovements = movimientosCaja.slice(0, 5);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header con gradiente */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
            <p className="text-blue-100 text-lg">
              Bienvenido al panel de control OptiControl
            </p>
            <div className="mt-4 flex items-center space-x-4 text-sm">
              <span className="bg-white/20 px-3 py-1 rounded-full">
                📊 Tiempo Real
              </span>
              <span className="bg-white/20 px-3 py-1 rounded-full">
                👥 {vendedores.length} Vendedores
              </span>
              <span className="bg-white/20 px-3 py-1 rounded-full">
                📈 Sistema Activo
              </span>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center">
              <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards con diseño moderno */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card bg-gradient-to-br from-green-400 to-green-600 text-white border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Total en Caja</p>
              <p className="text-3xl font-bold mt-2">
                {formatCurrency(stats.totalCaja)}
              </p>
              <div className="flex items-center mt-2">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Disponible</span>
              </div>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <CurrencyDollarIcon className="h-8 w-8" />
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-blue-400 to-blue-600 text-white border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Saldo Vendedores</p>
              <p className="text-3xl font-bold mt-2">
                {formatCurrency(stats.totalVendedores)}
              </p>
              <div className="flex items-center mt-2">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
                <span className="text-sm">{vendedores.length} vendedores</span>
              </div>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <UsersIcon className="h-8 w-8" />
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-emerald-400 to-emerald-600 text-white border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm font-medium">Ingresos Total</p>
              <p className="text-3xl font-bold mt-2">
                {formatCurrency(stats.ingresos)}
              </p>
              <div className="flex items-center mt-2">
                <TrendingUpIcon className="w-4 h-4 mr-1" />
                <span className="text-sm">Acumulado</span>
              </div>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <TrendingUpIcon className="h-8 w-8" />
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-red-400 to-red-600 text-white border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Egresos Total</p>
              <p className="text-3xl font-bold mt-2">
                {formatCurrency(stats.egresos)}
              </p>
              <div className="flex items-center mt-2">
                <TrendingDownIcon className="w-4 h-4 mr-1" />
                <span className="text-sm">Gastos</span>
              </div>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <TrendingDownIcon className="h-8 w-8" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Movements con diseño moderno */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              Últimos Movimientos
            </h3>
            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
              {recentMovements.length} movimientos
            </span>
          </div>
          <div className="space-y-4">
            {recentMovements.length > 0 ? (
              recentMovements.map((movement) => (
                <div key={movement.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                      movement.tipo === 'ingreso' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {movement.tipo === 'ingreso' ? (
                        <TrendingUpIcon className="w-5 h-5 text-green-600" />
                      ) : (
                        <TrendingDownIcon className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{movement.descripcion}</p>
                      <p className="text-sm text-gray-500">{formatDate(movement.fecha)}</p>
                    </div>
                  </div>
                  <div className={`font-bold text-lg ${
                    movement.tipo === 'ingreso' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {movement.tipo === 'ingreso' ? '+' : '-'}{formatCurrency(movement.monto)}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className="text-gray-500">No hay movimientos recientes</p>
              </div>
            )}
          </div>
        </div>

        {/* Vendors Summary con diseño moderno */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <UsersIcon className="w-5 h-5 text-purple-600" />
              </div>
              Resumen Vendedores
            </h3>
            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
              {vendedores.length} activos
            </span>
          </div>
          <div className="space-y-4">
            {vendedores.length > 0 ? (
              vendedores.map((vendedor) => (
                <div key={vendedor.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
                      <span className="text-white font-bold text-sm">
                        {vendedor.nombre.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{vendedor.nombre}</p>
                      <p className="text-sm text-gray-500">{vendedor.email}</p>
                    </div>
                  </div>
                  <div className={`font-bold text-lg ${
                    vendedor.saldo >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(vendedor.saldo || 0)}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UsersIcon className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500">No hay vendedores registrados</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
