import {ErrorBoundary} from '@teachmint/common'
import classNames from 'classnames'
import React, {lazy, Suspense, useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {useDispatch, useSelector} from 'react-redux'
import Loader from '../../../../../components/Common/Loader/Loader'
import {IS_MOBILE} from '../../../../../constants'

import {UPCOMING_LEAVE_DURATION} from '../../../LeaveManagement.constant'
import {
  getStaffList,
  getStaffUpcomingLeaves,
  getTotalLeaveStats,
} from '../../../redux/actions/leaveManagement.actions'
import Header from '../../Header/Header'
import LeaveTable from '../LeaveTable/LeaveTable'
import LeaveTabs from '../LeaveTabs/LeaveTabs'
import StaffOnLeaveWithControl from '../StaffOnLeave/listWithControl'
const LeaveSearch = lazy(() => import('../LeaveSearch'))

import styles from './styles.module.scss'

const ManageLeaves = () => {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()
  const {t} = useTranslation()

  const totalLeaveStats = useSelector(
    (state) => state.leaveManagement.totalLeaveStats
  )

  useEffect(() => {
    // get all staff list
    dispatch(getStaffList())
    dispatch(getTotalLeaveStats())
    dispatch(
      getStaffUpcomingLeaves({
        duration: UPCOMING_LEAVE_DURATION.TODAY.value,
      })
    )
    // fallback
    setTimeout(() => setLoading(false), 15 * 1000)
  }, [])

  useEffect(() => {
    const {pending, history} = totalLeaveStats || {}
    if (pending !== undefined || history !== undefined) {
      setLoading(false)
    }
  }, [totalLeaveStats])

  return (
    <>
      <Loader show={loading} />
      <Suspense fallback="Loading...">
        <div
          className={classNames(styles.wrapper, {
            [styles.isMobile]: IS_MOBILE,
          })}
        >
          <div className={styles.staffOnLeave}>
            <StaffOnLeaveWithControl />

            <div className={styles.divider} />
          </div>

          <Header
            text={t('overview')}
            showEditLimit
            className={styles.header}
          />

          <Suspense fallback="Loading...">
            <div className={styles.listWrapper}>
              {!IS_MOBILE && (
                <Suspense>
                  <LeaveSearch />
                </Suspense>
              )}
              <ErrorBoundary>
                {IS_MOBILE ? <LeaveTabs manage /> : <LeaveTable manage />}
              </ErrorBoundary>
            </div>
          </Suspense>
        </div>
      </Suspense>
    </>
  )
}

export default ManageLeaves
