import React from 'react';
import { Link } from 'react-router-dom';

function Login() {
  const divStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '50px auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    width: '300px',
    textAlign: 'center',
  };

  const linkStyle = {
    marginTop: '15px',
    color: '#007bff',
    textDecoration: 'none',
  };

  return (
    <div style={divStyle}>
      <h2>Login</h2>
      <p>Login form will be here.</p>
      <p>
        Don't have an account? <Link to="/register" style={linkStyle}>Create one</Link>
      </p>
    </div>
  );
}

export default Login;
