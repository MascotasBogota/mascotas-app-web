import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await axios.post('http://localhost:5000/api/users/login', formData);
      const { token, user } = res.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      setMessage('Inicio de sesión exitoso');
      // Redirige al home, dashboard, etc.
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit">Ingresar</button>
      </form>
      
      {message && <p>{message}</p>}
      
      <div className="register-link">
        <p>¿No tienes una cuenta? 
          <button 
            type="button" 
            onClick={() => navigate('/register')}
            className="link-button"
          >
            Crear cuenta
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
