interface HealthDataArrowProps {
  className?: string;
}

export const HealthDataArrow: React.FC<HealthDataArrowProps> = ({ className = "" }) => (
  <svg 
    className={`w-2 h-2 text-zama-green data-flow ${className}`} 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
);