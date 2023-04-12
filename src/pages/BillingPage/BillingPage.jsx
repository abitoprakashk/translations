import styles from './BillingPage.module.css'
import {useSelector} from 'react-redux'
import {useTranslation} from 'react-i18next'
import SubscriptionConfig from './components/SubscriptionConfig/SubscriptionConfig'
import PaymentSchedule from './components/PaymentSchedule/PaymentSchedule'
import {useEffect, useState} from 'react'
import {getCollectionInstallments} from './apiServices'
import {paymentStatusOptions} from './constants'

export default function BillingPage() {
  const {t} = useTranslation()
  const {instituteInfo} = useSelector((state) => state)
  const [subscriptionData, setSubscriptionData] = useState(null)

  const addStatusToInstallments = (installments) => {
    if (!installments) return null
    for (let i = 0; i < installments.length; i++)
      if (installments[i].pending_amount === 0)
        installments[i].status = paymentStatusOptions.PAID
      else if (installments[i].paid_amount === 0)
        installments[i].status = paymentStatusOptions.UNPAID
      else installments[i].status = paymentStatusOptions.PARTIAL
    return installments
  }

  useEffect(() => {
    getCollectionInstallments(instituteInfo?._id)
      .then((res) => {
        if (!res?.data?.obj) throw new Error()
        setSubscriptionData(res?.data.obj)
      })
      .catch(() => {})
  }, [])

  return (
    <>
      <div className={styles.billingPageWrapper}>
        <div className={styles.heading}>{t('billingPageHeader')}</div>
        <SubscriptionConfig subscriptionData={subscriptionData} />
        <PaymentSchedule
          collectionInstallments={addStatusToInstallments(
            subscriptionData?.installment
          )}
        />
      </div>
    </>
  )
}
