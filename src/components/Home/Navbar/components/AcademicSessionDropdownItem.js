import React from 'react'
import {useSelector} from 'react-redux'
import {events} from '../../../../utils/EventsConstants'
import {PERMISSION_CONSTANTS} from '../../../../utils/permission.constants'
import Permission from '../../../Common/Permission/Permission'
import {getDateFromTimeStamp} from './../../../../utils/Helpers'
import {sortSessionsByCreationDate} from '../../../../utils/sessionUtils'
import styles from '../Navbar.module.css'
import {t} from 'i18next'

const AcademicSessionDropdownItem = ({
  handleAcademicSessionChange,
  editAcademicSession,
}) => {
  const {eventManager, instituteAcademicSessionInfo} = useSelector(
    (state) => state
  )

  if (!instituteAcademicSessionInfo?.length) {
    return null
  }

  return sortSessionsByCreationDate(instituteAcademicSessionInfo).map(
    (session) => (
      <div
        className={styles.academicSessionDropdownItem}
        key={session?._id}
        onClick={() => handleAcademicSessionChange(session?._id)}
      >
        <div>
          <div className={`tm-hdg tm-hdg-14 ${styles.sessionName}`}>
            {session?.name}
          </div>
          <div
            className={`tm-para-12 ${
              session?.active_status
                ? styles.activeBackground
                : styles.inActiveBackground
            }`}
          >
            {session?.active_status ? t('active') : t('inactive')}
          </div>
        </div>
        <Permission
          permissionId={
            PERMISSION_CONSTANTS.instituteController_updateSession_update
          }
        >
          <p
            onClick={(e) => {
              e.stopPropagation()
              eventManager.send_event(
                events.EDIT_ACADEMIC_SESSION_CLICKED_TFI,
                {
                  start_date: session?.start_time
                    ? getDateFromTimeStamp(parseInt(session?.start_time) / 1000)
                    : '',
                  end_date: session?.end_time
                    ? getDateFromTimeStamp(parseInt(session?.end_time) / 1000)
                    : '',
                }
              )
              editAcademicSession(session)
            }}
            className={styles.editText}
          >
            {t('edit')}
          </p>
        </Permission>
      </div>
    )
  )
}

export default AcademicSessionDropdownItem
