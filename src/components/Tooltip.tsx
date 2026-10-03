import React, { useState, useId } from 'react';

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom';
  className?: string;
}

/**
 * Reusable Monochrome Tooltip Component
 * - 1px solid black border (`border border-black`)
 * - Pure white background (`bg-white`)
 * - Zero border radius (`rounded-none`, borderRadius: 0)
 * - Absolute positioning with architectural alignment notch
 * - Utilizes 'JetBrains Mono' font for technical and numerical accuracy
 */
export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipId = useId();

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
      aria-describedby={isVisible ? tooltipId : undefined}
    >
      {children}

      {isVisible && (
        <div
          id={tooltipId}
          role="tooltip"
          style={{ fontFamily: '"JetBrains Mono", monospace', borderRadius: 0 }}
          className={`absolute left-1/2 -translate-x-1/2 z-50 pointer-events-none w-72 sm:w-80 max-w-[calc(100vw-2rem)] p-3 bg-white text-black border border-black rounded-none shadow-none font-mono select-none transition-none ${
            position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
          }`}
        >
          {/* Architectural Alignment Notch (1px solid black border, white background, zero radius) */}
          <div
            style={{ borderRadius: 0 }}
            className={`absolute left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45 rounded-none ${
              position === 'top'
                ? '-bottom-[5px] border-b border-r border-black'
                : '-top-[5px] border-t border-l border-black'
            }`}
          />
          {content}
        </div>
      )}
    </div>
  );
};
