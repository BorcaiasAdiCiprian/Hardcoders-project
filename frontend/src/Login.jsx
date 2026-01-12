import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [parola, setParola] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState('');

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

  const styles = {
    container: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      margin: 0,
      padding: 0,
      zIndex: 9999,
      fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      overflow: 'hidden'
    },
    backgroundPattern: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
      pointerEvents: 'none'
    },
    card: {
      position: 'relative',
      background: 'rgba(30, 30, 46, 0.85)',
      backdropFilter: 'blur(20px)',
      padding: '48px 40px',
      borderRadius: '24px',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 80px rgba(120, 119, 198, 0.1)',
      width: '100%',
      maxWidth: '440px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      zIndex: 10
    },
    header: {
      textAlign: 'center',
      marginBottom: '36px'
    },
    logo: {
      width: '72px',
      height: '72px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '18px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#ffffff',
      fontSize: '32px',
      fontWeight: '800',
      margin: '0 auto 20px',
      boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)',
      transition: 'transform 0.3s ease'
    },
    title: {
      fontSize: '32px',
      fontWeight: '800',
      color: '#ffffff',
      margin: '0 0 8px 0',
      letterSpacing: '-0.5px'
    },
    subtitle: {
      color: 'rgba(255, 255, 255, 0.6)',
      fontSize: '15px',
      fontWeight: '500',
      margin: 0
    },
    errorBox: {
      background: 'rgba(239, 68, 68, 0.1)',
      border: '1px solid rgba(239, 68, 68, 0.3)',
      borderLeft: '4px solid #ef4444',
      color: '#fca5a5',
      padding: '14px 16px',
      borderRadius: '12px',
      marginBottom: '24px',
      fontSize: '14px',
      fontWeight: '500',
      animation: 'slideDown 0.3s ease'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    },
    label: {
      fontSize: '12px',
      fontWeight: '700',
      color: 'rgba(255, 255, 255, 0.5)',
      textTransform: 'uppercase',
      letterSpacing: '1.2px',
      marginLeft: '4px',
      marginBottom: '0px'
    },
    input: {
      width: '100%',
      padding: '16px 18px',
      background: 'rgba(255, 255, 255, 0.05)',
      border: '2px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '14px',
      outline: 'none',
      color: '#ffffff',
      fontSize: '15px',
      fontWeight: '500',
      transition: 'all 0.3s ease',
      boxSizing: 'border-box'
    },
    inputFocused: {
      background: 'rgba(255, 255, 255, 0.08)',
      border: '2px solid #667eea',
      boxShadow: '0 0 0 4px rgba(102, 126, 234, 0.1)'
    },
    button: {
      width: '100%',
      padding: '16px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      border: 'none',
      borderRadius: '14px',
      color: '#ffffff',
      fontSize: '16px',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)',
      letterSpacing: '0.5px',
      marginTop: '8px'
    },
    buttonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 12px 32px rgba(102, 126, 234, 0.4)'
    },
    buttonDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
      transform: 'none'
    },
    loadingContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px'
    },
    spinner: {
      animation: 'spin 1s linear infinite',
      width: '20px',
      height: '20px'
    },
    footer: {
      marginTop: '32px',
      paddingTop: '24px',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      textAlign: 'center'
    },
    footerText: {
      color: 'rgba(255, 255, 255, 0.4)',
      fontSize: '12px',
      fontWeight: '500',
      margin: 0
    }
  };

  return (
    <>
      <div style={styles.container}>
        <div style={styles.backgroundPattern}></div>

        <div style={styles.card}>
          <div style={styles.header}>
            <h1 style={styles.title}>Login</h1>
            <p style={styles.subtitle}>Portal Disertație</p>
          </div>

          {error && (
            <div style={styles.errorBox}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Email Universitar
              </label>
              <input
                type="email"
                required
                placeholder="nume@univ.ro"
                style={{
                  ...styles.input,
                  ...(focusedInput === 'email' ? styles.inputFocused : {})
                }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedInput('email')}
                onBlur={() => setFocusedInput('')}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Parolă
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                style={{
                  ...styles.input,
                  ...(focusedInput === 'password' ? styles.inputFocused : {})
                }}
                value={parola}
                onChange={(e) => setParola(e.target.value)}
                onFocus={() => setFocusedInput('password')}
                onBlur={() => setFocusedInput('')}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.button,
                ...(loading ? styles.buttonDisabled : {})
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(102, 126, 234, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(102, 126, 234, 0.3)';
                }
              }}
            >
              {loading ? (
                <span style={styles.loadingContainer}>
                  <svg style={styles.spinner} viewBox="0 0 24 24">
                    <circle
                      style={{ opacity: 0.25 }}
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      style={{ opacity: 0.75 }}
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  SE VERIFICĂ...
                </span>
              ) : 'AUTENTIFICARE'}
            </button>
          </form>

          <div style={styles.footer}>
            <p style={styles.footerText}>
              &copy; 2026 - Management Disertație
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;