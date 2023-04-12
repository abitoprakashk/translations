import {HeaderTemplate} from '@teachmint/krayon'
import {t} from 'i18next'
import React, {useEffect} from 'react'
import {useDispatch} from 'react-redux'
import {generatePath, useParams} from 'react-router-dom'
import globalActions from '../../../../redux/actions/global.actions'
import OrderStatusCard from '../../components/IdCardCheckout/OrderStatusCard/OrderStatusCard'
import {CUSTOM_ID_CARD_ROOT_ROUTE} from '../../CustomId.routes'
import {getIDCardOrderData} from '../../redux/CustomId.selector'
import styles from './PurchaseHistory.module.css'

export default function PuschaseHistory() {
  const {userType} = useParams()

  const dispatch = useDispatch()
  const orderHistoryData = getIDCardOrderData()

  useEffect(() => {
    dispatch(globalActions?.getIDCardOrderHistory?.request())
  }, [])

  return (
    <div className={styles.wrapper}>
      <HeaderTemplate
        mainHeading={t('purchaseHistory')}
        breadcrumbObj={{
          paths: [
            {
              label: t('customId.idCards'),
              to: generatePath(CUSTOM_ID_CARD_ROOT_ROUTE, {
                userType,
              }),
            },
            {label: t('purchaseHistory'), onClick: () => {}},
          ],
        }}
      />

      <div className={styles.cardsWrapper}>
        {orderHistoryData?.map((item) => (
          <OrderStatusCard item={item} key={item._id} showTrackOrder={false} />
        ))}
      </div>
    </div>
  )
}
