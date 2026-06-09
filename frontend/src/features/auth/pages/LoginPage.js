import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { authService } from '../../../services/auth';
import { useAuthStore } from '../../../store/auth';
import { AnimatedBackground } from '../../../components/AnimatedBackground';
import '../../../styles/globals.css';
// Design System Tokens
const DESIGN_TOKENS = {
    colors: {
        primary: '#6366F1',
        secondary: '#8B5CF6',
        tertiary: '#22C55E',
        neutral: '#F1F5F9',
        error: '#EF4444',
        errorLight: 'rgba(239, 68, 68, 0.1)',
        textSecondary: '#CBD5E1',
        bgOverlay: 'rgba(26, 26, 26, 0.8)',
    },
    spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
    },
    radius: '12px',
    duration: '200ms',
};
export function LoginPage() {
    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(window.innerWidth >= 768);
    const [showPassword, setShowPassword] = useState(false);
    const validateEmail = (value) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    };
    const handleEmailBlur = (value) => {
        if (value && !validateEmail(value)) {
            setEmailError('Por favor ingresa un email válido');
        }
        else {
            setEmailError('');
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        if (!validateEmail(email)) {
            setEmailError('Email inválido');
            setLoading(false);
            return;
        }
        try {
            const response = await authService.login({ email, password });
            setAuth(response.user, response.token, response.refreshToken);
            navigate('/dashboard');
        }
        catch (err) {
            setError(err.response?.data?.error || 'Error al iniciar sesión');
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
            padding: DESIGN_TOKENS.spacing.lg,
            position: 'relative',
            overflow: 'hidden',
        }}>
      <AnimatedBackground iconCount={12}/>

      {/* Pitch Screen - Mobile Only */}
      {!showForm && (<div style={{
                width: '100%',
                maxWidth: '900px',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 25px 70px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                border: `2px solid ${DESIGN_TOKENS.colors.primary}`,
                position: 'relative',
                zIndex: 10,
                background: `linear-gradient(135deg, ${DESIGN_TOKENS.colors.tertiary} 0%, #16a34a 50%, #2563eb 100%)`,
                padding: 'clamp(40px, 10vw, 60px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                color: 'white',
                minHeight: '100vh',
                animation: 'fadeInUp 0.5s ease-out',
            }}>
          <h2 style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: 'clamp(28px, 7vw, 36px)',
                fontWeight: '700',
                marginBottom: DESIGN_TOKENS.spacing.lg,
                letterSpacing: '-0.02em'
            }}>
            Bienvenido de vuelta
          </h2>
          <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '15px',
                opacity: 0.9,
                lineHeight: '1.6',
                marginBottom: DESIGN_TOKENS.spacing.xl,
                maxWidth: '500px'
            }}>
            Accede a tu cuenta para gestionar tu contenido viral, publicar en redes sociales y analizar el impacto de tu contenido.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: DESIGN_TOKENS.spacing.md, marginBottom: DESIGN_TOKENS.spacing.xl }}>
            <div style={{ display: 'flex', gap: DESIGN_TOKENS.spacing.md, alignItems: 'center', fontSize: '14px' }}>
              <span style={{ fontSize: '20px' }}>📱</span>
              Publica a múltiples plataformas
            </div>
            <div style={{ display: 'flex', gap: DESIGN_TOKENS.spacing.md, alignItems: 'center', fontSize: '14px' }}>
              <span style={{ fontSize: '20px' }}>📊</span>
              Analíticas en tiempo real
            </div>
            <div style={{ display: 'flex', gap: DESIGN_TOKENS.spacing.md, alignItems: 'center', fontSize: '14px' }}>
              <span style={{ fontSize: '20px' }}>🚀</span>
              Crece hasta 800% más rápido
            </div>
          </div>
          <button onClick={() => setShowForm(true)} style={{
                width: '100%',
                maxWidth: '300px',
                padding: '14px 24px',
                fontFamily: 'Outfit, sans-serif',
                fontWeight: 700,
                fontSize: '16px',
                background: 'rgba(255, 255, 255, 0.15)',
                color: 'white',
                border: '1.5px solid rgba(255, 255, 255, 0.3)',
                borderRadius: DESIGN_TOKENS.radius,
                backdropFilter: 'blur(10px)',
                cursor: 'pointer',
                transition: `all ${DESIGN_TOKENS.duration} ease-out`,
            }} onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                e.currentTarget.style.transform = 'translateY(-2px)';
            }} onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                e.currentTarget.style.transform = 'translateY(0)';
            }}>
            Inicia sesión
          </button>
        </div>)}

      {/* Form Screen */}
      {showForm && (<div style={{
                width: '100%',
                maxWidth: '900px',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 25px 70px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                border: `2px solid ${DESIGN_TOKENS.colors.primary}`,
                position: 'relative',
                zIndex: 10,
                animation: 'fadeInUp 0.5s ease-out',
                minHeight: window.innerWidth < 768 ? '100vh' : 'auto',
                display: 'flex',
            }}>
          {/* Left Side - Pitch (Desktop) */}
          <div style={{
                background: `linear-gradient(135deg, ${DESIGN_TOKENS.colors.tertiary} 0%, #16a34a 50%, #2563eb 100%)`,
                padding: '60px 40px',
                display: 'none',
                flexDirection: 'column',
                justifyContent: 'center',
                color: 'white',
                flex: 1,
            }} className="auth-left">
            <h2 style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: '32px',
                fontWeight: '700',
                marginBottom: DESIGN_TOKENS.spacing.lg,
                letterSpacing: '-0.02em'
            }}>
              Bienvenido de vuelta
            </h2>
            <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '15px',
                opacity: 0.9,
                lineHeight: '1.6',
                marginBottom: DESIGN_TOKENS.spacing.xl
            }}>
              Accede a tu cuenta para gestionar tu contenido viral, publicar en redes sociales y analizar el impacto de tu contenido.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: DESIGN_TOKENS.spacing.md }}>
              <div style={{ display: 'flex', gap: DESIGN_TOKENS.spacing.md, alignItems: 'center', fontSize: '14px' }}>
                <span style={{ fontSize: '20px' }}>📱</span>
                Publica a múltiples plataformas
              </div>
              <div style={{ display: 'flex', gap: DESIGN_TOKENS.spacing.md, alignItems: 'center', fontSize: '14px' }}>
                <span style={{ fontSize: '20px' }}>📊</span>
                Analíticas en tiempo real
              </div>
              <div style={{ display: 'flex', gap: DESIGN_TOKENS.spacing.md, alignItems: 'center', fontSize: '14px' }}>
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
                flex: 1,
            }}>
            <div style={{ marginBottom: DESIGN_TOKENS.spacing.xl }}>
              <h3 style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: 'clamp(20px, 5vw, 24px)',
                fontWeight: '700',
                color: DESIGN_TOKENS.colors.neutral,
                marginBottom: DESIGN_TOKENS.spacing.sm,
                letterSpacing: '-0.02em'
            }}>
                Inicia sesión
              </h3>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '13px',
                color: DESIGN_TOKENS.colors.textSecondary
            }}>Accede a tu cuenta</p>
            </div>

            {/* Global Error Message */}
            {error && (<div style={{
                    background: DESIGN_TOKENS.colors.errorLight,
                    border: `1px solid ${DESIGN_TOKENS.colors.error}`,
                    color: '#fca5a5',
                    padding: `${DESIGN_TOKENS.spacing.md} ${DESIGN_TOKENS.spacing.md}`,
                    borderRadius: DESIGN_TOKENS.radius,
                    marginBottom: DESIGN_TOKENS.spacing.lg,
                    fontSize: '13px',
                    fontFamily: 'Inter, sans-serif',
                    display: 'flex',
                    alignItems: 'center',
                    gap: DESIGN_TOKENS.spacing.sm,
                }}>
                <AlertCircle size={16}/>
                {error}
              </div>)}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: DESIGN_TOKENS.spacing.lg }}>
              {/* Email Field */}
              <div>
                <label style={{
                fontFamily: 'Outfit, sans-serif',
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: DESIGN_TOKENS.colors.neutral,
                marginBottom: DESIGN_TOKENS.spacing.sm,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
            }}>
                  Correo Electrónico
                </label>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={(e) => handleEmailBlur(e.target.value)} placeholder="tu@email.com" style={{
                width: '100%',
                padding: `${DESIGN_TOKENS.spacing.md} ${DESIGN_TOKENS.spacing.md}`,
                fontFamily: 'Inter, sans-serif',
                fontSize: '16px',
                border: `2px solid ${emailError
                    ? DESIGN_TOKENS.colors.error
                    : 'rgba(255, 255, 255, 0.1)'}`,
                borderRadius: DESIGN_TOKENS.radius,
                background: emailError
                    ? DESIGN_TOKENS.colors.errorLight
                    : 'rgba(255, 255, 255, 0.05)',
                color: DESIGN_TOKENS.colors.neutral,
                transition: `all ${DESIGN_TOKENS.duration} ease-out`,
                outline: 'none',
                boxSizing: 'border-box',
            }} onFocus={(e) => {
                if (!emailError) {
                    e.currentTarget.style.borderColor = DESIGN_TOKENS.colors.primary;
                    e.currentTarget.style.boxShadow = `0 0 0 3px rgba(99, 102, 241, 0.1)`;
                    e.currentTarget.style.background = 'rgba(99, 102, 241, 0.05)';
                }
            }} onBlur={(e) => {
                e.currentTarget.style.borderColor = emailError
                    ? DESIGN_TOKENS.colors.error
                    : 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.background = emailError
                    ? DESIGN_TOKENS.colors.errorLight
                    : 'rgba(255, 255, 255, 0.05)';
            }} required/>
                {emailError && (<p style={{
                    color: DESIGN_TOKENS.colors.error,
                    fontSize: '13px',
                    fontFamily: 'Inter, sans-serif',
                    marginTop: DESIGN_TOKENS.spacing.xs,
                    display: 'flex',
                    alignItems: 'center',
                    gap: DESIGN_TOKENS.spacing.xs
                }}>
                    <AlertCircle size={14}/>
                    {emailError}
                  </p>)}
              </div>

              {/* Password Field */}
              <div>
                <label style={{
                fontFamily: 'Outfit, sans-serif',
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: DESIGN_TOKENS.colors.neutral,
                marginBottom: DESIGN_TOKENS.spacing.sm,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
            }}>
                  Contraseña
                </label>
                <div style={{ position: 'relative' }}>
                  <input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" style={{
                width: '100%',
                padding: `${DESIGN_TOKENS.spacing.md} 44px ${DESIGN_TOKENS.spacing.md} ${DESIGN_TOKENS.spacing.md}`,
                fontFamily: 'Inter, sans-serif',
                fontSize: '16px',
                border: '2px solid rgba(255, 255, 255, 0.1)',
                borderRadius: DESIGN_TOKENS.radius,
                background: 'rgba(255, 255, 255, 0.05)',
                color: DESIGN_TOKENS.colors.neutral,
                transition: `all ${DESIGN_TOKENS.duration} ease-out`,
                outline: 'none',
                boxSizing: 'border-box',
            }} onFocus={(e) => {
                e.currentTarget.style.borderColor = DESIGN_TOKENS.colors.primary;
                e.currentTarget.style.boxShadow = `0 0 0 3px rgba(99, 102, 241, 0.1)`;
                e.currentTarget.style.background = 'rgba(99, 102, 241, 0.05)';
            }} onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            }} required/>
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                position: 'absolute',
                right: DESIGN_TOKENS.spacing.md,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: DESIGN_TOKENS.colors.textSecondary,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: DESIGN_TOKENS.spacing.sm,
                transition: `color ${DESIGN_TOKENS.duration} ease-out`
            }} onMouseEnter={(e) => {
                e.currentTarget.style.color = DESIGN_TOKENS.colors.primary;
            }} onMouseLeave={(e) => {
                e.currentTarget.style.color = DESIGN_TOKENS.colors.textSecondary;
            }}>
                    {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: DESIGN_TOKENS.spacing.sm,
                cursor: 'pointer'
            }}>
                <input type="checkbox" style={{
                width: '18px',
                height: '18px',
                cursor: 'pointer',
                accentColor: DESIGN_TOKENS.colors.primary
            }}/>
                <span style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                color: DESIGN_TOKENS.colors.textSecondary
            }}>
                  Recuerda esta sesión
                </span>
              </label>

              {/* Submit Button */}
              <button type="submit" disabled={loading || !email || !password || emailError !== ''} style={{
                width: '100%',
                padding: `14px ${DESIGN_TOKENS.spacing.lg}`,
                fontFamily: 'Outfit, sans-serif',
                fontWeight: '700',
                fontSize: '16px',
                background: !loading && !emailError
                    ? DESIGN_TOKENS.colors.primary
                    : `rgba(99, 102, 241, 0.4)`,
                color: DESIGN_TOKENS.colors.neutral,
                border: 'none',
                borderRadius: DESIGN_TOKENS.radius,
                cursor: loading || emailError ? 'not-allowed' : 'pointer',
                transition: `all ${DESIGN_TOKENS.duration} ease-out`,
                boxShadow: `0 8px 24px rgba(99, 102, 241, 0.3)`,
                opacity: loading || emailError ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: DESIGN_TOKENS.spacing.sm,
            }} onMouseEnter={(e) => {
                if (!loading && !emailError) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = `0 12px 32px rgba(99, 102, 241, 0.4)`;
                }
            }} onMouseLeave={(e) => {
                if (!loading && !emailError) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = `0 8px 24px rgba(99, 102, 241, 0.3)`;
                }
            }}>
                {loading ? (<>
                    <Loader size={18} style={{ animation: 'spin 1s linear infinite' }}/>
                    <span>Iniciando sesión...</span>
                  </>) : ('Inicia sesión')}
              </button>
            </form>

            {/* Register Link */}
            <p style={{
                textAlign: 'center',
                fontSize: '13px',
                color: DESIGN_TOKENS.colors.textSecondary,
                marginTop: DESIGN_TOKENS.spacing.xl,
                fontFamily: 'Inter, sans-serif',
            }}>
              ¿No tienes cuenta?{' '}
              <Link to="/register" style={{
                color: DESIGN_TOKENS.colors.primary,
                textDecoration: 'none',
                fontWeight: '600',
                transition: `color ${DESIGN_TOKENS.duration} ease-out`,
            }} onMouseEnter={(e) => {
                e.currentTarget.style.color = DESIGN_TOKENS.colors.secondary;
                e.currentTarget.style.textDecoration = 'underline';
            }} onMouseLeave={(e) => {
                e.currentTarget.style.color = DESIGN_TOKENS.colors.primary;
                e.currentTarget.style.textDecoration = 'none';
            }}>
                Regístrate aquí
              </Link>
            </p>

            {/* Mobile Back Button */}
            {window.innerWidth < 768 && (<button onClick={() => setShowForm(false)} style={{
                    marginTop: DESIGN_TOKENS.spacing.lg,
                    padding: `${DESIGN_TOKENS.spacing.md} ${DESIGN_TOKENS.spacing.lg}`,
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '13px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: `1.5px solid rgba(255, 255, 255, 0.15)`,
                    borderRadius: DESIGN_TOKENS.radius,
                    color: DESIGN_TOKENS.colors.textSecondary,
                    cursor: 'pointer',
                    transition: `all ${DESIGN_TOKENS.duration} ease-out`,
                }} onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(99, 102, 241, 0.15)';
                    e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)';
                }} onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                }}>
                ← Volver
              </button>)}
          </div>
        </div>)}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (min-width: 768px) {
          .auth-left { display: flex !important; }
        }
      `}</style>
    </div>);
}
//# sourceMappingURL=LoginPage.js.map