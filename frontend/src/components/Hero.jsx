import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, TrendingUp, Zap, Rocket, ShieldCheck, Sparkles } from 'lucide-react';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="animate-fade-in" style={{
      padding: '100px 20px 100px',
      textAlign: 'center',
      maxWidth: '1200px',
      margin: '0 auto',
      position: 'relative',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 16px',
        borderRadius: '20px',
        background: '#EEF2FF',
        color: '#6366F1',
        fontSize: '12px',
        fontWeight: '700',
        marginBottom: '32px',
        border: '1px solid #C7D2FE'
      }}>
        <Zap size={14} fill="currentColor" />
        <span>SOCIAL MEDIA INTELLIGENCE</span>
      </div>

      <h1 style={{
        fontSize: 'clamp(40px, 8vw, 64px)',
        fontWeight: '800',
        lineHeight: '1.1',
        marginBottom: '24px',
        fontFamily: 'Outfit, sans-serif',
        letterSpacing: '-0.03em',
        maxWidth: '900px',
        margin: '0 auto 24px',
        color: '#1F2937'
      }}>
        Multiplica tu <span style={{ color: '#6366F1' }}>Impacto Visual</span> en segundos.
      </h1>

      <p style={{
        fontSize: 'clamp(18px, 3vw, 20px)',
        color: '#6B7280',
        maxWidth: '700px',
        margin: '0 auto 48px',
        lineHeight: '1.6',
        fontWeight: '500'
      }}>
        La plataforma de gestión y distribución impulsada por IA creada para agencias y creadores que buscan dominar las tendencias mundiales.
      </p>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px'
      }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '16px',
          width: '100%'
        }}>
          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '16px 40px',
              fontSize: '1.1rem',
              borderRadius: '12px',
              background: '#6366F1',
              color: 'white',
              border: 'none',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Rocket size={20} />
            Empezar Gratis
          </button>

          <button style={{
            padding: '16px 40px',
            fontSize: '1.1rem',
            borderRadius: '12px',
            background: 'white',
            color: '#6366F1',
            border: '2px solid #6366F1',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Play size={20} fill="currentColor" />
            Ver Demo
          </button>
        </div>

        {/* Dynamic Social Proof */}
        <div style={{
          marginTop: '64px',
          paddingTop: '32px',
          borderTop: '1px solid #E5E7EB',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '48px',
          color: '#6B7280',
          fontSize: '13px',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '0.1em'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={18} color="#6366F1" />
            <span>+800% Retención Media</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={18} color="#8B5CF6" />
            <span>Distribución Multi-Canal</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="#F59E0B" />
            <span>AI-Driven Analysis</span>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          section { padding: 60px 20px !important; }
          h1 { font-size: 2.5rem !important; }
          button { width: 100%; }
        }
      `}</style>
    </section>
  );
};

export default Hero;
