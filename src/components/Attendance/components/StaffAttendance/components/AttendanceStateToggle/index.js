import React, {useCallback} from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import {useTranslation} from 'react-i18next'
import {STAFF_ATTENDANCE_STATUS} from '../../StaffAttendanceConstants'

import styles from './styles.module.css'
import Permission from '../../../../../Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../../../utils/permission.constants'

const {ABSENT, PRESENT, NOT_MARKED} = STAFF_ATTENDANCE_STATUS
const HALF_DAY_PRESENT = 'HALF_DAY_PRESENT'

const AttendanceStateToggle = ({selected = NOT_MARKED, onClick = null}) => {
  const {t} = useTranslation()

  const onClickElement = useCallback(
    (e) => {
      if (
        e._reactName === 'onKeyDown' &&
        e.code != 'Enter' &&
        e.code != 'Space'
      )
        return

      if (e.target?.dataset?.value && typeof onClick === 'function') {
        onClick(e.target.dataset.value)
      }
    },
    [onClick]
  )

  return (
    <div className={styles.wrapper}>
      <Permission
        permissionId={
          PERMISSION_CONSTANTS.staffAttendanceController_markAttendance_create
        }
      >
        <div
          className={styles.wrapper}
          onClick={onClickElement}
          onKeyDown={onClickElement}
        >
          <span
            className={classNames(styles.stateItem, styles.absent, {
              [styles.active]: selected === ABSENT,
            })}
            data-value={ABSENT}
            tabIndex={0}
          >
            {t('absent')}
          </span>
          <span
            className={classNames(styles.stateItem, styles.notMarked, {
              [styles.active]: selected === NOT_MARKED,
            })}
            data-value={NOT_MARKED}
            tabIndex={0}
          >
            NA
          </span>
          <span
            className={classNames(styles.stateItem, styles.present, {
              [styles.active]: selected === PRESENT,
            })}
            data-value={PRESENT}
            tabIndex={0}
          >
            {t('present')}
          </span>
        </div>
      </Permission>
    </div>
  )
}

AttendanceStateToggle.propTypes = {
  selected: PropTypes.oneOf([ABSENT, PRESENT, NOT_MARKED, HALF_DAY_PRESENT]),
  onClick: PropTypes.func,
}

export default AttendanceStateToggle
