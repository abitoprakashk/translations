import React, {lazy, Suspense, useState} from 'react'
import {Tabs} from '@teachmint/common'
import PendingLeaveList from './components/LeaveList/PendingLeaveList'
import PastLeaveList from './components/LeaveList/PastLeaveList'
import LeaveDetailsPopup from './components/LeaveDetailsPopup/LeaveDetailsPopup'
import {useSelector} from 'react-redux'
import styles from './LeaveTabs.module.css'
import {events} from '../../../../../utils/EventsConstants'
import {useTranslation} from 'react-i18next'
import {LEAVE_BASE_TYPE} from '../../../LeaveManagement.constant'
import ApproveModal from '../LeaveTable/components/ApproveModal/ApproveModal'
import RejectModal from '../LeaveTable/components/RejectModal/RejectModal'
import CancelLeaveModal from '../LeaveTable/components/CancelLeaveModal'
import {IS_MOBILE} from '../../../../../constants'
import RoleFilter from '../../../../../components/RoleFilter'
import {DownloadReportButton} from '../../LeaveButtons'
const LeaveSearch = lazy(() => import('../LeaveSearch'))

function LeaveTabs({manage = false}) {
  const {
    totalLeaveStats,
    leave: {selectedLeave},
  } = useSelector((state) => state.leaveManagement)
  const {searchedIds, active: searchActive} = useSelector(
    (state) => state.leaveManagement.search
  )
  const {eventManager} = useSelector((state) => state)
  const [currentTab, setcurrentTab] = useState({
    title: '',
    key: LEAVE_BASE_TYPE.PENDING,
  })
  const {t} = useTranslation()

  let pendingLeaveCount = ''
  let historyLeaveCount = ''
  if (searchActive && searchedIds.length == 0) {
    pendingLeaveCount = 0
    historyLeaveCount = 0
  } else if (totalLeaveStats) {
    pendingLeaveCount = totalLeaveStats.pending
    historyLeaveCount = totalLeaveStats.history
  }

  return (
    <>
      {manage && IS_MOBILE && (
        <div className={styles.flex}>
          <Suspense>
            <LeaveSearch mobile />
          </Suspense>
          <RoleFilter>
            <DownloadReportButton className={styles.downloadReport} />
          </RoleFilter>
        </div>
      )}
      <div className={styles.leaveTab}>
        <Tabs
          onTabClick={(tab) => {
            setcurrentTab(tab)
            if (tab.key === LEAVE_BASE_TYPE.PENDING) {
              eventManager.send_event(events.PENDING_LEAVE_REQUEST_CLICKED_TFI)
            } else {
              eventManager.send_event(events.PAST_LEAVES_CLICKED_TFI)
            }
          }}
          currentTab={currentTab}
          tabs={[
            {
              title: `${t('pendingRequests')} ${
                pendingLeaveCount !== '' ? `- ${pendingLeaveCount}` : ''
              }`,
              key: LEAVE_BASE_TYPE.PENDING,
            },
            {
              title: `${t('pastLeaves')} ${
                historyLeaveCount !== '' ? `- ${historyLeaveCount}` : ''
              }`,
              key: LEAVE_BASE_TYPE.PAST,
            },
          ]}
          showDivider={false}
          tabWrapperClass={styles.tabwrapper}
          tabClass={styles.tab}
          activeClass={styles.active}
        />
        <div
          className={
            currentTab?.key === LEAVE_BASE_TYPE.PENDING
              ? styles.show
              : styles.hide
          }
        >
          <PendingLeaveList manage={manage} />
        </div>
        <div
          className={
            currentTab?.key === LEAVE_BASE_TYPE.PAST ? styles.show : styles.hide
          }
        >
          <PastLeaveList manage={manage} />
        </div>
        {selectedLeave ? <LeaveDetailsPopup /> : null}
        <ApproveModal />
        <RejectModal />
        <CancelLeaveModal />
      </div>
    </>
  )
}

export default LeaveTabs
