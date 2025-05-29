import { useState, useEffect, useRef } from 'react';
import { orders } from '../../../data/orders';
import { indice } from '../../../data/users';
import './DashboardPage.css';

function DashboardPage() {
  const [filtrarlista, setFiltrarlista] = useState([]);
  const [paginaactual, setPaginaActual] = useState(1);
  const [Ordenseleccion, setOrdenseleccion] = useState(null);
  const ordenxpagina = 5;
  const corrio = useRef(false);

  const Generarlista = () => {
    const idbuscar = indice.ind + 1;
    const filtrar = orders.filter(a => a.userid === idbuscar);
    setFiltrarlista(filtrar);
  }

  useEffect(() => {
    if (indice.ind !== -1 && corrio.current === false) {
      Generarlista();
      corrio.current = true;
    }
  }, []);

  const abrirPopout = (order) => {
    setOrdenseleccion(order);
  };

  const cerrarPopout = () => {
    setOrdenseleccion(null);
  };

  const ifinal = paginaactual * ordenxpagina;
  const iinicial = ifinal - ordenxpagina;
  const Ordenporpagina = filtrarlista.slice(iinicial, ifinal);
  const paginastotales = Math.ceil(filtrarlista.length / ordenxpagina);

  return (
    <div className="dashboard-page">
      <div className="orders-dashboard">
        <h2 className="orders-title">Órdenes pedidas</h2>
        <ul className="orders-list">
          {Ordenporpagina.map((order) => (
            <li key={order.orderid} className="order-item">
              <div className="order-info">
                <span className="order-number">Número de orden: {order.orderid}</span>
                <span className="order-date">Fecha: {order.date}</span>
                <span className="order-total">Total: S/.{order.total.toFixed(2)}</span>
              </div>
              <button className="order-detail-button" onClick={() => abrirPopout(order)}>
                Ver detalle
              </button>
            </li>
          ))}
        </ul>
        <div className="pagination">
          {Array.from({ length: paginastotales }, (_, i) => (
            <button
              key={i}
              className={`pagination-button ${paginaactual === i + 1 ? 'active' : ''}`}
              onClick={() => setPaginaActual(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
        {Ordenseleccion && (
          <div className="order-modal" onClick={cerrarPopout}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3 className="modal-title">Detalles de la Orden #{Ordenseleccion.orderid}</h3>
              <div className="modal-info">
                <p className="modal-detail"><strong>Fecha:</strong> {Ordenseleccion.date}</p>
                <p className="modal-detail"><strong>Estado:</strong> {Ordenseleccion.status}</p>
                <p className="modal-detail"><strong>Total:</strong> S/.{Ordenseleccion.total.toFixed(2)}</p>
              </div>
              <div className="modal-items">
                <h4 className="items-title">Productos:</h4>
                <ul className="items-list">
                  {Ordenseleccion.items.map((item, i) => (
                    <li key={i} className="item-detail">
                      <span className="item-name">{item.nombre}</span>
                      <span className="item-quantity">Cantidad: {item.cantidad}</span>
                      <span className="item-price">S/.{item.precio.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button className="modal-close" onClick={cerrarPopout}>Cerrar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardPage; 