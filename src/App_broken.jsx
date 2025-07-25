import { useState } from 'react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (email && password) {
      setIsLoggedIn(true);
    }
  };

  if (isLoggedIn) {
    return <Dashboard email={email} />;
  }
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#667eea',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", sans-serif'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '50px',
        borderRadius: '24px',
        boxShadow: '0 25px 60px rgba(0,0,0,0.12)',
        textAlign: 'center',
        maxWidth: '420px',
        width: '100%',
        backdropFilter: 'blur(10px)'
      }}>
        <h1 style={{ 
          color: '#1a1a1a', 
          marginBottom: '8px',
          fontSize: '32px',
          fontWeight: '700',
          letterSpacing: '-0.5px'
        }}>
          🥽 OptiControl
        </h1>
        
        <p style={{ 
          color: '#6b7280', 
          marginBottom: '40px',
          fontSize: '16px',
          fontWeight: '400',
          lineHeight: '1.5'
        }}>
          Panel de Control para Empresa de Anteojos
        </p>
        
        <form onSubmit={handleLogin} style={{ 
          display: 'flex', 
          flexDirection: 'column',
          gap: '20px'
        }}>
          <input 
            type="email" 
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '16px 20px',
              border: '2px solid #f1f5f9',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '400',
              boxSizing: 'border-box',
              transition: 'all 0.2s ease',
              outline: 'none',
              backgroundColor: '#fafbfc',
              fontFamily: 'inherit'
            }}
          />
          
          <input 
            type="password" 
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '16px 20px',
              border: '2px solid #f1f5f9',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '400',
              boxSizing: 'border-box',
              transition: 'all 0.2s ease',
              outline: 'none',
              backgroundColor: '#fafbfc',
              fontFamily: 'inherit'
            }}
          />
          
          <button type="submit" style={{
            width: '100%',
            padding: '16px 20px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            letterSpacing: '0.5px',
            fontFamily: 'inherit'
          }}>
            Iniciar Sesión
          </button>
        </form>
        
        <p style={{ 
          color: '#9ca3af', 
          marginTop: '30px',
          fontSize: '14px',
          fontWeight: '400',
          lineHeight: '1.6'
        }}>
          ✅ Sistema Funcionando<br/>
          <span style={{ color: '#6b7280' }}>Usa cualquier email y contraseña</span>
        </p>
      </div>
    </div>
  );
}

// Componente Dashboard
function Dashboard({ email }) {
  const [currentSection, setCurrentSection] = useState('dashboard');

  const sections = {
    dashboard: '📊 Dashboard',
    vendedores: '👥 Vendedores', 
    caja: '💰 Caja',
    pedidos: '📋 Pedidos'
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#fafbfc',
      display: 'flex',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", sans-serif'
    }}>
      {/* Sidebar */}
      <div style={{
        width: '280px',
        backgroundColor: '#ffffff',
        borderRight: '1px solid #e2e8f0',
        color: '#1e293b',
        padding: '32px 24px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)'
      }}>
        <h2 style={{ 
          marginBottom: '48px',
          fontSize: '24px',
          fontWeight: '700',
          letterSpacing: '-0.5px',
          color: '#0f172a'
        }}>
          🥽 OptiControl
        </h2>
        
        <div style={{ marginBottom: '48px' }}>
          <p style={{ 
            fontSize: '12px', 
            color: '#64748b',
            marginBottom: '8px',
            fontWeight: '500',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Bienvenido
          </p>
          <p style={{ 
            fontWeight: '600',
            fontSize: '16px',
            color: '#1e293b'
          }}>
            {email}
          </p>
        </div>

        {Object.entries(sections).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setCurrentSection(key)}
            style={{
              width: '100%',
              padding: '16px 20px',
              marginBottom: '8px',
              backgroundColor: currentSection === key ? '#f1f5f9' : 'transparent',
              color: currentSection === key ? '#1e40af' : '#64748b',
              border: currentSection === key ? '1px solid #e2e8f0' : '1px solid transparent',
              borderRadius: '12px',
              textAlign: 'left',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: currentSection === key ? '600' : '500',
              transition: 'all 0.2s ease',
              fontFamily: 'inherit'
            }}
          >
            {label}
          </button>
        ))}
        
        <button
          onClick={() => window.location.reload()}
          style={{
            width: '100%',
            padding: '16px 20px',
            marginTop: '60px',
            backgroundColor: '#fef2f2',
            color: '#dc2626',
            border: '1px solid #fecaca',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '15px',
            fontWeight: '500',
            transition: 'all 0.2s ease',
            fontFamily: 'inherit'
          }}
        >
          🚪 Cerrar Sesión
        </button>
      </div>

      {/* Contenido Principal */}
      <div style={{ 
        flex: 1,
        padding: '40px 48px',
        backgroundColor: '#fafbfc'
      }}>
        <SectionContent section={currentSection} />
      </div>
    </div>
  );
}

// Componente para el contenido de cada sección
function SectionContent({ section }) {
  const content = {
    dashboard: (
      <div>
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ 
            fontSize: '36px', 
            marginBottom: '8px', 
            color: '#0f172a',
            fontWeight: '700',
            letterSpacing: '-0.8px'
          }}>
            📊 Dashboard
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#64748b',
            fontWeight: '400',
            marginBottom: '0'
          }}>
            Resumen general de la actividad empresarial
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '24px',
          marginBottom: '40px'
        }}>
          <StatsCard title="Total Vendedores" value="8" color="#3b82f6" subtitle="2 nuevos este mes" />
          <StatsCard title="Saldo Caja" value="$125,430" color="#10b981" subtitle="+12% vs mes anterior" />
          <StatsCard title="Pedidos Pendientes" value="15" color="#f59e0b" subtitle="3 urgentes" />
          <StatsCard title="Ventas Hoy" value="$8,250" color="#8b5cf6" subtitle="Meta: $12,000" />
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '24px',
          marginBottom: '32px'
        }}>
          {/* Actividad Reciente */}
          <div style={{
            backgroundColor: 'white',
            padding: '32px',
            borderRadius: '16px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{ 
              marginBottom: '24px', 
              color: '#0f172a',
              fontSize: '20px',
              fontWeight: '600',
              letterSpacing: '-0.3px'
            }}>
              📈 Actividad Reciente
            </h3>
            <div style={{ 
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <ActivityItem 
                icon="👤" 
                title="Nuevo vendedor registrado" 
                description="María González se unió al equipo"
                time="Hace 2 horas"
                type="success"
              />
              <ActivityItem 
                icon="✅" 
                title="Pedido completado" 
                description="#001234 - $2,150 - Cliente satisfecho"
                time="Hace 3 horas"
                type="success"
              />
              <ActivityItem 
                icon="💰" 
                title="Ingreso en caja" 
                description="$5,000 - Venta mostrador - Anteojos premium"
                time="Hace 4 horas"
                type="neutral"
              />
              <ActivityItem 
                icon="📋" 
                title="Pedido pendiente" 
                description="#001235 - Juan Pérez - Lentes progresivos"
                time="Hace 6 horas"
                type="warning"
              />
            </div>
          </div>

          {/* Panel Rápido */}
          <div style={{
            backgroundColor: 'white',
            padding: '32px',
            borderRadius: '16px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{ 
              marginBottom: '24px', 
              color: '#0f172a',
              fontSize: '20px',
              fontWeight: '600',
              letterSpacing: '-0.3px'
            }}>
              ⚡ Acciones Rápidas
            </h3>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <QuickActionButton icon="➕" text="Nuevo Vendedor" />
              <QuickActionButton icon="💰" text="Registrar Venta" />
              <QuickActionButton icon="📋" text="Crear Pedido" />
              <QuickActionButton icon="📊" text="Ver Reportes" />
            </div>
          </div>
        </div>
      </div>
    ),
    vendedores: <VendedoresSection />,
    caja: <CajaSection />,
    pedidos: (
      <div>
        <h1 style={{ fontSize: '32px', marginBottom: '20px', color: '#1e293b' }}>
          📋 Gestión de Pedidos
        </h1>
        <p style={{ color: '#64748b', fontSize: '18px' }}>
          Administra pedidos de clientes y fechas de entrega
        </p>
      </div>
    )
  };

  return content[section] || content.dashboard;
}

// Componente para las tarjetas de estadísticas
function StatsCard({ title, value, color, subtitle }) {
  return (
    <div style={{
      backgroundColor: 'white',
      padding: '28px',
      borderRadius: '16px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
      border: '1px solid #e2e8f0',
      transition: 'all 0.2s ease'
    }}>
      <h3 style={{ 
        color: '#64748b', 
        fontSize: '14px', 
        marginBottom: '8px',
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
      }}>
        {title}
      </h3>
      <p style={{ 
        fontSize: '32px', 
        fontWeight: '700', 
        color: color,
        margin: '0 0 4px 0',
        letterSpacing: '-0.5px'
      }}>
        {value}
      </p>
      {subtitle && (
        <p style={{
          fontSize: '13px',
          color: '#94a3b8',
          margin: 0,
          fontWeight: '400'
        }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

// Componente para elementos de actividad
function ActivityItem({ icon, title, description, time, type }) {
  const typeColors = {
    success: '#10b981',
    warning: '#f59e0b',
    neutral: '#6b7280'
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '16px',
      padding: '16px',
      borderRadius: '12px',
      backgroundColor: '#fafbfc',
      border: '1px solid #f1f5f9'
    }}>
      <div style={{
        fontSize: '20px',
        padding: '8px',
        borderRadius: '8px',
        backgroundColor: 'white',
        border: '1px solid #e2e8f0'
      }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <h4 style={{
          margin: '0 0 4px 0',
          fontSize: '15px',
          fontWeight: '600',
          color: '#1e293b'
        }}>
          {title}
        </h4>
        <p style={{
          margin: '0 0 8px 0',
          fontSize: '14px',
          color: '#64748b',
          lineHeight: '1.4'
        }}>
          {description}
        </p>
        <span style={{
          fontSize: '12px',
          color: typeColors[type],
          fontWeight: '500'
        }}>
          {time}
        </span>
      </div>
    </div>
  );
}

// Componente para botones de acción rápida
function QuickActionButton({ icon, text }) {
  return (
    <button style={{
      width: '100%',
      padding: '12px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      backgroundColor: '#fafbfc',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      color: '#374151',
      transition: 'all 0.2s ease',
      fontFamily: 'inherit'
    }}>
      <span style={{ fontSize: '16px' }}>{icon}</span>
      {text}
    </button>
  );
}

// Componente de Gestión de Vendedores
function VendedoresSection() {
  const [vendedores, setVendedores] = useState([
    { 
      id: 1, 
      nombre: 'Juan Pérez', 
      email: 'juan@empresa.com', 
      dni: '12345678',
      telefono: '+54 11 1234-5678',
      direccion: 'Av. Corrientes 1234, CABA',
      fechaNacimiento: '1985-03-15',
      fechaIngreso: '2023-01-15',
      saldo: 15250, 
      activo: true 
    },
    { 
      id: 2, 
      nombre: 'María González', 
      email: 'maria@empresa.com', 
      dni: '87654321',
      telefono: '+54 11 8765-4321',
      direccion: 'San Martín 567, Vicente López',
      fechaNacimiento: '1990-07-22',
      fechaIngreso: '2023-03-10',
      saldo: 22100, 
      activo: true 
    },
    { 
      id: 3, 
      nombre: 'Carlos Rodríguez', 
      email: 'carlos@empresa.com', 
      dni: '11223344',
      telefono: '+54 11 2233-4455',
      direccion: 'Belgrano 890, San Isidro',
      fechaNacimiento: '1982-11-08',
      fechaIngreso: '2022-09-20',
      saldo: 8750, 
      activo: true 
    },
    { 
      id: 4, 
      nombre: 'Ana Martínez', 
      email: 'ana@empresa.com', 
      dni: '55667788',
      telefono: '+54 11 5566-7788',
      direccion: 'Rivadavia 2345, Caballito',
      fechaNacimiento: '1988-04-12',
      fechaIngreso: '2021-11-05',
      saldo: 31200, 
      activo: false 
    },
    { 
      id: 5, 
      nombre: 'Luis Fernando', 
      email: 'luis@empresa.com', 
      dni: '99887766',
      telefono: '+54 11 9988-7766',
      direccion: 'Maipú 678, Olivos',
      fechaNacimiento: '1992-12-03',
      fechaIngreso: '2023-06-01',
      saldo: 19800, 
      activo: true 
    }
  ]);

  // Historial detallado de movimientos de vendedores
  const [movimientosVendedores, setMovimientosVendedores] = useState([
    { 
      id: 1, 
      vendedorId: 1, 
      vendedorNombre: 'Juan Pérez',
      fecha: '2025-01-24', 
      tipo: 'haber', 
      concepto: 'Comisión Ventas',
      descripcion: 'Venta óptica Centro - Cliente: María López', 
      numeroOptica: 'OP-001',
      monto: 1500,
      usuario: 'Admin'
    },
    { 
      id: 2, 
      vendedorId: 1, 
      vendedorNombre: 'Juan Pérez',
      fecha: '2025-01-23', 
      tipo: 'debe', 
      concepto: 'Anticipo Sueldo',
      descripcion: 'Anticipo quincenal solicitado', 
      numeroOptica: '',
      monto: 800,
      usuario: 'Admin'
    },
    { 
      id: 3, 
      vendedorId: 2, 
      vendedorNombre: 'María González',
      fecha: '2025-01-24', 
      tipo: 'haber', 
      concepto: 'Comisión Ventas',
      descripcion: 'Venta óptica Norte - Cliente: Carlos Ruiz', 
      numeroOptica: 'OP-002',
      monto: 900,
      usuario: 'Admin'
    },
    { 
      id: 4, 
      vendedorId: 4, 
      vendedorNombre: 'Ana Martínez',
      fecha: '2025-01-22', 
      tipo: 'haber', 
      concepto: 'Comisión Ventas',
      descripcion: 'Venta óptica Sur - Cliente: Patricia Silva', 
      numeroOptica: 'OP-003',
      monto: 1200,
      usuario: 'Admin'
    },
    { 
      id: 5, 
      vendedorId: 2, 
      vendedorNombre: 'María González',
      fecha: '2025-01-21', 
      tipo: 'debe', 
      concepto: 'Descuento',
      descripcion: 'Descuento por devolución de producto', 
      numeroOptica: 'OP-002',
      monto: 200,
      usuario: 'Admin'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('agregar'); // 'agregar', 'cobrar', 'ajustar'
  const [selectedVendedor, setSelectedVendedor] = useState(null);
  const [showDetalleVendedor, setShowDetalleVendedor] = useState(false);
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

  const abrirModal = (tipo, vendedor = null) => {
    setModalType(tipo);
    setSelectedVendedor(vendedor);
    setFormData({
      nombre: vendedor?.nombre || '',
      email: vendedor?.email || '',
      dni: vendedor?.dni || '',
      telefono: vendedor?.telefono || '',
      direccion: vendedor?.direccion || '',
      fechaNacimiento: vendedor?.fechaNacimiento || '',
      monto: '',
      descripcion: '',
      concepto: '',
      numeroOptica: ''
    });
    setShowModal(true);
  };

  const abrirDetalleVendedor = (vendedor) => {
    setSelectedVendedor(vendedor);
    setShowDetalleVendedor(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setSelectedVendedor(null);
    setShowDetalleVendedor(false);
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
  };

  const agregarVendedor = () => {
    if (formData.nombre && formData.email && formData.dni) {
      const nuevoVendedor = {
        id: Date.now(),
        nombre: formData.nombre,
        email: formData.email,
        dni: formData.dni,
        telefono: formData.telefono,
        direccion: formData.direccion,
        fechaNacimiento: formData.fechaNacimiento,
        fechaIngreso: new Date().toISOString().split('T')[0],
        saldo: 0,
        activo: true
      };
      setVendedores([...vendedores, nuevoVendedor]);
      cerrarModal();
    }
  };

  const editarVendedor = () => {
    if (selectedVendedor && formData.nombre && formData.email && formData.dni) {
      setVendedores(vendedores.map(v => 
        v.id === selectedVendedor.id 
          ? { 
              ...v, 
              nombre: formData.nombre,
              email: formData.email,
              dni: formData.dni,
              telefono: formData.telefono,
              direccion: formData.direccion,
              fechaNacimiento: formData.fechaNacimiento
            }
          : v
      ));
      cerrarModal();
    }
  };

  const procesarMovimiento = (tipoMovimiento) => {
    if (selectedVendedor && formData.monto && formData.concepto) {
      const monto = parseFloat(formData.monto);
      
      // Actualizar saldo del vendedor
      setVendedores(vendedores.map(v => 
        v.id === selectedVendedor.id 
          ? { 
              ...v, 
              saldo: tipoMovimiento === 'haber' 
                ? v.saldo + monto 
                : v.saldo - monto 
            }
          : v
      ));

      // Agregar movimiento al historial
      const nuevoMovimiento = {
        id: Date.now(),
        vendedorId: selectedVendedor.id,
        vendedorNombre: selectedVendedor.nombre,
        fecha: new Date().toISOString().split('T')[0],
        tipo: tipoMovimiento,
        concepto: formData.concepto,
        descripcion: formData.descripcion,
        numeroOptica: formData.numeroOptica,
        monto: monto,
        usuario: 'Usuario Actual'
      };

      setMovimientosVendedores([nuevoMovimiento, ...movimientosVendedores]);
      cerrarModal();
    }
  };

  const procesarCobro = () => procesarMovimiento('debe');
  const procesarHaber = () => procesarMovimiento('haber');

  const procesarAjuste = () => {
    if (selectedVendedor && formData.monto && formData.concepto) {
      const monto = parseFloat(formData.monto);
      const tipoMovimiento = monto >= 0 ? 'haber' : 'debe';
      
      setVendedores(vendedores.map(v => 
        v.id === selectedVendedor.id 
          ? { ...v, saldo: v.saldo + monto }
          : v
      ));

      // Agregar movimiento al historial
      const nuevoMovimiento = {
        id: Date.now(),
        vendedorId: selectedVendedor.id,
        vendedorNombre: selectedVendedor.nombre,
        fecha: new Date().toISOString().split('T')[0],
        tipo: tipoMovimiento,
        concepto: 'Ajuste - ' + formData.concepto,
        descripcion: formData.descripcion,
        numeroOptica: formData.numeroOptica,
        monto: Math.abs(monto),
        usuario: 'Usuario Actual'
      };

      setMovimientosVendedores([nuevoMovimiento, ...movimientosVendedores]);
      cerrarModal();
    }
  };

  const toggleEstado = (id) => {
    setVendedores(vendedores.map(v => 
      v.id === id ? { ...v, activo: !v.activo } : v
    ));
  };

  return (
    <div>
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px' }}>
          <div>
            <h1 style={{ 
              fontSize: '36px', 
              margin: '0 0 8px 0', 
              color: '#0f172a',
              fontWeight: '700',
              letterSpacing: '-0.8px'
            }}>
              👥 Gestión de Vendedores
            </h1>
            <p style={{
              fontSize: '16px',
              color: '#64748b',
              fontWeight: '400',
              margin: 0
            }}>
              Administra tu equipo de vendedores y sus comisiones
            </p>
          </div>
          <button
            onClick={() => abrirModal('agregar')}
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              color: 'white',
              border: 'none',
              padding: '14px 24px',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              letterSpacing: '0.3px',
              fontFamily: 'inherit',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.25)'
            }}
          >
            ➕ Agregar Vendedor
          </button>
        </div>
      </div>

      {/* Estadísticas de Vendedores */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '24px',
        marginBottom: '40px'
      }}>
        <StatsCard 
          title="Total Vendedores" 
          value={vendedores.length} 
          color="#3b82f6"
          subtitle={`${vendedores.filter(v => v.activo).length} activos, ${vendedores.filter(v => !v.activo).length} inactivos`}
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
        <StatsCard 
          title="Promedio por Vendedor" 
          value={`$${Math.round(vendedores.reduce((sum, v) => sum + v.saldo, 0) / vendedores.length).toLocaleString()}`} 
          color="#8b5cf6"
          subtitle={`Rango: $${Math.min(...vendedores.map(v => v.saldo)).toLocaleString()} - $${Math.max(...vendedores.map(v => v.saldo)).toLocaleString()}`}
        />
      </div>

      {/* Tabla de Vendedores */}
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
          borderBottom: '1px solid #e2e8f0'
        }}>
          <h3 style={{
            margin: 0,
            fontSize: '18px',
            fontWeight: '600',
            color: '#0f172a',
            letterSpacing: '-0.3px'
          }}>
            📋 Lista de Vendedores ({vendedores.length})
          </h3>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#fafbfc' }}>
              <th style={{ 
                padding: '20px 24px', 
                textAlign: 'left', 
                fontWeight: '600', 
                color: '#374151',
                fontSize: '14px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>Vendedor</th>
              <th style={{ 
                padding: '20px 24px', 
                textAlign: 'left', 
                fontWeight: '600', 
                color: '#374151',
                fontSize: '14px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>DNI</th>
              <th style={{ 
                padding: '20px 24px', 
                textAlign: 'left', 
                fontWeight: '600', 
                color: '#374151',
                fontSize: '14px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>Email</th>
              <th style={{ 
                padding: '20px 24px', 
                textAlign: 'center', 
                fontWeight: '600', 
                color: '#374151',
                fontSize: '14px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>Saldo</th>
              <th style={{ 
                padding: '20px 24px', 
                textAlign: 'center', 
                fontWeight: '600', 
                color: '#374151',
                fontSize: '14px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>Estado</th>
              <th style={{ 
                padding: '20px 24px', 
                textAlign: 'center', 
                fontWeight: '600', 
                color: '#374151',
                fontSize: '14px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {vendedores.map((vendedor, index) => (
              <tr key={vendedor.id} style={{ 
                borderBottom: index < vendedores.length - 1 ? '1px solid #f1f5f9' : 'none',
                transition: 'background-color 0.2s ease'
              }}>
                <td style={{ padding: '20px 24px' }}>
                  <div>
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
                      color: '#94a3b8',
                      fontWeight: '400'
                    }}>
                      {movimientosVendedores.filter(m => m.vendedorId === vendedor.id).length} movimientos
                    </div>
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
                  fontSize: '14px',
                  fontWeight: '400'
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
                    padding: '8px 12px',
                    borderRadius: '8px',
                    backgroundColor: vendedor.saldo >= 0 ? '#f0fdf4' : '#fef2f2',
                    color: vendedor.saldo >= 0 ? '#166534' : '#dc2626',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}>
                    ${vendedor.saldo.toLocaleString()}
                  </div>
                </td>
                <td style={{ padding: '20px 24px', textAlign: 'center' }}>
                  <span style={{
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    backgroundColor: vendedor.activo ? '#dcfce7' : '#fee2e2',
                    color: vendedor.activo ? '#166534' : '#991b1b'
                  }}>
                    {vendedor.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td style={{ padding: '20px 24px', textAlign: 'center' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    gap: '8px', 
                    flexWrap: 'wrap' 
                  }}>
                    <button
                      onClick={() => abrirDetalleVendedor(vendedor)}
                      style={{
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        padding: '8px 14px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        fontWeight: '500',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
                    >
                      📊 Detalles
                    </button>
                    <button
                      onClick={() => abrirModal('editar', vendedor)}
                      style={{
                        backgroundColor: '#8b5cf6',
                        color: 'white',
                        border: 'none',
                        padding: '8px 14px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        fontWeight: '500',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#7c3aed'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#8b5cf6'}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => abrirModal('haber', vendedor)}
                      style={{
                        backgroundColor: '#10b981',
                        color: 'white',
                        border: 'none',
                        padding: '8px 14px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        fontWeight: '500',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#059669'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#10b981'}
                    >
                      � Haber
                    </button>
                    <button
                      onClick={() => abrirModal('cobrar', vendedor)}
                      style={{
                        backgroundColor: '#ef4444',
                        color: 'white',
                        border: 'none',
                        padding: '8px 14px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        fontWeight: '500',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#dc2626'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#ef4444'}
                    >
                      🔴 Debe
                    </button>
                    <button
                      onClick={() => abrirModal('ajustar', vendedor)}
                      style={{
                        backgroundColor: '#f59e0b',
                        color: 'white',
                        border: 'none',
                        padding: '8px 14px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        fontWeight: '500',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#d97706'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#f59e0b'}
                    >
                      ⚖️ Ajustar
                    </button>
                    <button
                      onClick={() => toggleEstado(vendedor.id)}
                      style={{
                        backgroundColor: vendedor.activo ? '#6b7280' : '#8b5cf6',
                        color: 'white',
                        border: 'none',
                        padding: '8px 14px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        fontWeight: '500',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = vendedor.activo ? '#4b5563' : '#7c3aed'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = vendedor.activo ? '#6b7280' : '#8b5cf6'}
                    >
                      {vendedor.activo ? '🔒' : '🔓'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <VendedorModal 
          modalType={modalType}
          selectedVendedor={selectedVendedor}
          formData={formData}
          setFormData={setFormData}
          onClose={cerrarModal}
          onSubmit={modalType === 'agregar' ? agregarVendedor : 
                   modalType === 'editar' ? editarVendedor :
                   modalType === 'cobrar' ? procesarCobro : 
                   modalType === 'haber' ? procesarHaber : 
                   procesarAjuste}
        />
      )}

      {/* Modal de Detalles del Vendedor */}
      {showDetalleVendedor && selectedVendedor && (
        <DetalleVendedorModal 
          vendedor={selectedVendedor}
          movimientos={movimientosVendedores.filter(m => m.vendedorId === selectedVendedor.id)}
          onClose={cerrarModal}
        />
      )}
    </div>
  );
}

// Componente Modal de Vendedores
function VendedorModal({ modalType, selectedVendedor, formData, setFormData, onClose, onSubmit }) {
  const titles = {
    agregar: '➕ Agregar Nuevo Vendedor',
    editar: '✏️ Editar Vendedor',
    cobrar: '🔴 Registrar Debe',
    haber: '💚 Registrar Haber', 
    ajustar: '⚖️ Ajustar Saldo'
  };

  const conceptos = {
    cobrar: ['Anticipo Sueldo', 'Descuento', 'Préstamo', 'Devolución', 'Otros'],
    haber: ['Comisión Ventas', 'Bono', 'Reintegro', 'Premio', 'Otros'],
    ajustar: ['Corrección', 'Ajuste Manual', 'Error Sistema', 'Otros']
  };

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
      zIndex: 1000,
      backdropFilter: 'blur(8px)'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '40px',
        width: '100%',
        maxWidth: '650px',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.2)',
        maxHeight: '90vh',
        overflowY: 'auto',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '32px',
          paddingBottom: '16px',
          borderBottom: '1px solid #f1f5f9'
        }}>
          <h2 style={{ 
            margin: 0, 
            color: '#0f172a',
            fontSize: '24px',
            fontWeight: '700',
            letterSpacing: '-0.3px'
          }}>
            {titles[modalType]}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#64748b',
              padding: '8px',
              borderRadius: '8px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f1f5f9';
              e.target.style.color = '#374151';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#64748b';
            }}
          >
            ✕
          </button>
        </div>

        {(modalType === 'agregar' || modalType === 'editar') && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '600', 
                  color: '#374151',
                  fontSize: '14px'
                }}>
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  placeholder="Nombre completo del vendedor"
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '16px',
                    boxSizing: 'border-box',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", sans-serif',
                    transition: 'border-color 0.2s ease',
                    backgroundColor: '#fafbfc'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
              
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '600', 
                  color: '#374151',
                  fontSize: '14px'
                }}>
                  DNI *
                </label>
                <input
                  type="text"
                  placeholder="12345678"
                  value={formData.dni}
                  onChange={(e) => setFormData({...formData, dni: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '16px',
                    boxSizing: 'border-box',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", sans-serif',
                    transition: 'border-color 0.2s ease',
                    backgroundColor: '#fafbfc'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '600', 
                  color: '#374151',
                  fontSize: '14px'
                }}>
                  Email *
                </label>
                <input
                  type="email"
                  placeholder="email@empresa.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '16px',
                    boxSizing: 'border-box',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", sans-serif',
                    transition: 'border-color 0.2s ease',
                    backgroundColor: '#fafbfc'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '600', 
                  color: '#374151',
                  fontSize: '14px'
                }}>
                  Teléfono
                </label>
                <input
                  type="tel"
                  placeholder="+54 11 1234-5678"
                  value={formData.telefono}
                  onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '16px',
                    boxSizing: 'border-box',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", sans-serif',
                    transition: 'border-color 0.2s ease',
                    backgroundColor: '#fafbfc'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '600', 
                color: '#374151',
                fontSize: '14px'
              }}>
                Dirección
              </label>
              <input
                type="text"
                placeholder="Av. Corrientes 1234, CABA"
                value={formData.direccion}
                onChange={(e) => setFormData({...formData, direccion: e.target.value})}
                style={{
                  width: '100%',
                  padding: '16px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '16px',
                  boxSizing: 'border-box',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", sans-serif',
                  transition: 'border-color 0.2s ease',
                  backgroundColor: '#fafbfc'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '600', 
                color: '#374151',
                fontSize: '14px'
              }}>
                Fecha de Nacimiento
              </label>
              <input
                type="date"
                value={formData.fechaNacimiento}
                onChange={(e) => setFormData({...formData, fechaNacimiento: e.target.value})}
                style={{
                  width: '100%',
                  padding: '16px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '16px',
                  boxSizing: 'border-box',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", sans-serif',
                  transition: 'border-color 0.2s ease',
                  backgroundColor: '#fafbfc'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>
          </div>
        )}

        {(modalType === 'cobrar' || modalType === 'haber' || modalType === 'ajustar') && (
          <div>
            {selectedVendedor && (
              <div style={{ 
                marginBottom: '20px',
                padding: '15px',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid #e5e7eb'
              }}>
                <h3 style={{ margin: '0 0 8px 0', color: '#1e293b' }}>
                  � {selectedVendedor.nombre}
                </h3>
                <p style={{ margin: '0', color: '#6b7280', fontSize: '14px' }}>
                  Saldo actual: <strong style={{ 
                    color: selectedVendedor.saldo >= 0 ? '#10b981' : '#ef4444' 
                  }}>
                    ${selectedVendedor.saldo.toLocaleString()}
                  </strong>
                </p>
              </div>
            )}

            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '600', 
                color: '#374151',
                fontSize: '14px'
              }}>
                Concepto
              </label>
              <select
                value={formData.concepto}
                onChange={(e) => setFormData({...formData, concepto: e.target.value})}
                style={{
                  width: '100%',
                  padding: '16px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '16px',
                  boxSizing: 'border-box',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", sans-serif',
                  backgroundColor: '#fafbfc',
                  cursor: 'pointer'
                }}
              >
                <option value="">Seleccionar concepto</option>
                {conceptos[modalType]?.map(concepto => (
                  <option key={concepto} value={concepto}>{concepto}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '600', 
                color: '#374151',
                fontSize: '14px'
              }}>
                Número de Óptica (opcional)
              </label>
              <input
                type="text"
                placeholder="OP-001, OP-002, etc."
                value={formData.numeroOptica}
                onChange={(e) => setFormData({...formData, numeroOptica: e.target.value})}
                style={{
                  width: '100%',
                  padding: '16px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '16px',
                  boxSizing: 'border-box',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", sans-serif',
                  transition: 'border-color 0.2s ease',
                  backgroundColor: '#fafbfc'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '600', 
                color: '#374151',
                fontSize: '14px'
              }}>
                Monto
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#64748b',
                  fontSize: '16px',
                  fontWeight: '600'
                }}>$</span>
                <input
                  type="number"
                  placeholder="0.00"
                  value={formData.monto}
                  onChange={(e) => setFormData({...formData, monto: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '16px 16px 16px 32px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '16px',
                    boxSizing: 'border-box',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", sans-serif',
                    transition: 'border-color 0.2s ease',
                    backgroundColor: '#fafbfc'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '600', 
                color: '#374151',
                fontSize: '14px'
              }}>
                Descripción
              </label>
              <textarea
                placeholder="Descripción detallada del movimiento..."
                value={formData.descripcion}
                onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                style={{
                  width: '100%',
                  padding: '16px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '16px',
                  boxSizing: 'border-box',
                  minHeight: '100px',
                  resize: 'vertical',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", sans-serif',
                  transition: 'border-color 0.2s ease',
                  backgroundColor: '#fafbfc'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>
          </div>
        )}

        <div style={{ 
          display: 'flex', 
          gap: '16px', 
          justifyContent: 'flex-end',
          paddingTop: '24px',
          borderTop: '1px solid #f1f5f9'
        }}>
          <button
            onClick={onClose}
            style={{
              backgroundColor: 'transparent',
              color: '#64748b',
              border: '2px solid #e2e8f0',
              padding: '14px 28px',
              borderRadius: '12px',
              fontSize: '16px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.2s ease',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", sans-serif'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f8fafc';
              e.target.style.borderColor = '#cbd5e1';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.borderColor = '#e2e8f0';
            }}
          >
            Cancelar
          </button>
          <button
            onClick={onSubmit}
            style={{
              background: modalType === 'agregar' ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' : 
                         modalType === 'haber' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 
                         modalType === 'cobrar' ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : 
                         'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: 'white',
              border: 'none',
              padding: '14px 28px',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", sans-serif',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)'
            }}
          >
            {modalType === 'agregar' ? 'Agregar Vendedor' : 
             modalType === 'haber' ? 'Registrar Haber' :
             modalType === 'cobrar' ? 'Registrar Debe' : 'Aplicar Ajuste'}
          </button>
        </div>
      </div>
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
      zIndex: 1000,
      backdropFilter: 'blur(8px)'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '40px',
        width: '100%',
        maxWidth: '1000px',
        maxHeight: '90vh',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.2)',
        overflow: 'hidden',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '32px',
          paddingBottom: '16px',
          borderBottom: '1px solid #f1f5f9'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: '#3b82f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '24px'
            }}>
              {vendedor.nombre.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 style={{ 
                margin: 0, 
                color: '#0f172a',
                fontSize: '28px',
                fontWeight: '700',
                letterSpacing: '-0.4px'
              }}>
                {vendedor.nombre}
              </h2>
              <p style={{
                margin: '4px 0 0 0',
                color: '#64748b',
                fontSize: '16px',
                fontWeight: '400'
              }}>
                {vendedor.email}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#64748b',
              padding: '12px',
              borderRadius: '12px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f1f5f9';
              e.target.style.color = '#374151';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#64748b';
            }}
          >
            ✕
          </button>
        </div>

        {/* Resumen del Vendedor */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '20px',
          marginBottom: '32px'
        }}>
          <div style={{ 
            background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
            padding: '24px', 
            borderRadius: '16px',
            textAlign: 'center',
            border: '1px solid #bbf7d0'
          }}>
            <div style={{
              fontSize: '14px',
              color: '#166534',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '8px'
            }}>
              💚 Total Haber
            </div>
            <div style={{ 
              fontSize: '32px', 
              fontWeight: '700', 
              color: '#166534',
              letterSpacing: '-0.5px'
            }}>
              ${totalHaber.toLocaleString()}
            </div>
          </div>
          
          <div style={{ 
            background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
            padding: '24px', 
            borderRadius: '16px',
            textAlign: 'center',
            border: '1px solid #fecaca'
          }}>
            <div style={{
              fontSize: '14px',
              color: '#dc2626',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '8px'
            }}>
              🔴 Total Debe
            </div>
            <div style={{ 
              fontSize: '32px', 
              fontWeight: '700', 
              color: '#dc2626',
              letterSpacing: '-0.5px'
            }}>
              ${totalDebe.toLocaleString()}
            </div>
          </div>
          
          <div style={{ 
            background: vendedor.saldo >= 0 ? 
              'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)' : 
              'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
            padding: '24px', 
            borderRadius: '16px',
            textAlign: 'center',
            border: vendedor.saldo >= 0 ? '1px solid #bbf7d0' : '1px solid #fecaca'
          }}>
            <div style={{
              fontSize: '14px',
              color: vendedor.saldo >= 0 ? '#166534' : '#dc2626',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '8px'
            }}>
              ⚖️ Saldo Actual
            </div>
            <div style={{ 
              fontSize: '32px', 
              fontWeight: '700', 
              color: vendedor.saldo >= 0 ? '#166534' : '#dc2626',
              letterSpacing: '-0.5px'
            }}>
              ${vendedor.saldo.toLocaleString()}
            </div>
          </div>
          
          <div style={{ 
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', 
            padding: '24px', 
            borderRadius: '16px',
            textAlign: 'center',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{
              fontSize: '14px',
              color: '#3b82f6',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '8px'
            }}>
              📊 Movimientos
            </div>
            <div style={{ 
              fontSize: '32px', 
              fontWeight: '700', 
              color: '#3b82f6',
              letterSpacing: '-0.5px'
            }}>
              {movimientos.length}
            </div>
          </div>
        </div>

        {/* Historia de Movimientos */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '16px', 
          border: '1px solid #e2e8f0',
          maxHeight: '500px', 
          overflow: 'hidden'
        }}>
          <div style={{ 
            padding: '24px', 
            borderBottom: '1px solid #f1f5f9',
            backgroundColor: '#fafbfc',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h3 style={{ 
                margin: 0, 
                color: '#0f172a',
                fontSize: '20px',
                fontWeight: '700',
                letterSpacing: '-0.3px'
              }}>
                📋 Historial de Movimientos
              </h3>
              <p style={{
                margin: '4px 0 0 0',
                color: '#64748b',
                fontSize: '14px',
                fontWeight: '400'
              }}>
                Registro completo de todas las transacciones
              </p>
            </div>
            
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
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {vistaCompacta ? '📋' : '📊'} 
              {vistaCompacta ? 'Vista Detallada' : 'Vista Compacta'}
            </button>
          </div>
          
          <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
            {movimientos.length > 0 ? (
              vistaCompacta ? (
                // Vista Compacta - Lista
                <div style={{ padding: '0' }}>
                  {movimientos.map((movimiento, index) => {
                    // Calcular saldo acumulado
                    const saldoAcumulado = movimientos.slice(0, index + 1).reduce((acc, mov) => {
                      return acc + (mov.tipo === 'haber' ? mov.monto : -mov.monto);
                    }, 0);
                    
                    return (
                      <div key={movimiento.id} style={{
                        display: 'grid',
                        gridTemplateColumns: '70px 110px 1fr 100px 110px',
                        gap: '12px',
                        padding: '10px 20px',
                        borderBottom: index < movimientos.length - 1 ? '1px solid #f1f5f9' : 'none',
                        alignItems: 'center',
                        fontSize: '13px',
                        backgroundColor: index % 2 === 0 ? '#fafbfc' : 'white'
                      }}>
                        <div style={{
                          fontSize: '11px',
                          color: '#64748b',
                          fontWeight: '500'
                        }}>
                          {new Date(movimiento.fecha).toLocaleDateString('es-AR', { 
                            day: '2-digit', 
                            month: '2-digit' 
                          })}
                        </div>
                        
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <span style={{ fontSize: '14px' }}>
                            {movimiento.tipo === 'haber' ? '💚' : '🔴'}
                          </span>
                          <span style={{
                            fontSize: '10px',
                            fontWeight: '600',
                            color: movimiento.tipo === 'haber' ? '#166534' : '#991b1b'
                          }}>
                            {movimiento.tipo === 'haber' ? 'IN' : 'OUT'}
                          </span>
                        </div>
                        
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '1px'
                        }}>
                          <div style={{
                            fontWeight: '500',
                            color: '#1f2937',
                            fontSize: '12px',
                            lineHeight: '1.2',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {movimiento.descripcion}
                          </div>
                          <div style={{
                            fontSize: '10px',
                            color: '#64748b',
                            display: 'flex',
                            gap: '6px'
                          }}>
                            <span>{movimiento.concepto}</span>
                            {movimiento.numeroOptica && (
                              <span>🏪{movimiento.numeroOptica}</span>
                            )}
                          </div>
                        </div>
                        
                        <div style={{
                          textAlign: 'right',
                          fontWeight: '600',
                          fontSize: '13px',
                          color: movimiento.tipo === 'haber' ? '#166534' : '#dc2626'
                        }}>
                          {movimiento.tipo === 'haber' ? '+' : '-'}${movimiento.monto.toLocaleString()}
                        </div>
                        
                        <div style={{
                          textAlign: 'right',
                          fontWeight: '600',
                          fontSize: '12px',
                          color: saldoAcumulado >= 0 ? '#166534' : '#dc2626',
                          backgroundColor: saldoAcumulado >= 0 ? '#f0fdf4' : '#fef2f2',
                          padding: '3px 6px',
                          borderRadius: '4px'
                        }}>
                          ${saldoAcumulado.toLocaleString()}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div key={movimiento.id} style={{
                  padding: '20px 24px',
                  borderBottom: index < movimientos.length - 1 ? '1px solid #f1f5f9' : 'none',
                  backgroundColor: 'white',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  transition: 'background-color 0.2s ease'
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
                        borderRadius: '6px',
                        fontWeight: '500'
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
                          marginLeft: '8px',
                          fontWeight: '500'
                        }}>
                          🏪 {movimiento.numeroOptica}
                        </span>
                      )}
                    </div>
                    
                    <h4 style={{ 
                      margin: '0 0 12px 0', 
                      color: '#1f2937',
                      fontSize: '15px',
                      fontWeight: '600',
                      lineHeight: '1.4'
                    }}>
                      {movimiento.descripcion}
                    </h4>
                    
                    <div style={{ 
                      fontSize: '13px', 
                      color: '#64748b',
                      display: 'flex',
                      gap: '16px',
                      alignItems: 'center'
                    }}>
                      <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        📅 {new Date(movimiento.fecha).toLocaleDateString('es-ES')}
                      </span>
                      <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        👤 {movimiento.usuario}
                      </span>
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'right', marginLeft: '24px' }}>
                    <div style={{
                      fontSize: '20px',
                      fontWeight: '700',
                      color: movimiento.tipo === 'haber' ? '#166534' : '#dc2626',
                      letterSpacing: '-0.3px'
                    }}>
                      {movimiento.tipo === 'haber' ? '+' : '-'}${movimiento.monto.toLocaleString()}
                    </div>
                  </div>
                ))
              ) : (
                // Vista Detallada - Cards (original)
                movimientos.map((movimiento, index) => (
                  <div key={movimiento.id} style={{
                    padding: '20px 24px',
                    borderBottom: index < movimientos.length - 1 ? '1px solid #f1f5f9' : 'none',
                    backgroundColor: 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    transition: 'background-color 0.2s ease'
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
                          borderRadius: '6px',
                          fontWeight: '500'
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
                            marginLeft: '8px',
                            fontWeight: '500'
                          }}>
                            🏪 {movimiento.numeroOptica}
                          </span>
                        )}
                      </div>
                      
                      <h4 style={{ 
                        margin: '0 0 12px 0', 
                        color: '#1f2937',
                        fontSize: '15px',
                        fontWeight: '600',
                        lineHeight: '1.4'
                      }}>
                        {movimiento.descripcion}
                      </h4>
                      
                      <div style={{ 
                        fontSize: '13px', 
                        color: '#64748b',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <span>📅 {new Date(movimiento.fecha).toLocaleDateString('es-AR')}</span>
                      </div>
                    </div>
                    
                    <div style={{
                      textAlign: 'right',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-end',
                      marginLeft: '20px'
                    }}>
                      <div style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color: movimiento.tipo === 'haber' ? '#166534' : '#dc2626',
                        letterSpacing: '-0.3px'
                      }}>
                        {movimiento.tipo === 'haber' ? '+' : '-'}${movimiento.monto.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))
              )
              <div style={{ 
                padding: '30px', 
                textAlign: 'center', 
                color: '#6b7280',
                backgroundColor: 'white'
              }}>
                📋 No hay movimientos registrados para este vendedor
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente de Control de Caja
function CajaSection() {
  const [movimientos, setMovimientos] = useState([
    { 
      id: 1, 
      fecha: '2025-01-24', 
      tipo: 'ingreso', 
      monto: 15000, 
      categoria: 'Ventas', 
      descripcion: 'Venta de anteojos - Cliente: María López',
      usuario: 'Juan Pérez'
    },
    { 
      id: 2, 
      fecha: '2025-01-24', 
      tipo: 'egreso', 
      monto: 3500, 
      categoria: 'Gastos Operativos', 
      descripcion: 'Compra de insumos de limpieza',
      usuario: 'Ana Martínez'
    },
    { 
      id: 3, 
      fecha: '2025-01-23', 
      tipo: 'ingreso', 
      monto: 8750, 
      categoria: 'Ventas', 
      descripcion: 'Venta de lentes de contacto - Cliente: Carlos Ruiz',
      usuario: 'María González'
    },
    { 
      id: 4, 
      fecha: '2025-01-23', 
      tipo: 'egreso', 
      monto: 12000, 
      categoria: 'Inventario', 
      descripcion: 'Compra de marcos importados - Proveedor XYZ',
      usuario: 'Luis Fernando'
    },
    { 
      id: 5, 
      fecha: '2025-01-22', 
      tipo: 'ingreso', 
      monto: 22500, 
      categoria: 'Ventas', 
      descripcion: 'Venta de anteojos premium - Cliente: Patricia Silva',
      usuario: 'Juan Pérez'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [formData, setFormData] = useState({
    tipo: 'ingreso',
    monto: '',
    categoria: '',
    descripcion: '',
    fecha: new Date().toISOString().split('T')[0]
  });

  const categorias = {
    ingreso: ['Ventas', 'Servicios', 'Otros Ingresos'],
    egreso: ['Inventario', 'Gastos Operativos', 'Salarios', 'Servicios', 'Otros Gastos']
  };

  const abrirModal = () => {
    setFormData({
      tipo: 'ingreso',
      monto: '',
      categoria: '',
      descripcion: '',
      fecha: new Date().toISOString().split('T')[0]
    });
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
  };

  const agregarMovimiento = () => {
    if (formData.monto && formData.categoria && formData.descripcion) {
      const nuevoMovimiento = {
        id: Date.now(),
        fecha: formData.fecha,
        tipo: formData.tipo,
        monto: parseFloat(formData.monto),
        categoria: formData.categoria,
        descripcion: formData.descripcion,
        usuario: 'Usuario Actual' // En un sistema real, esto vendría del usuario logueado
      };
      setMovimientos([nuevoMovimiento, ...movimientos]);
      cerrarModal();
    }
  };

  const movimientosFiltrados = movimientos.filter(mov => 
    filtroTipo === 'todos' || mov.tipo === filtroTipo
  );

  const totalIngresos = movimientos
    .filter(mov => mov.tipo === 'ingreso')
    .reduce((sum, mov) => sum + mov.monto, 0);

  const totalEgresos = movimientos
    .filter(mov => mov.tipo === 'egreso')
    .reduce((sum, mov) => sum + mov.monto, 0);

  const saldoActual = totalIngresos - totalEgresos;

  const ingresosHoy = movimientos
    .filter(mov => mov.tipo === 'ingreso' && mov.fecha === new Date().toISOString().split('T')[0])
    .reduce((sum, mov) => sum + mov.monto, 0);

  const egresosHoy = movimientos
    .filter(mov => mov.tipo === 'egreso' && mov.fecha === new Date().toISOString().split('T')[0])
    .reduce((sum, mov) => sum + mov.monto, 0);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '32px', margin: 0, color: '#1e293b' }}>
          💰 Control de Caja
        </h1>
        <button
          onClick={abrirModal}
          style={{
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          ➕ Nuevo Movimiento
        </button>
      </div>

      {/* Estadísticas de Caja */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '20px',
        marginBottom: '30px'
      }}>
        <StatsCard 
          title="Saldo Actual" 
          value={`$${saldoActual.toLocaleString()}`} 
          color={saldoActual >= 0 ? "#10b981" : "#ef4444"} 
        />
        <StatsCard 
          title="Ingresos Totales" 
          value={`$${totalIngresos.toLocaleString()}`} 
          color="#10b981" 
        />
        <StatsCard 
          title="Egresos Totales" 
          value={`$${totalEgresos.toLocaleString()}`} 
          color="#ef4444" 
        />
        <StatsCard 
          title="Ingresos Hoy" 
          value={`$${ingresosHoy.toLocaleString()}`} 
          color="#3b82f6" 
        />
        <StatsCard 
          title="Egresos Hoy" 
          value={`$${egresosHoy.toLocaleString()}`} 
          color="#f59e0b" 
        />
        <StatsCard 
          title="Balance Hoy" 
          value={`$${(ingresosHoy - egresosHoy).toLocaleString()}`} 
          color={ingresosHoy - egresosHoy >= 0 ? "#10b981" : "#ef4444"} 
        />
      </div>

      {/* Filtros */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '12px', 
        marginBottom: '20px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
      }}>
        <h3 style={{ marginBottom: '15px', color: '#1e293b' }}>🔍 Filtros</h3>
        <div style={{ display: 'flex', gap: '12px' }}>
          {['todos', 'ingreso', 'egreso'].map(tipo => (
            <button
              key={tipo}
              onClick={() => setFiltroTipo(tipo)}
              style={{
                padding: '8px 16px',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                backgroundColor: filtroTipo === tipo ? '#3b82f6' : '#f3f4f6',
                color: filtroTipo === tipo ? 'white' : '#374151'
              }}
            >
              {tipo === 'todos' ? '📊 Todos' : tipo === 'ingreso' ? '💚 Ingresos' : '🔴 Egresos'}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Movimientos */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)'
      }}>
        <div style={{ 
          backgroundColor: '#f8fafc', 
          padding: '16px', 
          borderBottom: '2px solid #e5e7eb'
        }}>
          <h3 style={{ margin: 0, color: '#1e293b' }}>
            📋 Movimientos de Caja ({movimientosFiltrados.length})
          </h3>
        </div>
        
        <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
          {movimientosFiltrados.map((movimiento) => (
            <div key={movimiento.id} style={{
              padding: '20px',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start'
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    backgroundColor: movimiento.tipo === 'ingreso' ? '#dcfce7' : '#fee2e2',
                    color: movimiento.tipo === 'ingreso' ? '#166534' : '#991b1b',
                    marginRight: '12px'
                  }}>
                    {movimiento.tipo === 'ingreso' ? '💚 Ingreso' : '🔴 Egreso'}
                  </span>
                  <span style={{ 
                    fontSize: '14px', 
                    color: '#6b7280',
                    backgroundColor: '#f3f4f6',
                    padding: '2px 8px',
                    borderRadius: '4px'
                  }}>
                    {movimiento.categoria}
                  </span>
                </div>
                
                <h4 style={{ 
                  margin: '0 0 8px 0', 
                  color: '#1f2937',
                  fontSize: '16px'
                }}>
                  {movimiento.descripcion}
                </h4>
                
                <div style={{ 
                  fontSize: '14px', 
                  color: '#6b7280',
                  display: 'flex',
                  gap: '16px'
                }}>
                  <span>📅 {new Date(movimiento.fecha).toLocaleDateString('es-ES')}</span>
                  <span>👤 {movimiento.usuario}</span>
                </div>
              </div>
              
              <div style={{ textAlign: 'right' }}>
                <div style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: movimiento.tipo === 'ingreso' ? '#10b981' : '#ef4444'
                }}>
                  {movimiento.tipo === 'ingreso' ? '+' : '-'}${movimiento.monto.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <CajaModal 
          formData={formData}
          setFormData={setFormData}
          categorias={categorias}
          onClose={cerrarModal}
          onSubmit={agregarMovimiento}
        />
      )}
    </div>
  );
}

// Modal para Movimientos de Caja
function CajaModal({ formData, setFormData, categorias, onClose, onSubmit }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '30px',
        width: '100%',
        maxWidth: '500px',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)'
      }}>
        <h2 style={{ marginBottom: '20px', color: '#1e293b' }}>
          ➕ Nuevo Movimiento de Caja
        </h2>

        {/* Tipo de Movimiento */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#374151' }}>
            Tipo de Movimiento
          </label>
          <div style={{ display: 'flex', gap: '12px' }}>
            {['ingreso', 'egreso'].map(tipo => (
              <button
                key={tipo}
                onClick={() => setFormData({...formData, tipo, categoria: ''})}
                style={{
                  flex: 1,
                  padding: '12px',
                  border: '2px solid',
                  borderColor: formData.tipo === tipo ? '#3b82f6' : '#e5e7eb',
                  borderRadius: '8px',
                  backgroundColor: formData.tipo === tipo ? '#eff6ff' : 'white',
                  color: formData.tipo === tipo ? '#3b82f6' : '#6b7280',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                {tipo === 'ingreso' ? '💚 Ingreso' : '🔴 Egreso'}
              </button>
            ))}
          </div>
        </div>

        {/* Fecha */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#374151' }}>
            Fecha
          </label>
          <input
            type="date"
            value={formData.fecha}
            onChange={(e) => setFormData({...formData, fecha: e.target.value})}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Monto */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#374151' }}>
            Monto
          </label>
          <input
            type="number"
            placeholder="0.00"
            value={formData.monto}
            onChange={(e) => setFormData({...formData, monto: e.target.value})}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Categoría */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#374151' }}>
            Categoría
          </label>
          <select
            value={formData.categoria}
            onChange={(e) => setFormData({...formData, categoria: e.target.value})}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
          >
            <option value="">Seleccionar categoría</option>
            {categorias[formData.tipo].map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Descripción */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#374151' }}>
            Descripción
          </label>
          <textarea
            placeholder="Descripción del movimiento..."
            value={formData.descripcion}
            onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '16px',
              boxSizing: 'border-box',
              minHeight: '80px',
              resize: 'vertical'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              backgroundColor: '#6b7280',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            Cancelar
          </button>
          <button
            onClick={onSubmit}
            style={{
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Registrar Movimiento
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
