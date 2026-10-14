import React, { useState } from 'react';

export const RadialMeasurementGraphic: React.FC<{
  onSelectValue?: (val: number) => void;
}> = ({ onSelectValue }) => {
  const [hoveredRing, setHoveredRing] = useState<number | null>(null);

  // Key traditional radial intervals
  const rings = [
    { value: 10, label: '10', radius: 175, desc: 'Gunmam onset' },
    { value: 9, label: '9', radius: 155, desc: 'Smoky vision' },
    { value: 8, label: '8', radius: 135, desc: 'Mega-kaangai' },
    { value: 7, label: '7', radius: 115, desc: 'Pitta / Sayam' },
    { value: 6, label: '6', radius: 95, desc: 'Chest phlegm' },
    { value: 5, label: '5', radius: 75, desc: 'Pallor & cold' },
    { value: 4, label: '4', radius: 55, desc: 'Facial pallor' },
  ];

  return (
    <div className="relative flex items-center justify-center w-full max-w-[460px] aspect-square mx-auto p-4 select-none">
      {/* Ambient background glow */}
      <div className="absolute inset-0 rounded-full bg-gold-500/10 blur-2xl pointer-events-none" />

      <svg
        viewBox="0 0 400 400"
        className="w-full h-full transform transition-transform duration-700 hover:rotate-1"
      >
        <defs>
          <radialGradient id="virarGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#E7B95B" stopOpacity="0.3" />
            <stop offset="60%" stopColor="#123F35" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0B3029" stopOpacity="0.9" />
          </radialGradient>
          <linearGradient id="goldRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FCE7A6" />
            <stop offset="50%" stopColor="#E7B95B" />
            <stop offset="100%" stopColor="#9B7424" />
          </linearGradient>
        </defs>

        {/* Outer compass rim */}
        <circle
          cx="200"
          cy="200"
          r="192"
          fill="url(#virarGlow)"
          stroke="#E7B95B"
          strokeWidth="1.5"
          strokeOpacity="0.4"
        />
        <circle
          cx="200"
          cy="200"
          r="186"
          fill="none"
          stroke="#E7B95B"
          strokeWidth="0.75"
          strokeDasharray="2 4"
          strokeOpacity="0.6"
        />

        {/* Radial tick marks */}
        {Array.from({ length: 48 }).map((_, i) => {
          const angle = (i * 360) / 48;
          const isMajor = i % 4 === 0;
          const r1 = 186;
          const r2 = isMajor ? 172 : 180;
          const rad = (angle * Math.PI) / 180;
          const x1 = 200 + r1 * Math.cos(rad);
          const y1 = 200 + r1 * Math.sin(rad);
          const x2 = 200 + r2 * Math.cos(rad);
          const y2 = 200 + r2 * Math.sin(rad);

          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#E7B95B"
              strokeWidth={isMajor ? 1.5 : 0.75}
              strokeOpacity={isMajor ? 0.8 : 0.35}
            />
          );
        })}

        {/* Concentric Virarkadai measurement bands */}
        {rings.map((ring) => {
          const isHovered = hoveredRing === ring.value;
          return (
            <g
              key={ring.value}
              className="cursor-pointer transition-all duration-300"
              onMouseEnter={() => setHoveredRing(ring.value)}
              onMouseLeave={() => setHoveredRing(null)}
              onClick={() => onSelectValue?.(ring.value)}
            >
              <circle
                cx="200"
                cy="200"
                r={ring.radius}
                fill={isHovered ? 'rgba(231, 185, 91, 0.15)' : 'none'}
                stroke={isHovered ? '#FCE7A6' : '#E7B95B'}
                strokeWidth={isHovered ? 2.5 : 1}
                strokeDasharray={ring.value <= 6 ? '4 3' : undefined}
                strokeOpacity={isHovered ? 1 : 0.5}
              />
              {/* Ring Label */}
              <text
                x="200"
                y={200 - ring.radius + 12}
                textAnchor="middle"
                fill={isHovered ? '#FFFFFF' : '#E7B95B'}
                fontSize={isHovered ? '11' : '9'}
                fontWeight={isHovered ? '700' : '500'}
                className="font-serif tracking-widest transition-all"
              >
                {ring.label}
              </text>
            </g>
          );
        })}

        {/* Cardinal crosshairs */}
        <line x1="20" y1="200" x2="380" y2="200" stroke="#E7B95B" strokeWidth="0.75" strokeDasharray="3 6" strokeOpacity="0.3" />
        <line x1="200" y1="20" x2="200" y2="380" stroke="#E7B95B" strokeWidth="0.75" strokeDasharray="3 6" strokeOpacity="0.3" />

        {/* Center hub with golden lotus emblem */}
        <circle cx="200" cy="200" r="32" fill="#0B3029" stroke="url(#goldRingGrad)" strokeWidth="2" />
        <circle cx="200" cy="200" r="26" fill="none" stroke="#E7B95B" strokeWidth="1" strokeDasharray="2 3" strokeOpacity="0.7" />
        <circle cx="200" cy="200" r="10" fill="#E7B95B" />

        {/* Center label */}
        <text
          x="200"
          y="238"
          textAnchor="middle"
          fill="#E7B95B"
          fontSize="9"
          letterSpacing="0.15em"
          fontWeight="600"
          className="font-serif uppercase"
        >
          Virarkadai
        </text>
        <text
          x="200"
          y="248"
          textAnchor="middle"
          fill="#8EA69A"
          fontSize="8"
          className="font-tamil"
        >
          விரற்கடை
        </text>
      </svg>

      {/* Floating active ring tooltip badge */}
      {hoveredRing && (
        <div className="absolute bottom-2 bg-forest-950/90 border border-gold-500/50 backdrop-blur-md px-3 py-1 rounded-full text-xs text-gold-300 font-medium shadow-gold-sm animate-fade-in pointer-events-none">
          {hoveredRing} Virarkadai: {rings.find(r => r.value === hoveredRing)?.desc}
        </div>
      )}
    </div>
  );
};
