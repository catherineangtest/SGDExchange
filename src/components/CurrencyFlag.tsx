import React from 'react';
import { SINGAPORE_FLAG_URL, US_FLAG_URL } from '../data/currencies';

interface CurrencyFlagProps {
  code: string;
  className?: string;
  size?: number;
}

export const CurrencyFlag: React.FC<CurrencyFlagProps> = ({ code, className = '', size = 32 }) => {
  const upper = code.toUpperCase();

  if (upper === 'SGD') {
    return (
      <img
        src={SINGAPORE_FLAG_URL}
        alt="Singapore Flag"
        className={`rounded-full object-cover shadow-sm shrink-0 ${className}`}
        style={{ width: size, height: size }}
        referrerPolicy="no-referrer"
      />
    );
  }

  if (upper === 'USD') {
    return (
      <img
        src={US_FLAG_URL}
        alt="United States Flag"
        className={`rounded-full object-cover shadow-sm shrink-0 ${className}`}
        style={{ width: size, height: size }}
        referrerPolicy="no-referrer"
      />
    );
  }

  // High quality SVG representations for other currency flags
  switch (upper) {
    case 'EUR':
      return (
        <svg
          viewBox="0 0 32 32"
          className={`rounded-full overflow-hidden shadow-sm shrink-0 ${className}`}
          style={{ width: size, height: size }}
        >
          <rect width="32" height="32" fill="#003399" />
          {/* 12 stars circle */}
          {[...Array(12)].map((_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            const cx = 16 + 9 * Math.sin(angle);
            const cy = 16 - 9 * Math.cos(angle);
            return <circle key={i} cx={cx} cy={cy} r="1.3" fill="#FFCC00" />;
          })}
        </svg>
      );
    case 'GBP':
      return (
        <svg
          viewBox="0 0 32 32"
          className={`rounded-full overflow-hidden shadow-sm shrink-0 ${className}`}
          style={{ width: size, height: size }}
        >
          <rect width="32" height="32" fill="#012169" />
          <path d="M0,0 L32,32 M32,0 L0,32" stroke="#FFFFFF" strokeWidth="4.5" />
          <path d="M0,0 L32,32 M32,0 L0,32" stroke="#C8102E" strokeWidth="2" />
          <path d="M16,0 V32 M0,16 H32" stroke="#FFFFFF" strokeWidth="7" />
          <path d="M16,0 V32 M0,16 H32" stroke="#C8102E" strokeWidth="4" />
        </svg>
      );
    case 'JPY':
      return (
        <svg
          viewBox="0 0 32 32"
          className={`rounded-full overflow-hidden shadow-sm shrink-0 border border-slate-200 ${className}`}
          style={{ width: size, height: size }}
        >
          <rect width="32" height="32" fill="#FFFFFF" />
          <circle cx="16" cy="16" r="8" fill="#BC002D" />
        </svg>
      );
    case 'MYR':
      return (
        <svg
          viewBox="0 0 32 32"
          className={`rounded-full overflow-hidden shadow-sm shrink-0 ${className}`}
          style={{ width: size, height: size }}
        >
          {/* 14 alternating red/white stripes */}
          {[...Array(14)].map((_, i) => (
            <rect
              key={i}
              y={(i * 32) / 14}
              width="32"
              height={32 / 14}
              fill={i % 2 === 0 ? '#CC0000' : '#FFFFFF'}
            />
          ))}
          {/* Blue canton */}
          <rect width="18" height="18" fill="#000066" />
          {/* Crescent & 14-point star */}
          <circle cx="8" cy="9" r="6" fill="#FFCC00" />
          <circle cx="10" cy="9" r="5" fill="#000066" />
          <polygon
            points="12,9 13.2,7.5 15,7.8 14.2,9.5 15.5,10.8 13.8,11.2 13.2,12.8 12.2,11.5 10.5,12 11.2,10.2 10,9.2 11.5,8.8"
            fill="#FFCC00"
          />
        </svg>
      );
    case 'CNY':
      return (
        <svg
          viewBox="0 0 32 32"
          className={`rounded-full overflow-hidden shadow-sm shrink-0 ${className}`}
          style={{ width: size, height: size }}
        >
          <rect width="32" height="32" fill="#DE2910" />
          <polygon
            points="7,4 8.2,7.8 12,7.8 9,10 10.2,13.8 7,11.5 3.8,13.8 5,10 2,7.8 5.8,7.8"
            fill="#FFDE00"
          />
          <circle cx="14" cy="5" r="1.2" fill="#FFDE00" />
          <circle cx="16" cy="8" r="1.2" fill="#FFDE00" />
          <circle cx="16" cy="12" r="1.2" fill="#FFDE00" />
          <circle cx="14" cy="15" r="1.2" fill="#FFDE00" />
        </svg>
      );
    case 'AUD':
      return (
        <svg
          viewBox="0 0 32 32"
          className={`rounded-full overflow-hidden shadow-sm shrink-0 ${className}`}
          style={{ width: size, height: size }}
        >
          <rect width="32" height="32" fill="#012169" />
          {/* Mini Union Jack canton */}
          <g>
            <rect width="16" height="12" fill="#012169" />
            <path d="M0,0 L16,12 M16,0 L0,12" stroke="#FFFFFF" strokeWidth="2.5" />
            <path d="M0,0 L16,12 M16,0 L0,12" stroke="#C8102E" strokeWidth="1" />
            <path d="M8,0 V12 M0,6 H16" stroke="#FFFFFF" strokeWidth="3.5" />
            <path d="M8,0 V12 M0,6 H16" stroke="#C8102E" strokeWidth="2" />
          </g>
          {/* Commonwealth Star */}
          <circle cx="8" cy="22" r="3.5" fill="#FFFFFF" />
          {/* Southern cross dots */}
          <circle cx="24" cy="8" r="1.2" fill="#FFFFFF" />
          <circle cx="27" cy="14" r="1.2" fill="#FFFFFF" />
          <circle cx="24" cy="24" r="1.5" fill="#FFFFFF" />
          <circle cx="21" cy="16" r="1.2" fill="#FFFFFF" />
          <circle cx="25" cy="18" r="0.9" fill="#FFFFFF" />
        </svg>
      );
    case 'CAD':
      return (
        <svg
          viewBox="0 0 32 32"
          className={`rounded-full overflow-hidden shadow-sm shrink-0 ${className}`}
          style={{ width: size, height: size }}
        >
          <rect width="32" height="32" fill="#FF0000" />
          <rect x="8" width="16" height="32" fill="#FFFFFF" />
          <polygon
            points="16,8 17.5,13 21,12 19,16 22,18 17,19.5 17,24 15,24 15,19.5 10,18 13,16 11,12 14.5,13"
            fill="#FF0000"
          />
        </svg>
      );
    case 'CHF':
      return (
        <svg
          viewBox="0 0 32 32"
          className={`rounded-full overflow-hidden shadow-sm shrink-0 ${className}`}
          style={{ width: size, height: size }}
        >
          <rect width="32" height="32" fill="#D52B1E" />
          <rect x="13" y="7" width="6" height="18" fill="#FFFFFF" />
          <rect x="7" y="13" width="18" height="6" fill="#FFFFFF" />
        </svg>
      );
    case 'HKD':
      return (
        <svg
          viewBox="0 0 32 32"
          className={`rounded-full overflow-hidden shadow-sm shrink-0 ${className}`}
          style={{ width: size, height: size }}
        >
          <rect width="32" height="32" fill="#EE1C25" />
          <circle cx="16" cy="16" r="7" fill="#FFFFFF" />
          <circle cx="16" cy="16" r="5" fill="#EE1C25" />
        </svg>
      );
    case 'NZD':
      return (
        <svg
          viewBox="0 0 32 32"
          className={`rounded-full overflow-hidden shadow-sm shrink-0 ${className}`}
          style={{ width: size, height: size }}
        >
          <rect width="32" height="32" fill="#00247D" />
          <circle cx="23" cy="8" r="1.8" fill="#CC142B" stroke="#FFFFFF" strokeWidth="0.8" />
          <circle cx="26" cy="15" r="1.8" fill="#CC142B" stroke="#FFFFFF" strokeWidth="0.8" />
          <circle cx="23" cy="24" r="2.2" fill="#CC142B" stroke="#FFFFFF" strokeWidth="0.8" />
          <circle cx="20" cy="16" r="1.6" fill="#CC142B" stroke="#FFFFFF" strokeWidth="0.8" />
        </svg>
      );
    case 'THB':
      return (
        <svg
          viewBox="0 0 32 32"
          className={`rounded-full overflow-hidden shadow-sm shrink-0 ${className}`}
          style={{ width: size, height: size }}
        >
          <rect width="32" height="6" fill="#A51931" />
          <rect y="6" width="32" height="4" fill="#F4F5F8" />
          <rect y="10" width="32" height="12" fill="#2D2A4A" />
          <rect y="22" width="32" height="4" fill="#F4F5F8" />
          <rect y="26" width="32" height="6" fill="#A51931" />
        </svg>
      );
    default:
      return (
        <div
          className={`rounded-full bg-primary-fixed text-primary font-bold flex items-center justify-center text-xs shadow-sm shrink-0 ${className}`}
          style={{ width: size, height: size }}
        >
          {upper.slice(0, 3)}
        </div>
      );
  }
};
