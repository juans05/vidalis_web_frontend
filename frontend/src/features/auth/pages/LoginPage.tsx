import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../../services/auth';
import { useAuthStore } from '../../../store/auth';
import { AnimatedBackground } from '../../../components/AnimatedBackground';
import '../../../styles/globals.css';

export function LoginPage(): JSX.Element {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(window.innerWidth >= 768);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login({ email, password });
      setAuth(response.user, response.token, response.refreshToken);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 50%, #0f0f1e 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <AnimatedBackground iconCount={12} />
      {!showForm && (
        <div style={{
          width: '100%',
          maxWidth: '900px',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 25px 70px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          border: '2px solid rgba(34, 197, 94, 0.4)',
          position: 'relative',
          zIndex: 10,
          background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 50%, #2563eb 100%)',
          padding: 'clamp(40px, 10vw, 60px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          color: 'white',
          minHeight: '100vh',
          animation: 'fadeInUp 0.5s ease-out',
        }}>
          <h2 style={{ fontSize: 'clamp(28px, 7vw, 36px)', fontWeight: '700', marginBottom: '20px' }}>
            Bienvenido de vuelta
          </h2>
          <p style={{ fontSize: '15px', opacity: 0.9, lineHeight: '1.6', marginBottom: '40px', maxWidth: '500px' }}>
            Accede a tu cuenta para gestionar tu contenido viral, publicar en redes sociales y analizar el impacto de tu contenido.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '14px' }}>
              <span style={{ fontSize: '20px' }}>📱</span>
              Publica a múltiples plataformas
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '14px' }}>
              <span style={{ fontSize: '20px' }}>📊</span>
              Analíticas en tiempo real
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '14px' }}>
              <span style={{ fontSize: '20px' }}>🚀</span>
              Crece hasta 800% más rápido
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary"
            style={{ width: '100%', maxWidth: '300px', minHeight: '48px', fontSize: '16px', background: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.3)' }}
          >
            Inicia sesión
          </button>
        </div>
      )}

      {showForm && (
        <div className="auth-container" style={{
          width: '100%',
          maxWidth: '900px',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 25px 70px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          border: '2px solid rgba(34, 197, 94, 0.4)',
          position: 'relative',
          zIndex: 10,
          animation: 'fadeInUp 0.5s ease-out',
          minHeight: window.innerWidth < 768 ? '100vh' : 'auto',
        }}>
          {/* Left Side - Gradient Pitch */}
          <div className="auth-left" style={{
            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 50%, #2563eb 100%)',
            padding: '60px 40px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            color: 'white',
          }}>
          <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '20px' }}>
            Bienvenido de vuelta
          </h2>
          <p style={{ fontSize: '15px', opacity: 0.9, lineHeight: '1.6', marginBottom: '40px' }}>
            Accede a tu cuenta para gestionar tu contenido viral, publicar en redes sociales y analizar el impacto de tu contenido.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '14px' }}>
              <span style={{ fontSize: '20px' }}>📱</span>
              Publica a múltiples plataformas
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '14px' }}>
              <span style={{ fontSize: '20px' }}>📊</span>
              Analíticas en tiempo real
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '14px' }}>
              <span style={{ fontSize: '20px' }}>🚀</span>
              Crece hasta 800% más rápido
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div style={{
          background: '#0f0f1e',
          padding: 'clamp(32px, 5vw, 60px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          minHeight: '100vh',
        }}>
          <div style={{ marginBottom: 'clamp(24px, 5vw, 40px)' }}>
            <h3 style={{ fontSize: 'clamp(20px, 5vw, 24px)', fontWeight: '700', color: 'white', marginBottom: '8px' }}>
              Inicia sesión
            </h3>
            <p style={{ fontSize: '13px', color: '#999' }}>Accede a tu cuenta</p>
          </div>

          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.5)',
              color: '#fca5a5',
              padding: '12px 16px',
              borderRadius: '12px',
              marginBottom: '20px',
              fontSize: '13px',
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(16px, 4vw, 20px)' }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: 'clamp(12px, 3vw, 13px)',
                fontWeight: '700',
                color: 'white',
                marginBottom: '8px',
              }}>
                📧 Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="input-field"
                style={{ fontSize: '16px' }}
                required
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: 'clamp(12px, 3vw, 13px)',
                fontWeight: '700',
                color: 'white',
                marginBottom: '8px',
              }}>
                🔐 Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field"
                style={{ fontSize: '16px' }}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: 'clamp(12px, 3vw, 8px)', minHeight: '48px', fontSize: '16px' }}
            >
              {loading ? 'Iniciando sesión...' : 'Inicia sesión'}
            </button>
          </form>

          <p style={{
            textAlign: 'center',
            fontSize: '13px',
            color: '#999',
            marginTop: '24px',
          }}>
            ¿No tienes cuenta?{' '}
            <Link to="/register" style={{
              color: '#22c55e',
              textDecoration: 'none',
              fontWeight: '600',
            }}>
              Regístrate aquí
            </Link>
          </p>
        </div>
        </div>
      )}
    </div>
  );
}
