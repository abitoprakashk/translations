import React from 'react'

/**
 * @description - use this slider to have smooth horizontal swiping experience
 *                mostly for mobile device
 *
 * @param {Number} sideSpan - amount in pixel by which container should grow to conver whole scrolling area
 * @param {Number} widthUnit - css unit for wrapper (%, vw, px, ...)
 */

const HorizontalSwiper = ({
  children,
  sideSpan = 0,
  widthUnit = '%',
  className,
}) => {
  return (
    <div
      style={{
        width: `calc(100${widthUnit} + 2 * ${sideSpan}px)`,
        overflowX: 'auto',
        margin: `0 -${sideSpan}px`,
        padding: `0 ${sideSpan}px`,
        // this is required otherwise child will collapse rightmost margin
        display: 'flex',
      }}
      className={className}
    >
      {children}
    </div>
  )
}

export default HorizontalSwiper
