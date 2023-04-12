import React from 'react'
import styles from '../../FeeReports.module.css'
import {REPORT_TYPE} from '../../feeReport.constants'
import CustomReports from './CustomReports'

const FeeCards = ({
  selectedTab,
  payAndDuesCards,
  payDetailsCard,
  payCollectionCards,
  MiscellaneousReportCard,
  getCustomReportsData,
}) => {
  return (
    <div className={styles.feeCardWrapper}>
      {selectedTab === REPORT_TYPE.CUSTOM_REPORTS && (
        <CustomReports getCustomReportsData={getCustomReportsData} />
      )}
      {selectedTab === REPORT_TYPE.PAID_AND_DUE &&
        payAndDuesCards.map((cardDetail) => payDetailsCard(cardDetail))}
      {selectedTab === REPORT_TYPE.PAYMENT_COLLECTION &&
        payCollectionCards.map((cardDetail) => payDetailsCard(cardDetail))}
      {selectedTab === REPORT_TYPE.OTHER_REPORTS &&
        MiscellaneousReportCard.map((cardDetail) => payDetailsCard(cardDetail))}
    </div>
  )
}

export default FeeCards
