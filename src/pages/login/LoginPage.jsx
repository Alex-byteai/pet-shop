import { useState , useEffect, useRef} from 'react';
import {users, indice}from '../../data/users';
import { useNavigate, Link } from 'react-router-dom';
import {orders} from  '../../data/orders';
import './LoginPage.css';
function LoginPage() {
  const [email, setEmail] = useState('');
  const [contra, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [filtrarlista, setFiltrarlista] = useState([]);
  const [paginaactual, setPaginaActual] = useState(1);
  const ordenxpagina = 5;
  const navigate = useNavigate();
  const corrio = useRef(false); 
  const verificarLogin = () => {
    const user = users.find(u => u.email === email);
    if (user) {
      const indice2=user.id -1;

      if (contra === user.contra){
        indice.ind=indice2;
        navigate("/login/InicioC");
      }else{
        indice.ind=-1;
        setError('Credenciales incorrectas');
      }      
    } else {
      setError('Credenciales incorrectas');
    }
  };

  const Generarlista = () =>{
    const idbuscar = indice.ind+1;
    const filtrar= orders.filter(a => a.userid === idbuscar);
    setFiltrarlista(filtrar)
  }
  
  useEffect(() => {
    if (indice.ind!=-1 & corrio.current===false){
    Generarlista();
    corrio.current = true;
    }
  }, [])

  const [Ordenseleccion, setOrdenseleccion] = useState(null);

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
    <div>
      {indice.ind === -1 ? (
      <>
      <h2>Inicio de sesión</h2>
      <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Contraseña" onChange={e => setContrasena(e.target.value)} />
      <button  onClick={verificarLogin}>Login</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <Link to="/login/Register">Registrarse</Link>
      <Link to="/login/Recover">Recuperar Contraseña</Link>
      </>
      ):(
        <div className="listaordenes">
      <h2 id="h22">Ordenes pedidas</h2>
      <ul>
        {Ordenporpagina.map((order) => (
          <li key={order.orderid}>
            <strong>Número de orden:</strong> {order.orderid} |{" "}
            <strong>Fecha:</strong> {order.date} |{" "}
            <strong>Precio total:</strong> S/.{order.total.toFixed(2)}{" "}
            <button onClick={() => abrirPopout(order)}>Detalle</button>
          </li>
        ))}
      </ul>
      <div className="paginacion">
      {Array.from({ length: paginastotales }, (_, i) => (
        <button
          key={i}
          className={paginaactual === i + 1 ? 'active' : ''}
          onClick={() => setPaginaActual(i + 1)}
        >
          {i + 1}
        </button>
      ))}
      </div>  
      {Ordenseleccion && (
        <div className="disenopop" onClick={cerrarPopout}>
          <div className="contenido" onClick={(e) => e.stopPropagation()}>
            <h3 id="h33">Detalles (ID: {Ordenseleccion.orderid}):</h3>
            <p><strong>Fecha:</strong> {Ordenseleccion.date}</p>
            <p><strong>Estado:</strong> {Ordenseleccion.status}</p>
            <p><strong>Precio total:</strong> S/.{Ordenseleccion.total.toFixed(2)}</p>
            <h4 id="h44">Items:</h4>
            <ul>
              {Ordenseleccion.items.map((item, i) => (
                <li key={i} className="item-bordeado">
                  {item.nombre} - Cantidad: {item.cantidad} - Precio: S/.{item.precio.toFixed(2)}
                </li>
              ))}
            </ul>
            <button onClick={cerrarPopout}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
      )}
    </div>
  );
}

export default LoginPage;


