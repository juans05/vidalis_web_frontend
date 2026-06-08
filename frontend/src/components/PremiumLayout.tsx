import React from 'react';
import '../styles/globals.css';

interface PremiumLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const PremiumLayout: React.FC<PremiumLayoutProps> = ({ children, className = '' }) => {
  return (
    <div className={`premium-layout ${className}`}>
      {children}
    </div>
  );
};

interface PremiumHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const PremiumHeader: React.FC<PremiumHeaderProps> = ({ title, subtitle, action }) => {
  return (
    <div className="premium-header" style={{
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
    </div>
  );
};

interface PremiumCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const PremiumCard: React.FC<PremiumCardProps> = ({ children, className = '', onClick }) => {
  return (
    <div className={`card ${className}`} onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      {children}
    </div>
  );
};

interface PremiumButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const PremiumButton: React.FC<PremiumButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  className = '',
  type = 'button',
}) => {
  const buttonClass = `btn btn-${variant} ${className}`;
  return (
    <button
      type={type}
      className={buttonClass}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

interface PremiumInputProps {
  label?: string;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  icon?: string;
}

export const PremiumInput: React.FC<PremiumInputProps> = ({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  disabled = false,
  icon,
}) => {
  return (
    <div style={{ marginBottom: '20px' }}>
      {label && (
        <label style={{
          display: 'block',
          fontSize: '13px',
          fontWeight: '700',
          color: 'white',
          marginBottom: '10px',
        }}>
          {icon && <span style={{ marginRight: '6px' }}>{icon}</span>}
          {label}
        </label>
      )}
      <input
        type={type}
        className="input-field"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
      />
    </div>
  );
};

interface StatBoxProps {
  value: string | number;
  label: string;
  icon?: string;
}

export const StatBox: React.FC<StatBoxProps> = ({ value, label, icon }) => {
  return (
    <div className="card" style={{
      textAlign: 'center',
      background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(37, 99, 235, 0.1) 100%)',
      borderLeft: '4px solid #22c55e',
    }}>
      {icon && <div style={{ fontSize: '32px', marginBottom: '12px' }}>{icon}</div>}
      <div style={{ fontSize: '32px', fontWeight: '700', color: '#22c55e', marginBottom: '8px' }}>
        {value}
      </div>
      <div style={{ fontSize: '12px', color: '#999' }}>{label}</div>
    </div>
  );
};

export default PremiumLayout;
