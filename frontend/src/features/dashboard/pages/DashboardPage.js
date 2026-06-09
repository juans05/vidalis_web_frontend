import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/auth';
import { PremiumHeader, PremiumButton, StatBox } from '../../../components/PremiumLayout';
import '../../../styles/globals.css';
export function DashboardPage() {
    const navigate = useNavigate();
    const { user, clearAuth } = useAuthStore();
    const handleLogout = () => {
        clearAuth();
        navigate('/login');
    };
    const menuItems = [
        {
            title: 'Upload Video',
            description: 'Add and process new videos',
            icon: '📹',
            onClick: () => navigate('/content/upload'),
        },
        {
            title: 'Gallery',
            description: 'View and manage your videos',
            icon: '🎬',
            onClick: () => navigate('/content/gallery'),
        },
        {
            title: 'Analytics',
            description: 'View stats and insights',
            icon: '📈',
            onClick: () => navigate('/analytics'),
        },
        {
            title: 'Social Integration',
            description: 'Connect your social accounts',
            icon: '📱',
            onClick: () => navigate('/social/connect'),
        },
    ];
    return (<div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0a0a0a 0%, #0f0f1e 100%)',
        }}>
      {/* Navigation */}
      <nav style={{
            background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.8) 0%, rgba(20, 20, 30, 0.9) 100%)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            position: 'sticky',
            top: 0,
            zIndex: 50,
        }}>
        <div style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '20px 40px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        }}>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'white' }}>✨ Vidalis</h1>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', color: '#999' }}>{user?.name}</span>
            <button onClick={handleLogout} style={{
            padding: '10px 20px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#e0e0e0',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s',
        }} onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 0, 0, 0.2)';
            e.currentTarget.style.borderColor = 'rgba(255, 0, 0, 0.5)';
        }} onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        }}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '48px 40px' }}>
        {/* Welcome Section */}
        <PremiumHeader title={`Welcome back, ${user?.name}! 🎨`} subtitle="Manage your content and grow your audience" action={<PremiumButton onClick={() => navigate('/content/upload')}>+ New Video</PremiumButton>}/>

        {/* User Stats */}
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px',
            marginBottom: '48px',
        }}>
          <StatBox value={user?.plan || 'Free'} label="Plan" icon="🎯"/>
          <StatBox value={user?.sparksBalance || 0} label="Sparks Balance" icon="⚡"/>
          <StatBox value={user?.accountType || 'Creator'} label="Account Type" icon="👤"/>
        </div>

        {/* Pipeline Section */}
        <div style={{ marginBottom: '48px' }}>
          <h3 style={{ fontSize: '11px', fontWeight: '700', color: '#22c55e', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>📌 Your Pipeline</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '16px',
        }}>
            {[1, 2, 3, 4, 5].map((num) => (<div key={num} style={{
                textAlign: 'center',
                padding: '16px',
                background: num === 1 ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(37, 99, 235, 0.1) 100%)' : 'rgba(255, 255, 255, 0.05)',
                borderRadius: '16px',
                border: num === 1 ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
            }}>
                <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: num === 1 ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' : 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                margin: '0 auto 8px',
                boxShadow: num === 1 ? '0 8px 20px rgba(34, 197, 94, 0.3)' : 'none',
            }}>
                  {num}
                </div>
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#999' }}>
                  {['Subir', 'Editar', 'Programar', 'Publicar', 'Analizar'][num - 1]}
                </div>
              </div>))}
          </div>
        </div>

        {/* Menu Grid */}
        <div style={{ marginBottom: '48px' }}>
          <h3 style={{ fontSize: '11px', fontWeight: '700', color: '#22c55e', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>🎬 Quick Actions</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
        }}>
            {menuItems.map((item) => (<button key={item.title} onClick={item.onClick} style={{
                padding: '24px',
                background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.8) 0%, rgba(20, 20, 30, 0.9) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                textAlign: 'left',
                color: 'inherit',
            }} onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(34, 197, 94, 0.5)';
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(34, 197, 94, 0.15)';
            }} onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
            }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>{item.icon}</div>
                <h3 style={{ fontWeight: '600', color: 'white', marginBottom: '4px' }}>{item.title}</h3>
                <p style={{ fontSize: '13px', color: '#999' }}>{item.description}</p>
              </button>))}
          </div>
        </div>

        {/* Quick Start */}
        <div style={{
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(37, 99, 235, 0.1) 100%)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            borderRadius: '16px',
            padding: '32px',
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'white', marginBottom: '24px' }}>Quick Start</h3>
          <ol style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
            'Upload a video from your gallery or from a URL',
            'Our AI analyzes and generates hook suggestions',
            'Review and publish to your social platforms',
        ].map((step, idx) => (<li key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                borderRadius: '50%',
                color: 'white',
                fontWeight: '700',
                flexShrink: 0,
            }}>
                  {idx + 1}
                </span>
                <span style={{ color: '#e0e0e0', fontSize: '14px' }}>{step}</span>
              </li>))}
          </ol>
        </div>
      </main>
    </div>);
}
//# sourceMappingURL=DashboardPage.js.map