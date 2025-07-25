import React, { useState, useEffect } from 'react';
import { useDemoData } from '../data/demoData';
import { PlusIcon, UserIcon } from '@heroicons/react/24/outline';

const Vendedores = () => {
  const { vendedores: demoVendedores } = useDemoData();
  const [vendedores, setVendedores] = useState(demoVendedores);
  const [showModal, setShowModal] = useState(false);
  const [selectedVendedor, setSelectedVendedor] = useState(null);
  const [newVendedor, setNewVendedor] = useState({
    nombre: '',
    email: '',
    saldo: 0
  });
  const [cobro, setCobro] = useState({
    monto: '',
    descripcion: ''
  });
  const [loading, setLoading] = useState(true);

  // Simular carga
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleAddVendedor = async (e) => {
    e.preventDefault();
    try {
      const nuevoVendedor = {
        id: Date.now().toString(),
        ...newVendedor,
        saldo: Number(newVendedor.saldo),
        fechaCreacion: new Date()
      };
      setVendedores([...vendedores, nuevoVendedor]);
      setNewVendedor({ nombre: '', email: '', saldo: 0 });
      setShowModal(false);
    } catch (error) {
      console.error('Error al agregar vendedor:', error);
    }
  };

  const handleCobro = async (e) => {
    e.preventDefault();
    if (!selectedVendedor) return;

    try {
      const montoNumerico = Number(cobro.monto);
      const nuevoSaldo = selectedVendedor.saldo - montoNumerico;

      // Actualizar vendedores localmente
      setVendedores(vendedores.map(v => 
        v.id === selectedVendedor.id 
          ? { ...v, saldo: nuevoSaldo }
          : v
      ));

      setCobro({ monto: '', descripcion: '' });
      setSelectedVendedor(null);
      
      // Simular notificación
      alert(`Cobro registrado: $${montoNumerico.toLocaleString()} de ${selectedVendedor.nombre}`);
    } catch (error) {
      console.error('Error al procesar cobro:', error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
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
          <h1 className="text-3xl font-bold text-gray-900">Vendedores</h1>
          <p className="mt-2 text-gray-600">
            Gestión de vendedores y sus cuentas corrientes
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Agregar Vendedor
        </button>
      </div>

      {/* Vendedores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vendedores.map((vendedor) => (
          <div key={vendedor.id} className="card">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <UserIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">
                  {vendedor.nombre}
                </h3>
                <p className="text-sm text-gray-500">{vendedor.email}</p>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-500">Saldo Actual</p>
              <p className={`text-2xl font-bold ${
                vendedor.saldo >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatCurrency(vendedor.saldo || 0)}
              </p>
            </div>

            <button
              onClick={() => setSelectedVendedor(vendedor)}
              className="w-full btn-primary"
            >
              Registrar Cobro
            </button>
          </div>
        ))}
      </div>

      {/* Modal para agregar vendedor */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Agregar Nuevo Vendedor
            </h3>
            <form onSubmit={handleAddVendedor} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nombre
                </label>
                <input
                  type="text"
                  required
                  className="input-field mt-1"
                  value={newVendedor.nombre}
                  onChange={(e) => setNewVendedor({
                    ...newVendedor,
                    nombre: e.target.value
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  required
                  className="input-field mt-1"
                  value={newVendedor.email}
                  onChange={(e) => setNewVendedor({
                    ...newVendedor,
                    email: e.target.value
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Saldo Inicial
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="input-field mt-1"
                  value={newVendedor.saldo}
                  onChange={(e) => setNewVendedor({
                    ...newVendedor,
                    saldo: e.target.value
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

      {/* Modal para registrar cobro */}
      {selectedVendedor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Registrar Cobro - {selectedVendedor.nombre}
            </h3>
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Saldo Actual</p>
              <p className={`text-xl font-bold ${
                selectedVendedor.saldo >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatCurrency(selectedVendedor.saldo)}
              </p>
            </div>
            <form onSubmit={handleCobro} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Monto a Cobrar
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  className="input-field mt-1"
                  value={cobro.monto}
                  onChange={(e) => setCobro({
                    ...cobro,
                    monto: e.target.value
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Descripción (opcional)
                </label>
                <input
                  type="text"
                  className="input-field mt-1"
                  placeholder="Cobro quincenal"
                  value={cobro.descripcion}
                  onChange={(e) => setCobro({
                    ...cobro,
                    descripcion: e.target.value
                  })}
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setSelectedVendedor(null)}
                  className="btn-secondary flex-1"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary flex-1">
                  Registrar Cobro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vendedores;
