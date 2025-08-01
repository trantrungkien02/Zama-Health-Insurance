import React from 'react';

interface PrivacyShieldProps {
  className?: string;
  style?: React.CSSProperties;
}

export const PrivacyShield: React.FC<PrivacyShieldProps> = ({ className = "" }) => (
  <svg 
    className={`w-6 h-6 text-[#5adbb5] shield-icon ${className}`} 
    fill="#46a758" 
    viewBox="0 0 24 24"
  >
    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
    <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" fill="none"/>
  </svg>
);