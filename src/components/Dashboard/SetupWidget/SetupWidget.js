import React, {useEffect} from 'react'
import {Icon, ICON_CONSTANTS, Widget} from '@teachmint/krayon'
import styles from './SetupWidget.module.css'
import SetupProgress from '../SetupProgress/SetupProgress'
import {useDispatch, useSelector} from 'react-redux'
import globalActions from '../../../redux/actions/global.actions'
import {t} from 'i18next'
import {events} from '../../../utils/EventsConstants'

const SetupWidget = () => {
  const eventManager = useSelector((state) => state.eventManager)
  const dispatch = useDispatch()
  let actionButtons
  const getHeader = () => {
    return (
      <div className={styles.widgetSetupHeaderContainer}>
        <div className={styles.widgetSetupHeaderMainContainer}>
          <div className={styles.widgetSetupIconContainer}>
            <Icon
              name="homework"
              type="inverted"
              size={ICON_CONSTANTS.SIZES.XXX_SMALL}
              className={styles.widgetSetupIcon}
            />
          </div>
          <div className={styles.widgetSetupHeaderTitle}>
            {t('schoolOverview')}
          </div>
        </div>
      </div>
    )
  }

  const getBody = () => {
    return (
      <div className={styles.body}>
        <SetupProgress getData={getData} />
      </div>
    )
  }

  const getData = () => {
    dispatch(globalActions?.getSetupProgressWidget?.request())
  }
  useEffect(() => {
    eventManager.send_event(events.DASHBOARD_WIDGETS_LOADED, {
      widget_type: 'setup',
    })
    getData()
  }, [])

  return (
    <div className={styles.widgetSetup}>
      <Widget
        header={getHeader()}
        actionButtons={actionButtons}
        body={getBody()}
        classes={{
          widgetWrapper: styles.widgetSetupWrapper,
          header: styles.widgetSetupHeader,
          icon: styles.widgetSetupIcon,
          headerTitle: styles.widgetSetupHeaderTitle,
          actionBtn: styles.widgetSetupActionBtn,
          subHeading: styles.widgetSetupSubHeading,
          body: styles.widgetSetupBody,
          footer: styles.widgetSetupFooter,
        }}
      />
    </div>
  )
}

export default SetupWidget
