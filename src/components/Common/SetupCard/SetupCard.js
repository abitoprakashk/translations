import styles from './SetupCard.module.css'
import {
  Para,
  PARA_CONSTANTS,
  PlainCard,
  Button,
  BUTTON_CONSTANTS,
  ICON_FRAME_CONSTANTS,
  IconFrame,
  Icon,
  ICON_CONSTANTS,
} from '@teachmint/krayon'
import classNames from 'classnames'
import Permission from '../Permission/Permission'
import PropTypes from 'prop-types'
import {IS_MOBILE} from '../../../constants'

const ActionButton = ({btnName, onClick}) => {
  return IS_MOBILE ? (
    <span onClick={onClick}>
      <Icon
        name="forwardArrow"
        type={ICON_CONSTANTS.TYPES.INVERTED}
        size={ICON_CONSTANTS.SIZES.XX_SMALL}
      />
    </span>
  ) : (
    <Button
      type={BUTTON_CONSTANTS.TYPE.FILLED}
      size={BUTTON_CONSTANTS.SIZE.MEDIUM}
      category={BUTTON_CONSTANTS.CATEGORY.PRIMARY}
      onClick={onClick}
    >
      {btnName}
    </Button>
  )
}

export default function SetupCard({
  heading,
  text,
  permissionId,
  actionBtn,
  onClick,
  icon,
  classes,
  className,
}) {
  return (
    <PlainCard
      className={classNames(styles.setupCard, className, classes.wrapper)}
    >
      {typeof icon === 'string' ? (
        <div className={classNames(styles.iconClass, classes.icon)}>
          <IconFrame type={ICON_FRAME_CONSTANTS.TYPES.BASIC}>
            <Icon name={icon} type="inverted" />
          </IconFrame>
        </div>
      ) : (
        <div className={classNames(styles.iconClass, classes.icon)}>{icon}</div>
      )}
      <div className={styles.content}>
        {typeof heading === 'string' ? (
          <Para
            textSize={PARA_CONSTANTS.TEXT_SIZE.X_LARGE}
            weight={PARA_CONSTANTS.WEIGHT.MEDIUM}
            className={classNames(styles.heading, classes.heading)}
          >
            {heading}
          </Para>
        ) : (
          heading
        )}
        {typeof text === 'string' ? (
          !IS_MOBILE ? (
            <Para
              textSize={PARA_CONSTANTS.TEXT_SIZE.LARGE}
              className={classNames(styles.text, classes.text)}
            >
              {text}
            </Para>
          ) : null
        ) : (
          text
        )}
      </div>
      <div>
        {typeof actionBtn === 'string' && onClick ? (
          permissionId ? (
            <Permission permissionId={permissionId}>
              <ActionButton btnName={actionBtn} onClick={onClick} />
            </Permission>
          ) : (
            <ActionButton btnName={actionBtn} onClick={onClick} />
          )
        ) : (
          actionBtn
        )}
      </div>
    </PlainCard>
  )
}

SetupCard.propTypes = {
  heading: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  permissionId: PropTypes.string,
  actionBtn: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  onClick: PropTypes.func,
  icon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  classes: PropTypes.shape({
    wrapper: PropTypes.string,
    icon: PropTypes.string,
    heading: PropTypes.string,
    text: PropTypes.string,
  }),
}

SetupCard.defaultProps = {
  heading: '',
  text: '',
  permissionId: '',
  actionBtn: '',
  onClick: () => {},
  classes: PropTypes.shape({
    wrapper: '',
    icon: '',
    heading: '',
    text: '',
  }),
}
