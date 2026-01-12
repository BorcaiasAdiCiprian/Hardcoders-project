import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [parola, setParola] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, parola });
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('role', user.rol);
      localStorage.setItem('nume', `${user.nume} ${user.prenume}`);

      if (user.rol === 'student') {
        navigate('/student');
      } else if (user.rol === 'profesor') {
        navigate('/profesor');
      }
    } catch (err) {
      setError(err.response?.data?.message || "Email sau parolă incorectă.");
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc', 
    margin: 0,
    padding: 0,
    zIndex: 9999,
    fontFamily: 'sans-serif'
  };

  return (
    <div style={containerStyle}>
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100">
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg">
            D
          </div>
          <h1 className="text-3xl font-black text-gray-800 tracking-tight">Login</h1>
          <p className="text-gray-500 mt-2 font-medium">Portal Disertație</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 text-sm animate-bounce">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6 text-left">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
              Email Universitar
            </label>
            <input 
              type="email" 
              required 
              placeholder="nume@univ.ro"
              className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-gray-800"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
              Parolă
            </label>
            <input 
              type="password" 
              required 
              placeholder="••••••••"
              className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-gray-800"
              value={parola} 
              onChange={(e) => setParola(e.target.value)} 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:shadow-indigo-200 active:scale-95 transition-all disabled:bg-gray-400"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                SE VERIFICĂ...
              </span>
            ) : 'AUTENTIFICARE'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-50 text-center">
          <p className="text-gray-400 text-xs font-medium">
            &copy; 2026 - Management Disertație
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;