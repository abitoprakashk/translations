import React from 'react'

function AttendanceTrendViewShimmer() {
  return (
    <svg viewBox="0 0 590 144" style={{scale: 1.2}}>
      <rect
        role="presentation"
        x="0"
        y="0"
        width="100%"
        height="100%"
        clipPath="url(#clip-path-id-AttendanceTrendViewShimmer)"
        style={{fill: 'url(#animated-diff)'}}
      />
      <defs role="presentation">
        <clipPath id="clip-path-id-AttendanceTrendViewShimmer">
          <rect x="1" y="4" rx="0" ry="0" width="2" height="144" />
          <rect x="4" y="4" rx="0" ry="0" width="143" height="2" />
          <rect x="3" y="142" rx="0" ry="0" width="145" height="3" />
          <rect x="43" y="30" rx="0" ry="0" width="70" height="19" />
          <rect x="22" y="68" rx="0" ry="0" width="110" height="14" />
          <rect x="21" y="108" rx="0" ry="0" width="113" height="23" />
          <rect x="148" y="3" rx="0" ry="0" width="2" height="144" />
          <rect x="148" y="4" rx="0" ry="0" width="2" height="144" />
          <rect x="151" y="4" rx="0" ry="0" width="143" height="2" />
          <rect x="150" y="142" rx="0" ry="0" width="145" height="3" />
          <rect x="190" y="30" rx="0" ry="0" width="70" height="19" />
          <rect x="169" y="68" rx="0" ry="0" width="110" height="14" />
          <rect x="168" y="108" rx="0" ry="0" width="113" height="23" />
          <rect x="294" y="6" rx="0" ry="0" width="2" height="139" />
          <rect x="591" y="-1" rx="0" ry="0" width="2" height="144" />
          <rect x="295" y="2" rx="0" ry="0" width="2" height="144" />
          <rect x="298" y="2" rx="0" ry="0" width="143" height="2" />
          <rect x="297" y="140" rx="0" ry="0" width="145" height="3" />
          <rect x="337" y="28" rx="0" ry="0" width="70" height="19" />
          <rect x="316" y="66" rx="0" ry="0" width="110" height="14" />
          <rect x="315" y="106" rx="0" ry="0" width="113" height="23" />
          <rect x="442" y="1" rx="0" ry="0" width="2" height="144" />
          <rect x="442" y="2" rx="0" ry="0" width="2" height="144" />
          <rect x="445" y="2" rx="0" ry="0" width="143" height="2" />
          <rect x="444" y="140" rx="0" ry="0" width="145" height="3" />
          <rect x="484" y="28" rx="0" ry="0" width="70" height="19" />
          <rect x="463" y="66" rx="0" ry="0" width="110" height="14" />
          <rect x="462" y="106" rx="0" ry="0" width="113" height="23" />
          <rect x="588" y="4" rx="0" ry="0" width="2" height="139" />
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

export default AttendanceTrendViewShimmer
