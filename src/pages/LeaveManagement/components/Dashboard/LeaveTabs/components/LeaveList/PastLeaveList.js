import {useEffect, useState} from 'react'
import {VirtualizedLazyList} from '@teachmint/common'
import {useDispatch, useSelector} from 'react-redux'
import {
  getPastLeaves,
  resetPastLeaves,
} from '../../../../../redux/actions/leaveManagement.actions'
import {LEAVE_BASE_TYPE} from '../../../../../LeaveManagement.constant'
import {ReactComponent as EmptySvg} from '../../../../assets/leavemanagement_empty.svg'
import styles from './LeaveList.module.scss'
import {useTranslation} from 'react-i18next'
import LeaveCard from './LeaveCard'
import classNames from 'classnames'

const PastLeaveList = ({manage = false}) => {
  const [row, setrow] = useState([])
  const dispatch = useDispatch()
  const {t} = useTranslation()
  const {
    loading,
    data: pastLeavesData,
    maxSinglePageItems,
    allLoaded,
  } = useSelector((state) => state.leaveManagement.pastLeaves)

  const currentUserIid = useSelector(
    (state) => state.currentAdminInfo?.imember_id
  )

  const {searchedIds, active: searchActive} = useSelector(
    (state) => state.leaveManagement.search
  )

  useEffect(() => {
    dispatch(
      getPastLeaves({
        count: maxSinglePageItems,
        iid: !manage ? [currentUserIid] : searchedIds,
      })
    )
    return () => dispatch(resetPastLeaves())
  }, [manage, searchActive, searchedIds])

  useEffect(() => {
    setrow(pastLeavesData)
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

  const RowJSX = ({item}) => (
    <LeaveCard type={LEAVE_BASE_TYPE.PAST} item={item} manage={manage} />
  )

  return (
    <div
      className={classNames(styles.listwrapper, styles.past, {
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
          dynamicSize={true}
          loadMoreItems={loadMoreItems}
          rowsData={row}
          RowJSX={RowJSX}
          loadMorePlaceholder={<div className={`loader ${styles.loader}`} />}
          showLoadMorePlaceholder={loading}
        />
      )}
    </div>
  )
}

export default PastLeaveList
