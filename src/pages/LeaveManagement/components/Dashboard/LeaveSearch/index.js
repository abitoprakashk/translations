import {ErrorBoundary} from '@teachmint/common'
import classNames from 'classnames'
import React, {memo, useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import SearchBox from '../../../../../components/Common/SearchBox/SearchBox'
import {useDebouncedValue} from '../../../../AttendanceReport/hooks/useDebouncedValue'
import {
  getTotalLeaveStats,
  searchStaff,
} from '../../../redux/actions/leaveManagement.actions'

import styles from './styles.module.css'

const EMPTY_ARRAY = []

const LeaveSearch = memo(({mobile = false}) => {
  const dispatch = useDispatch()
  const [term, setTerm] = useState('')

  const [value] = useDebouncedValue(term.trim())
  const {staffList, searchedIds} = useSelector(
    (state) => state.leaveManagement.search
  )
  const currentUserIId = useSelector(
    (state) => state.currentAdminInfo?.imember_id
  )

  useEffect(() => {
    return () => {
      dispatch(searchStaff({staffIds: EMPTY_ARRAY, active: false}))
    }
  }, [])

  useEffect(() => {
    if (value.length < 2) {
      dispatch(searchStaff({staffIds: EMPTY_ARRAY, active: false}))
      dispatch(getTotalLeaveStats())
      return
    }

    const ids = staffList
      .filter(({name}) => name?.toLowerCase().includes(value.toLowerCase()))
      .filter(({_id}) => _id != currentUserIId)
      .map(({_id}) => _id)

    const initial = new Set(searchedIds)
    const now = new Set(ids)

    let intersect = new Set([...initial].filter((i) => now.has(i)))

    // only dispatch if ids has changed
    if (intersect.size != initial.size || intersect.size != now.size) {
      dispatch(getTotalLeaveStats({iid: ids}))
      dispatch(searchStaff({staffIds: ids, active: true}))
    } else {
      dispatch(searchStaff({active: !!value.length}))
    }
  }, [value])

  return (
    <ErrorBoundary>
      <div
        className={classNames(styles.searchWrapper, {[styles.mobile]: mobile})}
      >
        <SearchBox
          value={term}
          placeholder="Search..."
          handleSearchFilter={(value) => setTerm(value)}
        />

        {!mobile && <div id="leaveManagementButtons" />}
      </div>
    </ErrorBoundary>
  )
})

LeaveSearch.displayName = 'LeaveSearch'

export default LeaveSearch
