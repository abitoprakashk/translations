import {Icon, Modal, VirtualizedLazyList} from '@teachmint/common'
import classNames from 'classnames'
import React, {useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {useDispatch, useSelector} from 'react-redux'
import HorizontalSwiper from '../../../../../../../components/Common/HorizontalSwiper'
import Loader from '../../../../../../../components/Common/Loader/Loader'
import {CreateLeaveButton} from '../../../../LeaveButtons'

import {
  getStaffHistory,
  hideStaffHsitoryModal,
} from '../../../../../redux/actions/leaveManagement.actions'
import LeaveStats from '../../../LeaveStats'
import styles from './StaffHistory.module.css'
import PopupLeaveInfo from '../../../LeaveTabs/components/LeaveDetailsPopup/PopupLeaveInfo'
import BottomStatsInfo from '../../../LeaveTabs/components/LeaveDetailsPopup/BottomStatsInfo'
import {hasPrecidenceOnRole} from '../../../../../LeaveMangement.permission'

function StaffHistoryList() {
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

  const currentAdminRoles = useSelector(
    (state) => state.currentAdminInfo?.role_ids
  )

  const hasPrecedence = hasPrecidenceOnRole(currentAdminRoles, staffData?.roles)

  const dispatch = useDispatch()
  const {t} = useTranslation()

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
  }, [])

  useEffect(() => {
    setrow(leaveHistory)
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

  const Row = ({item}) => {
    return (
      <div className={styles.cardWrapper}>
        <div className={styles.card}>
          <PopupLeaveInfo leave={item} manage alert={false} />
          <hr />
          <BottomStatsInfo leave={item} />
        </div>
      </div>
    )
  }

  return (
    <>
      <Loader show={loading} />
      <Modal
        show={showPopup}
        className={classNames(styles.modalWrapper, styles.bg, styles.mobile)}
        wrapperClassName={styles.flexStart}
        // widthInPercent={60}
      >
        <div className={styles.wrapper}>
          <div className={styles.headerwrapper}>
            <div>
              {staffData.name} - {t('details')}
            </div>
            <span
              className={styles.closebtn}
              onClick={() => {
                dispatch(hideStaffHsitoryModal())
              }}
            >
              <Icon size={'xs'} name="close" />
            </span>
          </div>

          <HorizontalSwiper sideSpan={16} className={styles.negativeMarginY}>
            <LeaveStats stats={stats} className={styles.newStatsWrapper} />
          </HorizontalSwiper>

          <div className={classNames(styles.flex, styles.historywrapper)}>
            <div className={styles.statsNumber}>{t('details')}</div>
            {hasPrecedence && (
              <CreateLeaveButton
                eventData={{screen: 'USER_DETAILS'}}
                type="border"
                className={styles.btn}
                iconColor="primary"
                staff={staffData}
                onClick={() => dispatch(hideStaffHsitoryModal())}
              />
            )}
          </div>
          <div className={styles.listWrapper}>
            {leaveHistory && (
              <VirtualizedLazyList
                itemCount={allLoaded ? row?.length : row?.length + 1}
                itemSize={300}
                dynamicSize={true}
                loadMoreItems={loadMoreItems}
                rowsData={row}
                RowJSX={Row}
                loadMorePlaceholder={
                  <div className={`loader ${styles.loader}`} />
                }
                showLoadMorePlaceholder={loading}
              />
            )}
          </div>
        </div>
      </Modal>
    </>
  )
}

export default StaffHistoryList
