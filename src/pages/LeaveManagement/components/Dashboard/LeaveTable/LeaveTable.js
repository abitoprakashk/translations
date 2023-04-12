import React from 'react'
import ApproveModal from './components/ApproveModal/ApproveModal'
import RejectModal from './components/RejectModal/RejectModal'
import CancelLeaveModal from './components/CancelLeaveModal'
import PastLeaveRequest from './components/PastLeaveRequest/PastLeaveRequest'
import PendingLeaveRequest from './components/PendingLeaveRequest/PendingLeaveRequest'
import styles from './LeaveTable.module.css'

function LeaveTable({manage = false}) {
  return (
    <>
      <div>
        <div className={styles.tableWrapper}>
          <div className={styles.pendingRequestWrapper}>
            <PendingLeaveRequest manage={manage} />
          </div>
          <div className={styles.pastRequestWrapper}>
            <PastLeaveRequest manage={manage} />
          </div>
        </div>
      </div>
      <ApproveModal />
      <RejectModal />
      <CancelLeaveModal />
    </>
  )
}

export default LeaveTable
