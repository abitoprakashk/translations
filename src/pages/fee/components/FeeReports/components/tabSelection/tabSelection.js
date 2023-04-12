import React, {useEffect, useMemo} from 'react'
import {useTranslation} from 'react-i18next'
import styles from '../../FeeReports.module.css'
import {TabGroup} from '@teachmint/krayon'
import {REPORT_TYPE} from '../../feeReport.constants'
import useIsMobile from '../../../../../AttendanceReport/hooks/useIsMobile'

const TabSelection = ({selectedTab, setSelectedTab}) => {
  const {t} = useTranslation()
  const isMobile = useIsMobile()
  const tabs = useMemo(
    () => [
      ...(isMobile
        ? []
        : [{id: REPORT_TYPE.CUSTOM_REPORTS, label: t('customReports')}]),
      {id: REPORT_TYPE.PAID_AND_DUE, label: t('paidandDue')},
      {id: REPORT_TYPE.PAYMENT_COLLECTION, label: t('paymentCollection')},
      {
        id: REPORT_TYPE.OTHER_REPORTS,
        label: t('otherReports'),
      },
    ],
    [t, isMobile]
  )
  useEffect(() => {
    setSelectedTab(tabs[0].id)
  }, [isMobile])
  return (
    <div className={styles.tabGroupWrapper}>
      <TabGroup
        onTabClick={({id}) => {
          setSelectedTab(id)
        }}
        showMoreTab={isMobile}
        tabGroupType={'primary'}
        selectedTab={selectedTab}
        tabOptions={tabs}
      />
    </div>
  )
}

export default TabSelection
