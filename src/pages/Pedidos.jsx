import React, { useState, useEffect } from 'react';
import { useDemoData } from '../data/demoData';
import { 
  PlusIcon, 
  ClipboardDocumentListIcon,
  CheckIcon,
  XMarkIcon,
  ClockIcon 
} from '@heroicons/react/24/outline';

const Pedidos = () => {
  const { pedidos: demoPedidos } = useDemoData();
  const [pedidos, setPedidos] = useState(demoPedidos);
  const [showModal, setShowModal] = useState(false);
  const [nuevoPedido, setNuevoPedido] = useState({
    cliente: '',
    descripcion: '',
    monto: '',
    estado: 'pendiente',
    fechaEntrega: ''
  });
  const [loading, setLoading] = useState(true);

  // Simular carga
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const estados = [
    { value: 'pendiente', label: 'Pendiente', color: 'yellow' },
    { value: 'en_proceso', label: 'En Proceso', color: 'blue' },
    { value: 'completado', label: 'Completado', color: 'green' },
    { value: 'cancelado', label: 'Cancelado', color: 'red' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const nuevoPed = {
        id: Date.now().toString(),
        ...nuevoPedido,
        monto: Number(nuevoPedido.monto),
        fechaCreacion: new Date(),
        fechaEntrega: nuevoPedido.fechaEntrega ? new Date(nuevoPedido.fechaEntrega) : null
      };
      
      setPedidos([nuevoPed, ...pedidos]);
      
      setNuevoPedido({
        cliente: '',
        descripcion: '',
        monto: '',
        estado: 'pendiente',
        fechaEntrega: ''
      });
      setShowModal(false);
      
      alert(`Pedido creado para ${nuevoPedido.cliente} - $${Number(nuevoPedido.monto).toLocaleString()}`);
    } catch (error) {
      console.error('Error al agregar pedido:', error);
    }
  };

  const updateEstado = async (pedidoId, nuevoEstado) => {
    try {
      setPedidos(pedidos.map(p => 
        p.id === pedidoId 
          ? { ...p, estado: nuevoEstado }
          : p
      ));
      
      const pedido = pedidos.find(p => p.id === pedidoId);
      alert(`Estado actualizado: ${pedido?.cliente} → ${nuevoEstado}`);
    } catch (error) {
      console.error('Error al actualizar estado:', error);
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
      year: 'numeric'
    }).format(date);
  };

  const getEstadoColor = (estado) => {
    const estadoObj = estados.find(e => e.value === estado);
    return estadoObj ? estadoObj.color : 'gray';
  };

  const getEstadoLabel = (estado) => {
    const estadoObj = estados.find(e => e.value === estado);
    return estadoObj ? estadoObj.label : estado;
  };

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case 'completado':
        return <CheckIcon className="h-4 w-4" />;
      case 'cancelado':
        return <XMarkIcon className="h-4 w-4" />;
      case 'en_proceso':
        return <ClockIcon className="h-4 w-4" />;
      default:
        return <ClipboardDocumentListIcon className="h-4 w-4" />;
    }
  };

  const stats = {
    total: pedidos.length,
    pendientes: pedidos.filter(p => p.estado === 'pendiente').length,
    enProceso: pedidos.filter(p => p.estado === 'en_proceso').length,
    completados: pedidos.filter(p => p.estado === 'completado').length,
    montoTotal: pedidos.reduce((sum, p) => sum + (p.monto || 0), 0)
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
          <h1 className="text-3xl font-bold text-gray-900">Pedidos</h1>
          <p className="mt-2 text-gray-600">
            Gestión de pedidos y estado de entregas
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Nuevo Pedido
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="card">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-sm text-gray-500">Total Pedidos</p>
          </div>
        </div>
        <div className="card">
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">{stats.pendientes}</p>
            <p className="text-sm text-gray-500">Pendientes</p>
          </div>
        </div>
        <div className="card">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.enProceso}</p>
            <p className="text-sm text-gray-500">En Proceso</p>
          </div>
        </div>
        <div className="card">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{stats.completados}</p>
            <p className="text-sm text-gray-500">Completados</p>
          </div>
        </div>
        <div className="card">
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">{formatCurrency(stats.montoTotal)}</p>
            <p className="text-sm text-gray-500">Monto Total</p>
          </div>
        </div>
      </div>

      {/* Pedidos Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {pedidos.map((pedido) => (
          <div key={pedido.id} className="card">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {pedido.cliente}
                </h3>
                <p className="text-sm text-gray-500">
                  {formatDate(pedido.fechaCreacion)}
                </p>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${getEstadoColor(pedido.estado)}-100 text-${getEstadoColor(pedido.estado)}-800`}>
                {getEstadoIcon(pedido.estado)}
                <span className="ml-1">{getEstadoLabel(pedido.estado)}</span>
              </span>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">{pedido.descripcion}</p>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(pedido.monto || 0)}
              </p>
              {pedido.fechaEntrega && (
                <p className="text-sm text-gray-500 mt-1">
                  Entrega: {formatDate(pedido.fechaEntrega)}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <select
                value={pedido.estado}
                onChange={(e) => updateEstado(pedido.id, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {estados.map(estado => (
                  <option key={estado.value} value={estado.value}>
                    {estado.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>

      {pedidos.length === 0 && (
        <div className="text-center py-12">
          <ClipboardDocumentListIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay pedidos</h3>
          <p className="mt-1 text-sm text-gray-500">
            Comienza agregando un nuevo pedido
          </p>
        </div>
      )}

      {/* Modal para nuevo pedido */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Nuevo Pedido
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Cliente
                </label>
                <input
                  type="text"
                  required
                  className="input-field mt-1"
                  value={nuevoPedido.cliente}
                  onChange={(e) => setNuevoPedido({
                    ...nuevoPedido,
                    cliente: e.target.value
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
                  value={nuevoPedido.descripcion}
                  onChange={(e) => setNuevoPedido({
                    ...nuevoPedido,
                    descripcion: e.target.value
                  })}
                />
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
                  value={nuevoPedido.monto}
                  onChange={(e) => setNuevoPedido({
                    ...nuevoPedido,
                    monto: e.target.value
                  })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Fecha de Entrega (opcional)
                </label>
                <input
                  type="date"
                  className="input-field mt-1"
                  value={nuevoPedido.fechaEntrega}
                  onChange={(e) => setNuevoPedido({
                    ...nuevoPedido,
                    fechaEntrega: e.target.value
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
                  Crear Pedido
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pedidos;
