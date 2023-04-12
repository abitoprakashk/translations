import {useSelector} from 'react-redux'
import {useHistory} from 'react-router-dom'
import styles from './EmptyLandingPageView.module.css'
import {t} from 'i18next'
import SetupCard from '../../../../../components/Common/SetupCard/SetupCard'
import {sidebarData} from '../../../../../utils/SidebarItems'
import {events} from '../../../../../utils/EventsConstants'
import {PERMISSION_CONSTANTS} from '../../../../../utils/permission.constants'
import {
  Heading,
  HEADING_CONSTANTS,
  Para,
  PARA_CONSTANTS,
} from '@teachmint/krayon'

export default function EmptyLandingPageView() {
  const history = useHistory()
  const eventManager = useSelector((state) => state.eventManager)
  const onClickSetup = () => {
    eventManager.send_event(events.SETUP_AUTOMATED_ATTENDANCE_CLICKED_TFI, {
      screen_name: 'attendance_shifts',
    })
    history.push({
      pathname: `${sidebarData.HRMS_CONFIGURATION.subRoutes[0]}`, //go to attendance shifts
      state: {
        showCreateShiftModal: true,
      },
    })
  }

  return (
    <div>
      <SetupCard
        heading={t('setupAutomatedAttendance')}
        text={t('setupSchoolTimings')}
        actionBtn={t('setupNow')}
        onClick={onClickSetup}
        permissionId={
          PERMISSION_CONSTANTS.InstituteShiftController_update_route_create
        }
      />
      <div className={styles.container}>
        <div className={styles.iframeContainer}>
          <iframe
            src="https://www.youtube.com/embed/b9rzCtnWstE"
            title={t('attendanceShiftsSetupTourHeading')}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen="allowfullscreen"
            className={styles.video}
          ></iframe>
        </div>
        <Heading
          type={HEADING_CONSTANTS.TYPE.TEXT_PRIMARY}
          textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}
          className={styles.heading}
        >
          {t('attendanceShiftsSetupTourHeading')}
        </Heading>
        <Para type={PARA_CONSTANTS.TYPE.TEXT_SECONDARY}>
          {t('attendanceShiftsSetupTourText')}
        </Para>
      </div>
    </div>
  )
}
