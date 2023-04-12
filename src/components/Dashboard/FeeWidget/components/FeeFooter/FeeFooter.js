import classNames from 'classnames'
import React from 'react'
import {useSelector} from 'react-redux'
import Shimmer from '../Shimmer/Shimmer'
import DueApplicable from './DueApplicable'
import styles from './FeeFooter.module.css'
import FeePending from './FeePending'
function FeeFooter() {
  const {isLoading, data} = useSelector((state) => state.globalData.feeWidget)
  const {feeStructuresLoading} = useSelector((state) => state.feeStructure)

  return (
    <div className={styles.wrapper}>
      <div className={styles.section}>
        {isLoading || feeStructuresLoading ? <Shimmer /> : <DueApplicable />}
      </div>
      {!data?.pending?.length ? null : (
        <div className={classNames(styles.section, styles.footerMinWidth)}>
          {isLoading || feeStructuresLoading ? <Shimmer /> : <FeePending />}
        </div>
      )}
    </div>
  )
}

export default FeeFooter
