import { useState, useEffect } from 'react';
import GoogleSheetsConfig from './components/GoogleSheetsConfig.jsx';
import googleSheetsService from './services/googleSheets.js';
import { db } from './config/firebase.js';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  onSnapshot,
  orderBy,
  query,
  where,
  serverTimestamp 
} from 'firebase/firestore';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Estados globales para datos de Firebase
  const [vendedores, setVendedores] = useState([]);
  const [movimientosCaja, setMovimientosCaja] = useState([]);
  const [pedidos, setPedidos] = useState([]);

  // Cargar datos globales desde Firebase
  useEffect(() => {
    if (!isLoggedIn) return;

    // Cargar vendedores
    const unsubscribeVendedores = onSnapshot(collection(db, 'vendedores'), (snapshot) => {
      const vendedoresData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setVendedores(vendedoresData);
    });

    // Cargar movimientos de caja
    const unsubscribeMovimientos = onSnapshot(collection(db, 'movimientos_caja'), (snapshot) => {
      const movimientos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        fecha: doc.data().fecha?.toDate ? doc.data().fecha.toDate().toISOString().split('T')[0] : doc.data().fecha
      }));
      setMovimientosCaja(movimientos);
    });

    // Cargar pedidos
    const unsubscribePedidos = onSnapshot(collection(db, 'pedidos'), (snapshot) => {
      const pedidosData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        fechaCreacion: doc.data().fechaCreacion?.toDate ? doc.data().fechaCreacion.toDate().toISOString().split('T')[0] : doc.data().fechaCreacion
      }));
      setPedidos(pedidosData);
    });

    return () => {
      unsubscribeVendedores();
      unsubscribeMovimientos();
      unsubscribePedidos();
    };
  }, [isLoggedIn]);

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
        boxShadow: '4px 0 12px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh'
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

        <nav style={{ flex: 1 }}>
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
          marginTop: 'auto',
          padding: '24px'
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
          {currentView === 'dashboard' && (
            <DashboardSection 
              vendedores={vendedores}
              movimientosCaja={movimientosCaja}
              pedidos={pedidos}
            />
          )}
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
function DashboardSection({ vendedores = [], movimientosCaja = [], pedidos = [] }) {
  // Calcular estadísticas reales
  const vendedoresActivos = vendedores.length;
  
  // Calcular saldo en caja
  const totalIngresos = movimientosCaja
    .filter(m => m.tipo === 'ingreso')
    .reduce((sum, m) => sum + (m.monto || 0), 0);
  
  const totalEgresos = movimientosCaja
    .filter(m => m.tipo === 'egreso')
    .reduce((sum, m) => sum + (m.monto || 0), 0);
  
  const saldoEnCaja = totalIngresos - totalEgresos;
  
  // Calcular pedidos pendientes
  const pedidosPendientes = pedidos.filter(p => p.estado === 'pendiente').length;
  
  // Calcular ventas del mes (movimientos de vendedores de tipo cobro del mes actual)
  const fechaActual = new Date();
  const mesActual = fechaActual.getMonth();
  const añoActual = fechaActual.getFullYear();
  
  const ventasDelMes = movimientosCaja
    .filter(m => {
      if (m.tipo !== 'ingreso' || !m.fecha) return false;
      const fechaMovimiento = new Date(m.fecha);
      return fechaMovimiento.getMonth() === mesActual && fechaMovimiento.getFullYear() === añoActual;
    })
    .reduce((sum, m) => sum + (m.monto || 0), 0);

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
          value={`$${ventasDelMes.toLocaleString()}`} 
          color="#10b981"
          subtitle={ventasDelMes > 0 ? "Con datos reales" : "Sin ventas este mes"}
        />
        <StatsCard 
          title="Vendedores Activos" 
          value={vendedoresActivos.toString()} 
          color="#3b82f6"
          subtitle={vendedoresActivos > 0 ? "En la base de datos" : "Sin vendedores"}
        />
        <StatsCard 
          title="Pedidos Pendientes" 
          value={pedidosPendientes.toString()} 
          color="#f59e0b"
          subtitle={pedidosPendientes > 0 ? "Requieren atención" : "Sin pedidos pendientes"}
        />
        <StatsCard 
          title="Saldo en Caja" 
          value={`$${saldoEnCaja.toLocaleString()}`} 
          color={saldoEnCaja >= 0 ? "#8b5cf6" : "#ef4444"}
          subtitle={saldoEnCaja === 0 ? "Caja en cero" : saldoEnCaja > 0 ? "Saldo positivo" : "Saldo negativo"}
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
  const [vendedores, setVendedores] = useState([]);
  const [movimientosVendedores, setMovimientosVendedores] = useState([]);
  const [conceptosPersonalizados, setConceptosPersonalizados] = useState([
    'VENTA',
    'DEVOLUCION', 
    'DESCUENTO',
    'PAGO',
    'Comisión por ventas',
    'Bono por objetivos',
    'Adelanto de sueldo',
    'Ajuste por error'
  ]);

  // Cargar datos desde Firebase
  useEffect(() => {
    // Cargar vendedores
    const unsubscribeVendedores = onSnapshot(
      query(collection(db, 'vendedores'), orderBy('fechaIngreso', 'desc')), 
      (snapshot) => {
        const vendedoresData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setVendedores(vendedoresData);
      },
      (error) => {
        console.error('Error al cargar vendedores:', error);
        // Si hay error, usar datos por defecto
        setVendedores([
          { 
            id: 'default1', 
            nombre: 'Ana García', 
            email: 'ana@empresa.com', 
            dni: '12345678',
            telefono: '+54 11 1234-5678',
            direccion: 'Av. Corrientes 1234, CABA',
            fechaNacimiento: '1990-05-15',
            fechaIngreso: '2024-01-15',
            saldo: 2502500, 
            activo: true 
          },
          { 
            id: 'default2', 
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
      }
    );

    // Cargar movimientos de vendedores
    const unsubscribeMovimientos = onSnapshot(
      query(collection(db, 'movimientos_vendedores'), orderBy('fecha', 'desc')), 
      (snapshot) => {
        const movimientosData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMovimientosVendedores(movimientosData);
      },
      (error) => {
        console.error('Error al cargar movimientos:', error);
      }
    );

    return () => {
      unsubscribeVendedores();
      unsubscribeMovimientos();
    };
  }, []);

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

  // Función para agregar nuevo concepto
  const agregarNuevoConcepto = (nuevoConcepto) => {
    if (nuevoConcepto && !conceptosPersonalizados.includes(nuevoConcepto)) {
      setConceptosPersonalizados(prev => [...prev, nuevoConcepto]);
      return true;
    }
    return false;
  };

  // Función para eliminar concepto
  const eliminarConcepto = (concepto) => {
    // Verificar si el concepto está siendo usado en algún movimiento
    const conceptoEnUso = movimientosVendedores.some(m => m.concepto === concepto);
    if (conceptoEnUso) {
      alert(`No se puede eliminar el concepto "${concepto}" porque está siendo usado en movimientos existentes.`);
      return false;
    }
    
    setConceptosPersonalizados(prev => prev.filter(c => c !== concepto));
    return true;
  };

  // Funciones para manejar movimientos
  const agregarMovimiento = async (vendedorId, movimientoData) => {
    try {
      const nuevoMovimiento = {
        vendedorId: vendedorId,
        fecha: movimientoData.fecha || new Date().toISOString().split('T')[0],
        ...movimientoData,
        fechaCreacion: serverTimestamp()
      };
      
      // Agregar a Firebase
      const docRef = await addDoc(collection(db, 'movimientos_vendedores'), nuevoMovimiento);
      
      // Actualizar saldo del vendedor en Firebase
      const ajuste = movimientoData.tipo === 'haber' ? movimientoData.monto : -movimientoData.monto;
      const vendedorRef = doc(db, 'vendedores', vendedorId);
      
      // Obtener el vendedor actual
      const vendedor = vendedores.find(v => v.id === vendedorId);
      if (vendedor) {
        await updateDoc(vendedorRef, {
          saldo: vendedor.saldo + ajuste
        });
      }
      
      return docRef.id;
    } catch (error) {
      console.error('Error al agregar movimiento:', error);
      alert('Error al agregar movimiento');
      return null;
    }
  };

  const editarMovimiento = async (movimientoId, movimientoData) => {
    try {
      const movimientoAnterior = movimientosVendedores.find(m => m.id === movimientoId);
      if (!movimientoAnterior) return;

      // Calcular ajustes de saldo
      const ajusteAnterior = movimientoAnterior.tipo === 'haber' ? -movimientoAnterior.monto : movimientoAnterior.monto;
      const ajusteNuevo = movimientoData.tipo === 'haber' ? movimientoData.monto : -movimientoData.monto;
      const ajusteTotal = ajusteAnterior + ajusteNuevo;
      
      // Actualizar en Firebase
      await updateDoc(doc(db, 'movimientos_vendedores', movimientoId), movimientoData);
      
      // Actualizar saldo del vendedor en Firebase
      const vendedor = vendedores.find(v => v.id === movimientoAnterior.vendedorId);
      if (vendedor) {
        await updateDoc(doc(db, 'vendedores', movimientoAnterior.vendedorId), {
          saldo: vendedor.saldo + ajusteTotal
        });
      }
    } catch (error) {
      console.error('Error al editar movimiento:', error);
      alert('Error al editar movimiento');
    }
  };

  const eliminarMovimiento = async (movimientoId) => {
    try {
      const movimiento = movimientosVendedores.find(m => m.id === movimientoId);
      if (!movimiento) return;

      // Revertir el efecto del movimiento en el saldo
      const ajuste = movimiento.tipo === 'haber' ? -movimiento.monto : movimiento.monto;
      
      // Eliminar de Firebase
      await deleteDoc(doc(db, 'movimientos_vendedores', movimientoId));
      
      // Actualizar saldo del vendedor en Firebase
      const vendedor = vendedores.find(v => v.id === movimiento.vendedorId);
      if (vendedor) {
        await updateDoc(doc(db, 'vendedores', movimiento.vendedorId), {
          saldo: vendedor.saldo + ajuste
        });
      }
    } catch (error) {
      console.error('Error al eliminar movimiento:', error);
      alert('Error al eliminar movimiento');
    }
  };

  // Función para eliminar vendedor
  const eliminarVendedor = async (vendedorId) => {
    // Verificar si el vendedor tiene movimientos
    const tieneMovimientos = movimientosVendedores.some(m => m.vendedorId === vendedorId);
    
    if (tieneMovimientos) {
      const confirmar = confirm('Este vendedor tiene movimientos registrados. ¿Estás seguro de eliminarlo? Esto también eliminará todos sus movimientos.');
      if (!confirmar) return false;
      
      // Eliminar todos los movimientos del vendedor de Firebase
      try {
        const movimientosQuery = query(
          collection(db, 'movimientos_vendedores'),
          orderBy('fecha', 'desc')
        );
        const movimientosSnapshot = await getDocs(movimientosQuery);
        
        // Eliminar movimientos uno por uno
        for (const movDoc of movimientosSnapshot.docs) {
          const movData = movDoc.data();
          if (movData.vendedorId === vendedorId) {
            await deleteDoc(doc(db, 'movimientos_vendedores', movDoc.id));
          }
        }
      } catch (error) {
        console.error('Error al eliminar movimientos:', error);
        alert('Error al eliminar movimientos del vendedor');
        return false;
      }
    }
    
    // Eliminar el vendedor de Firebase
    try {
      await deleteDoc(doc(db, 'vendedores', vendedorId));
      return true;
    } catch (error) {
      console.error('Error al eliminar vendedor:', error);
      alert('Error al eliminar vendedor');
      return false;
    }
  };

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
                    <button
                      onClick={() => {
                        if (confirm(`¿Estás seguro de eliminar al vendedor "${vendedor.nombre}"?`)) {
                          eliminarVendedor(vendedor.id);
                        }
                      }}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: '#dc2626',
                        border: 'none',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      🗑️ Eliminar
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
          onAgregarMovimiento={agregarMovimiento}
          onEditarMovimiento={editarMovimiento}
          onEliminarMovimiento={eliminarMovimiento}
          conceptosDisponibles={conceptosPersonalizados}
          onAgregarConcepto={agregarNuevoConcepto}
          onEliminarConcepto={eliminarConcepto}
        />
      )}
    </div>
  );
}

// Modal de Detalles del Vendedor
function DetalleVendedorModal({ vendedor, movimientos, onClose, onAgregarMovimiento, onEditarMovimiento, onEliminarMovimiento, conceptosDisponibles, onAgregarConcepto, onEliminarConcepto }) {
  const [vistaCompacta, setVistaCompacta] = useState(false);
  const [showMovimientoModal, setShowMovimientoModal] = useState(false);
  const [movimientoEditando, setMovimientoEditando] = useState(null);
  const [showNuevoConceptoInput, setShowNuevoConceptoInput] = useState(false);
  const [nuevoConcepto, setNuevoConcepto] = useState('');
  const [showGestionConceptos, setShowGestionConceptos] = useState(false);
  const [formMovimiento, setFormMovimiento] = useState({
    tipo: 'haber',
    monto: '',
    concepto: '',
    descripcion: '',
    numeroOptica: '',
    fecha: new Date().toISOString().split('T')[0]
  });
  
  const totalHaber = movimientos
    .filter(m => m.tipo === 'haber')
    .reduce((sum, m) => sum + m.monto, 0);
  
  const totalDebe = movimientos
    .filter(m => m.tipo === 'debe')
    .reduce((sum, m) => sum + m.monto, 0);

  const agregarConceptoPersonalizado = () => {
    if (nuevoConcepto.trim() && onAgregarConcepto) {
      const conceptoAgregado = onAgregarConcepto(nuevoConcepto.trim().toUpperCase());
      if (conceptoAgregado) {
        setFormMovimiento({...formMovimiento, concepto: nuevoConcepto.trim().toUpperCase()});
        setNuevoConcepto('');
        setShowNuevoConceptoInput(false);
      } else {
        alert('Este concepto ya existe');
      }
    }
  };

  const abrirModalMovimiento = (movimiento = null) => {
    if (movimiento) {
      setMovimientoEditando(movimiento);
      setFormMovimiento({
        tipo: movimiento.tipo,
        monto: movimiento.monto.toString(),
        concepto: movimiento.concepto,
        descripcion: movimiento.descripcion,
        numeroOptica: movimiento.numeroOptica || '',
        fecha: movimiento.fecha
      });
    } else {
      setMovimientoEditando(null);
      setFormMovimiento({
        tipo: 'haber',
        monto: '',
        concepto: '',
        descripcion: '',
        numeroOptica: '',
        fecha: new Date().toISOString().split('T')[0]
      });
    }
    setShowMovimientoModal(true);
  };

  const cerrarModalMovimiento = () => {
    setShowMovimientoModal(false);
    setMovimientoEditando(null);
    setShowNuevoConceptoInput(false);
    setNuevoConcepto('');
    setFormMovimiento({
      tipo: 'haber',
      monto: '',
      concepto: '',
      descripcion: '',
      numeroOptica: '',
      fecha: new Date().toISOString().split('T')[0]
    });
  };

  const handleSubmitMovimiento = (e) => {
    e.preventDefault();
    
    if (!formMovimiento.monto || (!formMovimiento.concepto && !showNuevoConceptoInput) || !formMovimiento.descripcion) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }

    // Si está agregando un concepto nuevo, usar ese concepto
    const conceptoFinal = showNuevoConceptoInput ? nuevoConcepto.trim().toUpperCase() : formMovimiento.concepto;
    
    if (showNuevoConceptoInput && !nuevoConcepto.trim()) {
      alert('Por favor ingrese el nuevo concepto');
      return;
    }

    const movimientoData = {
      tipo: formMovimiento.tipo,
      monto: parseFloat(formMovimiento.monto),
      concepto: conceptoFinal,
      descripcion: formMovimiento.descripcion,
      numeroOptica: formMovimiento.numeroOptica,
      fecha: formMovimiento.fecha
    };

    // Si está agregando un concepto nuevo, agregarlo a la lista
    if (showNuevoConceptoInput && onAgregarConcepto) {
      onAgregarConcepto(conceptoFinal);
    }

    if (movimientoEditando) {
      onEditarMovimiento(movimientoEditando.id, movimientoData);
    } else {
      onAgregarMovimiento(vendedor.id, movimientoData);
    }

    cerrarModalMovimiento();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        width: '90%',
        maxWidth: '800px',
        maxHeight: '90vh',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>
              {vendedor.nombre}
            </h2>
            <p style={{ margin: '4px 0 0 0', opacity: 0.9 }}>
              Detalles del vendedor
            </p>
          </div>
          <button 
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              width: '32px',
              height: '32px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px'
            }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px', maxHeight: 'calc(90vh - 120px)', overflowY: 'auto' }}>
          {/* Información Personal */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#1f2937' }}>
              Información Personal
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              <div style={{ 
                backgroundColor: '#f8fafc', 
                padding: '12px', 
                borderRadius: '8px', 
                border: '1px solid #e2e8f0' 
              }}>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>EMAIL</span>
                <p style={{ margin: '4px 0 0 0', fontWeight: '500' }}>{vendedor.email}</p>
              </div>
              <div style={{ 
                backgroundColor: '#f8fafc', 
                padding: '12px', 
                borderRadius: '8px', 
                border: '1px solid #e2e8f0' 
              }}>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>DNI</span>
                <p style={{ margin: '4px 0 0 0', fontWeight: '500' }}>{vendedor.dni}</p>
              </div>
              <div style={{ 
                backgroundColor: '#f8fafc', 
                padding: '12px', 
                borderRadius: '8px', 
                border: '1px solid #e2e8f0' 
              }}>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>TELÉFONO</span>
                <p style={{ margin: '4px 0 0 0', fontWeight: '500' }}>{vendedor.telefono}</p>
              </div>
              <div style={{ 
                backgroundColor: '#f8fafc', 
                padding: '12px', 
                borderRadius: '8px', 
                border: '1px solid #e2e8f0' 
              }}>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>INGRESO</span>
                <p style={{ margin: '4px 0 0 0', fontWeight: '500' }}>{vendedor.fechaIngreso}</p>
              </div>
            </div>
          </div>

          {/* Resumen Financiero */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#1f2937' }}>
              Resumen Financiero
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
              <div style={{ 
                backgroundColor: '#ecfdf5', 
                border: '1px solid #a7f3d0', 
                padding: '16px', 
                borderRadius: '12px', 
                textAlign: 'center' 
              }}>
                <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#059669', fontWeight: '600' }}>
                  TOTAL HABER
                </p>
                <p style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#047857' }}>
                  ${totalHaber.toLocaleString()}
                </p>
              </div>
              <div style={{ 
                backgroundColor: '#fef2f2', 
                border: '1px solid #fca5a5', 
                padding: '16px', 
                borderRadius: '12px', 
                textAlign: 'center' 
              }}>
                <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#dc2626', fontWeight: '600' }}>
                  TOTAL DEBE
                </p>
                <p style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#b91c1c' }}>
                  ${totalDebe.toLocaleString()}
                </p>
              </div>
              <div style={{ 
                backgroundColor: '#f0f9ff', 
                border: '1px solid #7dd3fc', 
                padding: '16px', 
                borderRadius: '12px', 
                textAlign: 'center' 
              }}>
                <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#0284c7', fontWeight: '600' }}>
                  SALDO ACTUAL
                </p>
                <p style={{ 
                  margin: 0, 
                  fontSize: '20px', 
                  fontWeight: 'bold', 
                  color: vendedor.saldo >= 0 ? '#047857' : '#b91c1c' 
                }}>
                  ${vendedor.saldo.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Movimientos */}
          <div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '16px' 
            }}>
              <h3 style={{ margin: 0, fontSize: '18px', color: '#1f2937' }}>
                Movimientos
              </h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => abrirModalMovimiento()}
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  + Agregar
                </button>
                <button
                  onClick={() => setShowGestionConceptos(!showGestionConceptos)}
                  style={{
                    backgroundColor: showGestionConceptos ? '#8b5cf6' : '#f3f4f6',
                    color: showGestionConceptos ? 'white' : '#4b5563',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  ⚙️ Conceptos
                </button>
                <button
                  onClick={() => setVistaCompacta(!vistaCompacta)}
                  style={{
                    backgroundColor: vistaCompacta ? '#3b82f6' : '#f3f4f6',
                    color: vistaCompacta ? 'white' : '#4b5563',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  {vistaCompacta ? 'Detallada' : 'Compacta'}
                </button>
              </div>
            </div>

            {movimientos.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '48px 24px', 
                color: '#6b7280',
                backgroundColor: '#f9fafb',
                borderRadius: '12px',
                border: '1px solid #e5e7eb'
              }}>
                <p style={{ margin: 0, fontSize: '16px' }}>No hay movimientos registrados</p>
                <p style={{ margin: '8px 0 0 0', fontSize: '14px' }}>
                  Agrega el primer movimiento para comenzar
                </p>
              </div>
            ) : (
              <div style={{ 
                border: '1px solid #e5e7eb', 
                borderRadius: '12px', 
                overflow: 'hidden',
                backgroundColor: 'white'
              }}>
                {movimientos.map((movimiento, index) => (
                  <div key={movimiento.id} style={{
                    padding: vistaCompacta ? '12px 16px' : '16px',
                    borderBottom: index < movimientos.length - 1 ? '1px solid #f3f4f6' : 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: vistaCompacta ? 'center' : 'flex-start'
                  }}>
                    <div style={{ flex: 1 }}>
                      {vistaCompacta ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{
                            display: 'inline-block',
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: movimiento.tipo === 'haber' ? '#10b981' : '#ef4444'
                          }}></span>
                          <span style={{ fontWeight: '500', minWidth: '80px' }}>
                            {movimiento.concepto}
                          </span>
                          <span style={{ color: '#6b7280', fontSize: '14px', flex: 1 }}>
                            {movimiento.descripcion}
                          </span>
                          <span style={{ fontSize: '14px', color: '#6b7280' }}>
                            {movimiento.fecha}
                          </span>
                          <span style={{ 
                            fontWeight: 'bold',
                            color: movimiento.tipo === 'haber' ? '#059669' : '#dc2626',
                            minWidth: '80px',
                            textAlign: 'right'
                          }}>
                            {movimiento.tipo === 'haber' ? '+' : '-'}${movimiento.monto.toLocaleString()}
                          </span>
                        </div>
                      ) : (
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <span style={{
                              display: 'inline-block',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: '600',
                              backgroundColor: movimiento.tipo === 'haber' ? '#ecfdf5' : '#fef2f2',
                              color: movimiento.tipo === 'haber' ? '#059669' : '#dc2626'
                            }}>
                              {movimiento.tipo.toUpperCase()}
                            </span>
                            <span style={{ fontWeight: '600', fontSize: '16px' }}>
                              {movimiento.concepto}
                            </span>
                            <span style={{ 
                              fontWeight: 'bold',
                              fontSize: '16px',
                              color: movimiento.tipo === 'haber' ? '#059669' : '#dc2626'
                            }}>
                              {movimiento.tipo === 'haber' ? '+' : '-'}${movimiento.monto.toLocaleString()}
                            </span>
                          </div>
                          <p style={{ margin: '0 0 8px 0', color: '#4b5563' }}>
                            {movimiento.descripcion}
                          </p>
                          <div style={{ display: 'flex', gap: '16px', fontSize: '14px', color: '#6b7280' }}>
                            <span>📅 {movimiento.fecha}</span>
                            {movimiento.numeroOptica && (
                              <span>🏪 Óptica #{movimiento.numeroOptica}</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '4px', marginLeft: '12px' }}>
                      <button
                        onClick={() => abrirModalMovimiento(movimiento)}
                        style={{
                          backgroundColor: '#f3f4f6',
                          color: '#4b5563',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          padding: '6px 8px',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('¿Estás seguro de eliminar este movimiento?')) {
                            onEliminarMovimiento(movimiento.id);
                          }
                        }}
                        style={{
                          backgroundColor: '#fef2f2',
                          color: '#dc2626',
                          border: '1px solid #fca5a5',
                          borderRadius: '6px',
                          padding: '6px 8px',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                        title="Eliminar"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Panel de Gestión de Conceptos */}
          {showGestionConceptos && (
            <div style={{ 
              marginTop: '24px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '20px'
            }}>
              <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#1f2937' }}>
                Gestión de Conceptos
              </h4>
              
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  <input
                    type="text"
                    value={nuevoConcepto}
                    onChange={(e) => setNuevoConcepto(e.target.value)}
                    placeholder="Nuevo concepto (ej: INSTALACION)"
                    style={{
                      flex: 1,
                      padding: '10px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (nuevoConcepto.trim()) {
                          const agregado = onAgregarConcepto(nuevoConcepto.trim().toUpperCase());
                          if (agregado) {
                            setNuevoConcepto('');
                          } else {
                            alert('Este concepto ya existe');
                          }
                        }
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      if (nuevoConcepto.trim()) {
                        const agregado = onAgregarConcepto(nuevoConcepto.trim().toUpperCase());
                        if (agregado) {
                          setNuevoConcepto('');
                        } else {
                          alert('Este concepto ya existe');
                        }
                      }
                    }}
                    style={{
                      padding: '10px 16px',
                      background: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    + Agregar
                  </button>
                </div>
              </div>

              <div style={{ 
                maxHeight: '200px', 
                overflowY: 'auto',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                backgroundColor: 'white'
              }}>
                {conceptosDisponibles && conceptosDisponibles.map((concepto, index) => (
                  <div key={concepto} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 16px',
                    borderBottom: index < conceptosDisponibles.length - 1 ? '1px solid #f3f4f6' : 'none'
                  }}>
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>
                      {concepto}
                    </span>
                    <button
                      onClick={() => {
                        if (confirm(`¿Estás seguro de eliminar el concepto "${concepto}"?`)) {
                          onEliminarConcepto(concepto);
                        }
                      }}
                      style={{
                        backgroundColor: '#fef2f2',
                        color: '#dc2626',
                        border: '1px solid #fca5a5',
                        borderRadius: '4px',
                        padding: '4px 8px',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Agregar/Editar Movimiento */}
      {showMovimientoModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1001
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            width: '90%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              color: 'white',
              padding: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
                {movimientoEditando ? 'Editar Movimiento' : 'Agregar Movimiento'}
              </h3>
              <button 
                onClick={cerrarModalMovimiento}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  width: '28px',
                  height: '28px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px'
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmitMovimiento} style={{ padding: '20px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                  Tipo de Movimiento *
                </label>
                <select
                  value={formMovimiento.tipo}
                  onChange={(e) => setFormMovimiento({...formMovimiento, tipo: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                  required
                >
                  <option value="haber">Haber (Entrada)</option>
                  <option value="debe">Debe (Salida)</option>
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                  Monto *
                </label>
                <input
                  type="number"
                  value={formMovimiento.monto}
                  onChange={(e) => setFormMovimiento({...formMovimiento, monto: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                  Concepto *
                </label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
                  <div style={{ flex: 1 }}>
                    <select
                      value={formMovimiento.concepto}
                      onChange={(e) => {
                        if (e.target.value === 'NUEVO_CONCEPTO') {
                          setShowNuevoConceptoInput(true);
                          setFormMovimiento({...formMovimiento, concepto: ''});
                        } else {
                          setFormMovimiento({...formMovimiento, concepto: e.target.value});
                        }
                      }}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                      required={!showNuevoConceptoInput}
                    >
                      <option value="">Seleccionar concepto</option>
                      {conceptosDisponibles && conceptosDisponibles.map(concepto => (
                        <option key={concepto} value={concepto}>{concepto}</option>
                      ))}
                      <option value="NUEVO_CONCEPTO">+ Agregar nuevo concepto</option>
                    </select>
                  </div>
                </div>
                
                {showNuevoConceptoInput && (
                  <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      value={nuevoConcepto}
                      onChange={(e) => setNuevoConcepto(e.target.value)}
                      placeholder="Nuevo concepto (ej: REPARACION)"
                      style={{
                        flex: 1,
                        padding: '10px',
                        border: '2px solid #3b82f6',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                      autoFocus
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          agregarConceptoPersonalizado();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={agregarConceptoPersonalizado}
                      style={{
                        padding: '10px 16px',
                        background: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      ✓ Agregar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowNuevoConceptoInput(false);
                        setNuevoConcepto('');
                      }}
                      style={{
                        padding: '10px 16px',
                        background: '#6b7280',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                  Descripción *
                </label>
                <textarea
                  value={formMovimiento.descripcion}
                  onChange={(e) => setFormMovimiento({...formMovimiento, descripcion: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    minHeight: '80px',
                    resize: 'vertical'
                  }}
                  placeholder="Descripción detallada del movimiento"
                  required
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                  Número de Óptica
                </label>
                <input
                  type="text"
                  value={formMovimiento.numeroOptica}
                  onChange={(e) => setFormMovimiento({...formMovimiento, numeroOptica: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                  placeholder="Ej: 001, 002, etc."
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                  Fecha *
                </label>
                <input
                  type="date"
                  value={formMovimiento.fecha}
                  onChange={(e) => setFormMovimiento({...formMovimiento, fecha: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={cerrarModalMovimiento}
                  style={{
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  {movimientoEditando ? 'Actualizar' : 'Agregar'} Movimiento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Componente de Control de Caja
function CajaSection() {
  const [movimientosCaja, setMovimientosCaja] = useState([]);

  // Cargar movimientos de caja desde Firebase
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'movimientos_caja'), (snapshot) => {
      const movimientos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        fecha: doc.data().fecha?.toDate ? doc.data().fecha.toDate().toISOString().split('T')[0] : doc.data().fecha
      }));
      
      // Ordenar por fecha descendente (más recientes primero)
      movimientos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
      
      setMovimientosCaja(movimientos);
    });

    return () => unsubscribe();
  }, []);

  const [categorias, setCategorias] = useState([
    'Ventas',
    'Gastos Operativos', 
    'Compras',
    'Sueldos',
    'Impuestos',
    'Servicios',
    'Mantenimiento',
    'Marketing',
    'Otros'
  ]);

  const [showMovimientoModal, setShowMovimientoModal] = useState(false);
  const [showGestionCategorias, setShowGestionCategorias] = useState(false);
  const [nuevaCategoria, setNuevaCategoria] = useState('');
  const [filtroFechaDesde, setFiltroFechaDesde] = useState('');
  const [filtroFechaHasta, setFiltroFechaHasta] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [formMovimiento, setFormMovimiento] = useState({
    tipo: 'ingreso',
    monto: '',
    categoria: '',
    descripcion: '',
    numeroComprobante: '',
    fecha: new Date().toISOString().split('T')[0]
  });

  // Calcular totales
  const totalIngresos = movimientosCaja
    .filter(m => m.tipo === 'ingreso')
    .reduce((sum, m) => sum + m.monto, 0);

  const totalEgresos = movimientosCaja
    .filter(m => m.tipo === 'egreso')
    .reduce((sum, m) => sum + m.monto, 0);

  const saldoActual = totalIngresos - totalEgresos;

  // Filtrar movimientos
  const movimientosFiltrados = movimientosCaja.filter(movimiento => {
    // Filtro por rango de fechas
    let cumpleFecha = true;
    if (filtroFechaDesde && filtroFechaHasta) {
      // Filtrar por rango de fechas
      cumpleFecha = movimiento.fecha >= filtroFechaDesde && movimiento.fecha <= filtroFechaHasta;
    } else if (filtroFechaDesde) {
      // Solo fecha desde (desde esa fecha en adelante)
      cumpleFecha = movimiento.fecha >= filtroFechaDesde;
    } else if (filtroFechaHasta) {
      // Solo fecha hasta (hasta esa fecha)
      cumpleFecha = movimiento.fecha <= filtroFechaHasta;
    }
    
    const cumpleCategoria = !filtroCategoria || movimiento.categoria === filtroCategoria;
    const cumpleTipo = !filtroTipo || movimiento.tipo === filtroTipo;
    return cumpleFecha && cumpleCategoria && cumpleTipo;
  });

  // Funciones para manejar movimientos
  const agregarMovimiento = async (e) => {
    e.preventDefault();
    
    if (!formMovimiento.monto || !formMovimiento.categoria || !formMovimiento.descripcion) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    try {
      const nuevoMovimiento = {
        ...formMovimiento,
        monto: parseFloat(formMovimiento.monto),
        fecha: new Date(formMovimiento.fecha)
      };

      await addDoc(collection(db, 'movimientos_caja'), nuevoMovimiento);
      cerrarModal();
    } catch (error) {
      console.error('Error al agregar movimiento de caja:', error);
      alert('Error al agregar el movimiento');
    }
  };

  // Funciones para gestionar categorías
  const agregarCategoria = () => {
    if (nuevaCategoria.trim() && !categorias.includes(nuevaCategoria.trim())) {
      setCategorias(prev => [...prev, nuevaCategoria.trim()]);
      setNuevaCategoria('');
      return true;
    }
    return false;
  };

  const eliminarCategoria = (categoria) => {
    // Verificar si la categoría está siendo usada en algún movimiento
    const categoriaEnUso = movimientosCaja.some(m => m.categoria === categoria);
    if (categoriaEnUso) {
      alert(`No se puede eliminar la categoría "${categoria}" porque está siendo usada en movimientos existentes.`);
      return false;
    }
    
    setCategorias(prev => prev.filter(c => c !== categoria));
    return true;
  };

  const eliminarMovimiento = async (movimientoId) => {
    if (confirm('¿Estás seguro de eliminar este movimiento?')) {
      try {
        await deleteDoc(doc(db, 'movimientos_caja', movimientoId));
      } catch (error) {
        console.error('Error al eliminar movimiento de caja:', error);
        alert('Error al eliminar el movimiento');
      }
    }
  };

  const cerrarModal = () => {
    setShowMovimientoModal(false);
    setFormMovimiento({
      tipo: 'ingreso',
      monto: '',
      categoria: '',
      descripcion: '',
      numeroComprobante: '',
      fecha: new Date().toISOString().split('T')[0]
    });
  };

  // Obtener movimientos de hoy
  const hoy = new Date().toISOString().split('T')[0];
  const movimientosHoy = movimientosCaja.filter(m => m.fecha === hoy);
  const ingresosHoy = movimientosHoy.filter(m => m.tipo === 'ingreso').reduce((sum, m) => sum + m.monto, 0);
  const egresosHoy = movimientosHoy.filter(m => m.tipo === 'egreso').reduce((sum, m) => sum + m.monto, 0);

  return (
    <div>
      {/* Resumen de Caja */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px', 
        marginBottom: '32px' 
      }}>
        <StatsCard 
          title="Saldo Actual" 
          value={`$${saldoActual.toLocaleString()}`}
          color={saldoActual >= 0 ? "#10b981" : "#ef4444"}
          subtitle={saldoActual >= 0 ? "Saldo positivo" : "Saldo negativo"}
        />
        <StatsCard 
          title="Ingresos Total" 
          value={`$${totalIngresos.toLocaleString()}`}
          color="#3b82f6"
          subtitle={`${movimientosCaja.filter(m => m.tipo === 'ingreso').length} movimientos`}
        />
        <StatsCard 
          title="Egresos Total" 
          value={`$${totalEgresos.toLocaleString()}`}
          color="#f59e0b"
          subtitle={`${movimientosCaja.filter(m => m.tipo === 'egreso').length} movimientos`}
        />
        <StatsCard 
          title="Movimientos Hoy" 
          value={movimientosHoy.length}
          color="#8b5cf6"
          subtitle={`+$${ingresosHoy.toLocaleString()} / -$${egresosHoy.toLocaleString()}`}
        />
      </div>

      {/* Panel de Control */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e2e8f0',
        marginBottom: '24px'
      }}>
        <div style={{
          backgroundColor: '#fafbfc',
          padding: '20px 24px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <h3 style={{
            margin: 0,
            fontSize: '18px',
            fontWeight: '600',
            color: '#0f172a'
          }}>
            💰 Control de Caja ({movimientosFiltrados.length} movimientos)
          </h3>
          
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Filtros */}
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: 'white'
              }}
            >
              <option value="">Todos los tipos</option>
              <option value="ingreso">Ingresos</option>
              <option value="egreso">Egresos</option>
            </select>

            <select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: 'white'
              }}
            >
              <option value="">Todas las categorías</option>
              {categorias.map(categoria => (
                <option key={categoria} value={categoria}>{categoria}</option>
              ))}
            </select>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Desde:</span>
              <input
                type="date"
                value={filtroFechaDesde}
                onChange={(e) => setFiltroFechaDesde(e.target.value)}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Hasta:</span>
              <input
                type="date"
                value={filtroFechaHasta}
                onChange={(e) => setFiltroFechaHasta(e.target.value)}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
            </div>

            <button
              onClick={() => {
                setFiltroFechaDesde('');
                setFiltroFechaHasta('');
                setFiltroCategoria('');
                setFiltroTipo('');
              }}
              style={{
                padding: '8px 12px',
                backgroundColor: '#f3f4f6',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                color: '#4b5563',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              🔄 Limpiar
            </button>

            <button
              onClick={() => setShowGestionCategorias(!showGestionCategorias)}
              style={{
                padding: '8px 12px',
                backgroundColor: showGestionCategorias ? '#8b5cf6' : '#f3f4f6',
                color: showGestionCategorias ? 'white' : '#4b5563',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              ⚙️ Categorías
            </button>

            <button
              onClick={() => setShowMovimientoModal(true)}
              style={{
                padding: '12px 20px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
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
              ➕ Nuevo Movimiento
            </button>
          </div>
        </div>

        {/* Lista de Movimientos */}
        <div style={{ padding: '24px' }}>
          {movimientosFiltrados.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '48px 24px', 
              color: '#6b7280',
              backgroundColor: '#f9fafb',
              borderRadius: '12px',
              border: '1px solid #e5e7eb'
            }}>
              <p style={{ margin: 0, fontSize: '16px' }}>No hay movimientos que coincidan con los filtros</p>
              <p style={{ margin: '8px 0 0 0', fontSize: '14px' }}>
                Intenta ajustar los filtros o agregar un nuevo movimiento
              </p>
            </div>
          ) : (
            <div style={{ 
              border: '1px solid #e5e7eb', 
              borderRadius: '12px', 
              overflow: 'hidden',
              backgroundColor: 'white'
            }}>
              {movimientosFiltrados.map((movimiento, index) => (
                <div key={movimiento.id} style={{
                  padding: '20px',
                  borderBottom: index < movimientosFiltrados.length - 1 ? '1px solid #f3f4f6' : 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        backgroundColor: movimiento.tipo === 'ingreso' ? '#ecfdf5' : '#fef2f2',
                        color: movimiento.tipo === 'ingreso' ? '#059669' : '#dc2626'
                      }}>
                        {movimiento.tipo === 'ingreso' ? '💰 INGRESO' : '💸 EGRESO'}
                      </span>
                      <span style={{ 
                        fontWeight: 'bold',
                        fontSize: '18px',
                        color: movimiento.tipo === 'ingreso' ? '#059669' : '#dc2626'
                      }}>
                        {movimiento.tipo === 'ingreso' ? '+' : '-'}${movimiento.monto.toLocaleString()}
                      </span>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500',
                        backgroundColor: '#f0f9ff',
                        color: '#0284c7'
                      }}>
                        {movimiento.categoria}
                      </span>
                    </div>
                    <p style={{ margin: '0 0 8px 0', color: '#4b5563', fontSize: '15px' }}>
                      {movimiento.descripcion}
                    </p>
                    <div style={{ display: 'flex', gap: '16px', fontSize: '14px', color: '#6b7280' }}>
                      <span>📅 {movimiento.fecha}</span>
                      {movimiento.numeroComprobante && (
                        <span>📄 {movimiento.numeroComprobante}</span>
                      )}
                    </div>
                  </div>
                  <div style={{ marginLeft: '16px' }}>
                    <button
                      onClick={() => eliminarMovimiento(movimiento.id)}
                      style={{
                        backgroundColor: '#fef2f2',
                        color: '#dc2626',
                        border: '1px solid #fca5a5',
                        borderRadius: '6px',
                        padding: '6px 8px',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                      title="Eliminar movimiento"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Panel de Gestión de Categorías */}
      {showGestionCategorias && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e2e8f0',
          marginBottom: '24px'
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
              color: '#0f172a'
            }}>
              ⚙️ Gestión de Categorías
            </h3>
          </div>
          
          <div style={{ padding: '24px' }}>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <input
                  type="text"
                  value={nuevaCategoria}
                  onChange={(e) => setNuevaCategoria(e.target.value)}
                  placeholder="Nueva categoría (ej: Publicidad)"
                  style={{
                    flex: 1,
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (nuevaCategoria.trim()) {
                        const agregado = agregarCategoria();
                        if (!agregado) {
                          alert('Esta categoría ya existe');
                        }
                      }
                    }
                  }}
                />
                <button
                  onClick={() => {
                    if (nuevaCategoria.trim()) {
                      const agregado = agregarCategoria();
                      if (!agregado) {
                        alert('Esta categoría ya existe');
                      }
                    }
                  }}
                  style={{
                    padding: '10px 16px',
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  + Agregar
                </button>
              </div>
            </div>

            <div style={{ 
              maxHeight: '200px', 
              overflowY: 'auto',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              backgroundColor: 'white'
            }}>
              {categorias.map((categoria, index) => (
                <div key={categoria} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  borderBottom: index < categorias.length - 1 ? '1px solid #f3f4f6' : 'none'
                }}>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>
                    {categoria}
                  </span>
                  <button
                    onClick={() => {
                      if (confirm(`¿Estás seguro de eliminar la categoría "${categoria}"?`)) {
                        eliminarCategoria(categoria);
                      }
                    }}
                    style={{
                      backgroundColor: '#fef2f2',
                      color: '#dc2626',
                      border: '1px solid #fca5a5',
                      borderRadius: '4px',
                      padding: '4px 8px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal para Agregar Movimiento */}
      {showMovimientoModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            width: '90%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              padding: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
                💰 Nuevo Movimiento de Caja
              </h3>
              <button 
                onClick={cerrarModal}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  width: '28px',
                  height: '28px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px'
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={agregarMovimiento} style={{ padding: '20px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                  Tipo de Movimiento *
                </label>
                <select
                  value={formMovimiento.tipo}
                  onChange={(e) => setFormMovimiento({...formMovimiento, tipo: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                  required
                >
                  <option value="ingreso">💰 Ingreso</option>
                  <option value="egreso">💸 Egreso</option>
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                  Monto *
                </label>
                <input
                  type="number"
                  value={formMovimiento.monto}
                  onChange={(e) => setFormMovimiento({...formMovimiento, monto: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                  Categoría *
                </label>
                <select
                  value={formMovimiento.categoria}
                  onChange={(e) => setFormMovimiento({...formMovimiento, categoria: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                  required
                >
                  <option value="">Seleccionar categoría</option>
                  {categorias.map(categoria => (
                    <option key={categoria} value={categoria}>{categoria}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                  Descripción *
                </label>
                <textarea
                  value={formMovimiento.descripcion}
                  onChange={(e) => setFormMovimiento({...formMovimiento, descripcion: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    minHeight: '80px',
                    resize: 'vertical'
                  }}
                  placeholder="Descripción detallada del movimiento"
                  required
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                  Número de Comprobante
                </label>
                <input
                  type="text"
                  value={formMovimiento.numeroComprobante}
                  onChange={(e) => setFormMovimiento({...formMovimiento, numeroComprobante: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                  placeholder="Ej: FC001-0001, REC-0001, etc."
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                  Fecha *
                </label>
                <input
                  type="date"
                  value={formMovimiento.fecha}
                  onChange={(e) => setFormMovimiento({...formMovimiento, fecha: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={cerrarModal}
                  style={{
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  💰 Agregar Movimiento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function PedidosSection() {
  const [pedidos, setPedidos] = useState([]);

  // Cargar pedidos desde Firebase
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'pedidos'), (snapshot) => {
      const pedidosFirebase = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id, // Asegurar que el ID sea del documento de Firebase (sobrescribir cualquier ID de Google Sheets)
        firebaseId: doc.id, // Guardar explícitamente el ID de Firebase
        idOriginal: doc.data().idOriginal || doc.data().id, // Mantener el ID original de Google Sheets por separado
        fechaCreacion: doc.data().fechaCreacion?.toDate ? doc.data().fechaCreacion.toDate().toISOString().split('T')[0] : doc.data().fechaCreacion,
        fechaEntrega: doc.data().fechaEntrega?.toDate ? doc.data().fechaEntrega.toDate().toISOString().split('T')[0] : doc.data().fechaEntrega,
        origen: doc.data().origen || 'manual'
      }));
      
      // Ordenar por fecha de creación descendente (más recientes primero)
      pedidosFirebase.sort((a, b) => new Date(b.fechaCreacion || 0) - new Date(a.fechaCreacion || 0));
      
      setPedidos(pedidosFirebase);
    });

    return () => unsubscribe();
  }, []);

  const [showGoogleSheetsConfig, setShowGoogleSheetsConfig] = useState(false);
  const [googleSheetsConfig, setGoogleSheetsConfig] = useState(
    JSON.parse(localStorage.getItem('googleSheetsConfig')) || {
      spreadsheetId: '10xOE60FHfUZKvRybRCINcfi6rtz-6U7Vzz_PRtiHbGE',
      apiKey: 'AIzaSyA-5jarFn3W3oHow9kbFvHhjG7WqipWpSQ',
      range: 'Pedidos!A1:O1000'
    }
  );
  const [isLoadingFromSheets, setIsLoadingFromSheets] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroCliente, setFiltroCliente] = useState('');
  const [ultimaActualizacion, setUltimaActualizacion] = useState(null);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
  
  // Estados para vista detallada de pedidos
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [datosEdicion, setDatosEdicion] = useState({});

  // Auto-sincronización al cargar la sección
  useEffect(() => {
    console.log('PedidosSection useEffect ejecutándose...');
    console.log('autoSyncEnabled:', autoSyncEnabled);
    console.log('googleSheetsConfig:', googleSheetsConfig);
    
    if (autoSyncEnabled && googleSheetsConfig.spreadsheetId && googleSheetsConfig.apiKey) {
      console.log('Iniciando carga automática desde Google Sheets...');
      loadPedidosFromSheets(true); // true indica que es carga automática
    } else {
      console.log('No se carga automáticamente. Razones:');
      console.log('- autoSyncEnabled:', autoSyncEnabled);
      console.log('- spreadsheetId:', !!googleSheetsConfig.spreadsheetId);
      console.log('- apiKey:', !!googleSheetsConfig.apiKey);
    }
  }, []); // Solo se ejecuta una vez al montar el componente

  // Funciones para manejar Google Sheets
  const handleSaveGoogleSheetsConfig = (config) => {
    setGoogleSheetsConfig(config);
    localStorage.setItem('googleSheetsConfig', JSON.stringify(config));
  };

  const handleTestConnection = async (config) => {
    const { default: googleSheetsService } = await import('./services/googleSheets.js');
    googleSheetsService.configure(config);
    return await googleSheetsService.testConnection();
  };

  const loadPedidosFromSheets = async (isAutoSync = false) => {
    console.log('loadPedidosFromSheets iniciado. isAutoSync:', isAutoSync);
    console.log('Configuración actual:', googleSheetsConfig);
    
    if (!googleSheetsConfig.spreadsheetId || !googleSheetsConfig.apiKey) {
      console.log('Configuración incompleta');
      if (!isAutoSync) {
        alert('Por favor configura Google Sheets primero');
      }
      return;
    }

    setIsLoadingFromSheets(true);
    try {
      console.log('Importando servicio de Google Sheets...');
      const { default: googleSheetsService } = await import('./services/googleSheets.js');
      googleSheetsService.configure(googleSheetsConfig);
      
      console.log('Obteniendo pedidos desde Google Sheets...');
      const pedidosFromSheets = await googleSheetsService.getPedidos();
      console.log('Pedidos obtenidos de Google Sheets:', pedidosFromSheets.length, pedidosFromSheets);
      
      if (isAutoSync) {
        console.log('Modo auto-sync: eliminando pedidos existentes de Google Sheets...');
        // En carga automática, borra todos los pedidos de Google Sheets existentes y los vuelve a cargar
        const existentesQuery = query(
          collection(db, 'pedidos'),
          where('origen', '==', 'google_sheets')
        );
        const existentesSnapshot = await getDocs(existentesQuery);
        console.log('Pedidos existentes en Firebase:', existentesSnapshot.docs.length);
        
        // Borrar pedidos existentes de Google Sheets
        for (const docSnap of existentesSnapshot.docs) {
          await deleteDoc(doc(db, 'pedidos', docSnap.id));
        }
        console.log('Pedidos existentes eliminados');
        
        // Crear un Set para evitar duplicados por ID original
        const pedidosUnicos = new Map();
        
        // Filtrar pedidos únicos por ID original de Google Sheets
        for (const pedido of pedidosFromSheets) {
          const idOriginal = pedido.id;
          if (!pedidosUnicos.has(idOriginal)) {
            pedidosUnicos.set(idOriginal, pedido);
          } else {
            console.log('Pedido duplicado encontrado, manteniéndose el primero:', idOriginal);
          }
        }
        
        const pedidosParaGuardar = Array.from(pedidosUnicos.values());
        console.log('Agregando pedidos únicos a Firebase:', pedidosParaGuardar.length, 'de', pedidosFromSheets.length, 'originales');
        
        // Agregar solo los pedidos únicos a Firebase
        for (const pedido of pedidosParaGuardar) {
          await addDoc(collection(db, 'pedidos'), {
            ...pedido,
            idOriginal: pedido.id, // Guardar el ID original de Google Sheets por separado
            fechaCreacion: pedido.fechaCreacion ? new Date(pedido.fechaCreacion) : new Date(),
            fechaEntrega: pedido.fechaEntrega ? new Date(pedido.fechaEntrega) : null
          });
        }
        console.log('Pedidos únicos agregados a Firebase');
        
        setUltimaActualizacion(new Date());
      } else {
        // En carga manual, solo agregar pedidos nuevos
        const existentesQuery = query(
          collection(db, 'pedidos'),
          where('origen', '==', 'google_sheets')
        );
        const existentesSnapshot = await getDocs(existentesQuery);
        const existentesIds = new Set(existentesSnapshot.docs.map(doc => doc.data().idOriginal || doc.data().id));
        
        // Crear un Set para evitar duplicados por ID original
        const pedidosUnicos = new Map();
        
        // Filtrar pedidos únicos por ID original de Google Sheets
        for (const pedido of pedidosFromSheets) {
          const idOriginal = pedido.id;
          if (!pedidosUnicos.has(idOriginal) && !existentesIds.has(idOriginal)) {
            pedidosUnicos.set(idOriginal, pedido);
          }
        }
        
        const pedidosNuevos = Array.from(pedidosUnicos.values());
        
        // Guardar pedidos nuevos únicos en Firebase
        for (const pedido of pedidosNuevos) {
          await addDoc(collection(db, 'pedidos'), {
            ...pedido,
            idOriginal: pedido.id, // Guardar el ID original de Google Sheets por separado
            fechaCreacion: pedido.fechaCreacion ? new Date(pedido.fechaCreacion) : new Date(),
            fechaEntrega: pedido.fechaEntrega ? new Date(pedido.fechaEntrega) : null
          });
        }
        
        setUltimaActualizacion(new Date());
        alert(`✅ Se importaron ${pedidosNuevos.length} pedidos nuevos únicos desde Google Sheets (${pedidosFromSheets.length} total encontrados, duplicados filtrados)`);
      }
      
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
      if (!isAutoSync) {
        alert(`❌ Error al cargar pedidos: ${error.message}`);
      }
    } finally {
      setIsLoadingFromSheets(false);
    }
  };

  // Filtrar pedidos
  const pedidosFiltrados = pedidos.filter(pedido => {
    const cumpleEstado = !filtroEstado || pedido.estado === filtroEstado;
    const cumpleCliente = !filtroCliente || 
      pedido.cliente.toLowerCase().includes(filtroCliente.toLowerCase());
    return cumpleEstado && cumpleCliente;
  });

  // Funciones para manejar pedidos
  const cambiarEstadoPedido = async (pedidoId, nuevoEstado) => {
    try {
      console.log('Cambiando estado del pedido:', pedidoId, 'a:', nuevoEstado);
      console.log('Tipo de pedidoId:', typeof pedidoId);
      
      // Validar que el pedidoId no sea null o undefined
      if (!pedidoId || pedidoId === 'undefined' || pedidoId === 'null') {
        throw new Error('ID del pedido no válido');
      }
      
      // Buscar el pedido en el estado actual para obtener información adicional
      const pedidoActual = pedidos.find(p => p.id === pedidoId);
      console.log('Pedido encontrado en estado:', pedidoActual);
      
      // Buscar el documento en Firebase usando el ID del documento (no el ID personalizado)
      const pedidoDoc = doc(db, 'pedidos', pedidoId);
      await updateDoc(pedidoDoc, {
        estado: nuevoEstado
      });
      
      // Si el pedido viene de Google Sheets, también actualizar allí AUTOMÁTICAMENTE
      if (pedidoActual && pedidoActual.origen === 'google_sheets' && pedidoActual.idCliente) {
        try {
          console.log('🔄 Actualizando AUTOMÁTICAMENTE en Google Sheets para pedido:', pedidoActual.idCliente);
          
          // Obtener la fecha en formato string como se guarda en Google Sheets
          const fechaString = pedidoActual.fechaCreacion;
          
          const resultado = await googleSheetsService.updatePedidoEstado(
            pedidoActual.idCliente, 
            fechaString,
            nuevoEstado
          );
          
          if (resultado.automatic) {
            console.log('🎉 Estado actualizado AUTOMÁTICAMENTE en Google Sheets');
            // No mostrar alerta, funcionó automáticamente
          }
          
        } catch (gsError) {
          console.error('❌ Error al actualizar Google Sheets automáticamente:', gsError);
          
          // Mostrar mensaje específico según el error
          if (gsError.message.includes('FALTA COMPARTIR')) {
            alert(`✅ Pedido actualizado en el sistema.\n\n🔗 Para completar la sincronización automática:\n${gsError.message}\n\n⚠️ Una vez compartido, la sincronización será automática.`);
          } else if (gsError.message.includes('permisos de escritura') || gsError.message.includes('Service Account')) {
            console.log('⚠️ Se requiere configuración adicional para automatización completa');
            // Silencioso - no molestar al usuario con detalles técnicos
          } else {
            console.error('💥 Error inesperado:', gsError);
            alert(`✅ Pedido actualizado en el sistema.\n\n⚠️ Error al sincronizar automáticamente con Google Sheets: ${gsError.message}`);
          }
        }
      }
      
      console.log('Estado del pedido cambiado exitosamente');
    } catch (error) {
      console.error('Error al cambiar estado del pedido:', error);
      console.error('ID del pedido:', pedidoId);
      console.error('Nuevo estado:', nuevoEstado);
      
      // Mostrar mensaje de error más específico
      if (error.code === 'not-found') {
        alert(`Error: No se encontró el pedido con ID "${pedidoId}". El documento puede haber sido eliminado.`);
      } else {
        alert(`Error al cambiar el estado del pedido: ${error.message}`);
      }
    }
  };

  // Funciones para vista detallada
  const abrirDetallePedido = (pedido) => {
    setPedidoSeleccionado(pedido);
    setDatosEdicion({ ...pedido });
    setModoEdicion(false);
  };

  const cerrarDetallePedido = () => {
    setPedidoSeleccionado(null);
    setModoEdicion(false);
    setDatosEdicion({});
  };

  const activarEdicion = () => {
    setModoEdicion(true);
  };

  const cancelarEdicion = () => {
    setDatosEdicion({ ...pedidoSeleccionado });
    setModoEdicion(false);
  };

  const guardarCambios = async () => {
    try {
      const pedidoDoc = doc(db, 'pedidos', pedidoSeleccionado.id);
      
      // Preparar datos para actualizar
      const datosActualizados = {
        cliente: datosEdicion.cliente || '',
        descripcion: datosEdicion.descripcion || '',
        monto: parseFloat(datosEdicion.monto) || 0,
        estado: datosEdicion.estado || 'pendiente',
        fechaCreacion: datosEdicion.fechaCreacion || '',
        fechaEntrega: datosEdicion.fechaEntrega || null,
        vendedor: datosEdicion.vendedor || '',
        optica: datosEdicion.optica || '',
        cuit: datosEdicion.cuit || '',
        bruto: parseFloat(datosEdicion.bruto) || 0,
        iva: parseFloat(datosEdicion.iva) || 0,
        descuentos: parseFloat(datosEdicion.descuentos) || 0,
        pago: parseFloat(datosEdicion.pago) || 0,
        saldo: parseFloat(datosEdicion.saldo) || 0,
        modelos: datosEdicion.modelos || '',
        detallePago: datosEdicion.detallePago || ''
      };

      await updateDoc(pedidoDoc, datosActualizados);
      
      // Actualizar el estado local
      setPedidoSeleccionado({ ...pedidoSeleccionado, ...datosActualizados });
      setModoEdicion(false);
      
      alert('✅ Pedido actualizado exitosamente');
      
    } catch (error) {
      console.error('Error al guardar cambios:', error);
      alert(`Error al guardar cambios: ${error.message}`);
    }
  };

  const handleInputChange = (campo, valor) => {
    setDatosEdicion(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const eliminarPedido = async (pedidoId) => {
    if (confirm('¿Estás seguro de eliminar este pedido?')) {
      try {
        await deleteDoc(doc(db, 'pedidos', pedidoId));
      } catch (error) {
        console.error('Error al eliminar pedido:', error);
        alert('Error al eliminar el pedido');
      }
    }
  };

  // Calcular estadísticas
  const totalPedidos = pedidos.length;
  const pedidosPendientes = pedidos.filter(p => p.estado === 'pendiente').length;
  const pedidosEnProceso = pedidos.filter(p => p.estado === 'en_proceso').length;
  const pedidosCompletados = pedidos.filter(p => p.estado === 'completado').length;
  const montoTotal = pedidos.reduce((sum, p) => sum + p.monto, 0);

  const getEstadoColor = (estado) => {
    const colores = {
      'pendiente': '#f59e0b',
      'en_proceso': '#3b82f6',
      'completado': '#10b981',
      'cancelado': '#ef4444'
    };
    return colores[estado] || '#6b7280';
  };

  const getEstadoTexto = (estado) => {
    const textos = {
      'pendiente': '⏳ Pendiente',
      'en_proceso': '🔄 En Proceso',
      'completado': '✅ Completado',
      'cancelado': '❌ Cancelado'
    };
    return textos[estado] || estado;
  };

  return (
    <div>
      {/* Estadísticas de Pedidos */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '20px', 
        marginBottom: '32px' 
      }}>
        <StatsCard 
          title="Total Pedidos" 
          value={totalPedidos}
          color="#3b82f6"
          subtitle={`$${montoTotal.toLocaleString()}`}
        />
        <StatsCard 
          title="Pendientes" 
          value={pedidosPendientes}
          color="#f59e0b"
          subtitle={`${Math.round((pedidosPendientes/totalPedidos)*100)}%`}
        />
        <StatsCard 
          title="En Proceso" 
          value={pedidosEnProceso}
          color="#3b82f6"
          subtitle={`${Math.round((pedidosEnProceso/totalPedidos)*100)}%`}
        />
        <StatsCard 
          title="Completados" 
          value={pedidosCompletados}
          color="#10b981"
          subtitle={`${Math.round((pedidosCompletados/totalPedidos)*100)}%`}
        />
      </div>

      {/* Panel de Control */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e2e8f0',
        marginBottom: '24px'
      }}>
        <div style={{
          backgroundColor: '#fafbfc',
          padding: '20px 24px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <h3 style={{
            margin: 0,
            fontSize: '18px',
            fontWeight: '600',
            color: '#0f172a'
          }}>
            📋 Gestión de Pedidos ({pedidosFiltrados.length})
          </h3>
          
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Filtros */}
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: 'white'
              }}
            >
              <option value="">Todos los estados</option>
              <option value="pendiente">Pendientes</option>
              <option value="en_proceso">En Proceso</option>
              <option value="completado">Completados</option>
              <option value="cancelado">Cancelados</option>
            </select>

            <input
              type="text"
              value={filtroCliente}
              onChange={(e) => setFiltroCliente(e.target.value)}
              placeholder="Buscar cliente..."
              style={{
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                minWidth: '150px'
              }}
            />

            <button
              onClick={() => setAutoSyncEnabled(!autoSyncEnabled)}
              style={{
                padding: '8px 12px',
                backgroundColor: autoSyncEnabled ? '#10b981' : '#f3f4f6',
                color: autoSyncEnabled ? 'white' : '#6b7280',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
              title={autoSyncEnabled ? 'Auto-sync habilitado' : 'Auto-sync deshabilitado'}
            >
              {autoSyncEnabled ? '🔄 Auto' : '⏸️ Manual'}
            </button>

            <button
              onClick={() => setShowGoogleSheetsConfig(!showGoogleSheetsConfig)}
              style={{
                padding: '8px 12px',
                backgroundColor: showGoogleSheetsConfig ? '#3b82f6' : '#f3f4f6',
                color: showGoogleSheetsConfig ? 'white' : '#4b5563',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              � Google Sheets
            </button>

            <button
              onClick={loadPedidosFromSheets}
              disabled={isLoadingFromSheets || !googleSheetsConfig.spreadsheetId}
              style={{
                padding: '8px 12px',
                backgroundColor: isLoadingFromSheets ? '#f3f4f6' : '#10b981',
                color: isLoadingFromSheets ? '#6b7280' : 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: isLoadingFromSheets ? 'not-allowed' : 'pointer',
                opacity: isLoadingFromSheets ? 0.6 : 1,
                marginRight: '8px'
              }}
            >
              {isLoadingFromSheets ? '🔄 Cargando...' : '📥 Sincronizar'}
            </button>
            
            {/* Botón para abrir Google Sheets */}
            {googleSheetsConfig.spreadsheetId && (
              <button 
                onClick={() => {
                  const url = `https://docs.google.com/spreadsheets/d/${googleSheetsConfig.spreadsheetId}/edit`;
                  window.open(url, '_blank');
                }}
                style={{
                  padding: '8px 12px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
                title="Abrir Google Sheets en nueva pestaña"
              >
                🔗 Abrir Hoja
              </button>
            )}
          </div>
        </div>

        {/* Indicador de última actualización */}
        {ultimaActualizacion && (
          <div style={{
            backgroundColor: '#f0f9ff',
            padding: '12px 24px',
            borderBottom: '1px solid #e2e8f0',
            fontSize: '13px',
            color: '#6b7280',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>
              📊 Última sincronización: {ultimaActualizacion.toLocaleString('es-AR', {
                day: '2-digit',
                month: '2-digit', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
            <span style={{
              padding: '2px 8px',
              borderRadius: '12px',
              backgroundColor: autoSyncEnabled ? '#dcfce7' : '#fef3c7',
              color: autoSyncEnabled ? '#16a34a' : '#d97706',
              fontSize: '11px',
              fontWeight: '500'
            }}>
              {autoSyncEnabled ? 'Auto-sync ON' : 'Auto-sync OFF'}
            </span>
          </div>
        )}

        {/* Lista de Pedidos */}
        <div style={{ padding: '24px' }}>
          {pedidosFiltrados.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '48px 24px', 
              color: '#6b7280',
              backgroundColor: '#f9fafb',
              borderRadius: '12px',
              border: '1px solid #e5e7eb'
            }}>
              <p style={{ margin: 0, fontSize: '16px' }}>No hay pedidos que coincidan con los filtros</p>
              <p style={{ margin: '8px 0 0 0', fontSize: '14px' }}>
                Intenta ajustar los filtros o importar desde Google Sheets
              </p>
            </div>
          ) : (
            <div style={{ 
              border: '1px solid #e5e7eb', 
              borderRadius: '12px', 
              overflow: 'hidden',
              backgroundColor: 'white'
            }}>
              {pedidosFiltrados.map((pedido, index) => (
                <div key={pedido.id} style={{
                  padding: '20px',
                  borderBottom: index < pedidosFiltrados.length - 1 ? '1px solid #f3f4f6' : 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onClick={() => abrirDetallePedido(pedido)}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f8fafc'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <h4 style={{ 
                        margin: 0, 
                        fontSize: '16px', 
                        fontWeight: '600',
                        color: '#0f172a'
                      }}>
                        {pedido.cliente}
                      </h4>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500',
                        backgroundColor: pedido.origen === 'google_sheets' ? '#f0f9ff' : '#f3f4f6',
                        color: pedido.origen === 'google_sheets' ? '#0284c7' : '#6b7280'
                      }}>
                        {pedido.origen === 'google_sheets' ? '📊 Google Sheets' : '✋ Manual'}
                      </span>
                      <span style={{ 
                        fontWeight: 'bold',
                        fontSize: '16px',
                        color: '#059669'
                      }}>
                        ${pedido.monto.toLocaleString()}
                      </span>
                      {pedido.saldo > 0 && (
                        <span style={{
                          padding: '2px 6px',
                          borderRadius: '8px',
                          fontSize: '11px',
                          fontWeight: '500',
                          backgroundColor: '#fef3c7',
                          color: '#d97706'
                        }}>
                          Saldo: ${pedido.saldo.toLocaleString()}
                        </span>
                      )}
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '8px',
                        fontSize: '11px',
                        fontWeight: '500',
                        backgroundColor: '#f0f0f0',
                        color: '#666'
                      }}>
                        📝 Click para ver detalles
                      </span>
                    </div>
                    
                    <p style={{ margin: '0 0 8px 0', color: '#4b5563', fontSize: '14px' }}>
                      {pedido.descripcion || pedido.modelos}
                    </p>
                    
                    <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>
                      <span>📅 {pedido.fechaCreacion}</span>
                      {pedido.vendedor && <span>👤 {pedido.vendedor}</span>}
                      {pedido.optica && <span>🏪 {pedido.optica}</span>}
                    </div>
                    
                    {pedido.origen === 'google_sheets' && (
                      <div style={{ 
                        display: 'flex', 
                        gap: '12px', 
                        fontSize: '12px', 
                        color: '#6b7280',
                        backgroundColor: '#f8fafc',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        marginTop: '8px'
                      }}>
                        {pedido.bruto > 0 && <span>� Bruto: ${pedido.bruto.toLocaleString()}</span>}
                        {pedido.iva > 0 && <span>📊 IVA: ${pedido.iva.toLocaleString()}</span>}
                        {pedido.descuentos > 0 && <span>🎯 Desc: ${pedido.descuentos.toLocaleString()}</span>}
                        {pedido.pago > 0 && <span>✅ Pagado: ${pedido.pago.toLocaleString()}</span>}
                      </div>
                    )}
                  </div>
                  <div style={{ 
                    marginLeft: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    alignItems: 'flex-end'
                  }}>
                    <select
                      value={pedido.estado}
                      onChange={(e) => {
                        e.stopPropagation(); // Evitar que se abra el detalle al cambiar estado
                        cambiarEstadoPedido(pedido.id, e.target.value);
                      }}
                      onClick={(e) => e.stopPropagation()} // Evitar que se abra el detalle al hacer click
                      style={{
                        padding: '6px 8px',
                        border: `2px solid ${getEstadoColor(pedido.estado)}`,
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '500',
                        backgroundColor: 'white',
                        color: getEstadoColor(pedido.estado)
                      }}
                    >
                      <option value="pendiente">⏳ Pendiente</option>
                      <option value="en_proceso">🔄 En Proceso</option>
                      <option value="completado">✅ Completado</option>
                      <option value="cancelado">❌ Cancelado</option>
                    </select>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Evitar que se abra el detalle al eliminar
                        eliminarPedido(pedido.id);
                      }}
                      style={{
                        backgroundColor: '#fef2f2',
                        color: '#dc2626',
                        border: '1px solid #fca5a5',
                        borderRadius: '6px',
                        padding: '4px 6px',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                      title="Eliminar pedido"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Configuración de Google Sheets */}
      {showGoogleSheetsConfig && (
        <GoogleSheetsConfig
          currentConfig={googleSheetsConfig}
          onConfigSave={handleSaveGoogleSheetsConfig}
          onTestConnection={handleTestConnection}
        />
      )}

      {/* Modal de Vista Detallada del Pedido */}
      {pedidoSeleccionado && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            maxWidth: '800px',
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            {/* Header del Modal */}
            <div style={{
              padding: '24px 32px',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#f8fafc',
              borderRadius: '16px 16px 0 0'
            }}>
              <div>
                <h2 style={{ 
                  margin: '0 0 4px 0', 
                  fontSize: '24px', 
                  fontWeight: '700',
                  color: '#0f172a'
                }}>
                  Detalle del Pedido
                </h2>
                <p style={{ 
                  margin: 0, 
                  color: '#64748b',
                  fontSize: '14px'
                }}>
                  {pedidoSeleccionado.origen === 'google_sheets' ? '📊 Importado desde Google Sheets' : '✋ Creado manualmente'}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {!modoEdicion ? (
                  <button
                    onClick={activarEdicion}
                    style={{
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    ✏️ Editar
                  </button>
                ) : (
                  <>
                    <button
                      onClick={guardarCambios}
                      style={{
                        backgroundColor: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '8px 16px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      ✅ Guardar
                    </button>
                    <button
                      onClick={cancelarEdicion}
                      style={{
                        backgroundColor: '#6b7280',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '8px 16px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      ❌ Cancelar
                    </button>
                  </>
                )}
                <button
                  onClick={cerrarDetallePedido}
                  style={{
                    backgroundColor: '#f3f4f6',
                    color: '#6b7280',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontSize: '18px',
                    cursor: 'pointer'
                  }}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Contenido del Modal */}
            <div style={{ padding: '32px' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '24px',
                marginBottom: '32px'
              }}>
                {/* Información Básica */}
                <div>
                  <h3 style={{ 
                    margin: '0 0 16px 0', 
                    fontSize: '18px', 
                    fontWeight: '600',
                    color: '#0f172a',
                    borderBottom: '2px solid #e5e7eb',
                    paddingBottom: '8px'
                  }}>
                    📋 Información Básica
                  </h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                        Cliente / Razón Social
                      </label>
                      {modoEdicion ? (
                        <input
                          type="text"
                          value={datosEdicion.cliente || ''}
                          onChange={(e) => handleInputChange('cliente', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '14px'
                          }}
                        />
                      ) : (
                        <p style={{ margin: 0, fontSize: '14px', color: '#111827', fontWeight: '500' }}>
                          {pedidoSeleccionado.cliente || 'No especificado'}
                        </p>
                      )}
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                        Descripción / Modelos
                      </label>
                      {modoEdicion ? (
                        <textarea
                          value={datosEdicion.descripcion || datosEdicion.modelos || ''}
                          onChange={(e) => handleInputChange('descripcion', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '14px',
                            minHeight: '80px',
                            resize: 'vertical'
                          }}
                        />
                      ) : (
                        <p style={{ margin: 0, fontSize: '14px', color: '#111827' }}>
                          {pedidoSeleccionado.descripcion || pedidoSeleccionado.modelos || 'No especificado'}
                        </p>
                      )}
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                        Estado
                      </label>
                      {modoEdicion ? (
                        <select
                          value={datosEdicion.estado || ''}
                          onChange={(e) => handleInputChange('estado', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '14px'
                          }}
                        >
                          <option value="pendiente">⏳ Pendiente</option>
                          <option value="en_proceso">🔄 En Proceso</option>
                          <option value="completado">✅ Completado</option>
                          <option value="cancelado">❌ Cancelado</option>
                        </select>
                      ) : (
                        <span style={{
                          padding: '6px 12px',
                          borderRadius: '12px',
                          fontSize: '14px',
                          fontWeight: '500',
                          backgroundColor: getEstadoColor(pedidoSeleccionado.estado) + '20',
                          color: getEstadoColor(pedidoSeleccionado.estado)
                        }}>
                          {pedidoSeleccionado.estado === 'pendiente' && '⏳ Pendiente'}
                          {pedidoSeleccionado.estado === 'en_proceso' && '🔄 En Proceso'}
                          {pedidoSeleccionado.estado === 'completado' && '✅ Completado'}
                          {pedidoSeleccionado.estado === 'cancelado' && '❌ Cancelado'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Información Comercial */}
                <div>
                  <h3 style={{ 
                    margin: '0 0 16px 0', 
                    fontSize: '18px', 
                    fontWeight: '600',
                    color: '#0f172a',
                    borderBottom: '2px solid #e5e7eb',
                    paddingBottom: '8px'
                  }}>
                    💰 Información Comercial
                  </h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                        Monto Total
                      </label>
                      {modoEdicion ? (
                        <input
                          type="number"
                          step="0.01"
                          value={datosEdicion.monto || ''}
                          onChange={(e) => handleInputChange('monto', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '14px'
                          }}
                        />
                      ) : (
                        <p style={{ margin: 0, fontSize: '18px', color: '#059669', fontWeight: '700' }}>
                          ${pedidoSeleccionado.monto?.toLocaleString() || '0'}
                        </p>
                      )}
                    </div>

                    {pedidoSeleccionado.origen === 'google_sheets' && (
                      <>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                              Bruto
                            </label>
                            {modoEdicion ? (
                              <input
                                type="number"
                                step="0.01"
                                value={datosEdicion.bruto || ''}
                                onChange={(e) => handleInputChange('bruto', e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '8px 12px',
                                  border: '1px solid #d1d5db',
                                  borderRadius: '6px',
                                  fontSize: '14px'
                                }}
                              />
                            ) : (
                              <p style={{ margin: 0, fontSize: '14px', color: '#111827' }}>
                                ${pedidoSeleccionado.bruto?.toLocaleString() || '0'}
                              </p>
                            )}
                          </div>

                          <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                              IVA
                            </label>
                            {modoEdicion ? (
                              <input
                                type="number"
                                step="0.01"
                                value={datosEdicion.iva || ''}
                                onChange={(e) => handleInputChange('iva', e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '8px 12px',
                                  border: '1px solid #d1d5db',
                                  borderRadius: '6px',
                                  fontSize: '14px'
                                }}
                              />
                            ) : (
                              <p style={{ margin: 0, fontSize: '14px', color: '#111827' }}>
                                ${pedidoSeleccionado.iva?.toLocaleString() || '0'}
                              </p>
                            )}
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                              Descuentos
                            </label>
                            {modoEdicion ? (
                              <input
                                type="number"
                                step="0.01"
                                value={datosEdicion.descuentos || ''}
                                onChange={(e) => handleInputChange('descuentos', e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '8px 12px',
                                  border: '1px solid #d1d5db',
                                  borderRadius: '6px',
                                  fontSize: '14px'
                                }}
                              />
                            ) : (
                              <p style={{ margin: 0, fontSize: '14px', color: '#111827' }}>
                                ${pedidoSeleccionado.descuentos?.toLocaleString() || '0'}
                              </p>
                            )}
                          </div>

                          <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                              Pagado
                            </label>
                            {modoEdicion ? (
                              <input
                                type="number"
                                step="0.01"
                                value={datosEdicion.pago || ''}
                                onChange={(e) => handleInputChange('pago', e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '8px 12px',
                                  border: '1px solid #d1d5db',
                                  borderRadius: '6px',
                                  fontSize: '14px'
                                }}
                              />
                            ) : (
                              <p style={{ margin: 0, fontSize: '14px', color: '#10b981', fontWeight: '600' }}>
                                ${pedidoSeleccionado.pago?.toLocaleString() || '0'}
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                            Saldo Pendiente
                          </label>
                          {modoEdicion ? (
                            <input
                              type="number"
                              step="0.01"
                              value={datosEdicion.saldo || ''}
                              onChange={(e) => handleInputChange('saldo', e.target.value)}
                              style={{
                                width: '100%',
                                padding: '8px 12px',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                fontSize: '14px'
                              }}
                            />
                          ) : (
                            <p style={{ 
                              margin: 0, 
                              fontSize: '16px', 
                              color: pedidoSeleccionado.saldo > 0 ? '#dc2626' : '#10b981',
                              fontWeight: '600'
                            }}>
                              ${pedidoSeleccionado.saldo?.toLocaleString() || '0'}
                            </p>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Información Adicional */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '24px'
              }}>
                {/* Fechas */}
                <div>
                  <h3 style={{ 
                    margin: '0 0 16px 0', 
                    fontSize: '18px', 
                    fontWeight: '600',
                    color: '#0f172a',
                    borderBottom: '2px solid #e5e7eb',
                    paddingBottom: '8px'
                  }}>
                    📅 Fechas
                  </h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                        Fecha de Creación
                      </label>
                      {modoEdicion ? (
                        <input
                          type="date"
                          value={datosEdicion.fechaCreacion || ''}
                          onChange={(e) => handleInputChange('fechaCreacion', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '14px'
                          }}
                        />
                      ) : (
                        <p style={{ margin: 0, fontSize: '14px', color: '#111827' }}>
                          {pedidoSeleccionado.fechaCreacion || 'No especificada'}
                        </p>
                      )}
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                        Fecha de Entrega
                      </label>
                      {modoEdicion ? (
                        <input
                          type="date"
                          value={datosEdicion.fechaEntrega || ''}
                          onChange={(e) => handleInputChange('fechaEntrega', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '14px'
                          }}
                        />
                      ) : (
                        <p style={{ margin: 0, fontSize: '14px', color: '#111827' }}>
                          {pedidoSeleccionado.fechaEntrega || 'No programada'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Información del Negocio */}
                <div>
                  <h3 style={{ 
                    margin: '0 0 16px 0', 
                    fontSize: '18px', 
                    fontWeight: '600',
                    color: '#0f172a',
                    borderBottom: '2px solid #e5e7eb',
                    paddingBottom: '8px'
                  }}>
                    🏪 Información del Negocio
                  </h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                        Vendedor
                      </label>
                      {modoEdicion ? (
                        <input
                          type="text"
                          value={datosEdicion.vendedor || ''}
                          onChange={(e) => handleInputChange('vendedor', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '14px'
                          }}
                        />
                      ) : (
                        <p style={{ margin: 0, fontSize: '14px', color: '#111827' }}>
                          {pedidoSeleccionado.vendedor || 'No asignado'}
                        </p>
                      )}
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                        Óptica
                      </label>
                      {modoEdicion ? (
                        <input
                          type="text"
                          value={datosEdicion.optica || ''}
                          onChange={(e) => handleInputChange('optica', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '14px'
                          }}
                        />
                      ) : (
                        <p style={{ margin: 0, fontSize: '14px', color: '#111827' }}>
                          {pedidoSeleccionado.optica || 'No especificada'}
                        </p>
                      )}
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                        CUIT
                      </label>
                      {modoEdicion ? (
                        <input
                          type="text"
                          value={datosEdicion.cuit || ''}
                          onChange={(e) => handleInputChange('cuit', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '14px'
                          }}
                        />
                      ) : (
                        <p style={{ margin: 0, fontSize: '14px', color: '#111827', fontFamily: 'monospace' }}>
                          {pedidoSeleccionado.cuit || 'No especificado'}
                        </p>
                      )}
                    </div>

                    {pedidoSeleccionado.origen === 'google_sheets' && (
                      <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                          Detalle de Pago
                        </label>
                        {modoEdicion ? (
                          <textarea
                            value={datosEdicion.detallePago || ''}
                            onChange={(e) => handleInputChange('detallePago', e.target.value)}
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              border: '1px solid #d1d5db',
                              borderRadius: '6px',
                              fontSize: '14px',
                              minHeight: '60px',
                              resize: 'vertical'
                            }}
                          />
                        ) : (
                          <p style={{ margin: 0, fontSize: '14px', color: '#111827' }}>
                            {pedidoSeleccionado.detallePago || 'No especificado'}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
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
