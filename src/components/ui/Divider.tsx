import React from 'react';

interface DividerProps {
  className?: string;
  subtle?: boolean;
}

export const Divider: React.FC<DividerProps> = ({ className = '', subtle = false }) => {
  return (
    <hr
      className={`border-0 border-t ${subtle ? 'border-[#303034]/40' : 'border-[#303034]'} w-full my-8 sm:my-12 ${className}`}
    />
  );
};
