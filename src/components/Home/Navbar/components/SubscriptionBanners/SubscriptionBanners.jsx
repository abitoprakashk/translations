import styles from './SubscriptionBanners.module.css'
import {useSelector} from 'react-redux'
import {useEffect, useState} from 'react'
import {
  allowedToPayRoles,
  getBannerContent,
} from '../../../../../utils/subscriptionHelpers'
import moment from 'moment'
import Banner from '../Banner/Banner'
import {localStorageKeys} from '../../../../../pages/BillingPage/constants'

export default function SubscriptionBanners() {
  const {instituteBillingInfo, currentAdminInfo} = useSelector((state) => state)
  const [bannerData, setBannerData] = useState([])

  useEffect(() => {
    setBannerData(
      getBannerContent(
        instituteBillingInfo,
        currentAdminInfo?.role_ids?.includes(allowedToPayRoles.OWNER) ||
          currentAdminInfo?.role_ids?.includes(allowedToPayRoles.ACCOUNTANT)
      )
    )
  }, [
    instituteBillingInfo,
    moment().format(
      moment().isSame(instituteBillingInfo?.next_collection_date, 'days')
        ? 'm'
        : 'D'
    ),
  ])

  const handleCloseClicked = () => {
    setBannerData({showBanner: false})
    localStorage.setItem(localStorageKeys.BANNER_LAST_SHOWN, moment().unix())
  }

  return bannerData?.showBanner ? (
    <Banner
      icon={bannerData?.icon}
      iconVersion={bannerData?.iconVersion}
      iconType={bannerData?.iconType}
      content={bannerData?.content}
      button={bannerData?.button}
      showButton={
        currentAdminInfo?.role_ids?.includes(allowedToPayRoles.OWNER) ||
        currentAdminInfo?.role_ids?.includes(allowedToPayRoles.ACCOUNTANT)
      }
      dismissable={bannerData?.dismissable}
      dismissLabel={bannerData?.dismissLabel}
      onClose={() => handleCloseClicked()}
      classes={{
        wrapper: styles[bannerData?.wrapper],
        button: styles[bannerData?.button?.classes],
      }}
    />
  ) : null
}
