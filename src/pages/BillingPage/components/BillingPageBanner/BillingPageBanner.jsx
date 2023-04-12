import styles from './BillingPageBanner.module.css'
import {useTranslation} from 'react-i18next'
import {useSelector, useDispatch} from 'react-redux'
import {Button, TOAST_CONSTANTS} from '@teachmint/krayon'
import {useEffect, useState} from 'react'
import {getSubscriptionBannerContent} from '../../../../utils/subscriptionHelpers'
import classNames from 'classnames'
import discount from './discount.gif'
import discountStatic from './discountStatic.jpg'
import due from './due.gif'
import dueStatic from './dueStatic.jpg'
import exclamation from './exclamation.gif'
import exclamationStatic from './exclamationStatic.jpg'
import {getPaymentLink} from '../../apiServices'
import {showToast} from '../../../../redux/actions/commonAction'

export default function BillingPageBanner() {
  const {instituteBillingInfo, instituteInfo, currentAdminInfo} = useSelector(
    (state) => state
  )

  const {t} = useTranslation()
  const dispatch = useDispatch()
  const [bannerData, setBannerData] = useState([])
  const [isAnimating, setIsAnimating] = useState(true)

  useEffect(() => {
    setBannerData(getSubscriptionBannerContent(instituteBillingInfo))
  }, [instituteBillingInfo])

  useEffect(() => {
    const timer = setInterval(() => {
      setIsAnimating(!isAnimating)
    }, 5 * 1000)

    return () => {
      clearInterval(timer)
    }
  }, [isAnimating])

  const imgSources = {
    discount: [discount, discountStatic],
    due: [due, dueStatic],
    exclamation: [exclamation, exclamationStatic],
  }

  const handlePayClicked = () => {
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
  }

  return (
    <>
      {bannerData.showBanner && (
        <div className={classNames(styles.wrapper, styles[bannerData.wrapper])}>
          <div className={styles.icon}>
            <img
              src={
                isAnimating
                  ? imgSources[bannerData.icon][0]
                  : imgSources[bannerData.icon][1]
              }
              className={styles.gif}
            />
          </div>
          <div className={styles.headerAndContent}>
            <div className={styles.header}>{bannerData.header}</div>
            <div className={styles.content}> {bannerData.content}</div>
          </div>
          <div className={styles.buttons}>
            {bannerData.button1 && (
              <div className={styles.button1}>
                <Button
                  type={bannerData.button1.type}
                  category={bannerData.button1.category}
                  onClick={() => {
                    handlePayClicked()
                  }}
                >
                  {t(bannerData.button1.content)}
                </Button>
              </div>
            )}
            {bannerData.button2 && (
              <div>
                <Button
                  type={bannerData.button2.type}
                  category={bannerData.button2.category}
                  onClick={() => {}}
                >
                  {t(bannerData.button2.content)}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
