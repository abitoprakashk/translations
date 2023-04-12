import classNames from 'classnames'
import styles from './onboardingCard.module.css'
import {
  Heading,
  HEADING_CONSTANTS,
  Icon,
  IconFrame,
  ICON_CONSTANTS,
  ICON_FRAME_CONSTANTS,
  Para,
  PlainCard,
} from '@teachmint/krayon'
import {ONBOARDING_CARD_STATE} from '../../constants'

export default function OnboardingCard({
  title,
  desc,
  iconName,
  classes,
  onClick,
  state = ONBOARDING_CARD_STATE.TODO,
}) {
  return (
    <PlainCard
      className={classNames(styles.card, classes?.card, {
        [styles.isSetupComplete]: state === ONBOARDING_CARD_STATE.COMPLETED,
        [styles.disabledCard]: state === ONBOARDING_CARD_STATE.DISABLED,
      })}
      onClick={onClick}
    >
      <div className={styles.header}>
        <IconFrame
          size={ICON_FRAME_CONSTANTS.SIZES.LARGE}
          className={classNames(classes?.iconFrame, {
            [styles.disabledIconFrame]:
              state === ONBOARDING_CARD_STATE.DISABLED,
          })}
        >
          <Icon
            type={ICON_CONSTANTS.TYPES.INVERTED}
            size={ICON_CONSTANTS.SIZES.XX_SMALL}
            name={iconName}
            className={classes?.icon}
          />
        </IconFrame>
        <Icon
          size={ICON_CONSTANTS.SIZES.XX_SMALL}
          type={
            state === ONBOARDING_CARD_STATE.DISABLED
              ? ICON_CONSTANTS.TYPES.SECONDARY
              : ICON_CONSTANTS.TYPES.BASIC
          }
          name="forwardArrow"
          className={classNames(classes?.arrowIcon, {
            [styles.disabledColor]: state === ONBOARDING_CARD_STATE.DISABLED,
          })}
        />
      </div>
      <div className={classNames(styles.content, classes?.content)}>
        <div className={styles.titleWrapper}>
          <Heading
            textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}
            className={classNames(classes?.title, {
              [styles.disabledColor]: state === ONBOARDING_CARD_STATE.DISABLED,
            })}
          >
            {title}
          </Heading>
          {state === ONBOARDING_CARD_STATE.COMPLETED && (
            <Icon
              version={ICON_CONSTANTS.VERSION.FILLED}
              type={ICON_CONSTANTS.TYPES.SUCCESS}
              size={ICON_CONSTANTS.SIZES.XX_SMALL}
              name={'checkCircle1'}
              className={classNames(classes?.checkCircle1Icon, {
                [styles.disabledColor]:
                  state === ONBOARDING_CARD_STATE.DISABLED,
              })}
            />
          )}
        </div>
        <Para
          className={classNames(classes?.desc, {
            [styles.disabledColor]: state === ONBOARDING_CARD_STATE.DISABLED,
          })}
        >
          {desc}
        </Para>
      </div>
    </PlainCard>
  )
}
