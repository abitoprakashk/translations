import React from 'react'

function AttendanceTrendShimmer() {
  return (
    <svg viewBox="0 0 456 524">
      <rect
        role="presentation"
        x="0"
        y="0"
        width="100%"
        height="100%"
        clipPath="url(#clip-path-id)"
        style={{fill: 'url(#animated-diff)'}}
      />
      <defs role="presentation">
        <clipPath id="clip-path-id">
          <rect x="9" y="37" rx="0" ry="0" width="90" height="44" />
          <rect x="10" y="93" rx="0" ry="0" width="286" height="24" />
          <rect x="14" y="162" rx="0" ry="0" width="320" height="6" />
          <circle cx="297" cy="166" r="13" />
          <rect x="9" y="234" rx="0" ry="0" width="506" height="2" />
          <rect x="144" y="258" rx="0" ry="0" width="206" height="26" />
        </clipPath>
        <linearGradient id="animated-diff">
          <stop offset="-2" stopColor="#dddddd" stopOpacity="1">
            <animate
              attributeName="offset"
              values="-2; -2; 1"
              keyTimes="0; 0.25; 1"
              dur="2s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="-1" stopColor="#dfdfdf" stopOpacity="1">
            <animate
              attributeName="offset"
              values="-1; -1; 2"
              keyTimes="0; 0.25; 1"
              dur="2s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="0" stopColor="#eeeeee" stopOpacity="1">
            <animate
              attributeName="offset"
              values="0; 0; 3"
              keyTimes="0; 0.25; 1"
              dur="2s"
              repeatCount="indefinite"
            />
          </stop>
        </linearGradient>
      </defs>
    </svg>
  )
}

export default AttendanceTrendShimmer
