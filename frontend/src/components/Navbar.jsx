import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, LogIn } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav style={{
      width: '100%',
      height: '80px',
      padding: '0 40px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: '0',
      zIndex: 1000,
      borderBottom: '1px solid #E5E7EB',
      transition: 'all 0.3s ease',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)'
    }}>
      <div
        style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }}
        onClick={() => navigate('/')}
      >
        <div style={{
          background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
          padding: '8px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
        }}>
          <Sparkles size={20} color="white" />
        </div>
        <span style={{
          fontFamily: 'Outfit, sans-serif',
          fontSize: '24px',
          fontWeight: '900',
          letterSpacing: '-0.03em',
          color: '#1F2937'
        }}>
          Vidalis
        </span>
      </div>

      <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
        <a href="#features" style={{
          color: '#6B7280',
          textDecoration: 'none',
          fontWeight: '600',
          fontSize: '14px',
          transition: 'all 0.2s ease',
          letterSpacing: '0.02em'
        }} onMouseEnter={(e) => e.target.style.color = '#1F2937'} onMouseLeave={(e) => e.target.style.color = '#6B7280'}>
          Funciones
        </a>
        <a href="#about" style={{
          color: '#6B7280',
          textDecoration: 'none',
          fontWeight: '600',
          fontSize: '14px',
          transition: 'all 0.2s ease',
          letterSpacing: '0.02em'
        }} onMouseEnter={(e) => e.target.style.color = '#1F2937'} onMouseLeave={(e) => e.target.style.color = '#6B7280'}>
          Nosotros
        </a>

        <button
          onClick={() => navigate('/login')}
          style={{
            padding: '10px 20px',
            fontSize: '14px',
            borderRadius: '8px',
            background: '#6366F1',
            color: 'white',
            border: 'none',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap'
          }}
        >
          <LogIn size={18} />
          <span>Acceso Directo</span>
        </button>
      </div>

      <style>{`
        @media (max-width: 768px) {
          nav { padding: 0 20px; height: 72px; }
          .nav-link { display: none; }
          button { padding: 8px 14px; font-size: 13px; }
        }
        @media (max-width: 400px) {
          button span { display: none; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
