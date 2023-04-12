import styles from './StaffAttendanceTabs.module.css'
import {useHistory} from 'react-router-dom'
import {useRouteMatch} from 'react-router-dom'
import {TabGroup} from '@teachmint/krayon'
import {
  STAFF_ATTENDANCE_PAGE,
  STAFF_ATTENDANCE_ROUTES,
} from '../../StaffAttendanceConstants'
import {t} from 'i18next'
import {events} from '../../../../../../utils/EventsConstants'
import {useSelector} from 'react-redux'

const STAFF_ATTENDANCE_TAB_EVENTS = {
  [STAFF_ATTENDANCE_PAGE.STAFF_ATTENDANCE]:
    events.STAFF_ATTENDANCE_TAB_CLICKED_TFI,
  [STAFF_ATTENDANCE_PAGE.MY_ATTENDANCE]: events.MY_ATTENDANCE_TAB_CLICKED_TFI,
}

export default function StaffAttendanceTabs() {
  const eventManager = useSelector((state) => state.eventManager)
  const history = useHistory()
  const myAttendance = useRouteMatch(STAFF_ATTENDANCE_ROUTES.MY_ATTENDANCE)
  const tabOptions = [
    {
      id: STAFF_ATTENDANCE_PAGE.STAFF_ATTENDANCE,
      label: t('staffAttendance'),
    },
    {
      id: STAFF_ATTENDANCE_PAGE.MY_ATTENDANCE,
      label: t('myAttendance'),
    },
  ]
  return (
    <div className={styles.staffAttendanceTabs}>
      <TabGroup
        tabOptions={tabOptions}
        selectedTab={
          myAttendance
            ? STAFF_ATTENDANCE_PAGE.MY_ATTENDANCE
            : STAFF_ATTENDANCE_PAGE.STAFF_ATTENDANCE
        }
        showMoreTab={false}
        onTabClick={(tab) => {
          eventManager.send_event(STAFF_ATTENDANCE_TAB_EVENTS[tab.id])
          history.push(STAFF_ATTENDANCE_ROUTES[tab.id])
        }}
      />
    </div>
  )
}
