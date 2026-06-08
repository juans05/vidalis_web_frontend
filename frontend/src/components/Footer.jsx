import React from 'react';
import { Github, Twitter, Instagram, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      padding: '60px 20px',
      borderTop: '1px solid #E5E7EB',
      marginTop: '100px',
      textAlign: 'center'
    }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '30px' }}>
        <a href="#" style={{ color: '#6B7280', cursor: 'pointer' }}><Twitter size={20} /></a>
        <a href="#" style={{ color: '#6B7280', cursor: 'pointer' }}><Instagram size={20} /></a>
        <a href="#" style={{ color: '#6B7280', cursor: 'pointer' }}><Github size={20} /></a>
        <a href="#" style={{ color: '#6B7280', cursor: 'pointer' }}><Mail size={20} /></a>
      </div>
      <p style={{ color: '#6B7280', fontSize: '14px' }}>
        © 2026 VIDALIS.AI - Automatización Viral para Músicos de Élite.
      </p>
    </footer>
  );
};

export default Footer;
