import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../../services/auth';
import { useAuthStore } from '../../../store/auth';
import { AnimatedBackground } from '../../../components/AnimatedBackground';
import '../../../styles/globals.css';
export function RegisterPage() {
    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        birthDate: '',
        accountType: 'artist',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(window.innerWidth >= 768);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await authService.register(formData);
            setAuth(response.user, response.token, response.refreshToken);
            navigate('/dashboard');
        }
        catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        }
        finally {
            setLoading(false);
        }
    };
    return (<div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 50%, #0f0f1e 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            position: 'relative',
            overflow: 'hidden',
        }}>
      <AnimatedBackground iconCount={12}/>
      {!showForm && (<div style={{
                width: '100%',
                maxWidth: '900px',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 25px 70px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                border: '2px solid rgba(235, 29, 72, 0.4)',
                position: 'relative',
                zIndex: 10,
                background: 'linear-gradient(135deg, #e11d48 0%, #fb7185 50%, #2563eb 100%)',
                padding: 'clamp(40px, 10vw, 60px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                color: 'white',
                minHeight: '100vh',
                animation: 'fadeInUp 0.5s ease-out',
            }}>
          <h2 style={{ fontSize: 'clamp(28px, 7vw, 36px)', fontWeight: '700', marginBottom: '20px' }}>
            Únete a Vidalis
          </h2>
          <p style={{ fontSize: '15px', opacity: 0.9, lineHeight: '1.6', marginBottom: '40px', maxWidth: '500px' }}>
            Comienza tu viaje como creador. Gestiona tu contenido, publica en redes sociales y crece exponencialmente.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '14px' }}>
              <span style={{ fontSize: '20px' }}>🎨</span>
              Herramientas para artistas creadores
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '14px' }}>
              <span style={{ fontSize: '20px' }}>⚡</span>
              Publica en segundos
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '14px' }}>
              <span style={{ fontSize: '20px' }}>📈</span>
              Análisis inteligente con IA
            </div>
          </div>
          <button onClick={() => setShowForm(true)} className="btn btn-primary" style={{ width: '100%', maxWidth: '300px', minHeight: '48px', fontSize: '16px', background: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.3)' }}>
            Crear Cuenta
          </button>
        </div>)}

      {showForm && (<div className="auth-container" style={{
                width: '100%',
                maxWidth: '900px',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 25px 70px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                border: '2px solid rgba(235, 29, 72, 0.4)',
                position: 'relative',
                zIndex: 10,
                animation: 'fadeInUp 0.5s ease-out',
                minHeight: window.innerWidth < 768 ? '100vh' : 'auto',
            }}>
          {/* Left Side - Gradient Pitch */}
          <div className="auth-left" style={{
                background: 'linear-gradient(135deg, #e11d48 0%, #fb7185 50%, #2563eb 100%)',
                padding: '60px 40px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                color: 'white',
            }}>
          <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '20px' }}>
            Únete a Vidalis
          </h2>
          <p style={{ fontSize: '15px', opacity: 0.9, lineHeight: '1.6', marginBottom: '40px' }}>
            Comienza tu viaje como creador. Gestiona tu contenido, publica en redes sociales y crece exponencialmente.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '14px' }}>
              <span style={{ fontSize: '20px' }}>🎨</span>
              Herramientas para artistas creadores
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '14px' }}>
              <span style={{ fontSize: '20px' }}>⚡</span>
              Publica en segundos
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '14px' }}>
              <span style={{ fontSize: '20px' }}>📈</span>
              Análisis inteligente con IA
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
                overflowY: 'auto',
                minHeight: '100vh',
            }}>
          <div style={{ marginBottom: 'clamp(24px, 5vw, 32px)' }}>
            <h3 style={{ fontSize: 'clamp(20px, 5vw, 24px)', fontWeight: '700', color: 'white', marginBottom: '8px' }}>
              Crear Cuenta
            </h3>
            <p style={{ fontSize: '13px', color: '#999' }}>Únete en 3 minutos</p>
          </div>

          {error && (<div style={{
                    background: 'rgba(239, 68, 68, 0.2)',
                    border: '1px solid rgba(239, 68, 68, 0.5)',
                    color: '#fca5a5',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    marginBottom: '20px',
                    fontSize: '13px',
                }}>
              {error}
            </div>)}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 3vw, 16px)' }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: 'clamp(12px, 3vw, 13px)',
                fontWeight: '700',
                color: 'white',
                marginBottom: '8px',
            }}>
                👤 Nombre Completo
              </label>
              <input id="name" type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Tu nombre" className="input-field" style={{ fontSize: '16px' }} required/>
            </div>

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
              <input id="email" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="tu@email.com" className="input-field" style={{ fontSize: '16px' }} required/>
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
              <input id="password" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" className="input-field" style={{ fontSize: '16px' }} required/>
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: 'clamp(12px, 3vw, 13px)',
                fontWeight: '700',
                color: 'white',
                marginBottom: '8px',
            }}>
                🎂 Fecha de Nacimiento
              </label>
              <input id="birthDate" type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} className="input-field" style={{ fontSize: '16px' }} required/>
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: 'clamp(12px, 3vw, 13px)',
                fontWeight: '700',
                color: 'white',
                marginBottom: '8px',
            }}>
                🎯 Tipo de Cuenta
              </label>
              <select id="accountType" name="accountType" value={formData.accountType} onChange={handleChange} style={{
                width: '100%',
                padding: '12px 16px',
                background: 'linear-gradient(135deg, rgba(36, 36, 36, 0.6) 0%, rgba(42, 42, 52, 0.6) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                color: '#e0e0e0',
                fontSize: '16px',
                cursor: 'pointer',
            }}>
                <option value="artist">Artista</option>
                <option value="agency">Agencia</option>
              </select>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: 'clamp(12px, 3vw, 12px)', minHeight: '48px', fontSize: '16px' }}>
              {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </button>
          </form>

          <p style={{
                textAlign: 'center',
                fontSize: '13px',
                color: '#999',
                marginTop: '20px',
            }}>
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" style={{
                color: '#22c55e',
                textDecoration: 'none',
                fontWeight: '600',
            }}>
              Inicia sesión
            </Link>
          </p>
        </div>
        </div>)}
    </div>);
}
//# sourceMappingURL=RegisterPage.js.map