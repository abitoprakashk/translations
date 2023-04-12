import {
  Heading,
  HEADING_CONSTANTS,
  Icon,
  ICON_CONSTANTS,
  PlainCard,
} from '@teachmint/krayon'
import {t} from 'i18next'
import styles from './multipleRouteAdditionForm.module.css'
import RouteCard from './RouteCard'

export default function MultipleRouteAdditionForm({
  setShowMultipleRouteAdditionForm,
  addedRoutes,
}) {
  return (
    <div className={styles.cardsWrapper}>
      <PlainCard
        className={styles.createNewRoute}
        onClick={() => setShowMultipleRouteAdditionForm(false)}
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
          {t('createNewRoute')}
        </Heading>
      </PlainCard>

      {addedRoutes?.map((routeObj) => (
        <RouteCard key={routeObj.name} data={routeObj} />
      ))}
    </div>
  )
}
