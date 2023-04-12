import React from 'react'
import './progressBar.css'

export default function ProgressBar({bgcolor, progress, height}) {
  const Parentdiv = {
    height: height,
  }

  const Childdiv = {
    width: `${progress}%`,
    backgroundColor: bgcolor,
  }

  return (
    <div className="progress-bar-section" style={Parentdiv}>
      <div className="progress-bar-status" style={Childdiv}></div>
    </div>
  )
}
