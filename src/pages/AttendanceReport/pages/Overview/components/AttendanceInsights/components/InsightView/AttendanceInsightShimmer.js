import React from 'react'

function AttendanceInsightShimmer() {
  return (
    <svg viewBox="0 0 456 144">
      <rect
        role="presentation"
        x="0"
        y="0"
        width="100%"
        height="100%"
        clipPath="url(#clip-path-id-AttendanceInsightShimmer)"
        style={{fill: 'url(#animated-diff)'}}
      />
      <defs role="presentation">
        <clipPath id="clip-path-id-AttendanceInsightShimmer">
          <rect x="2" y="8" rx="0" ry="0" width="90" height="44" />
          <rect x="3" y="67" rx="0" ry="0" width="286" height="24" />
          <rect x="8" y="116" rx="0" ry="0" width="320" height="6" />
          <circle cx="291" cy="120" r="13" />
          <rect x="10" y="147" rx="0" ry="0" width="440" height="2" />
          <rect x="126" y="168" rx="0" ry="0" width="168" height="23" />
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

export default AttendanceInsightShimmer
