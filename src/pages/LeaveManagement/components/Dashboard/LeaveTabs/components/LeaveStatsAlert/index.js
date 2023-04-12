import classNames from 'classnames'
import React from 'react'
import styles from './styles.module.css'

const LeaveStatsAlert = ({type, children, className}) => {
  return (
    <div
      className={classNames(
        styles.alert,
        {[styles[type?.toLowerCase()]]: true},
        className
      )}
    >
      {children}
    </div>
  )
}

export default LeaveStatsAlert
