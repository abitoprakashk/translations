import {
  Button,
  BUTTON_CONSTANTS,
  Checkbox,
  CHECKBOX_CONSTANTS,
} from '@teachmint/krayon'
import classNames from 'classnames'
import React, {useCallback} from 'react'
import {useTranslation} from 'react-i18next'
import {useDispatch, useSelector} from 'react-redux'
import {IS_MOBILE} from '../../../../../../constants'
import {events} from '../../../../../../utils/EventsConstants'
import {PERMISSION_CONSTANTS} from '../../../../../../utils/permission.constants'
import Permission from '../../../../../Common/Permission/Permission'
import {updateAllAttendance} from '../../redux/actions/StaffAttendanceActions'
import {
  ATTENDANCE_DAY_STATS,
  ATTENDANCE_VIEW_TYPE,
  STAFF_ATTENDANCE_STATUS,
} from '../../StaffAttendanceConstants'
import EditAttendanceButton from '../Buttons/EditAttendanceButton'

import styles from './styles.module.css'

const {PRESENT, ABSENT, TOTAL_STAFF, NOT_MARKED} = ATTENDANCE_VIEW_TYPE

const AttendanceViewTypeFilter = React.memo(
  ({
    active,
    counts = {},
    onClick,
    selectAll,
    setSelectAll,
    showEditButton,
    editing,
    isFilterActive = false,
  }) => {
    const {t} = useTranslation()
    const dispatch = useDispatch()
    const todayStatus = useSelector(
      (state) => state.staffAttendance.todayStatus
    )
    const selectedDateUTCTimestamp = useSelector(
      (state) => state.staffAttendance.selectedDateUTCTimestamp
    )
    const eventManager = useSelector((state) => state.eventManager)

    const handleClick = useCallback(
      (e) => {
        const viewType = e.currentTarget?.dataset.type
        onClick(viewType)
        let eventType = ''
        if (viewType === TOTAL_STAFF)
          eventType = events.STAFF_ATTENDANCE_TOTAL_STAFF_TAB_CLICKED_TFI

        if (viewType === PRESENT)
          eventType = events.STAFF_ATTENDANCE_PRESENT_STAFF_TAB_CLICKED_TFI

        if (viewType === ABSENT)
          eventType = events.STAFF_ATTENDANCE_ABSENT_STAFF_TAB_CLICKED_TFI

        if (viewType === NOT_MARKED)
          eventType = events.STAFF_ATTENDANCE_NOT_MARKED_STAFF_TAB_CLICKED_TFI

        eventManager.send_event(eventType, {
          attendance_date: selectedDateUTCTimestamp,
        })
      },
      [onClick, eventManager]
    )

    const btnSize = IS_MOBILE
      ? BUTTON_CONSTANTS.SIZE.SMALL
      : BUTTON_CONSTANTS.SIZE.MEDIUM

    const renderWithCount = useCallback(
      (label, staffCount) => {
        if (isFilterActive) return t(label)
        else {
          return `${t(label)} - ${staffCount}`
        }
      },
      [t, isFilterActive]
    )

    return (
      <div
        className={classNames(styles.viewTypeFilterBlock, styles.flex, {
          [styles.mobile]: IS_MOBILE,
        })}
      >
        <Button
          classes={{
            button: classNames({
              [styles.mobileBtn]: IS_MOBILE,
              [styles.btn]: TOTAL_STAFF !== active,
              [styles.noWrap]: TOTAL_STAFF === active,
            }),
          }}
          data-type={TOTAL_STAFF}
          onClick={handleClick}
          size={btnSize}
        >
          {IS_MOBILE ? 'All' : t('totalStaff')} - {counts[TOTAL_STAFF] || 0}
        </Button>
        <Button
          classes={{
            button: classNames({
              [styles.mobileBtn]: IS_MOBILE,
              [styles.btn]: PRESENT !== active,
              [styles.noWrap]: PRESENT === active,
            }),
          }}
          data-type={PRESENT}
          onClick={handleClick}
          size={btnSize}
          isDisabled={isFilterActive}
          disabled={isFilterActive}
        >
          {renderWithCount(
            IS_MOBILE ? 'P' : 'present',
            todayStatus === ATTENDANCE_DAY_STATS.NOT_MARKED_THIS_DAY.value
              ? 0
              : counts[PRESENT]
          )}
        </Button>
        <Button
          classes={{
            button: classNames({
              [styles.mobileBtn]: IS_MOBILE,
              [styles.btn]: ABSENT !== active,
              [styles.noWrap]: ABSENT === active,
            }),
          }}
          data-type={ABSENT}
          onClick={handleClick}
          size={btnSize}
          isDisabled={isFilterActive}
          disabled={isFilterActive}
        >
          {renderWithCount(
            IS_MOBILE ? 'A' : 'absent',
            todayStatus === ATTENDANCE_DAY_STATS.NOT_MARKED_THIS_DAY.value
              ? 0
              : counts[ABSENT]
          )}
        </Button>
        <Button
          classes={{
            button: classNames({
              [styles.mobileBtn]: IS_MOBILE,
              [styles.btn]: NOT_MARKED !== active,
              [styles.noWrap]: NOT_MARKED === active,
            }),
          }}
          data-type={NOT_MARKED}
          onClick={handleClick}
          size={btnSize}
          isDisabled={isFilterActive}
          disabled={isFilterActive}
        >
          {renderWithCount(
            IS_MOBILE ? 'NA' : 'notMarked',
            todayStatus === ATTENDANCE_DAY_STATS.NOT_MARKED_THIS_DAY.value
              ? counts[TOTAL_STAFF]
              : counts[NOT_MARKED]
          )}
        </Button>

        {todayStatus !== ATTENDANCE_DAY_STATS.MARKED_THIS_DAY.value ? (
          <div
            className={classNames(
              styles.marginLeftAuto,
              styles.markAllCheckboxWrapper
            )}
          >
            <Permission
              permissionId={
                PERMISSION_CONSTANTS.staffAttendanceController_markAttendance_create
              }
            >
              <Checkbox
                isSelected={selectAll}
                fieldName="nothing"
                handleChange={(e) => {
                  setSelectAll(e.value)
                  if (e.value)
                    dispatch(
                      updateAllAttendance({
                        status: STAFF_ATTENDANCE_STATUS.PRESENT,
                      })
                    )
                  else
                    dispatch(
                      updateAllAttendance({
                        status: STAFF_ATTENDANCE_STATUS.NOT_MARKED,
                      })
                    )

                  eventManager.send_event(
                    events.STAFF_ATTENDANCE_MARK_ALL_AS_PRESENT_CLICKED_TFI,
                    {
                      attendance_date: selectedDateUTCTimestamp,
                      status: Boolean(e.value),
                    }
                  )
                }}
                size={CHECKBOX_CONSTANTS.SIZE.SMALL}
                label={t('markAllAsPresent')}
                classes={{
                  label: styles.markAllCheckbox,
                  wrapper: classNames(
                    styles.markAllCheckboxWrapper,
                    styles.marginLeftAuto
                  ),
                  checkbox: styles.checkbox,
                }}
              />
            </Permission>
          </div>
        ) : (
          showEditButton &&
          !IS_MOBILE && <EditAttendanceButton editing={editing} />
        )}
      </div>
    )
  }
)

AttendanceViewTypeFilter.displayName = 'AttendanceViewTypeFilter'

export default AttendanceViewTypeFilter
