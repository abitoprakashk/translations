import {
  Button,
  BUTTON_CONSTANTS,
  Heading,
  HEADING_CONSTANTS,
  Icon,
  ICON_CONSTANTS,
  IconFrame,
  ICON_FRAME_CONSTANTS,
  PlainCard,
} from '@teachmint/krayon'
import React, {useState} from 'react'
import {useTranslation} from 'react-i18next'
import styles from './RequestLiveTrackingCard.module.css'
import {useSelector} from 'react-redux'
import {events} from '../../../../../../utils/EventsConstants'
import Permission from '../../../../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../../../utils/permission.constants'
import LiveTrackingIntegrationModal from './LiveTrackingIntegrationModal'

export default function RequestLiveTrackingCard() {
  const [
    showLiveTrackingIntegrationModal,
    setShowLiveTrackingIntegrationModal,
  ] = useState(false)

  const {t} = useTranslation()

  const eventManager = useSelector((state) => state?.eventManager)

  const handleRequest = () => {
    setShowLiveTrackingIntegrationModal(true)
    eventManager.send_event(events.REQUEST_GPS_CLICKED_TFI, {
      screen_name: 'overview_tab',
    })
  }

  return (
    <>
      <PlainCard className={styles.card}>
        <div className={styles.infoSection}>
          <IconFrame
            size={ICON_FRAME_CONSTANTS.SIZES.XXXX_LARGE}
            type={ICON_FRAME_CONSTANTS.TYPES.BASIC}
          >
            <Icon
              size={ICON_CONSTANTS.SIZES.SMALL}
              type={ICON_CONSTANTS.TYPES.INVERTED}
              name="nearMe"
              className={styles.busIcon}
            />
          </IconFrame>
          <div className={styles.infoWrapper}>
            <Heading
              className={styles.heading}
              textSize={HEADING_CONSTANTS.TEXT_SIZE.X_SMALL}
            >
              {t('liveTrackingIntegration')}
            </Heading>
          </div>
        </div>
        <div className={styles.buttonWrapper}>
          <Permission
            permissionId={
              PERMISSION_CONSTANTS.transportSettingsController_updateSchoolAddress_update
            }
          >
            <Button
              size={BUTTON_CONSTANTS.SIZE.LARGE}
              classes={{button: styles.button}}
              onClick={handleRequest}
            >
              {t('requestGPS')}
            </Button>
          </Permission>
        </div>
      </PlainCard>
      <LiveTrackingIntegrationModal
        showModal={showLiveTrackingIntegrationModal}
        setShowModal={setShowLiveTrackingIntegrationModal}
      />
    </>
  )
}
