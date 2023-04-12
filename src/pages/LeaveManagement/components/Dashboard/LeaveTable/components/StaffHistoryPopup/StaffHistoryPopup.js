import {Icon, Modal, Table} from '@teachmint/common'
import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import Loader from '../../../../../../../components/Common/Loader/Loader'
import {
  // cancelLeave,
  getStaffHistory,
  hideStaffHsitoryModal,
} from '../../../../../redux/actions/leaveManagement.actions'
import {
  getLeavesTableColumnStyle,
  getStaffHistoryTableRow,
} from '../../table.util'
import defaultUserImage from '../../../../../../../assets/images/icons/user-profile.svg'
import tableStyles from '../../LeaveTable.module.css'
// import TableHeader from '../TableHeader'
import styles from './StaffHistory.module.css'
import {useTranslation} from 'react-i18next'
import LeaveStats from '../../../LeaveStats'
import HorizontalSwiper from '../../../../../../../components/Common/HorizontalSwiper'
import {staffHistoryTableHeader} from '../../../../../LeaveManagement.constant'
import {CreateLeaveButton} from '../../../../LeaveButtons'
import classNames from 'classnames'
import {hasPrecidenceOnRole} from '../../../../../LeaveMangement.permission'

function StaffHistory() {
  const [row, setrow] = useState([])
  const {
    showPopup,
    staffData,
    leaveHistory,
    stats,
    loading,
    maxSinglePageItems,
    allLoaded,
  } = useSelector((state) => state.leaveManagement.staffHistory)
  const {t} = useTranslation()
  const dispatch = useDispatch()

  const currentAdminRoles = useSelector(
    (state) => state.currentAdminInfo?.role_ids
  )

  const hasPrecedence = hasPrecidenceOnRole(currentAdminRoles, staffData?.roles)

  useEffect(() => {
    if (staffData && showPopup) {
      dispatch(
        getStaffHistory({
          iid: [staffData.iid],
          count: maxSinglePageItems,
          u: null,
        })
      )
    }
    return () => {}
  }, [])

  useEffect(() => {
    const rows = leaveHistory?.map((rowData) => {
      return getStaffHistoryTableRow({rowData})
    })
    setrow(rows)
  }, [leaveHistory])

  const loadMoreItems = () => {
    dispatch(
      getStaffHistory({
        u: leaveHistory?.[leaveHistory.length - 1]?.u,
        count: maxSinglePageItems,
        iid: [staffData.iid],
      })
    )
  }
  return (
    <>
      <Loader show={loading} />
      <Modal show={showPopup} className={styles.modalWrapper}>
        <div className={styles.wrapper}>
          <div className={styles.headerwrapper}>
            <div>{t('leaveDetails')}</div>
            <span
              className={styles.closebtn}
              onClick={() => {
                dispatch(hideStaffHsitoryModal())
              }}
            >
              <Icon size={'xs'} name="close" />
            </span>
          </div>
          <div className={styles.statsWrapper}>
            <div className={styles.flex}>
              <img
                className={styles.img}
                src={staffData.img_url || defaultUserImage}
                alt=""
              />
              <div>
                <div className={styles.leavedate}>{staffData.name}</div>
                <div className={styles.staffType}>{staffData.rollName}</div>
              </div>
            </div>
            {hasPrecedence && (
              <div className={styles.flex}>
                <CreateLeaveButton
                  eventData={{screen: 'USER_DETAILS'}}
                  staff={staffData}
                  onClick={() => dispatch(hideStaffHsitoryModal())}
                />
              </div>
            )}
          </div>

          <HorizontalSwiper
            sideSpan={0}
            className={styles.newStatsWrapperPopup}
          >
            <LeaveStats stats={stats} />
          </HorizontalSwiper>

          {leaveHistory ? (
            <div
              className={classNames(
                tableStyles.tableWrapper,
                styles.tableWrapper
              )}
            >
              <Table
                showHeader
                dynamicSize={true}
                rows={row}
                cols={staffHistoryTableHeader}
                itemSize={72}
                uniqueKey="key"
                autoSize
                loadMoreItems={loadMoreItems}
                itemCount={allLoaded ? row?.length : row?.length + 1}
                lazyLoad
                columnStyle={getLeavesTableColumnStyle(staffHistoryTableHeader)}
                showLoadMorePlaceholder={loading}
                loadMorePlaceholder={
                  <div className={`loader ${styles.loader}`} />
                }
              />
            </div>
          ) : (
            <div className={styles.empty}>{t('noLeaveAppliedYet')}</div>
          )}
        </div>
      </Modal>
    </>
  )
}

export default StaffHistory
