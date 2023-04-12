import {Heading, HEADING_CONSTANTS, PlainCard} from '@teachmint/krayon'
import {t} from 'i18next'
import React from 'react'
import {PURCHASE_ORDER_STATUS} from '../../../CustomId.constants'
import OrderStatusCard from '../OrderStatusCard/OrderStatusCard'
import styles from './OrderStatusInfo.module.css'

export default function OrderStatusInfo({orderHistoryData}) {
  return (
    <PlainCard className={styles.wrapper}>
      <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}>
        {t('currentOrders')}
      </Heading>

      <div className={styles.itemsWrapper}>
        {orderHistoryData
          ?.filter(({status}) => status !== PURCHASE_ORDER_STATUS.DELIVERED)
          .map((item, i) => (
            <div key={i} className={styles.item}>
              <OrderStatusCard item={item} />
            </div>
          ))}
      </div>
    </PlainCard>
  )
}
