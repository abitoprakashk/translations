import React from 'react'
import {Button, BUTTON_CONSTANTS, Icon, ICON_CONSTANTS} from '@teachmint/krayon'
import classNames from 'classnames'
import {useDispatch, useSelector} from 'react-redux'
import {events} from '../../../../../../utils/EventsConstants'
import {editAttendance} from '../../redux/actions/StaffAttendanceActions'
import {IS_MOBILE} from '../../../../../../constants'

import styles from './EditAttendanceButton.module.css'
import {useTranslation} from 'react-i18next'
import Permission from '../../../../../Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../../../utils/permission.constants'

const EditAttendanceButton = ({editing}) => {
  const dispatch = useDispatch()
  const {t} = useTranslation()

  const eventManager = useSelector((state) => state.eventManager)
  const selectedDateUTCTimestamp = useSelector(
    (state) => state.staffAttendance.selectedDateUTCTimestamp
  )

  const btnSize = IS_MOBILE
    ? BUTTON_CONSTANTS.SIZE.SMALL
    : BUTTON_CONSTANTS.SIZE.MEDIUM

  return (
    <div className={styles.marginLeftAuto}>
      <Permission
        permissionId={
          PERMISSION_CONSTANTS.staffAttendanceController_markAttendance_create
        }
      >
        <Button
          type={BUTTON_CONSTANTS.TYPE.OUTLINE}
          onClick={() => {
            dispatch(editAttendance(!editing))
            eventManager.send_event(events.STAFF_ATTENDANCE_EDIT_CLICKED_TFI, {
              attendance_date: selectedDateUTCTimestamp,
            })
          }}
          classes={{
            button: classNames({
              [styles.noWrap]: true,
              [styles.mobileBtn]: IS_MOBILE,
              [styles.marginLeftAuto]: true,
            }),
          }}
          size={btnSize}
        >
          {IS_MOBILE ? (
            <Icon
              name={editing ? 'close' : 'edit2'}
              type={ICON_CONSTANTS.TYPES.PRIMARY}
              size={ICON_CONSTANTS.SIZES.XX_SMALL}
            />
          ) : editing ? (
            t('cancel')
          ) : (
            t('editAttendance')
          )}
        </Button>
      </Permission>
    </div>
  )
}

export default EditAttendanceButton
