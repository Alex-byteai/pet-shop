import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function VerificarCodigo() {
  const [code, setCode] = useState('');
  const [verified, setVerified] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const idbuscar = location.state?.id;
  const CORRECT_CODE = "az"; // Código estático para verificar

  const users = JSON.parse(localStorage.getItem('users')) || [];

  const handleCodeSubmit = () => {
    if (code === CORRECT_CODE) {
      setVerified(true);
      setError('');
    } else {
      setError('Código incorrecto. Intenta nuevamente.');
    }
  };

  const handlePasswordReset = () => {
    if (!newPassword || !confirmPassword) {
      setError("Los campos deben estar llenos");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    // Buscar el usuario por ID y actualizar contraseña
    const updatedUsers = users.map(user => {
      if (user.id === idbuscar) {
        return { ...user, contra: newPassword };
      }
      return user;
    });

    localStorage.setItem('users', JSON.stringify(updatedUsers));
    navigate("/login");
  };

  return (
    <div>
      <h2>Verificación de Código</h2>
      {!verified ? (
        <>
          <input
            type="text"
            placeholder="Código recibido"
            value={code}
            onChange={e => setCode(e.target.value)}
          />
          <button onClick={handleCodeSubmit}>Verificar Código</button>
        </>
      ) : (
        <>
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirmar nueva contraseña"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />
          <button onClick={handlePasswordReset}>Cambiar contraseña</button>
        </>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default VerificarCodigo;
