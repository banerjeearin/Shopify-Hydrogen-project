import {ReactNode, KeyboardEvent} from 'react';

interface AccessibleButtonProps {
  children: ReactNode;
  onClick: () => void;
  className?: string;
  ariaLabel?: string;
  disabled?: boolean;
}

export default function AccessibleButton({
  children,
  onClick,
  className = '',
  ariaLabel,
  disabled = false,
}: AccessibleButtonProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <button
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={className}
      aria-label={ariaLabel}
      disabled={disabled}
      tabIndex={disabled ? -1 : 0}
    >
      {children}
    </button>
  );
}

