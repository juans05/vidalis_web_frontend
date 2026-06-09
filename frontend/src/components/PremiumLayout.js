import React from 'react';
import '../styles/globals.css';
export const PremiumLayout = ({ children, className = '' }) => {
    return (<div className={`premium-layout ${className}`}>
      {children}
    </div>);
};
export const PremiumHeader = ({ title, subtitle, action }) => {
    return (<div className="premium-header" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '40px',
        }}>
      <div>
        <h2>{title}</h2>
        {subtitle && <p style={{ marginTop: '8px', color: '#999' }}>{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>);
};
export const PremiumCard = ({ children, className = '', onClick }) => {
    return (<div className={`card ${className}`} onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      {children}
    </div>);
};
export const PremiumButton = ({ children, onClick, variant = 'primary', disabled = false, className = '', type = 'button', }) => {
    const buttonClass = `btn btn-${variant} ${className}`;
    return (<button type={type} className={buttonClass} onClick={onClick} disabled={disabled}>
      {children}
    </button>);
};
export const PremiumInput = ({ label, placeholder, type = 'text', value, onChange, disabled = false, icon, }) => {
    return (<div style={{ marginBottom: '20px' }}>
      {label && (<label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '700',
                color: 'white',
                marginBottom: '10px',
            }}>
          {icon && <span style={{ marginRight: '6px' }}>{icon}</span>}
          {label}
        </label>)}
      <input type={type} className="input-field" placeholder={placeholder} value={value} onChange={(e) => onChange?.(e.target.value)} disabled={disabled}/>
    </div>);
};
export const StatBox = ({ value, label, icon }) => {
    return (<div className="card" style={{
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(37, 99, 235, 0.1) 100%)',
            borderLeft: '4px solid #22c55e',
        }}>
      {icon && <div style={{ fontSize: '32px', marginBottom: '12px' }}>{icon}</div>}
      <div style={{ fontSize: '32px', fontWeight: '700', color: '#22c55e', marginBottom: '8px' }}>
        {value}
      </div>
      <div style={{ fontSize: '12px', color: '#999' }}>{label}</div>
    </div>);
};
export default PremiumLayout;
//# sourceMappingURL=PremiumLayout.js.map