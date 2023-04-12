import {Button, ErrorOverlay, FlatAccordion, Table} from '@teachmint/common'
import React, {useEffect, useState} from 'react'
import {ReactComponent as EmptySvg} from '../../../../assets/leavemanagement_empty.svg'
import {useDispatch, useSelector} from 'react-redux'
import {
  getLeavesTableColumnStyle,
  getPendingTableRow,
  ROW_ACTIONS,
} from '../../table.util'
import {
  getPendingLeaves,
  resetPendingLeaves,
  showApproveModal,
  showCancelModal,
  showEditLeavePopup,
  showRejectModal,
  showStaffHsitoryModal,
} from '../../../../../redux/actions/leaveManagement.actions'
import styles from '../../LeaveTable.module.css'
import {events} from '../../../../../../../utils/EventsConstants'
import {useTranslation} from 'react-i18next'
import classNames from 'classnames'
import {showErrorToast} from '../../../../../../../redux/actions/commonAction'
import {
  LEAVE_TYPE,
  manageViewPendingLeavesTableHeader,
  myViewPendingLeavesTableHeader,
} from '../../../../../LeaveManagement.constant'
import {
  canCancelPendingLeave,
  canEditPendingLeave,
} from '../../../../../LeaveMangement.permission'

function PendingLeaveRequest({manage = false}) {
  const [open, setopen] = useState(true)
  const [row, setrow] = useState([])
  const dispatch = useDispatch()
  const {t} = useTranslation()
  const {
    loading,
    data: pendingLeavesData,
    maxSinglePageItems,
    allLoaded,
    error,
  } = useSelector((state) => state.leaveManagement.pendingLeaves)
  const totalLeaveStats = useSelector(
    (state) => state.leaveManagement.totalLeaveStats
  )
  const {searchedIds, active: searchActive} = useSelector(
    (state) => state.leaveManagement.search
  )
  const eventManager = useSelector((state) => state.eventManager)
  const {balance} = useSelector(
    (state) => state.leaveManagement.yearlyLeavesOfInstitute?.data
  )

  const currentUserIid = useSelector(
    (state) => state.currentAdminInfo?.imember_id
  )

  useEffect(() => {
    dispatch(
      getPendingLeaves({
        count: maxSinglePageItems,
        iid: !manage ? [currentUserIid] : searchedIds,
      })
    )
    return () => dispatch(resetPendingLeaves())
  }, [manage, searchActive, searchedIds])

  const loadMoreItems = () => {
    dispatch(
      getPendingLeaves({
        u: pendingLeavesData?.[pendingLeavesData.length - 1]?.u,
        count: maxSinglePageItems,
        iid: !manage ? [currentUserIid] : searchedIds,
      })
    )
  }

  const onApprove = (rowData) => {
    const {type} = rowData
    if (
      type in balance &&
      Number.isInteger(balance[type]) &&
      balance[type] <= 0
    ) {
      dispatch(
        showErrorToast(
          `Can't approve, please update ${LEAVE_TYPE[
            type
          ].toLowerCase()} leave quota`
        )
      )
      return
    }
    dispatch(showApproveModal(rowData))
    eventManager.send_event(events.APPROVE_LEAVE_CLICKED_TFI, {
      employee_name: rowData.name,
      employee_user_id: rowData.id,
      employee_type:
        typeof rowData.rollName === 'object'
          ? rowData.rollName?.props?.children
          : rowData.rollName,
    })
  }

  const onReject = (rowData) => {
    dispatch(showRejectModal(rowData))
    eventManager.send_event(events.REJECT_LEAVE_CLICKED_TFI, {
      employee_name: rowData.name,
      employee_user_id: rowData.id,
      employee_type:
        typeof rowData.rollName === 'object'
          ? rowData.rollName?.props?.children
          : rowData.rollName,
    })
  }

  const onCancel = (rowData) => {
    dispatch(showCancelModal({...rowData, manage}))
    eventManager.send_event(events.CANCEL_LEAVE_CLICKED_TFI, {
      employee_name: rowData.name,
      employee_user_id: rowData.id,
      screen: 'DASHBOARD',
      employee_type:
        typeof rowData.rollName === 'object'
          ? rowData.rollName?.props?.children
          : rowData.rollName,
    })
  }

  const onEdit = (rowData) => {
    const request = !manage && rowData.iid === currentUserIid
    dispatch(
      showEditLeavePopup({
        leave: rowData,
        request,
      })
    )
    eventManager.send_event(
      request
        ? events.EDIT_LEAVE_FOR_SELF_CLICKED_TFI
        : events.EDIT_LEAVE_FOR_EMPLOYEE_CLICKED_TFI,
      {
        employee_name: rowData.name,
        employee_user_id: rowData.id,
        screen: 'DASHBOARD',
        employee_type:
          typeof rowData.rollName === 'object'
            ? rowData.rollName?.props?.children
            : rowData.rollName,
      }
    )
  }

  const onAction = (type, data) => {
    switch (type) {
      case ROW_ACTIONS.CANCEL:
        onCancel(data)
        break
      case ROW_ACTIONS.REJECT:
        onReject(data)
        break
      case ROW_ACTIONS.APPROVE:
        onApprove(data)
        break
      case ROW_ACTIONS.EDIT:
        onEdit(data)
        break
    }
  }

  useEffect(() => {
    const rows = pendingLeavesData?.map((rowData) => {
      return getPendingTableRow({
        rowData,
        onAction,
        showStaffmodal,
        canCancel: (leave) => canCancelPendingLeave({leave}),
        canEdit: (leave) => canEditPendingLeave({leave, manage}),
      })
    })
    setrow(rows)
  }, [pendingLeavesData])

  const showStaffmodal = (rowData) => {
    dispatch(showStaffHsitoryModal(rowData))
    eventManager.send_event(events.VIEW_LEAVE_HISTORY_CLICKED_TFI, {
      employee_name: rowData.name,
      employee_user_id: rowData.id,
      employee_type:
        typeof rowData.rollName === 'object'
          ? rowData.rollName?.props?.children
          : rowData.rollName,
    })
  }

  let leaveCount = ''
  if (searchActive && searchedIds.length == 0) leaveCount = 0
  else if (totalLeaveStats) leaveCount = totalLeaveStats.pending

  return (
    <>
      <FlatAccordion
        titleClass={classNames(styles.pendingAccordionTitle, {
          [styles.accordianBorder]: open,
        })}
        accordionClass={styles.pendingAccordionWrapper}
        title={`${t('pendingRequests')} ${
          leaveCount !== '' ? `- ${leaveCount}` : ''
        } `}
        isOpen={open}
        onClick={() => {
          setopen(!open)
          if (!open)
            eventManager.send_event(events.PENDING_LEAVE_REQUEST_CLICKED_TFI)
        }}
      >
        {(!row?.length && !error) ||
        (searchActive && searchedIds.length == 0) ? (
          <div
            className={`${styles.alignCenter} ${styles.column} ${styles.emptyScreen}`}
          >
            <EmptySvg className={styles.emptysvg} />
            <div className={styles.noRequest}>
              {searchActive
                ? t('noRequestFoundForThisStaff')
                : t('norequestrecievedyet')}
            </div>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            {error ? (
              <ErrorOverlay>
                <div className={classNames(styles.alignCenter, styles.column)}>
                  <>
                    <div>Something went wrong</div>
                    <Button
                      className={styles.retry}
                      onClick={() => {
                        dispatch(
                          getPendingLeaves({
                            u: pendingLeavesData?.[length - 1]?.u,
                            count: maxSinglePageItems,
                          })
                        )
                      }}
                      type="secondary"
                    >
                      {t('retry')}
                    </Button>
                  </>
                </div>
              </ErrorOverlay>
            ) : null}
            <Table
              showHeader
              dynamicSize={true}
              rows={row}
              cols={
                manage
                  ? manageViewPendingLeavesTableHeader
                  : myViewPendingLeavesTableHeader
              }
              itemSize={80}
              uniqueKey="key"
              autoSize
              loadMoreItems={loadMoreItems}
              itemCount={allLoaded ? row?.length : row?.length + 1}
              lazyLoad
              columnStyle={getLeavesTableColumnStyle(
                manage
                  ? manageViewPendingLeavesTableHeader
                  : myViewPendingLeavesTableHeader
              )}
              showLoadMorePlaceholder={loading}
              loadMorePlaceholder={
                <div className={`loader ${styles.loader}`} />
              }
            />
          </div>
        )}
      </FlatAccordion>
    </>
  )
}

export default PendingLeaveRequest
