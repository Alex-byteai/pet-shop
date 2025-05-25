import { useNavigate } from 'react-router-dom';

function InicioC() {
  const navigate = useNavigate();
  return (
    <div>

      <h2>Inicio de sesión correcto</h2>
      <button  onClick={() =>navigate("/")}>Regresar al menú principal</button>
    </div>
  );
}

export default InicioC;