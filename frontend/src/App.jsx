import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login'; // Placeholder Login component
import './App.css'; // Keep existing styles

// Placeholder Home component
function Home() {
  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h1>Welcome to the App</h1>
      <p>This is the home page.</p>
      <div className="card">
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR (This is example content)
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more (This is example content)
      </p>
    </div>
  );
}


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Placeholder auth state

  // Placeholder logout function
  const handleLogout = () => {
    setIsLoggedIn(false);
    // In a real app, also clear token from localStorage, etc.
    // navigate('/'); // Optional: redirect to home or login
  };

  const navStyle = {
    display: 'flex',
    justifyContent: 'space-around',
    padding: '1rem',
    backgroundColor: '#f0f0f0',
    borderBottom: '1px solid #ccc',
  };

  const linkStyle = {
    textDecoration: 'none',
    color: '#007bff',
    margin: '0 10px',
  };

  const buttonStyle = {
    background: 'none',
    border: 'none',
    color: '#007bff',
    cursor: 'pointer',
    padding: '0',
    fontFamily: 'inherit',
    fontSize: 'inherit',
    margin: '0 10px',
  };

  return (
    <BrowserRouter>
      <nav style={navStyle}>
        <Link to="/" style={linkStyle}>Home</Link>
        {isLoggedIn ? (
          <>
            {/* <p>Welcome, User!</p> */}
            <button onClick={handleLogout} style={buttonStyle}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={linkStyle}>Login</Link>
            <Link to="/register" style={linkStyle}>Create Account</Link>
          </>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        {/* Add other routes here */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
