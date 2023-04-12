import {
  Heading,
  HEADING_CONSTANTS,
  Icon,
  ICON_CONSTANTS,
  Modal,
  MODAL_CONSTANTS,
  Para,
  TabGroup,
} from '@teachmint/krayon'
import {t} from 'i18next'
import React, {useState} from 'react'
import {useTranslation} from 'react-i18next'
import styles from './RouteScheduleModal.module.css'

const directoryTabs = [
  {label: t('pickup'), id: 'pickup'},
  {label: t('drop'), id: 'drop'},
]

export default function RouteScheduleModal({
  showModal,
  onModalClose,
  title,
  stopDetails,
}) {
  if (!showModal) return null

  const [selectedDirectory, setSelectedDirectory] = useState(
    directoryTabs?.[0]?.id
  )
  const {t} = useTranslation()

  const getSortedStopSchedule = () =>
    stopDetails
      ?.map((item) => ({
        stopName: item.pickup_point_name,
        passengersCount: item?.passenger_ids?.length || 0,
        time:
          selectedDirectory === 'pickup' ? item.pickup_time : item.drop_time,
      }))
      .sort((a, b) => (a.time > b.time ? 1 : b.time > a.time ? -1 : 0))

  return (
    <Modal
      header={title}
      classes={{modal: styles.modal}}
      headerIcon={
        <Icon
          size={ICON_CONSTANTS.SIZES.SMALL}
          name="people"
          type={ICON_CONSTANTS.TYPES.BASIC}
        />
      }
      isOpen={true}
      onClose={onModalClose}
      size={MODAL_CONSTANTS.SIZE.X_LARGE}
      shouldCloseOnOverlayClick={false}
    >
      <div className={styles.wrapper}>
        <div className={styles.tabGroupWrapper}>
          <TabGroup
            tabOptions={directoryTabs}
            onTabClick={(tab) => setSelectedDirectory(tab?.id)}
            selectedTab={selectedDirectory}
          />
        </div>

        <div>
          {getSortedStopSchedule()?.map(
            ({stopName, passengersCount, time}, index) => (
              <div key={index} className={styles.stopItem}>
                <div>
                  <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}>
                    {stopName}
                  </Heading>
                  <Para>{`${t(selectedDirectory)} - ${time}`}</Para>
                </div>

                <div className={styles.passengerCountWrapper}>
                  <Icon
                    size={ICON_CONSTANTS.SIZES.XX_SMALL}
                    name="directionsWalk"
                    type={ICON_CONSTANTS.TYPES.SECONDARY}
                  />
                  <Para>{`${passengersCount} ${t('passengers')}`}</Para>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </Modal>
  )
}
