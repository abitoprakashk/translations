import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useTranslation} from 'react-i18next'
import SearchBox from '../../../../../Common/SearchBox/SearchBox'
import {
  fetchStaffListFiltersRequestAction,
  staffAttendanceUIManageStatesAction,
  storeStaffAttendanceSearchTerm,
} from '../../redux/actions/StaffAttendanceActions'
import {newStaffFilterCollectionList} from '../../commonFunctions'
import {
  getAttendanceButtonRender,
  updateViewAttendanceButtonRender,
} from './TopSectionSearchBar.utils'
import {events} from '../../../../../../utils/EventsConstants'
import {STAFF_ATTENDANCE_STATUS} from '../../StaffAttendanceConstants'
import styles from './TopSectionSearchBar.module.css'

export default function TopSectionSearchBar() {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const {eventManager} = useSelector((state) => state)
  const {
    staffFiltersListData,
    staffAttendanceListData,
    staffAttendanceListWithStatusData,
    staffAttendanceStatesManageData,
    staffSearchText,
  } = useSelector((state) => state.staffAttendance)

  // Search value set
  const handleSearchFilter = (text) => {
    dispatch(storeStaffAttendanceSearchTerm(text))
  }

  // Click on Mark Attendance Button
  const handleAttendancePart = () => {
    const staffAttendanceStatesChanges = {
      isShowMarkAttendance: true,
      isShowMarkAttendanceToggle: true,
    }
    dispatch(staffAttendanceUIManageStatesAction(staffAttendanceStatesChanges))
    eventManager.send_event(events.MARK_STAFF_ATTENDANCE_CLICKED_TFI, {})
  }

  // Click on Mark all Absent button
  const handleMarkAllAbsent = () => {
    const staffAttendanceStatesChanges = {
      isAllPresentAbsentAttendance: true,
    }
    dispatch(staffAttendanceUIManageStatesAction(staffAttendanceStatesChanges))
    if (staffFiltersListData) {
      const newStaffAbsentListData = newStaffFilterCollectionList(
        staffFiltersListData,
        STAFF_ATTENDANCE_STATUS.ABSENT
      )
      dispatch(fetchStaffListFiltersRequestAction(newStaffAbsentListData))
    }
    eventManager.send_event(events.MARK_ALL_STAFF_ABSENT_CLICKED_TFI, {})
  }

  // Click on Mark all Present button
  const handleMarkAllPresent = () => {
    const staffAttendanceStatesChanges = {
      isAllPresentAbsentAttendance: false,
    }
    dispatch(staffAttendanceUIManageStatesAction(staffAttendanceStatesChanges))
    if (staffFiltersListData) {
      const newStaffPresentListData = newStaffFilterCollectionList(
        staffFiltersListData,
        STAFF_ATTENDANCE_STATUS.PRESENT
      )
      dispatch(fetchStaffListFiltersRequestAction(newStaffPresentListData))
    }
    eventManager.send_event(events.MARK_ALL_STAFF_PRESENT_CLICKED_TFI, {})
  }

  // Click on Update Attendance button
  const handleUpdateAttendancePart = () => {
    const staffAttendanceStatesChanges = {
      isEditMarkAttendance: true,
      isMarkAttendanceUpdateView: true,
    }
    dispatch(staffAttendanceUIManageStatesAction(staffAttendanceStatesChanges))
    if (staffAttendanceListWithStatusData) {
      dispatch(
        fetchStaffListFiltersRequestAction(staffAttendanceListWithStatusData)
      )
      eventManager.send_event(events.UPDATE_STAFF_ATTENDANCE_CLICKED_TFI, {})
    }
  }

  // Click on Cancel button
  const handleViewAttendancePart = () => {
    const staffAttendanceStatesChanges = {
      isShowMarkAttendance: false,
      isShowMarkAttendanceToggle: false,
      isEditMarkAttendance: false,
      isMarkAttendanceUpdateView: false,
    }
    dispatch(staffAttendanceUIManageStatesAction(staffAttendanceStatesChanges))
  }

  // Show/Hide Buttons
  const updateViewAttendanceButtonLoad = updateViewAttendanceButtonRender({
    staffAttendanceStatesManageData,
    staffAttendanceListData,
    handleAttendancePart,
    handleUpdateAttendancePart,
    handleViewAttendancePart,
  })

  const getAttendanceButtonLoad = getAttendanceButtonRender({
    staffAttendanceStatesManageData,
    handleMarkAllAbsent,
    handleMarkAllPresent,
  })

  return (
    <div>
      <div className={styles.searchContainer}>
        <SearchBox
          value={staffSearchText}
          placeholder={t('searchByNameOrRoles')}
          handleSearchFilter={handleSearchFilter}
        />
      </div>
      <div className={styles.markAttendanceButtonBlock}>
        <>{updateViewAttendanceButtonLoad}</>
        <>{getAttendanceButtonLoad}</>
      </div>
    </div>
  )
}
