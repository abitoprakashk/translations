import styles from './SubscriptionPopups.module.css'
import {useSelector, useDispatch} from 'react-redux'
import {useEffect, useState} from 'react'
import {
  allowedToPayRoles,
  getPopupContent,
} from '../../../../../utils/subscriptionHelpers'
import moment from 'moment'
import {
  Button,
  BUTTON_CONSTANTS,
  Divider,
  ICON_CONSTANTS,
  Modal,
  MODAL_CONSTANTS,
  TOAST_CONSTANTS,
} from '@teachmint/krayon'
import warningTriangle from './warning.gif'
import warningTriangleStatic from './WarningTriangle.svg'
import {useTranslation} from 'react-i18next'
import classNames from 'classnames'
import {Icon} from '@teachmint/common'
import instituteBlockedIcon from './instituteBlocked.png'
import {getPaymentLink} from '../../../../../pages/BillingPage/apiServices'
import {showToast} from '../../../../../redux/actions/commonAction'
import {localStorageKeys} from '../../../../../pages/BillingPage/constants'

export default function SubscriptionBanners() {
  const {t} = useTranslation()
  const dispatch = useDispatch()

  const {instituteBillingInfo, instituteInfo, currentAdminInfo} = useSelector(
    (state) => state
  )
  const [popupData, setPopupData] = useState([])
  const [isAnimating, setIsAnimating] = useState(true)

  useEffect(() => {
    setPopupData(getPopupContent(instituteBillingInfo))
  }, [
    instituteBillingInfo,
    moment().format(
      moment().isSame(instituteBillingInfo?.next_collection_date, 'days')
        ? 'm'
        : 'D'
    ),
  ])

  useEffect(() => {
    const timer = setInterval(() => {
      setIsAnimating(!isAnimating)
    }, 5 * 1000)

    return () => {
      clearInterval(timer)
    }
  }, [isAnimating])

  const handleCloseClicked = () => {
    setPopupData({showPopup: false})
    localStorage.setItem(localStorageKeys.POPUP_LAST_SHOWN, moment().unix())
  }

  const ModalHeader = (header) => {
    return (
      <div>
        <div className={classNames(styles.header)}>
          <div className={styles.headerTitle}>{header}</div>
          <div onClick={() => handleCloseClicked()}>
            <Icon
              name="close"
              size={ICON_CONSTANTS.SIZES.X_SMALL}
              className={styles.clickable}
            />
          </div>
        </div>
        <Divider spacing="0" />
      </div>
    )
  }

  return popupData?.showPopup && !popupData?.blocking ? (
    <div className={styles.modalWrapper}>
      <Modal
        isOpen={true}
        actionButtons={
          currentAdminInfo?.role_ids?.includes(allowedToPayRoles.OWNER) ||
          currentAdminInfo?.role_ids?.includes(allowedToPayRoles.ACCOUNTANT)
            ? [
                {
                  body: t('payNow'),
                  onClick: function noRefCheck() {
                    getPaymentLink(
                      instituteInfo,
                      instituteBillingInfo,
                      currentAdminInfo
                    )
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
                  type: BUTTON_CONSTANTS.TYPE.FILLED,
                },
              ]
            : []
        }
        size={MODAL_CONSTANTS.SIZE.SMALL}
        classes={{modal: styles.modal}}
        header={ModalHeader(popupData?.header)}
        onClose={() => handleCloseClicked()}
      >
        <div className={styles.contentWrapper}>
          <img
            src={isAnimating ? warningTriangle : warningTriangleStatic}
            className={styles.gif}
          />
          <div className={styles.content}>{popupData?.content}</div>
        </div>
      </Modal>
    </div>
  ) : popupData?.blocking ? (
    <Modal isOpen={true} header={null} classes={{modal: styles.blockingModal}}>
      <div className={styles.blockingPopupWrapper}>
        <div className={styles.blockingPopupLeft}>
          <div className={styles.blockingPopupHeader}>
            {t('blockingPopupHeader')}
          </div>
          <div className={styles.blockingPopupContent}>{popupData.content}</div>
          {(currentAdminInfo?.role_ids?.includes(allowedToPayRoles.OWNER) ||
            currentAdminInfo?.role_ids?.includes(
              allowedToPayRoles.ACCOUNTANT
            )) && (
            <div>
              <Button
                type={BUTTON_CONSTANTS.TYPE.FILLED}
                onClick={() => {
                  getPaymentLink(
                    instituteInfo,
                    instituteBillingInfo,
                    currentAdminInfo
                  )
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
                }}
                classes={{button: styles.button}}
              >
                {t('payToReactivate')}
              </Button>
            </div>
          )}
        </div>
        <div className={styles.blockingPopupRight}>
          <div className={styles.blockedIcon}>
            <img src={instituteBlockedIcon} />
          </div>
          <div className={styles.blockedNotice}>{popupData?.content2}</div>
        </div>
      </div>
    </Modal>
  ) : null
}
