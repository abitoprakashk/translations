import {
  Button,
  BUTTON_CONSTANTS,
  Icon,
  ICON_CONSTANTS,
  TOAST_CONSTANTS,
} from '@teachmint/krayon'
import classNames from 'classnames'
import styles from './Banner.module.css'
import {useTranslation} from 'react-i18next'
import {getPaymentLink} from '../../../../../pages/BillingPage/apiServices'
import {useSelector, useDispatch} from 'react-redux'
import {showToast} from '../../../../../redux/actions/commonAction'
import {sidebarData} from '../../../../../utils/SidebarItems'

export default function Banner({
  icon,
  classes,
  iconType,
  iconVersion = null,
  content,
  button,
  showButton,
  dismissable = true,
  dismissLabel,
  onClose,
}) {
  const {instituteBillingInfo, instituteInfo, currentAdminInfo} = useSelector(
    (state) => state
  )
  const {t} = useTranslation()
  const dispatch = useDispatch()

  const onClicks = {
    VIEW: () => {
      window.location.href = sidebarData.BILLING.route
    },
    PAY: () => {
      getPaymentLink(instituteInfo, instituteBillingInfo, currentAdminInfo)
        .then((res) => {
          if (!res?.data?.obj) throw new Error()
          window.location.href = res?.data?.obj?.payment_link
        })
        .catch(() => {
          dispatch(
            showToast({
              type: TOAST_CONSTANTS.TYPES.ERROR,
              message: t('somethingWentWrong'),
            })
          )
        })
    },
  }

  return (
    <>
      <div className={classNames(styles.wrapper, classes.wrapper)}>
        <Icon
          name={icon}
          type={iconType}
          version={iconVersion || ICON_CONSTANTS.VERSION.FILLED}
          className={styles.icon}
        />
        <div className={classNames(styles.content, classes.content)}>
          {content}
        </div>
        <div className={styles.buttonAndClose}>
          {dismissable && (
            <div className={classNames(styles.button, classes.button)}>
              <Button
                type={BUTTON_CONSTANTS.TYPE.OUTLINE}
                onClick={() => {
                  onClose()
                }}
              >
                {t(dismissLabel)}
              </Button>
            </div>
          )}
          {showButton && (
            <div className={classNames(styles.button, classes.button)}>
              <Button
                type={button.type}
                onClick={() => {
                  onClicks[button.onClick]()
                }}
              >
                {t(button.label)}
              </Button>
            </div>
          )}
          {dismissable && (
            <div className={styles.closeIcon}>
              <Icon
                onClick={() => {
                  onClose()
                }}
                name="close"
                size={ICON_CONSTANTS.SIZES.X_SMALL}
              />
            </div>
          )}
        </div>
      </div>
    </>
  )
}
