import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useTranslation} from 'react-i18next'
import {Button, Icon, StickyFooter} from '@teachmint/common'
import classNames from 'classnames'
import LinearTabOptions from '../../../../../Common/LinearTabOptions/LinearTabOptions'
import EmptyScreenV1 from '../../../../../Common/EmptyScreenV1/EmptyScreenV1'
import {
  fetchStaffAttendanceWithStatusListAction,
  markStaffAttendanceSubmitRequestAction,
  selectedTabAction,
  staffAttendanceUIManageStatesAction,
} from '../../redux/actions/StaffAttendanceActions'
import StaffUserListSection from '../StaffUserListSection/StaffUserListSection'
import {
  getPresentAbsentListIds,
  getStaffAttendanceStatusList,
  getTabsWiseStaffUserList,
} from './MarkAttendanceSection.utils'
import {events} from '../../../../../../utils/EventsConstants'
import {STAFF_ATTENDANCE_USERS_STATUS_TABS} from '../../StaffAttendanceConstants'
import emptyStaffListImage from '../../../../../../assets/images/dashboard/empty/empty_fee_transaction_report.svg'
import styles from './MarkAttendanceSection.module.css'
import Permission from '../../../../../Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../../../utils/permission.constants'

export default function MarkAttendanceSection() {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const {eventManager} = useSelector((state) => state)
  const [staffFiltersViewListState, setStaffFiltersViewListState] = useState([])
  const [markPresentList, setMarkpresentList] = useState([])
  const [markAbsentList, setMarkAbsentList] = useState([])
  const {
    staffAttendanceSelectedDate: selectedDate,
    staffAttendanceSelectedFiltersData: filter,
    staffFiltersListData,
    staffAttendanceListData,
    staffAttendanceListWithStatusData,
    staffAttendanceStatesManageData,
    selectedDateUTCTimestamp,
    selectedTabValue,
  } = useSelector((state) => state.staffAttendance)

  // Set value of staff present and absent list
  useEffect(() => {
    if (staffFiltersListData && staffFiltersListData.length > 0) {
      const {markedPresentListIds, markedAbsentListIds} =
        getPresentAbsentListIds(staffFiltersListData)
      setMarkpresentList(markedPresentListIds)
      setMarkAbsentList(markedAbsentListIds)
    }
  }, [selectedDate, filter, staffFiltersListData])

  // Submit Staff Attendance data
  const handleSubmittedAttendance = () => {
    const submitParams = {
      date: `${selectedDateUTCTimestamp}`,
      present_list: markPresentList,
      absent_list: markAbsentList,
      from_date: selectedDateUTCTimestamp,
      to_date: selectedDateUTCTimestamp,
      roles: filter.staffRolesNames.toString(),
    }
    eventManager.send_event(events.SAVE_STAFF_ATTENDANCE_CLICKED_TFI, {})
    dispatch(markStaffAttendanceSubmitRequestAction(submitParams))
    const staffAttendanceStatesChanges = {
      isShowMarkAttendance: false,
      isShowMarkAttendanceToggle: false,
      isEditMarkAttendance: false,
    }
    dispatch(staffAttendanceUIManageStatesAction(staffAttendanceStatesChanges))
    dispatch(selectedTabAction(STAFF_ATTENDANCE_USERS_STATUS_TABS[0].id))
  }

  // Staff Attendance list store with status
  useEffect(() => {
    const newStaffAttendanceMapList = getStaffAttendanceStatusList({
      selectedDateUTCTimestamp,
      staffFiltersListData,
      staffAttendanceListData,
    })
    if (newStaffAttendanceMapList && newStaffAttendanceMapList.length > 0) {
      dispatch(
        fetchStaffAttendanceWithStatusListAction(newStaffAttendanceMapList)
      )
    }
  }, [
    selectedDateUTCTimestamp,
    staffFiltersListData,
    staffAttendanceListData,
    staffAttendanceStatesManageData.isEditMarkAttendance,
  ])

  // Get tabs wise staff user list
  useEffect(() => {
    if (staffAttendanceListWithStatusData) {
      const newStaffFilerlist = getTabsWiseStaffUserList({
        selectedTabValue,
        staffAttendanceListWithStatusData,
      })
      setStaffFiltersViewListState(newStaffFilerlist)
    }
  }, [
    staffAttendanceListWithStatusData,
    staffAttendanceListData,
    selectedDate,
    selectedTabValue,
  ])

  const commonStaffListRender = (staffFiltersCollection) => {
    return (
      <StaffUserListSection staffFiltersCollection={staffFiltersCollection} />
    )
  }

  return (
    <div className={classNames(styles.wrapper)}>
      {!staffAttendanceStatesManageData.isEditMarkAttendance &&
        staffAttendanceListData &&
        staffAttendanceListData?.[selectedDateUTCTimestamp]
          ?.staff_attendance_info?.length > 0 && (
          <div className={styles.staffAttendanceTabsMainBlock}>
            <LinearTabOptions
              options={STAFF_ATTENDANCE_USERS_STATUS_TABS}
              selected={selectedTabValue}
              handleChange={(id) => {
                dispatch(selectedTabAction(id))
              }}
              className={styles.staffAttendanceTabsPart}
              shouldTranslation={true}
            />
          </div>
        )}

      <div className={styles.overviewWrapper}>
        {!staffAttendanceStatesManageData.isEditMarkAttendance &&
        staffAttendanceListData &&
        staffAttendanceListData?.[selectedDateUTCTimestamp]
          ?.staff_attendance_info?.length > 0 ? (
          staffFiltersViewListState && staffFiltersViewListState.length > 0 ? (
            <>{commonStaffListRender(staffFiltersViewListState)}</>
          ) : (
            <div className={styles.staffEmptyscreen}>
              <EmptyScreenV1
                image={emptyStaffListImage}
                title={t('noStaffDataFound')}
              />
            </div>
          )
        ) : null}

        {staffAttendanceStatesManageData.isEditMarkAttendance ||
        !staffAttendanceListData ||
        Object.keys(staffAttendanceListData).length == 0 ? (
          staffFiltersListData && staffFiltersListData.length > 0 ? (
            <>{commonStaffListRender(staffFiltersListData)}</>
          ) : (
            <div className={styles.staffEmptyscreen}>
              <EmptyScreenV1
                image={emptyStaffListImage}
                title={t('noStaffDataFound')}
              />
            </div>
          )
        ) : null}

        {(staffAttendanceStatesManageData.isShowMarkAttendance ||
          staffAttendanceStatesManageData.isEditMarkAttendance) && (
          <div className={styles.marksAttendanceSubmitPart}>
            <StickyFooter forSlider={true}>
              <div className={styles.noticeBlock}>
                <div className={styles.markAttendanceInfo}>
                  <Icon
                    color="warning"
                    name="caution"
                    size="m"
                    type="outlined"
                  />
                  <span className={styles.noticeText}>
                    {t('clickOnSaveToMarkAttendance')}
                  </span>
                </div>
              </div>
              <Permission
                permissionId={
                  PERMISSION_CONSTANTS.staffAttendanceController_markAttendance_create
                }
              >
                <Button
                  size="big"
                  className={styles.marksAttendanceSubmitBtn}
                  onClick={() => handleSubmittedAttendance()}
                >
                  {t('save')}
                </Button>
              </Permission>
            </StickyFooter>
          </div>
        )}
      </div>
    </div>
  )
}
