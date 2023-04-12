import {ErrorBoundary} from '@teachmint/common'
import React from 'react'

function ComponentErrorBoundary({children, style = {}}) {
  return (
    <div style={{position: 'relative', ...style}}>
      <ErrorBoundary>{children}</ErrorBoundary>
    </div>
  )
}

export default ComponentErrorBoundary
