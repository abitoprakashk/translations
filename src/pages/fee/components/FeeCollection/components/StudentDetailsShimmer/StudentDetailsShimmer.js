import React from 'react'

function StudentDetailsShimmer() {
  return (
    <svg
      width={1057}
      height={72}
      aria-labelledby="loading-aria"
      preserveAspectRatio="none"
    >
      <title>{'Loading...'}</title>
      <rect
        width="100%"
        height="100%"
        clipPath="url(#a)"
        style={{
          fill: 'url(#b)',
        }}
      />
      <defs>
        <linearGradient id="b">
          <stop offset={0.6} stopColor="#f3f3f3">
            <animate
              attributeName="offset"
              values="-2; -2; 1"
              keyTimes="0; 0.25; 1"
              dur="2s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset={1.6} stopColor="#ecebeb">
            <animate
              attributeName="offset"
              values="-1; -1; 2"
              keyTimes="0; 0.25; 1"
              dur="2s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset={2.6} stopColor="#f3f3f3">
            <animate
              attributeName="offset"
              values="0; 0; 3"
              keyTimes="0; 0.25; 1"
              dur="2s"
              repeatCount="indefinite"
            />
          </stop>
        </linearGradient>
        <clipPath id="a">
          <rect x={18} y={14} rx={11} ry={11} width={45} height={45} />
          <path d="M30.53 42V30.364h4.364c.894 0 1.644.155 2.25.465.61.311 1.07.747 1.38 1.307.315.557.472 1.207.472 1.95 0 .745-.159 1.393-.477 1.942-.314.546-.778.968-1.392 1.267-.614.296-1.367.444-2.261.444h-3.108v-1.75h2.824c.522 0 .95-.072 1.284-.216.333-.148.58-.362.738-.642.163-.284.245-.633.245-1.046 0-.413-.082-.765-.245-1.057" />
          <rect x={18} y={14} rx={11} ry={11} width={45} height={45} />
          <rect x={72} y={12} rx={4} ry={4} width={230} height={20} />
          <path d="M172.719 20.254h-1.859" />
          <rect x={72} y={40} rx={4} ry={4} width={230} height={20} />
          <path d="M172.719 48.254h-1.859" />
          <rect x={411} y={12} rx={4} ry={4} width={200} height={20} />
          <path d="M496.719 20.254h-1.859" />
          <rect x={411} y={40} rx={4} ry={4} width={200} height={20} />
          <path d="M496.719 48.254h-1.859" />
          <rect x={673} y={12} rx={4} ry={4} width={200} height={20} />
          <path d="M758.719 20.254h-1.859" />
          <rect x={673} y={40} rx={4} ry={4} width={200} height={20} />
          <path d="M758.719 48.254h-1.859" />
          <rect x={911} y={12} rx={4} ry={4} width={130} height={48} />
          <path d="M961.719 34.254h-1.859M1057 71H0v2h1057v-2z" />
        </clipPath>
      </defs>
    </svg>
  )
}

export default StudentDetailsShimmer
