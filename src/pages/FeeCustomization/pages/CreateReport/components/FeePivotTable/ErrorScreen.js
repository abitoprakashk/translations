import classNames from 'classnames'
import React from 'react'
import RetryOverlay from '../../../../../AttendanceReport/components/RetryOverlay/RetryOverlay'
import styles from './FeePivotTable.module.css'

function ErrorScreen({getData}) {
  return (
    <div className={classNames('relative', styles.minHeight)}>
      <RetryOverlay onretry={getData} />
    </div>
  )
}

export default ErrorScreen
