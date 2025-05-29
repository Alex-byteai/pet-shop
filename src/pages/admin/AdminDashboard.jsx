import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaShoppingBag, FaMoneyBillWave } from 'react-icons/fa';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [summaryData, setSummaryData] = useState({
    orders: 0,
    newUsers: 0,
    totalIncome: 0
  });

  const [dateRange, setDateRange] = useState(() => {
    // Establecer el rango para marzo 2024
    const startDate = new Date(2024, 2, 1); // Marzo es 2 (0-based)
    const endDate = new Date(2024, 2, 31);
    
    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    };
  });

  useEffect(() => {
    loadSummaryData();
  }, [dateRange]);

  const loadSummaryData = () => {
    try {
      // Cargar órdenes
      const allOrders = JSON.parse(localStorage.getItem('orders')) || [];
      console.log('Todas las órdenes:', allOrders);

      const startDate = new Date(dateRange.startDate + 'T00:00:00-05:00'); // Usar zona horaria de Perú
      const endDate = new Date(dateRange.endDate + 'T23:59:59-05:00');

      console.log('Rango de fechas:', {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        startDateLocal: startDate.toString(),
        endDateLocal: endDate.toString()
      });

      // Filtrar órdenes por fecha
      const filteredOrders = allOrders.filter(order => {
        const orderDate = new Date(order.date);
        const isInRange = orderDate >= startDate && orderDate <= endDate;
        console.log('Orden:', {
          id: order.orderid,
          date: orderDate.toISOString(),
          dateLocal: orderDate.toString(),
          isInRange,
          total: order.total
        });
        return isInRange;
      });

      // Cargar usuarios
      const allUsers = JSON.parse(localStorage.getItem('users')) || [];
      console.log('Todos los usuarios:', allUsers);

      // Filtrar usuarios por fecha de registro
      const newUsers = allUsers.filter(user => {
        if (!user.registerDate) return false;
        const registerDate = new Date(user.registerDate);
        const isInRange = registerDate >= startDate && registerDate <= endDate;
        console.log('Usuario:', {
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          registerDate: registerDate.toISOString(),
          registerDateLocal: registerDate.toString(),
          isInRange
        });
        return isInRange;
      });

      // Calcular totales
      const totalIncome = filteredOrders.reduce((sum, order) => {
        const orderTotal = typeof order.total === 'number' ? order.total : 0;
        return sum + orderTotal;
      }, 0);

      const summary = {
        orders: filteredOrders.length,
        newUsers: newUsers.length,
        totalIncome: totalIncome
      };

      console.log('Resumen calculado:', summary);

      setSummaryData(summary);
    } catch (error) {
      console.error('Error al cargar datos del resumen:', error);
      setSummaryData({
        orders: 0,
        newUsers: 0,
        totalIncome: 0
      });
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Panel de Administración</h1>
        <div className="date-filter">
          <div className="date-input">
            <label>Desde:</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              max={dateRange.endDate}
            />
          </div>
          <div className="date-input">
            <label>Hasta:</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              min={dateRange.startDate}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>
      </div>

      <div className="summary-cards">
        <div className="summary-card">
          <div className="card-icon">
            <FaShoppingBag />
          </div>
          <div className="card-content">
            <h3>Pedidos</h3>
            <p className="card-value">{summaryData.orders}</p>
            <Link to="/admin/orders" className="card-link">Ver pedidos</Link>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon">
            <FaUsers />
          </div>
          <div className="card-content">
            <h3>Nuevos Usuarios</h3>
            <p className="card-value">{summaryData.newUsers}</p>
            <Link to="/admin/users" className="card-link">Ver usuarios</Link>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon">
            <FaMoneyBillWave />
          </div>
          <div className="card-content">
            <h3>Ingresos Totales</h3>
            <p className="card-value">{formatPrice(summaryData.totalIncome)}</p>
            <Link to="/admin/orders" className="card-link">Ver detalles</Link>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Acciones Rápidas</h2>
        <div className="action-buttons">
          <Link to="/admin/products/new" className="action-button">
            Agregar Producto
          </Link>
          <Link to="/admin/categories/new" className="action-button">
            Crear Categoría
          </Link>
          <Link to="/admin/products" className="action-button">
            Gestionar Productos
          </Link>
          <Link to="/admin/categories" className="action-button">
            Gestionar Categorías
          </Link>
        </div>
      </div>
    </div>
  );
}
