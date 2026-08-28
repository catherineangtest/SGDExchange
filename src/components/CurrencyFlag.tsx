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
    case 'KRW':
      return (
        <svg
          viewBox="0 0 32 32"
          className={`rounded-full overflow-hidden shadow-sm shrink-0 border border-slate-200 ${className}`}
          style={{ width: size, height: size }}
        >
          <rect width="32" height="32" fill="#FFFFFF" />
          <circle cx="16" cy="16" r="7" fill="#C60C30" />
          <path d="M 9,16 A 7,7 0 0,0 23,16 A 3.5,3.5 0 0,0 16,16 A 3.5,3.5 0 0,1 9,16" fill="#003478" />
        </svg>
      );
    case 'INR':
      return (
        <svg
          viewBox="0 0 32 32"
          className={`rounded-full overflow-hidden shadow-sm shrink-0 ${className}`}
          style={{ width: size, height: size }}
        >
          <rect width="32" height="10.6" fill="#FF9933" />
          <rect y="10.6" width="32" height="10.8" fill="#FFFFFF" />
          <rect y="21.4" width="32" height="10.6" fill="#138808" />
          <circle cx="16" cy="16" r="3.5" fill="none" stroke="#000080" strokeWidth="1" />
          <circle cx="16" cy="16" r="0.8" fill="#000080" />
        </svg>
      );
    case 'IDR':
      return (
        <svg
          viewBox="0 0 32 32"
          className={`rounded-full overflow-hidden shadow-sm shrink-0 border border-slate-200 ${className}`}
          style={{ width: size, height: size }}
        >
          <rect width="32" height="16" fill="#FF0000" />
          <rect y="16" width="32" height="16" fill="#FFFFFF" />
        </svg>
      );
    case 'TWD':
      return (
        <svg
          viewBox="0 0 32 32"
          className={`rounded-full overflow-hidden shadow-sm shrink-0 ${className}`}
          style={{ width: size, height: size }}
        >
          <rect width="32" height="32" fill="#FE0000" />
          <rect width="16" height="16" fill="#000095" />
          <circle cx="8" cy="8" r="4.5" fill="#FFFFFF" />
          <circle cx="8" cy="8" r="3" fill="#000095" />
          <circle cx="8" cy="8" r="2.2" fill="#FFFFFF" />
        </svg>
      );
    case 'PHP':
      return (
        <svg
          viewBox="0 0 32 32"
          className={`rounded-full overflow-hidden shadow-sm shrink-0 ${className}`}
          style={{ width: size, height: size }}
        >
          <rect width="32" height="16" fill="#0038A8" />
          <rect y="16" width="32" height="16" fill="#CE1126" />
          <polygon points="0,0 16,16 0,32" fill="#FFFFFF" />
          <circle cx="6" cy="16" r="2.5" fill="#FCD116" />
        </svg>
      );
    case 'VND':
      return (
        <svg
          viewBox="0 0 32 32"
          className={`rounded-full overflow-hidden shadow-sm shrink-0 ${className}`}
          style={{ width: size, height: size }}
        >
          <rect width="32" height="32" fill="#DA251D" />
          <polygon
            points="16,8 18.5,14 24,14 19.5,17.5 21,23 16,19.5 11,23 12.5,17.5 8,14 13.5,14"
            fill="#FFFF00"
          />
        </svg>
      );
    case 'SEK':
      return (
        <svg
          viewBox="0 0 32 32"
          className={`rounded-full overflow-hidden shadow-sm shrink-0 ${className}`}
          style={{ width: size, height: size }}
        >
          <rect width="32" height="32" fill="#006AA7" />
          <rect x="10" width="5" height="32" fill="#FECC00" />
          <rect y="13.5" width="32" height="5" fill="#FECC00" />
        </svg>
      );
    case 'NOK':
      return (
        <svg
          viewBox="0 0 32 32"
          className={`rounded-full overflow-hidden shadow-sm shrink-0 ${className}`}
          style={{ width: size, height: size }}
        >
          <rect width="32" height="32" fill="#BA0C2F" />
          <rect x="9" width="7" height="32" fill="#FFFFFF" />
          <rect y="12.5" width="32" height="7" fill="#FFFFFF" />
          <rect x="10.5" width="4" height="32" fill="#00205B" />
          <rect y="14" width="32" height="4" fill="#00205B" />
        </svg>
      );
    case 'DKK':
      return (
        <svg
          viewBox="0 0 32 32"
          className={`rounded-full overflow-hidden shadow-sm shrink-0 ${className}`}
          style={{ width: size, height: size }}
        >
          <rect width="32" height="32" fill="#C8102E" />
          <rect x="10" width="4.5" height="32" fill="#FFFFFF" />
          <rect y="13.5" width="32" height="4.5" fill="#FFFFFF" />
        </svg>
      );
    case 'SAR':
      return (
        <svg
          viewBox="0 0 32 32"
          className={`rounded-full overflow-hidden shadow-sm shrink-0 ${className}`}
          style={{ width: size, height: size }}
        >
          <rect width="32" height="32" fill="#006C35" />
          <rect x="8" y="19" width="16" height="2" fill="#FFFFFF" rx="1" />
          <path d="M10,12 Q16,8 22,12" stroke="#FFFFFF" strokeWidth="2" fill="none" />
        </svg>
      );
    case 'AED':
      return (
        <svg
          viewBox="0 0 32 32"
          className={`rounded-full overflow-hidden shadow-sm shrink-0 ${className}`}
          style={{ width: size, height: size }}
        >
          <rect width="32" height="10.6" fill="#00732F" />
          <rect y="10.6" width="32" height="10.8" fill="#FFFFFF" />
          <rect y="21.4" width="32" height="10.6" fill="#000000" />
          <rect width="10" height="32" fill="#FF0000" />
        </svg>
      );
    case 'ZAR':
      return (
        <svg
          viewBox="0 0 32 32"
          className={`rounded-full overflow-hidden shadow-sm shrink-0 ${className}`}
          style={{ width: size, height: size }}
        >
          <rect width="32" height="16" fill="#E03C31" />
          <rect y="16" width="32" height="16" fill="#001489" />
          <polygon points="0,0 14,16 0,32" fill="#000000" />
          <polygon points="0,0 16,16 0,32" fill="none" stroke="#FFB81C" strokeWidth="2" />
          <rect y="13" width="32" height="6" fill="#007749" />
          <rect y="14.5" width="32" height="3" fill="#FFFFFF" />
        </svg>
      );
    default:
      return (
        <div
          className={`rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-bold flex items-center justify-center text-xs shadow-xs shrink-0 ${className}`}
          style={{ width: size, height: size }}
        >
          {upper.slice(0, 3)}
        </div>
      );
  }
};
