import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function VerificarCodigo() {
  const [code, setCode] = useState('');
  const [verified, setVerified] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const location = useLocation();
  const idbuscar=location.state?.id;
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const navigate = useNavigate();
  const CORRECT_CODE = "az"; 

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

    users[idbuscar - 1].contra = newPassword;
    localStorage.setItem('users', JSON.stringify(users));
    setError("Contraseña actualizada correctamente.");
    navigate("/login/LoginPage");
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto" }}>
      <h2>Recuperar Contraseña</h2>

      {!verified ? (
        <>
          <input
            type="text"
            placeholder="Código de verificación"
            value={code}
            onChange={e => setCode(e.target.value)}
          /><br />
          <button onClick={handleCodeSubmit}>Verificar Código</button>
        </>
      ) : (
        <>
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
          /><br />
          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          /><br />
          <button onClick={handlePasswordReset}>Cambiar Contraseña</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </>
      )}
    </div>
  );
}

export default VerificarCodigo;
