import {useEffect, useState} from 'react'
import {VirtualizedLazyList} from '@teachmint/common'
import {useDispatch, useSelector} from 'react-redux'
import {
  getPendingLeaves,
  resetPendingLeaves,
} from '../../../../../redux/actions/leaveManagement.actions'
import {ReactComponent as EmptySvg} from '../../../../assets/leavemanagement_empty.svg'
import styles from './LeaveList.module.scss'
import {useTranslation} from 'react-i18next'
import LeaveCard from './LeaveCard'
import {LEAVE_BASE_TYPE} from '../../../../../LeaveManagement.constant'
import classNames from 'classnames'

const PendingLeaveList = ({manage = false}) => {
  const [row, setrow] = useState([])
  const dispatch = useDispatch()
  const {t} = useTranslation()
  const {
    loading,
    data: pendingLeavesData,
    maxSinglePageItems,
    allLoaded,
  } = useSelector((state) => state.leaveManagement.pendingLeaves)

  const currentUserIid = useSelector(
    (state) => state.currentAdminInfo?.imember_id
  )

  const {searchedIds, active: searchActive} = useSelector(
    (state) => state.leaveManagement.search
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

  useEffect(() => {
    setrow(pendingLeavesData)
  }, [pendingLeavesData])

  const loadMoreItems = () => {
    dispatch(
      getPendingLeaves({
        u: pendingLeavesData?.[pendingLeavesData.length - 1]?.u,
        count: maxSinglePageItems,
        iid: !manage ? [currentUserIid] : searchedIds,
      })
    )
  }

  const RowJSX = ({item}) => (
    <LeaveCard type={LEAVE_BASE_TYPE.PENDING} item={item} manage={manage} />
  )

  return (
    <div
      className={classNames(styles.listwrapper, styles.pending, {
        [styles.manage]: manage,
      })}
    >
      {!row?.length || (searchActive && searchedIds.length == 0) ? (
        <div className={`${styles.column} ${styles.emptyScreen}`}>
          <EmptySvg className={styles.emptysvg} />
          <div className={styles.noRequest}>
            {searchActive
              ? t('noRequestFoundForThisStaff')
              : t('norequestrecievedyet')}
          </div>
        </div>
      ) : (
        <VirtualizedLazyList
          itemCount={allLoaded ? row?.length : row?.length + 1}
          itemSize={85}
          loadMoreItems={loadMoreItems}
          rowsData={row}
          dynamicSize={true}
          RowJSX={RowJSX}
          loadMorePlaceholder={<div className={`loader ${styles.loader}`} />}
          showLoadMorePlaceholder={loading}
        />
      )}
    </div>
  )
}

export default PendingLeaveList
