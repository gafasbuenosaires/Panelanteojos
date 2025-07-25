// Datos de demo para el dashboard
export const demoData = {
  vendedores: [
    {
      id: '1',
      nombre: 'Juan Pérez',
      email: 'juan@vendedor.com',
      saldo: 25000,
      fechaCreacion: new Date('2024-01-15')
    },
    {
      id: '2',
      nombre: 'María García',
      email: 'maria@vendedor.com',
      saldo: -5000,
      fechaCreacion: new Date('2024-02-01')
    },
    {
      id: '3',
      nombre: 'Carlos López',
      email: 'carlos@vendedor.com',
      saldo: 15000,
      fechaCreacion: new Date('2024-01-20')
    }
  ],

  movimientosCaja: [
    {
      id: '1',
      tipo: 'ingreso',
      monto: 50000,
      descripcion: 'Venta del día - Cliente VIP',
      categoria: 'venta',
      fecha: new Date('2024-07-24T10:30:00')
    },
    {
      id: '2',
      tipo: 'egreso',
      monto: 15000,
      descripcion: 'Compra de marcos nuevos',
      categoria: 'compra_mercaderia',
      fecha: new Date('2024-07-24T09:15:00')
    },
    {
      id: '3',
      tipo: 'ingreso',
      monto: 35000,
      descripcion: 'Cobro quincenal - Juan Pérez',
      categoria: 'cobro_vendedor',
      fecha: new Date('2024-07-23T16:45:00')
    },
    {
      id: '4',
      tipo: 'egreso',
      monto: 8000,
      descripcion: 'Servicios - Electricidad',
      categoria: 'servicios',
      fecha: new Date('2024-07-23T14:20:00')
    },
    {
      id: '5',
      tipo: 'ingreso',
      monto: 28000,
      descripcion: 'Venta lentes de contacto',
      categoria: 'venta',
      fecha: new Date('2024-07-23T11:30:00')
    }
  ],

  pedidos: [
    {
      id: '1',
      cliente: 'Ana Martínez',
      descripcion: 'Anteojos graduados con marco titanio - Miopía -2.5',
      monto: 45000,
      estado: 'pendiente',
      fechaCreacion: new Date('2024-07-24T08:00:00'),
      fechaEntrega: new Date('2024-07-30')
    },
    {
      id: '2',
      cliente: 'Roberto Silva',
      descripcion: 'Lentes de sol polarizados - Marco deportivo',
      monto: 32000,
      estado: 'en_proceso',
      fechaCreacion: new Date('2024-07-23T15:30:00'),
      fechaEntrega: new Date('2024-07-28')
    },
    {
      id: '3',
      cliente: 'Laura Fernández',
      descripcion: 'Anteojos bifocales - Marco clásico',
      monto: 38000,
      estado: 'completado',
      fechaCreacion: new Date('2024-07-20T10:15:00'),
      fechaEntrega: new Date('2024-07-25')
    },
    {
      id: '4',
      cliente: 'Miguel Torres',
      descripcion: 'Lentes progresivos - Marco flexible',
      monto: 55000,
      estado: 'en_proceso',
      fechaCreacion: new Date('2024-07-22T14:45:00'),
      fechaEntrega: new Date('2024-08-02')
    }
  ]
};

// Hook para simular datos en tiempo real
export const useDemoData = () => {
  return {
    vendedores: demoData.vendedores,
    movimientosCaja: demoData.movimientosCaja,
    pedidos: demoData.pedidos,
    stats: {
      totalCaja: demoData.movimientosCaja.reduce((total, mov) => {
        return mov.tipo === 'ingreso' ? total + mov.monto : total - mov.monto;
      }, 0),
      totalVendedores: demoData.vendedores.reduce((total, v) => total + v.saldo, 0),
      ingresos: demoData.movimientosCaja
        .filter(m => m.tipo === 'ingreso')
        .reduce((total, m) => total + m.monto, 0),
      egresos: demoData.movimientosCaja
        .filter(m => m.tipo === 'egreso')
        .reduce((total, m) => total + m.monto, 0)
    }
  };
};
