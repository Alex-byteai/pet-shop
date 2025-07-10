import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaShoppingBag, FaMoneyBillWave, FaCalendarAlt, FaPlus, FaCog, FaBox, FaTags } from 'react-icons/fa';
import { getOrders, getUsers } from '../../services/api';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [summaryData, setSummaryData] = useState({
    orders: 0,
    newUsers: 0,
    totalIncome: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [dateRange, setDateRange] = useState(() => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    return {
      startDate: firstDayOfMonth.toISOString().split('T')[0],
      endDate: lastDayOfMonth.toISOString().split('T')[0]
    };
  });

  useEffect(() => {
    if (!localStorage.getItem('products')) {
      localStorage.setItem('products', JSON.stringify([]));
    }
    
    if (!localStorage.getItem('categories')) {
      localStorage.setItem('categories', JSON.stringify([]));
    }

    loadSummaryData();
  }, [dateRange]);

  const loadSummaryData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Cargar órdenes desde el backend
      const allOrders = await getOrders();
      console.log('Todas las órdenes (desde API):', allOrders);

      // Cambiar el cálculo de startDate y endDate para comparar en UTC
      const startDate = new Date(dateRange.startDate + 'T00:00:00');
      const endDate = new Date(dateRange.endDate + 'T23:59:59');

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
        console.log('Orden (filtrada):', {
          id: order.orderid,
          date: orderDate.toISOString(),
          dateLocal: orderDate.toString(),
          isInRange,
          total: order.total
        });
        return isInRange;
      });

      // Cargar usuarios desde el backend
      const allUsers = await getUsers();
      console.log('Todos los usuarios (desde API):', allUsers);

      // Filtrar usuarios por fecha de registro
      const newUsers = allUsers.filter(user => {
        if (!user.registerDate) return false;
        const registerDate = new Date(user.registerDate);
        const isInRange = registerDate >= startDate && registerDate <= endDate;
        console.log('Usuario (filtrado):', {
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
        const orderTotal = Number(order.total) || 0;
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
      console.error('Error al cargar datos del resumen del administrador desde la API:', error);
      setError('Error al cargar los datos. Por favor, intenta de nuevo.');
      setSummaryData({
        orders: 0,
        newUsers: 0,
        totalIncome: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando datos del dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Panel de Administración</h1>
        <div className="date-filter">
          <div className="date-input">
            <label>
              <FaCalendarAlt style={{ marginRight: '0.5rem' }} />
              Desde:
            </label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              max={dateRange.endDate}
            />
          </div>
          <div className="date-input">
            <label>
              <FaCalendarAlt style={{ marginRight: '0.5rem' }} />
              Hasta:
            </label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              min={dateRange.startDate}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>
        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={loadSummaryData} className="retry-button">
              Reintentar
            </button>
          </div>
        )}
      </div>

      <div className="summary-cards">
        <div className="summary-card">
          <div className="card-icon">
            <FaShoppingBag />
          </div>
          <div className="card-content">
            <h3>Pedidos</h3>
            <p className="card-value">{summaryData.orders.toLocaleString()}</p>
            <p className="card-period">
              {formatDate(dateRange.startDate)} - {formatDate(dateRange.endDate)}
            </p>
            <Link to="/admin/orders" className="card-link">Ver pedidos</Link>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon">
            <FaUsers />
          </div>
          <div className="card-content">
            <h3>Nuevos Usuarios</h3>
            <p className="card-value">{summaryData.newUsers.toLocaleString()}</p>
            <p className="card-period">
              {formatDate(dateRange.startDate)} - {formatDate(dateRange.endDate)}
            </p>
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
            <p className="card-period">
              {formatDate(dateRange.startDate)} - {formatDate(dateRange.endDate)}
            </p>
            <Link to="/admin/orders" className="card-link">Ver detalles</Link>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Acciones Rápidas</h2>
        <div className="action-buttons">
          <Link to="/admin/products/new" className="action-button">
            <FaPlus style={{ marginRight: '0.5rem' }} />
            Agregar Producto
          </Link>
          <Link to="/admin/categories/new" className="action-button">
            <FaTags style={{ marginRight: '0.5rem' }} />
            Crear Categoría
          </Link>
          <Link to="/admin/products" className="action-button">
            <FaBox style={{ marginRight: '0.5rem' }} />
            Gestionar Productos
          </Link>
          <Link to="/admin/categories" className="action-button">
            <FaCog style={{ marginRight: '0.5rem' }} />
            Gestionar Categorías
          </Link>
        </div>
      </div>
    </div>
  );
}
