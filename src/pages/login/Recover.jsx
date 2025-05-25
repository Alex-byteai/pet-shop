import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
function Recover() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const user = users.find(u => u.email === email);
  const verificarCorreo=  () => {
    if (user){
        const id =user.id;
        navigate("/login/Codigo", { state: { id }});
    }else{
        setError('Correo no está registrado');
    }
 }

  return (
    <div>        
      <h2>Recuperar Contraseña</h2>
      <input
          type="email"
          placeholder="Ingrese su correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      <button onClick={verificarCorreo}>Enviar</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Recover;