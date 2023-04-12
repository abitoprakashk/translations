import styles from './SusbcriptionConfig.module.css'
import {useTranslation} from 'react-i18next'
import {useSelector} from 'react-redux'
import moment from 'moment'
import {Divider} from '@teachmint/krayon'
import {handleNull} from '../../utils'
import {cleanUpProductPackage} from '../../../../utils/subscriptionHelpers'

export default function SubscriptionConfig() {
  const {instituteBillingInfo} = useSelector((state) => state)
  const {t} = useTranslation()

  const configItems = [
    {
      key: 'product_package',
      title: 'Product',
      value: cleanUpProductPackage(instituteBillingInfo?.product_package),
    },
    {
      key: 'licenses',
      title: 'Licenses',
      value: `${instituteBillingInfo?.no_of_students} SaaS${
        instituteBillingInfo?.number_of_content_students
          ? ` + ${instituteBillingInfo?.number_of_content_students} Online Content`
          : ''
      }`,
    },
    {
      key: 'subscription_duration',
      title: 'Subscription Duration',
      value: '3 years',
    },
    {
      key: 'payment_cycle',
      title: 'Payment Cycle',
      value: instituteBillingInfo?.payment_cycle,
    },
    {
      key: 'billing_effective_date',
      title: 'Billing Effective Date',
      value: moment
        .unix(instituteBillingInfo?.billing_start_date)
        .format('Do MMMM YYYY'),
    },
  ]

  return (
    <div className={styles.wrapper}>
      <div className={styles.config1}>
        <div className={styles.header}>{t('subscriptionConfigHeader')}</div>
        {/* <div className={styles.pspm}>
          <div className={styles.pspmValue}>
            {getSymbolFromCurrency(instituteInfo?.currency || 'INR')}
            {instituteBillingInfo?.pspm}
          </div>
          <div className={styles.pspmLabel}>{t('perStudentPerMonth')}</div>
        </div> */}
      </div>
      <Divider classes={{wrapper: styles.divider}} />
      <div className={styles.config2}>
        {configItems.map((configItem) => {
          return (
            <div key={configItem.key} className={styles.configItem}>
              <div className={styles.configItemHeader}>{configItem.title}</div>
              <div className={styles.configItemValue}>
                {handleNull(configItem.value)}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
