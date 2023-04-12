import {Button, ErrorOverlay, FlatAccordion, Table} from '@teachmint/common'
import React, {useEffect, useState} from 'react'
import {ReactComponent as EmptySvg} from '../../../../assets/leavemanagement_empty.svg'
import {useDispatch, useSelector} from 'react-redux'
import {
  getLeavesTableColumnStyle,
  getPastTableRow,
  ROW_ACTIONS,
} from '../../table.util'
import {
  getPastLeaves,
  resetPastLeaves,
  showCancelModal,
  showEditLeavePopup,
  showStaffHsitoryModal,
} from '../../../../../redux/actions/leaveManagement.actions'
import styles from '../../LeaveTable.module.css'
import {events} from '../../../../../../../utils/EventsConstants'
import {useTranslation} from 'react-i18next'
import classNames from 'classnames'
import {
  manageViewPastLeavesTableHeader,
  myViewPastLeavesTableHeader,
} from '../../../../../LeaveManagement.constant'
import useRoleFilter from '../../../../../../../hooks/useRoleFilter'
import {
  canCancelPastLeave,
  canEditPastLeave,
} from '../../../../../LeaveMangement.permission'

function PastLeaveRequest({manage = false}) {
  const [open, setopen] = useState(false)
  const [row, setrow] = useState([])
  const dispatch = useDispatch()
  const {t} = useTranslation()

  const {
    loading,
    data: pastLeavesData,
    maxSinglePageItems,
    allLoaded,
    error,
  } = useSelector((state) => state.leaveManagement.pastLeaves)
  const totalLeaveStats = useSelector(
    (state) => state.leaveManagement.totalLeaveStats
  )
  const {searchedIds, active: searchActive} = useSelector(
    (state) => state.leaveManagement.search
  )

  const eventManager = useSelector((state) => state.eventManager)

  const currentUserIid = useSelector(
    (state) => state.currentAdminInfo?.imember_id
  )
  const currentUserRoles = useSelector(
    (state) => state.currentAdminInfo?.role_ids
  )

  const [canManageLeave] = useRoleFilter()

  useEffect(() => {
    dispatch(
      getPastLeaves({
        count: maxSinglePageItems,
        iid: !manage ? [currentUserIid] : searchedIds,
      })
    )
    return () => dispatch(resetPastLeaves())
  }, [manage, searchActive, searchedIds])

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
      case ROW_ACTIONS.EDIT:
        onEdit(data)
        break
    }
  }

  useEffect(() => {
    const rows = pastLeavesData?.map((rowData) => {
      return getPastTableRow({
        rowData,
        showStaffmodal,
        onAction,
        canCancel: (leave) =>
          canCancelPastLeave({
            leave,
            manage,
            canManageLeave,
            operator: {roles: currentUserRoles, iid: currentUserIid},
          }),
        canEdit: (leave) =>
          canEditPastLeave({
            leave,
            manage,
            canManageLeave,
            operator: {roles: currentUserRoles, iid: currentUserIid},
          }),
      })
    })
    setrow(rows)
  }, [pastLeavesData])

  const loadMoreItems = () => {
    dispatch(
      getPastLeaves({
        u: pastLeavesData?.[pastLeavesData.length - 1]?.u,
        count: maxSinglePageItems,
        iid: !manage ? [currentUserIid] : searchedIds,
      })
    )
  }

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
  else if (totalLeaveStats) leaveCount = totalLeaveStats.history

  return (
    <FlatAccordion
      titleClass={classNames(styles.pastAccordionTitle, {
        [styles.accordianBorder]: open,
        [styles.borderRadius]: !open,
      })}
      accordionClass={styles.pendingAccordionWrapper}
      title={`${t('pastLeaves')} ${
        leaveCount !== '' ? `- ${leaveCount}` : ''
      } `}
      isOpen={open}
      onClick={() => {
        setopen(!open)
        if (!open) eventManager.send_event(events.PAST_LEAVES_CLICKED_TFI)
      }}
    >
      {(!row?.length && !error) || (searchActive && searchedIds.length == 0) ? (
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
                        getPastLeaves({
                          u: pastLeavesData?.[length - 1]?.u,
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
                ? manageViewPastLeavesTableHeader
                : myViewPastLeavesTableHeader
            }
            itemSize={72}
            uniqueKey="key"
            autoSize
            loadMoreItems={loadMoreItems}
            itemCount={allLoaded ? row?.length : row?.length + 1}
            lazyLoad
            columnStyle={getLeavesTableColumnStyle(
              manage
                ? manageViewPastLeavesTableHeader
                : myViewPastLeavesTableHeader
            )}
            showLoadMorePlaceholder={loading}
            loadMorePlaceholder={<div className={`loader ${styles.loader}`} />}
          />
        </div>
      )}
    </FlatAccordion>
  )
}

export default PastLeaveRequest
