import React, {useMemo} from 'react'
import {v4} from 'uuid'

function Shimmer({width = '100%', height = '100%', className, children}) {
  const clip_path_id = useMemo(() => v4(), [])
  const animated_diff = useMemo(() => v4(), [])
  return (
    <svg width={width} height={height} className={className}>
      <rect
        role="presentation"
        x="0"
        y="0"
        width="100%"
        height="100%"
        clipPath={`url(#${clip_path_id})`}
        style={{fill: `url(#${animated_diff})`}}
      />
      <defs role="presentation">
        <clipPath id={clip_path_id}>{children}</clipPath>

        <linearGradient id={animated_diff}>
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

export default Shimmer
