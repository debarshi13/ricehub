export function RiceBowl({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Steam wisps */}
      <path
        d="M80 65 Q82 50 78 35"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      >
        <animate
          attributeName="d"
          values="M80 65 Q82 50 78 35;M80 65 Q76 48 80 30;M80 65 Q82 50 78 35"
          dur="3s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.3;0.6;0.3"
          dur="3s"
          repeatCount="indefinite"
        />
      </path>
      <path
        d="M100 60 Q102 42 98 25"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      >
        <animate
          attributeName="d"
          values="M100 60 Q102 42 98 25;M100 60 Q96 40 100 20;M100 60 Q102 42 98 25"
          dur="3.5s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.2;0.5;0.2"
          dur="3.5s"
          repeatCount="indefinite"
        />
      </path>
      <path
        d="M120 63 Q122 48 118 33"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      >
        <animate
          attributeName="d"
          values="M120 63 Q122 48 118 33;M120 63 Q116 45 120 28;M120 63 Q122 48 118 33"
          dur="4s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.25;0.55;0.25"
          dur="4s"
          repeatCount="indefinite"
        />
      </path>

      {/* Rice grains peeking out */}
      <ellipse cx="85" cy="72" rx="6" ry="3" fill="#e8e0d0" opacity="0.9" />
      <ellipse
        cx="98"
        cy="68"
        rx="5.5"
        ry="3"
        fill="#f0e8d8"
        opacity="0.85"
        transform="rotate(-15 98 68)"
      />
      <ellipse
        cx="112"
        cy="70"
        rx="6"
        ry="3"
        fill="#e8e0d0"
        opacity="0.9"
        transform="rotate(10 112 70)"
      />
      <ellipse
        cx="92"
        cy="66"
        rx="5"
        ry="2.5"
        fill="#f5ede0"
        opacity="0.8"
        transform="rotate(-8 92 66)"
      />
      <ellipse
        cx="106"
        cy="66"
        rx="5.5"
        ry="2.8"
        fill="#ece4d4"
        opacity="0.85"
        transform="rotate(5 106 66)"
      />

      {/* Bowl body */}
      <path
        d="M55 78 Q55 135 100 145 Q145 135 145 78 Z"
        fill="#DC143C"
        opacity="0.9"
      />
      <path
        d="M55 78 Q55 135 100 145 Q145 135 145 78 Z"
        fill="url(#bowlGrad)"
        opacity="0.4"
      />

      {/* Bowl rim */}
      <ellipse cx="100" cy="78" rx="46" ry="10" fill="#DC143C" />
      <ellipse cx="100" cy="78" rx="46" ry="10" fill="url(#rimGrad)" opacity="0.5" />

      {/* Bowl base */}
      <ellipse cx="100" cy="148" rx="18" ry="5" fill="#a01030" />
      <rect x="92" y="145" width="16" height="8" rx="2" fill="#b01535" />

      {/* Bowl pattern - simple line */}
      <path
        d="M65 100 Q100 115 135 100"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="1.5"
        fill="none"
      />

      {/* Chopsticks */}
      <line
        x1="125"
        y1="30"
        x2="90"
        y2="75"
        stroke="#d4a574"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1="135"
        y1="28"
        x2="95"
        y2="72"
        stroke="#c49564"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Chopstick tips */}
      <line
        x1="90"
        y1="75"
        x2="87"
        y2="80"
        stroke="#f5ede0"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="95"
        y1="72"
        x2="92"
        y2="77"
        stroke="#f5ede0"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Face on bowl - kawaii style */}
      {/* Eyes */}
      <circle cx="88" cy="105" r="3" fill="#0F0D14" />
      <circle cx="112" cy="105" r="3" fill="#0F0D14" />
      <circle cx="89" cy="104" r="1.2" fill="white" />
      <circle cx="113" cy="104" r="1.2" fill="white" />

      {/* Blush */}
      <ellipse cx="80" cy="112" rx="5" ry="3" fill="#ff6b8a" opacity="0.3" />
      <ellipse cx="120" cy="112" rx="5" ry="3" fill="#ff6b8a" opacity="0.3" />

      {/* Smile */}
      <path
        d="M94 114 Q100 120 106 114"
        stroke="#0F0D14"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />

      <defs>
        <linearGradient id="bowlGrad" x1="55" y1="78" x2="145" y2="145">
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
        <linearGradient id="rimGrad" x1="54" y1="68" x2="146" y2="88">
          <stop offset="0%" stopColor="white" />
          <stop offset="50%" stopColor="transparent" />
          <stop offset="100%" stopColor="black" stopOpacity="0.2" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function RiceGrain({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <ellipse
        cx="12"
        cy="6"
        rx="10"
        ry="5"
        fill="currentColor"
        opacity="0.15"
      />
    </svg>
  );
}

export function SleepyRiceBowl({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Bowl body */}
      <path
        d="M35 65 Q35 115 80 125 Q125 115 125 65 Z"
        fill="#252030"
      />
      <ellipse cx="80" cy="65" rx="46" ry="10" fill="#2d2838" />

      {/* Rice grains */}
      <ellipse cx="68" cy="60" rx="5" ry="2.5" fill="#e8e0d0" opacity="0.6" />
      <ellipse cx="80" cy="57" rx="5" ry="2.5" fill="#f0e8d8" opacity="0.5" transform="rotate(-10 80 57)" />
      <ellipse cx="92" cy="59" rx="5" ry="2.5" fill="#e8e0d0" opacity="0.6" transform="rotate(8 92 59)" />

      {/* Sleeping eyes - horizontal lines */}
      <path d="M67 88 Q72 86 77 88" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M83 88 Q88 86 93 88" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* Sleepy mouth */}
      <ellipse cx="80" cy="98" rx="3" ry="2" fill="#94A3B8" opacity="0.4" />

      {/* Zzz */}
      <text x="108" y="50" fill="#94A3B8" fontSize="14" fontFamily="monospace" opacity="0.6">z</text>
      <text x="118" y="38" fill="#94A3B8" fontSize="11" fontFamily="monospace" opacity="0.4">z</text>
      <text x="126" y="28" fill="#94A3B8" fontSize="9" fontFamily="monospace" opacity="0.25">z</text>
    </svg>
  );
}
