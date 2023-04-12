import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useTranslation} from 'react-i18next'
import {Card, Tag, ToggleSwitch} from '@teachmint/common'
import classNames from 'classnames'
import UserProfile from '../../../../../Common/UserProfile/UserProfile'
import EmptyScreenV1 from '../../../../../Common/EmptyScreenV1/EmptyScreenV1'
import {fetchStaffListFiltersRequestAction} from '../../redux/actions/StaffAttendanceActions'
import {STAFF_ATTENDANCE_STATUS} from '../../StaffAttendanceConstants'
import emptyStaffListImage from '../../../../../../assets/images/dashboard/empty/empty_fee_transaction_report.svg'
import styles from './StaffUserListSection.module.css'

export default function StaffUserListSection({staffFiltersCollection}) {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const {
    staffFiltersListData,
    staffAttendanceListData,
    staffAttendanceStatesManageData,
    staffSearchText,
    selectedDateUTCTimestamp,
  } = useSelector((state) => state.staffAttendance)
  // Get roles names
  const getRoleNames = (roles) => {
    let roleName = roles ? roles : '-'
    return roleName
  }
  // Toggle changes event
  const handleIndividuleToggle = (checked, _id) => {
    const invToggleUpdate = checked
      ? STAFF_ATTENDANCE_STATUS.PRESENT
      : STAFF_ATTENDANCE_STATUS.ABSENT
    const updateAttendanceCollect = staffFiltersListData
      ? [...staffFiltersListData]
      : []
    const index = updateAttendanceCollect.findIndex((user) => user._id === _id)
    updateAttendanceCollect[index] = {
      ...updateAttendanceCollect[index],
      status: invToggleUpdate,
    }
    dispatch(fetchStaffListFiltersRequestAction(updateAttendanceCollect))
  }
  // Staff user list data
  const newSelectedFiltersData = staffFiltersCollection
    .filter((staffFiltersList) => {
      if (staffSearchText) {
        return (
          staffFiltersList?.name
            .toLowerCase()
            .includes(staffSearchText.toLowerCase()) ||
          staffFiltersList?.roles
            .toLowerCase()
            .includes(staffSearchText.toLowerCase())
        )
      }
      return true
    })
    .map(({_id, name, img_url, roles, status}, index) => {
      const staffDesignation = getRoleNames(roles)
      return (
        <div key={`${_id}_${index}`}>
          <Card className={classNames(styles.todayAttendanceCard)}>
            <div className={styles.statsItem}>
              <div className={styles.attendanceUserProfile}>
                <UserProfile
                  image={img_url}
                  name={name}
                  phoneNumber={staffDesignation}
                />
              </div>
              {!staffAttendanceStatesManageData.isEditMarkAttendance &&
                staffAttendanceListData &&
                staffAttendanceListData?.[selectedDateUTCTimestamp]
                  ?.staff_attendance_info?.length > 0 && (
                  <div className={styles.attendancePresentAbsentTagBl}>
                    <Tag
                      accent={
                        status == STAFF_ATTENDANCE_STATUS.PRESENT
                          ? 'success'
                          : status == STAFF_ATTENDANCE_STATUS.ABSENT
                          ? 'danger'
                          : null
                      }
                      content={
                        status == STAFF_ATTENDANCE_STATUS.PRESENT
                          ? t('present')
                          : status == STAFF_ATTENDANCE_STATUS.ABSENT
                          ? t('absent')
                          : t('notMarked')
                      }
                    />
                  </div>
                )}
              {(staffAttendanceStatesManageData.isShowMarkAttendanceToggle ||
                staffAttendanceStatesManageData.isEditMarkAttendance) && (
                <div className={styles.attendanceTogglePart}>
                  <div
                    className={classNames(styles.atteToggleText, {
                      [styles.togglePresentRed]:
                        status == STAFF_ATTENDANCE_STATUS.ABSENT ||
                        status == STAFF_ATTENDANCE_STATUS.NOT_MARKED,
                      [styles.togglePresentGreen]:
                        status == STAFF_ATTENDANCE_STATUS.PRESENT,
                    })}
                  >
                    {status == STAFF_ATTENDANCE_STATUS.ABSENT ||
                    status == STAFF_ATTENDANCE_STATUS.NOT_MARKED
                      ? 'A'
                      : 'P'}
                  </div>
                  <ToggleSwitch
                    id={`markToggleId${index}`}
                    checked={
                      status == STAFF_ATTENDANCE_STATUS.PRESENT ? true : false
                    }
                    onChange={(checked) => handleIndividuleToggle(checked, _id)}
                    className={styles.cstToggleSwitch}
                  />
                </div>
              )}
            </div>
          </Card>
        </div>
      )
    })

  return newSelectedFiltersData && newSelectedFiltersData.length > 0 ? (
    <div className={styles.statsContainer}>{newSelectedFiltersData}</div>
  ) : (
    <div className={styles.staffEmptyscreen}>
      <EmptyScreenV1
        image={emptyStaffListImage}
        title={t('noStaffDataFound')}
      />
    </div>
  )
}
