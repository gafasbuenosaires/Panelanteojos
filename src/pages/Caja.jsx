import React, { useState, useEffect } from 'react';
import { useDemoData } from '../data/demoData';
import { PlusIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';

const Caja = () => {
  const { movimientosCaja: demoMovimientos, stats: demoStats } = useDemoData();
  const [movimientos, setMovimientos] = useState(demoMovimientos);
  const [showModal, setShowModal] = useState(false);
  const [nuevoMovimiento, setNuevoMovimiento] = useState({
    tipo: 'ingreso',
    monto: '',
    descripcion: '',
    categoria: ''
  });
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(demoStats);

  // Simular carga
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const categorias = {
    ingreso: [
      'venta',
      'cobro_vendedor',
      'devolucion',
      'ajuste_positivo',
      'otro'
    ],
    egreso: [
      'compra_mercaderia',
      'gastos_operativos',
      'sueldos',
      'alquiler',
      'servicios',
      'impuestos',
      'ajuste_negativo',
      'otro'
    ]
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const nuevoMov = {
        id: Date.now().toString(),
        ...nuevoMovimiento,
        monto: Number(nuevoMovimiento.monto),
        fecha: new Date()
      };
      
      setMovimientos([nuevoMov, ...movimientos]);
      
      // Actualizar stats
      const montoNumerico = Number(nuevoMovimiento.monto);
      if (nuevoMovimiento.tipo === 'ingreso') {
        setStats(prev => ({
          ...prev,
          totalIngresos: prev.totalIngresos + montoNumerico,
          saldoActual: prev.saldoActual + montoNumerico
        }));
      } else {
        setStats(prev => ({
          ...prev,
          totalEgresos: prev.totalEgresos + montoNumerico,
          saldoActual: prev.saldoActual - montoNumerico
        }));
      }
      
      setNuevoMovimiento({
        tipo: 'ingreso',
        monto: '',
        descripcion: '',
        categoria: ''
      });
      setShowModal(false);
      
      alert(`Movimiento registrado: ${nuevoMovimiento.tipo} por $${montoNumerico.toLocaleString()}`);
    } catch (error) {
      console.error('Error al agregar movimiento:', error);
    }
  };

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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Caja</h1>
          <p className="mt-2 text-gray-600">
            Gestión de ingresos y egresos de la empresa
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Nuevo Movimiento
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <ArrowUpIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Ingresos</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(stats.totalIngresos)}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100">
              <ArrowDownIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Egresos</p>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(stats.totalEgresos)}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className={`p-3 rounded-full ${
              stats.saldoActual >= 0 ? 'bg-blue-100' : 'bg-yellow-100'
            }`}>
              <svg
                className={`h-6 w-6 ${
                  stats.saldoActual >= 0 ? 'text-blue-600' : 'text-yellow-600'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Saldo Actual</p>
              <p className={`text-2xl font-bold ${
                stats.saldoActual >= 0 ? 'text-blue-600' : 'text-yellow-600'
              }`}>
                {formatCurrency(stats.saldoActual)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Movements Table */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Historial de Movimientos
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monto
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {movimientos.map((movimiento) => (
                <tr key={movimiento.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(movimiento.fecha)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      movimiento.tipo === 'ingreso'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {movimiento.tipo === 'ingreso' ? 'Ingreso' : 'Egreso'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {movimiento.descripcion}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {movimiento.categoria}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${
                    movimiento.tipo === 'ingreso' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {movimiento.tipo === 'ingreso' ? '+' : '-'}{formatCurrency(movimiento.monto)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para nuevo movimiento */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Nuevo Movimiento
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tipo
                </label>
                <select
                  className="input-field mt-1"
                  value={nuevoMovimiento.tipo}
                  onChange={(e) => setNuevoMovimiento({
                    ...nuevoMovimiento,
                    tipo: e.target.value,
                    categoria: ''
                  })}
                >
                  <option value="ingreso">Ingreso</option>
                  <option value="egreso">Egreso</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Categoría
                </label>
                <select
                  className="input-field mt-1"
                  value={nuevoMovimiento.categoria}
                  onChange={(e) => setNuevoMovimiento({
                    ...nuevoMovimiento,
                    categoria: e.target.value
                  })}
                  required
                >
                  <option value="">Seleccionar categoría</option>
                  {categorias[nuevoMovimiento.tipo].map(cat => (
                    <option key={cat} value={cat}>
                      {cat.replace('_', ' ').charAt(0).toUpperCase() + cat.replace('_', ' ').slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Monto
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  className="input-field mt-1"
                  value={nuevoMovimiento.monto}
                  onChange={(e) => setNuevoMovimiento({
                    ...nuevoMovimiento,
                    monto: e.target.value
                  })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Descripción
                </label>
                <textarea
                  rows={3}
                  required
                  className="input-field mt-1"
                  value={nuevoMovimiento.descripcion}
                  onChange={(e) => setNuevoMovimiento({
                    ...nuevoMovimiento,
                    descripcion: e.target.value
                  })}
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary flex-1">
                  Agregar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Caja;
