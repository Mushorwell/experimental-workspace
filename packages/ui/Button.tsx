import * as React from 'react';

interface IButtonProps {
  primary?: boolean;
  size?: 'small' | 'large';
  label?: string;
}

export const Button = ({
  primary = false,
  label = 'Boop',
  size = 'small',
}: IButtonProps) => {
  return (
    <button
      style={{
        backgroundColor: primary ? 'red' : 'blue',
        fontSize: size === 'large' ? '24px' : '14px',
      }}
    >
      {label}
    </button>
  );
};
