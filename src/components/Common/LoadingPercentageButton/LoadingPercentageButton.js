import classNames from 'classnames'
import React from 'react'
import style from './LoadingPercentageButton.module.css'

const LoadingPercentageButton = ({small}) => {
  if (small) return <div className={classNames(style.smallLoader)}></div>
  return <div className={classNames(style.loader)}></div>
}

export default LoadingPercentageButton
