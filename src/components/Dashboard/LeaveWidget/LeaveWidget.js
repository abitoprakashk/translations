import {Widget, PARA_CONSTANTS, Para, BUTTON_CONSTANTS} from '@teachmint/krayon'
import {useEffect, useState} from 'react'
import classNames from 'classnames'
import {useDispatch, useSelector} from 'react-redux'
import {Link} from 'react-router-dom'
import globalActions from '../../../redux/actions/global.actions'
import LeaveWidgetModal from './LeaveWidgetModal'
import styles from './LeaveWidget.module.css'
import {checkSubscriptionType} from '../../../utils/Helpers'
import {useTranslation} from 'react-i18next'
import {events} from '../../../utils/EventsConstants'
import LeaveWidgetBody from './Components/LeaveWidgetBody'

export default function LeaveWidget() {
  const instituteInfo = useSelector((state) => state?.instituteInfo)
  const eventManager = useSelector((state) => state.eventManager)
  const dispatch = useDispatch()
  const [modalData, setModalData] = useState([])
  const [displayModal, setDisplayModal] = useState(false)
  const [modalHeader, setModalHeader] = useState(null)
  const utcTimestamp = new Date().getTime() / 1000
  const {t} = useTranslation()

  const getStaffOnLeaveComponent = (staffData) => {
    return (
      <>
        <Para
          type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
          weight={PARA_CONSTANTS.WEIGHT.MEDIUM}
          textSize={PARA_CONSTANTS.TEXT_SIZE.LARGE}
          className={classNames(styles.heading, styles.ellipseText)}
        >
          {staffData?.name}
        </Para>
        {staffData?.classes?.length === 0 ? (
          <Para
            type={PARA_CONSTANTS.TYPE.TEXT_SECONDARY}
            weight={PARA_CONSTANTS.WEIGHT.MEDIUM}
            textSize={PARA_CONSTANTS.TEXT_SIZE.LARGE}
            className={classNames(styles.subHeading, styles.ellipseText)}
          >
            {staffData?.role_name}
          </Para>
        ) : (
          <Para
            type={PARA_CONSTANTS.TYPE.TEXT_SECONDARY}
            weight={PARA_CONSTANTS.WEIGHT.MEDIUM}
            textSize={PARA_CONSTANTS.TEXT_SIZE.LARGE}
            className={classNames(styles.subHeading, styles.ellipseText)}
          >{`${staffData?.classes?.[0]}, ${t('classTeacher')}`}</Para>
        )}
      </>
    )
  }

  const getStaffUpcomingComponent = (staffData) => {
    return (
      <>
        <Para
          type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
          weight={PARA_CONSTANTS.WEIGHT.MEDIUM}
          textSize={PARA_CONSTANTS.TEXT_SIZE.LARGE}
          className={classNames(styles.heading, styles.ellipseText)}
        >
          {staffData?.name}
        </Para>
        <Para
          type={PARA_CONSTANTS.TYPE.TEXT_SECONDARY}
          weight={PARA_CONSTANTS.WEIGHT.MEDIUM}
          textSize={PARA_CONSTANTS.TEXT_SIZE.LARGE}
          className={classNames(styles.subHeading, styles.ellipseText)}
        >
          {Math.ceil((staffData?.from_date - utcTimestamp) / 86400) === 1
            ? t('afterOneDay')
            : t('afterVariableDays', {
                dayCount: Math.ceil(
                  (staffData?.from_date - utcTimestamp) / 86400
                ),
              })}
        </Para>
      </>
    )
  }
  useEffect(() => {
    if (instituteInfo && checkSubscriptionType(instituteInfo)) {
      dispatch(globalActions?.leaveWidgetData?.request())
    }
    eventManager.send_event(events.DASHBOARD_WIDGETS_LOADED, {
      widget_type: 'leave',
    })
  }, [])

  return (
    <>
      <Widget
        header={{
          icon: 'eventBusy',
          title: t('onLeave'),
        }}
        actionButtons={[
          {
            body: checkSubscriptionType(instituteInfo) && (
              <Link
                to="/institute/dashboard/leave-management/manage-leaves"
                onClick={() =>
                  eventManager.send_event(events.LEAVE_VIEW_CLICKED_TFI)
                }
              >
                {t('admitCardView')}
              </Link>
            ),
            type: BUTTON_CONSTANTS.TYPE.TEXT,
          },
        ]}
        body={
          <LeaveWidgetBody
            getStaffOnLeaveComponent={getStaffOnLeaveComponent}
            setDisplayModal={setDisplayModal}
            setModalData={setModalData}
            setModalHeader={setModalHeader}
            getStaffUpcomingComponent={getStaffUpcomingComponent}
          />
        }
        classes={styles}
      />
      <LeaveWidgetModal
        headerData={modalHeader}
        bodyData={modalData}
        display={displayModal}
        setDisplay={setDisplayModal}
      />
    </>
  )
}
