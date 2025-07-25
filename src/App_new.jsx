import { useState } from 'react';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Login temporal
  const handleLogin = (email, password) => {
    if (email === 'admin@malnacont.com' && password === 'admin123') {
      setUser({ email, nombre: 'Administrador' });
      setIsLoggedIn(true);
    } else {
      alert('Credenciales incorrectas');
    }
  };

  if (!isLoggedIn) {
    return <LoginComponent onLogin={handleLogin} />;
  }

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", sans-serif'
    }}>
      {/* Sidebar */}
      <div style={{
        width: '280px',
        background: 'linear-gradient(180deg, #1e293b 0%, #334155 100%)',
        color: 'white',
        padding: '24px 0',
        boxShadow: '4px 0 12px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ padding: '0 24px', marginBottom: '32px' }}>
          <h1 style={{ 
            margin: 0, 
            fontSize: '24px', 
            fontWeight: '700',
            letterSpacing: '-0.5px'
          }}>
            👓 MalnaCont
          </h1>
          <p style={{ margin: '4px 0 0 0', color: '#94a3b8', fontSize: '14px' }}>
            Panel de Control
          </p>
        </div>

        <nav>
          {[
            { id: 'dashboard', icon: '📊', label: 'Dashboard' },
            { id: 'vendedores', icon: '👥', label: 'Vendedores' },
            { id: 'caja', icon: '💰', label: 'Control de Caja' },
            { id: 'pedidos', icon: '📋', label: 'Pedidos' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              style={{
                width: '100%',
                padding: '16px 24px',
                background: currentView === item.id ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                border: 'none',
                color: currentView === item.id ? '#60a5fa' : '#cbd5e1',
                fontSize: '15px',
                fontWeight: '500',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                borderLeft: currentView === item.id ? '3px solid #3b82f6' : '3px solid transparent'
              }}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>

        <div style={{ 
          position: 'absolute', 
          bottom: '24px', 
          left: '24px', 
          right: '24px' 
        }}>
          <button
            onClick={() => setIsLoggedIn(false)}
            style={{
              width: '100%',
              padding: '12px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              color: '#fca5a5',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            🚪 Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, backgroundColor: '#f8fafc' }}>
        <div style={{
          padding: '32px 40px',
          borderBottom: '1px solid #e2e8f0',
          backgroundColor: 'white'
        }}>
          <h2 style={{ 
            margin: 0, 
            fontSize: '32px', 
            fontWeight: '700', 
            color: '#0f172a',
            letterSpacing: '-0.5px'
          }}>
            {currentView === 'dashboard' && '📊 Dashboard'}
            {currentView === 'vendedores' && '👥 Gestión de Vendedores'}
            {currentView === 'caja' && '💰 Control de Caja'}
            {currentView === 'pedidos' && '📋 Gestión de Pedidos'}
          </h2>
        </div>

        <div style={{ padding: '40px' }}>
          {currentView === 'dashboard' && <DashboardSection />}
          {currentView === 'vendedores' && <VendedoresSection />}
          {currentView === 'caja' && <CajaSection />}
          {currentView === 'pedidos' && <PedidosSection />}
        </div>
      </div>
    </div>
  );
}

// Componente de Login
function LoginComponent({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", sans-serif'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '48px',
        borderRadius: '20px',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.2)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ 
            fontSize: '48px', 
            margin: '0 0 16px 0'
          }}>👓</h1>
          <h2 style={{ 
            margin: 0, 
            fontSize: '28px', 
            fontWeight: '700',
            color: '#1f2937',
            letterSpacing: '-0.5px'
          }}>
            MalnaCont
          </h2>
          <p style={{ 
            margin: '8px 0 0 0', 
            color: '#6b7280',
            fontSize: '16px'
          }}>
            Panel de Control
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600', 
              color: '#374151'
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@malnacont.com"
              style={{
                width: '100%',
                padding: '16px',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600', 
              color: '#374151'
            }}>
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '16px',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
              required
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '16px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'transform 0.2s ease'
            }}
            onMouseDown={(e) => e.target.style.transform = 'scale(0.98)'}
            onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
          >
            🔑 Iniciar Sesión
          </button>
        </form>

        <div style={{ 
          marginTop: '24px', 
          padding: '16px', 
          backgroundColor: '#f3f4f6', 
          borderRadius: '8px',
          fontSize: '14px',
          color: '#6b7280',
          textAlign: 'center'
        }}>
          <strong>Demo:</strong> admin@malnacont.com / admin123
        </div>
      </div>
    </div>
  );
}

// Componente Dashboard
function DashboardSection() {
  return (
    <div>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '24px', 
        marginBottom: '32px' 
      }}>
        <StatsCard 
          title="Ventas del Mes" 
          value="$125,400" 
          color="#10b981"
          subtitle="↗ +12% vs mes anterior"
        />
        <StatsCard 
          title="Vendedores Activos" 
          value="8" 
          color="#3b82f6"
          subtitle="2 nuevos este mes"
        />
        <StatsCard 
          title="Pedidos Pendientes" 
          value="23" 
          color="#f59e0b"
          subtitle="5 urgentes"
        />
        <StatsCard 
          title="Saldo en Caja" 
          value="$45,230" 
          color="#8b5cf6"
          subtitle="Último movimiento: hace 2h"
        />
      </div>

      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '16px', 
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
      }}>
        <h3 style={{ 
          margin: '0 0 16px 0', 
          fontSize: '20px', 
          fontWeight: '600',
          color: '#1f2937'
        }}>
          📈 Resumen de Actividad
        </h3>
        <p style={{ color: '#6b7280', margin: 0 }}>
          Panel en desarrollo. Aquí se mostrarán gráficos y métricas detalladas.
        </p>
      </div>
    </div>
  );
}

// Componente de Vendedores
function VendedoresSection() {
  const [vendedores, setVendedores] = useState([
    { 
      id: 1, 
      nombre: 'Ana García', 
      email: 'ana@empresa.com', 
      dni: '12345678',
      telefono: '+54 11 1234-5678',
      direccion: 'Av. Corrientes 1234, CABA',
      fechaNacimiento: '1990-05-15',
      fechaIngreso: '2024-01-15',
      saldo: 2500, 
      activo: true 
    },
    { 
      id: 2, 
      nombre: 'Carlos López', 
      email: 'carlos@empresa.com', 
      dni: '23456789',
      telefono: '+54 11 2345-6789',
      direccion: 'Av. Santa Fe 5678, CABA',
      fechaNacimiento: '1985-08-22',
      fechaIngreso: '2023-11-10',
      saldo: -800, 
      activo: true 
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [showDetalleVendedor, setShowDetalleVendedor] = useState(false);
  const [selectedVendedor, setSelectedVendedor] = useState(null);
  const [modalType, setModalType] = useState('agregar');
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    dni: '',
    telefono: '',
    direccion: '',
    fechaNacimiento: '',
    monto: '',
    descripcion: '',
    concepto: '',
    numeroOptica: ''
  });

  // Datos de movimientos de vendedores
  const [movimientosVendedores, setMovimientosVendedores] = useState([
    {
      id: 1,
      vendedorId: 1,
      fecha: '2025-01-20',
      tipo: 'haber',
      monto: 3000,
      concepto: 'Comisión por ventas',
      descripcion: 'Comisión mensual enero 2025',
      numeroOptica: '001'
    },
    {
      id: 2,
      vendedorId: 1,
      fecha: '2025-01-22',
      tipo: 'debe',
      monto: 500,
      concepto: 'Descuento',
      descripcion: 'Descuento por producto defectuoso',
      numeroOptica: '002'
    }
  ]);

  return (
    <div>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px', 
        marginBottom: '32px' 
      }}>
        <StatsCard 
          title="Total Vendedores" 
          value={vendedores.length} 
          color="#3b82f6"
          subtitle={`${vendedores.filter(v => v.activo).length} activos`}
        />
        <StatsCard 
          title="Vendedores Activos" 
          value={vendedores.filter(v => v.activo).length} 
          color="#10b981"
          subtitle={`${Math.round((vendedores.filter(v => v.activo).length / vendedores.length) * 100)}% del total`}
        />
        <StatsCard 
          title="Saldo Total" 
          value={`$${vendedores.reduce((sum, v) => sum + v.saldo, 0).toLocaleString()}`} 
          color="#f59e0b"
          subtitle={`${vendedores.filter(v => v.saldo > 0).length} con saldo positivo`}
        />
      </div>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{
          backgroundColor: '#fafbfc',
          padding: '20px 24px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{
            margin: 0,
            fontSize: '18px',
            fontWeight: '600',
            color: '#0f172a'
          }}>
            📋 Lista de Vendedores ({vendedores.length})
          </h3>
          <button
            onClick={() => {
              setModalType('agregar');
              setFormData({
                nombre: '',
                email: '',
                dni: '',
                telefono: '',
                direccion: '',
                fechaNacimiento: '',
                monto: '',
                descripcion: '',
                concepto: '',
                numeroOptica: ''
              });
              setShowModal(true);
            }}
            style={{
              padding: '12px 20px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            ➕ Agregar Vendedor
          </button>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#fafbfc' }}>
              <th style={{ 
                padding: '20px 24px', 
                textAlign: 'left', 
                fontWeight: '600', 
                color: '#374151',
                fontSize: '14px'
              }}>Vendedor</th>
              <th style={{ 
                padding: '20px 24px', 
                textAlign: 'left', 
                fontWeight: '600', 
                color: '#374151',
                fontSize: '14px'
              }}>DNI</th>
              <th style={{ 
                padding: '20px 24px', 
                textAlign: 'left', 
                fontWeight: '600', 
                color: '#374151',
                fontSize: '14px'
              }}>Email</th>
              <th style={{ 
                padding: '20px 24px', 
                textAlign: 'center', 
                fontWeight: '600', 
                color: '#374151',
                fontSize: '14px'
              }}>Saldo</th>
              <th style={{ 
                padding: '20px 24px', 
                textAlign: 'center', 
                fontWeight: '600', 
                color: '#374151',
                fontSize: '14px'
              }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {vendedores.map((vendedor, index) => (
              <tr key={vendedor.id} style={{ 
                borderBottom: index < vendedores.length - 1 ? '1px solid #f1f5f9' : 'none'
              }}>
                <td style={{ padding: '20px 24px' }}>
                  <div style={{ 
                    fontWeight: '600', 
                    color: '#1f2937',
                    fontSize: '15px',
                    marginBottom: '4px'
                  }}>
                    {vendedor.nombre}
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: '#94a3b8'
                  }}>
                    {movimientosVendedores.filter(m => m.vendedorId === vendedor.id).length} movimientos
                  </div>
                </td>
                <td style={{ 
                  padding: '20px 24px', 
                  color: '#64748b',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  {vendedor.dni || 'Sin DNI'}
                </td>
                <td style={{ 
                  padding: '20px 24px', 
                  color: '#64748b',
                  fontSize: '14px'
                }}>
                  {vendedor.email}
                </td>
                <td style={{ 
                  padding: '20px 24px', 
                  textAlign: 'center'
                }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: '600',
                    backgroundColor: vendedor.saldo >= 0 ? '#dcfce7' : '#fee2e2',
                    color: vendedor.saldo >= 0 ? '#166534' : '#991b1b'
                  }}>
                    ${vendedor.saldo.toLocaleString()}
                  </div>
                </td>
                <td style={{ 
                  padding: '20px 24px', 
                  textAlign: 'center'
                }}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    <button
                      onClick={() => {
                        setSelectedVendedor(vendedor);
                        setShowDetalleVendedor(true);
                      }}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: '#3b82f6',
                        border: 'none',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      👁️ Ver
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Detalles del Vendedor */}
      {showDetalleVendedor && selectedVendedor && (
        <DetalleVendedorModal 
          vendedor={selectedVendedor}
          movimientos={movimientosVendedores.filter(m => m.vendedorId === selectedVendedor.id)}
          onClose={() => setShowDetalleVendedor(false)}
        />
      )}
    </div>
  );
}

// Modal de Detalles del Vendedor
function DetalleVendedorModal({ vendedor, movimientos, onClose }) {
  const [vistaCompacta, setVistaCompacta] = useState(false);
  
  const totalHaber = movimientos
    .filter(m => m.tipo === 'haber')
    .reduce((sum, m) => sum + m.monto, 0);
  
  const totalDebe = movimientos
    .filter(m => m.tipo === 'debe')
    .reduce((sum, m) => sum + m.monto, 0);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '40px',
        width: '100%',
        maxWidth: '1000px',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '32px'
        }}>
          <h2 style={{ 
            margin: 0, 
            fontSize: '28px', 
            fontWeight: '700',
            color: '#0f172a'
          }}>
            {vendedor.nombre}
          </h2>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#64748b'
            }}
          >
            ✕
          </button>
        </div>

        {/* Resumen */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '20px',
          marginBottom: '32px'
        }}>
          <div style={{ 
            background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
            padding: '24px', 
            borderRadius: '16px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '14px', color: '#166534', fontWeight: '600', marginBottom: '8px' }}>
              💚 Total Haber
            </div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#166534' }}>
              ${totalHaber.toLocaleString()}
            </div>
          </div>
          
          <div style={{ 
            background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
            padding: '24px', 
            borderRadius: '16px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '14px', color: '#dc2626', fontWeight: '600', marginBottom: '8px' }}>
              🔴 Total Debe
            </div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#dc2626' }}>
              ${totalDebe.toLocaleString()}
            </div>
          </div>
          
          <div style={{ 
            background: vendedor.saldo >= 0 ? 
              'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)' : 
              'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
            padding: '24px', 
            borderRadius: '16px',
            textAlign: 'center'
          }}>
            <div style={{ 
              fontSize: '14px', 
              color: vendedor.saldo >= 0 ? '#166534' : '#dc2626', 
              fontWeight: '600', 
              marginBottom: '8px' 
            }}>
              ⚖️ Saldo Actual
            </div>
            <div style={{ 
              fontSize: '32px', 
              fontWeight: '700', 
              color: vendedor.saldo >= 0 ? '#166534' : '#dc2626' 
            }}>
              ${vendedor.saldo.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Historial */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '16px', 
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ 
            padding: '24px', 
            borderBottom: '1px solid #f1f5f9',
            backgroundColor: '#fafbfc',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h3 style={{ 
              margin: 0, 
              fontSize: '20px',
              fontWeight: '700'
            }}>
              📋 Historial de Movimientos
            </h3>
            
            <button
              onClick={() => setVistaCompacta(!vistaCompacta)}
              style={{
                padding: '12px 20px',
                backgroundColor: vistaCompacta ? '#3b82f6' : 'white',
                color: vistaCompacta ? 'white' : '#3b82f6',
                border: '2px solid #3b82f6',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              {vistaCompacta ? '📋 Vista Detallada' : '📊 Vista Compacta'}
            </button>
          </div>
          
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {movimientos.length > 0 ? (
              vistaCompacta ? (
                // Vista Compacta
                <div>
                  {movimientos.map((movimiento, index) => {
                    const saldoAcumulado = movimientos.slice(0, index + 1).reduce((acc, mov) => {
                      return acc + (mov.tipo === 'haber' ? mov.monto : -mov.monto);
                    }, 0);
                    
                    return (
                      <div key={movimiento.id} style={{
                        display: 'grid',
                        gridTemplateColumns: '80px 100px 1fr 120px 120px',
                        gap: '16px',
                        padding: '12px 24px',
                        borderBottom: index < movimientos.length - 1 ? '1px solid #f1f5f9' : 'none',
                        alignItems: 'center',
                        backgroundColor: index % 2 === 0 ? '#fafbfc' : 'white'
                      }}>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>
                          {new Date(movimiento.fecha).toLocaleDateString('es-AR', { 
                            day: '2-digit', 
                            month: '2-digit' 
                          })}
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span>{movimiento.tipo === 'haber' ? '💚' : '🔴'}</span>
                          <span style={{
                            fontSize: '11px',
                            fontWeight: '600',
                            color: movimiento.tipo === 'haber' ? '#166534' : '#991b1b'
                          }}>
                            {movimiento.tipo === 'haber' ? 'IN' : 'OUT'}
                          </span>
                        </div>
                        
                        <div>
                          <div style={{ fontWeight: '500', fontSize: '13px', color: '#1f2937' }}>
                            {movimiento.descripcion}
                          </div>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>
                            {movimiento.concepto} {movimiento.numeroOptica && `• 🏪${movimiento.numeroOptica}`}
                          </div>
                        </div>
                        
                        <div style={{
                          textAlign: 'right',
                          fontWeight: '600',
                          color: movimiento.tipo === 'haber' ? '#166534' : '#dc2626'
                        }}>
                          {movimiento.tipo === 'haber' ? '+' : '-'}${movimiento.monto.toLocaleString()}
                        </div>
                        
                        <div style={{
                          textAlign: 'right',
                          fontWeight: '600',
                          fontSize: '13px',
                          color: saldoAcumulado >= 0 ? '#166534' : '#dc2626',
                          backgroundColor: saldoAcumulado >= 0 ? '#f0fdf4' : '#fef2f2',
                          padding: '4px 8px',
                          borderRadius: '6px'
                        }}>
                          ${saldoAcumulado.toLocaleString()}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                // Vista Detallada
                movimientos.map((movimiento, index) => (
                  <div key={movimiento.id} style={{
                    padding: '20px 24px',
                    borderBottom: index < movimientos.length - 1 ? '1px solid #f1f5f9' : 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                        <span style={{
                          padding: '6px 14px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600',
                          backgroundColor: movimiento.tipo === 'haber' ? '#dcfce7' : '#fee2e2',
                          color: movimiento.tipo === 'haber' ? '#166534' : '#991b1b',
                          marginRight: '12px'
                        }}>
                          {movimiento.tipo === 'haber' ? '💚 Haber' : '🔴 Debe'}
                        </span>
                        <span style={{ 
                          fontSize: '13px', 
                          color: '#64748b',
                          backgroundColor: '#f1f5f9',
                          padding: '4px 10px',
                          borderRadius: '6px'
                        }}>
                          {movimiento.concepto}
                        </span>
                        {movimiento.numeroOptica && (
                          <span style={{ 
                            fontSize: '12px', 
                            color: '#3b82f6',
                            backgroundColor: '#eff6ff',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            marginLeft: '8px'
                          }}>
                            🏪 {movimiento.numeroOptica}
                          </span>
                        )}
                      </div>
                      
                      <h4 style={{ 
                        margin: '0 0 12px 0', 
                        color: '#1f2937',
                        fontSize: '15px',
                        fontWeight: '600'
                      }}>
                        {movimiento.descripcion}
                      </h4>
                      
                      <div style={{ 
                        fontSize: '13px', 
                        color: '#64748b'
                      }}>
                        📅 {new Date(movimiento.fecha).toLocaleDateString('es-AR')}
                      </div>
                    </div>
                    
                    <div style={{ fontSize: '20px', fontWeight: '700', color: movimiento.tipo === 'haber' ? '#166534' : '#dc2626' }}>
                      {movimiento.tipo === 'haber' ? '+' : '-'}${movimiento.monto.toLocaleString()}
                    </div>
                  </div>
                ))
              )
            ) : (
              <div style={{ 
                padding: '40px', 
                textAlign: 'center', 
                color: '#6b7280'
              }}>
                📋 No hay movimientos registrados
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Componentes simples para otras secciones
function CajaSection() {
  return (
    <div style={{ 
      backgroundColor: 'white', 
      borderRadius: '16px', 
      padding: '24px',
      textAlign: 'center'
    }}>
      <h3 style={{ margin: '0 0 16px 0', fontSize: '20px' }}>💰 Control de Caja</h3>
      <p style={{ color: '#6b7280', margin: 0 }}>Funcionalidad en desarrollo</p>
    </div>
  );
}

function PedidosSection() {
  return (
    <div style={{ 
      backgroundColor: 'white', 
      borderRadius: '16px', 
      padding: '24px',
      textAlign: 'center'
    }}>
      <h3 style={{ margin: '0 0 16px 0', fontSize: '20px' }}>📋 Gestión de Pedidos</h3>
      <p style={{ color: '#6b7280', margin: 0 }}>Funcionalidad en desarrollo</p>
    </div>
  );
}

// Componente StatsCard
function StatsCard({ title, value, color, subtitle }) {
  return (
    <div style={{
      backgroundColor: 'white',
      padding: '24px',
      borderRadius: '16px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
      border: '1px solid #e2e8f0'
    }}>
      <div style={{
        fontSize: '14px',
        color: '#6b7280',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        marginBottom: '8px'
      }}>
        {title}
      </div>
      <div style={{
        fontSize: '32px',
        fontWeight: '700',
        color: color,
        marginBottom: '8px',
        letterSpacing: '-0.5px'
      }}>
        {value}
      </div>
      {subtitle && (
        <div style={{
          fontSize: '13px',
          color: '#94a3b8'
        }}>
          {subtitle}
        </div>
      )}
    </div>
  );
}

export default App;
