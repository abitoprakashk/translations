import {ErrorBoundary} from '@teachmint/common'
import classNames from 'classnames'
import React, {lazy, Suspense, useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {useDispatch, useSelector} from 'react-redux'
import HorizontalSwiper from '../../../../../components/Common/HorizontalSwiper'
import Loader from '../../../../../components/Common/Loader/Loader'
import {IS_MOBILE} from '../../../../../constants'
import {UPCOMING_LEAVE_DURATION} from '../../../LeaveManagement.constant'
import {
  getCurrentUserLeaveStats,
  getStaffUpcomingLeaves,
  getTotalLeaveStats,
} from '../../../redux/actions/leaveManagement.actions'
import Header from '../../Header/Header'
import LeaveStats from '../LeaveStats'
import StaffOnLeaveWithControl from '../StaffOnLeave/listWithControl'

import styles from './styles.module.scss'

const LeaveTable = lazy(() => import('../LeaveTable/LeaveTable'))
const LeaveTabs = lazy(() => import('../LeaveTabs/LeaveTabs'))
const EmptyLeave = lazy(() => import('../EmptyLeave'))

const MyLeaves = () => {
  const [loading, setLoading] = useState(true)
  const [haveLeaves, setHaveLeaves] = useState(false)
  const dispatch = useDispatch()
  const {t} = useTranslation()

  const {data: myLeaveStats} = useSelector(
    (state) => state.leaveManagement.currentUserLeaveInfo
  )

  const totalLeaveStats = useSelector(
    (state) => state.leaveManagement.totalLeaveStats
  )

  const iid = useSelector((state) => state.currentAdminInfo?.imember_id)

  useEffect(() => {
    dispatch(getTotalLeaveStats({iid}))
    dispatch(getCurrentUserLeaveStats({iid}))
    dispatch(
      getStaffUpcomingLeaves({
        duration: UPCOMING_LEAVE_DURATION.TODAY.value,
        iid,
      })
    )
    // fallback
    setTimeout(() => setLoading(false), 15 * 1000)
  }, [])

  useEffect(() => {
    const {pending, history} = totalLeaveStats || {}
    if (pending !== undefined || history !== undefined) {
      setHaveLeaves((pending || history) > 0)
      setLoading(false)
    }
  }, [totalLeaveStats])

  return (
    <>
      <Loader show={loading} />
      <Suspense fallback="Loading...">
        {haveLeaves ? (
          <div
            className={classNames(styles.wrapper, {
              [styles.isMobile]: IS_MOBILE,
            })}
          >
            <div className={styles.staffUpcomingLeave}>
              <StaffOnLeaveWithControl
                iid={iid}
                heading={t('upcomingLeaves')}
                upcoming
              />
            </div>
            <Header text={t('overview')} myLeave className={styles.header} />
            <HorizontalSwiper
              sideSpan={IS_MOBILE ? 16 : 20}
              className={styles.statsWrapper}
            >
              <LeaveStats stats={myLeaveStats} className={styles.leaveStats} />
            </HorizontalSwiper>

            <Suspense fallback="Loading...">
              <div className={styles.listWrapper}>
                <ErrorBoundary>
                  {IS_MOBILE ? <LeaveTabs /> : <LeaveTable />}
                </ErrorBoundary>
              </div>
            </Suspense>
          </div>
        ) : (
          <EmptyLeave />
        )}
      </Suspense>
    </>
  )
}

export default MyLeaves
