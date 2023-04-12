import React from 'react'
import Lottie from 'lottie-react'
import verifiedGreen from '../../../utils/animations/lottie/varifiedGreen.json'

export default function SuccessSplash({width}) {
  return (
    <div style={{width: `${width}px`}}>
      <Lottie animationData={verifiedGreen} loop={true} />
    </div>
  )
}
