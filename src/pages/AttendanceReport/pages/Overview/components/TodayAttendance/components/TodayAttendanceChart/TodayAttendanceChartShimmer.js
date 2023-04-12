import React from 'react'

function TodayAttendanceChartShimmer() {
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
          <circle cx="235" cy="227" r="223" />
          <rect x="7" y="492" rx="0" ry="0" width="139" height="30" />
          <rect x="170" y="489" rx="0" ry="0" width="139" height="30" />
          <rect x="330" y="489" rx="0" ry="0" width="139" height="30" />
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

export default TodayAttendanceChartShimmer
