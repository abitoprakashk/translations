import React from 'react'
import {useTranslation} from 'react-i18next'
import {Divider, Icon, ICON_CONSTANTS} from '@teachmint/krayon'
import styles from './AttendanceGraph.module.css'
import WidgetShimmer from '../../WidgetShimmer/WidgetShimmer'
import {createNewCommunicationAction} from '../../../../pages/communication/redux/actions/commonActions'
import {useDispatch, useSelector} from 'react-redux'
import {events} from '../../../../utils/EventsConstants'
import {SORT_TYPE} from '../../../../pages/AttendanceReport/AttendanceReport.constant'
import {handleClassSort} from '../../../../pages/AttendanceReport/pages/Overview/utils/utils'
import Permission from '../../../Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../utils/permission.constants'

const NotMarkedTable = ({
  teachersIdNotMarkedClasses,
  tableRowsNotMarked,
  rows,
  error,
  setShowTable,
  rowsMarked,
  formattedDate,
}) => {
  const {common} = useSelector((state) => state.communicationInfo)
  const {eventManager, adminInfo} = useSelector((state) => state)
  const dispatch = useDispatch()
  const {t} = useTranslation()
  const postAnnouncement = async () => {
    eventManager.send_event(
      events.DASHBOARD_REPORTS_NOTIFY_CLASS_TEACHER_CLICKED_TFI
    )
    let obj = {...common, draft: false}
    ;(obj.title = t('pendingClassAttendanceAnnouncementTitle')),
      (obj.message = t('pendingClassAttendanceAnnouncementDescription', {
        formattedDate: formattedDate,
      })),
      (obj.creator_id = adminInfo._id),
      (obj.selected_users = teachersIdNotMarkedClasses),
      (obj.source = 'classAttendanceWidget'),
      (obj.module = 'classAttendanceWidget')
    dispatch(createNewCommunicationAction(obj))
    setShowTable(false)
  }

  const sortedTableRowData = handleClassSort({
    type: SORT_TYPE.ASC,
    data: tableRowsNotMarked,
    key: 'name',
  })

  const getTable = (tableRowsNotMarked, rows, error) => {
    if (error) {
      return (
        <div className={styles.noAttendanceMarkedError}>
          {t('couldNotLoadTryAgain')}
        </div>
      )
    } else {
      if (!rows && !error) {
        return <WidgetShimmer shimmerCount={5} />
      } else {
        if (tableRowsNotMarked?.length > 0) {
          return (
            <div className={styles.noAttendanceMarkedTable}>
              {rows &&
                tableRowsNotMarked &&
                tableRowsNotMarked?.map((item) => (
                  <div key={item?.id}>
                    <div className={styles.tableRowClass}>
                      {item?.name || ''}
                    </div>
                    <div className={styles.tableRowTeacher}>{`${t(
                      'classTeacher'
                    )} - ${item?.teacher || ''}`}</div>
                    <Divider spacing="16px" className={styles.divider} />
                  </div>
                ))}
              {rows && tableRowsNotMarked && (
                <Permission
                  permissionId={
                    PERMISSION_CONSTANTS.communicationController_announcement_create
                  }
                >
                  <div className={styles.notificationContainer}>
                    <Icon
                      name="notificationsActive"
                      size={ICON_CONSTANTS.SIZES.XX_SMALL}
                      type={ICON_CONSTANTS.TYPES.INVERTED}
                    />
                    <div
                      onClick={() => postAnnouncement()}
                      className={styles.notificationContainerText}
                    >
                      {t('notificationTextClassTeacher')}
                    </div>
                  </div>
                </Permission>
              )}
            </div>
          )
        } else {
          return (
            <div className={styles.noAttendanceMarkedText}>
              {rowsMarked ? t('attendanceMarkedToday') : t('dataNotFound')}
            </div>
          )
        }
      }
    }
  }

  return <div>{getTable(sortedTableRowData, rows, error)}</div>
}

export default NotMarkedTable
