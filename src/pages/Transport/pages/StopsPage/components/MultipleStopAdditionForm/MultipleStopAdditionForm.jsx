import {
  Heading,
  HEADING_CONSTANTS,
  Icon,
  ICON_CONSTANTS,
  PlainCard,
} from '@teachmint/krayon'
import {t} from 'i18next'
import styles from './multipleStopAdditionForm.module.css'
import StopCard from './StopCard'

export default function MultipleStopAdditionForm({
  setShowMultipleStopAdditionForm,
  addedStops,
}) {
  return (
    <div className={styles.cardsWrapper}>
      <PlainCard
        className={styles.addNewStop}
        onClick={() => setShowMultipleStopAdditionForm(false)}
      >
        <Icon
          type={ICON_CONSTANTS.TYPES.PRIMARY}
          size={ICON_CONSTANTS.SIZES.LARGE}
          name={'add'}
        />
        <Heading
          textSize={HEADING_CONSTANTS.TEXT_SIZE.X_SMALL}
          type={HEADING_CONSTANTS.TYPE.TEXT_SECONDARY}
        >
          {t('addNewStop')}
        </Heading>
      </PlainCard>

      {addedStops?.map((stopObj) => (
        <StopCard key={stopObj.name} data={stopObj} />
      ))}
    </div>
  )
}
