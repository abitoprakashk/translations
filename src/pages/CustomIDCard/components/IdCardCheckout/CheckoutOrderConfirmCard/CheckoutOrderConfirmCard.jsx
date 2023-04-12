import {
  Badges,
  BADGES_CONSTANTS,
  Heading,
  HEADING_CONSTANTS,
  Para,
  PARA_CONSTANTS,
} from '@teachmint/krayon'
import {t} from 'i18next'
import React from 'react'
import styles from './CheckoutOrderConfirmCard.module.css'

export default function CheckoutOrderConfirmCard({summary}) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}>
          {t('orderSummary')}
        </Heading>
      </div>

      <div className={styles.content}>
        <div className={styles.infoWrapper}>
          <div>
            <Para>{t('subtotal')}</Para>
            {summary?.student_no_of_sets && (
              <Para
                textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
                className={styles.subtext}
              >
                {t('student')}: ({summary?.student_no_of_sets} sets *{' '}
                {summary?.student_price_per_set}/set)
              </Para>
            )}

            {summary?.staff_no_of_sets && (
              <Para
                textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
                className={styles.subtext}
              >
                {t('staff')}: ({summary?.staff_no_of_sets} sets *{' '}
                {summary?.staff_price_per_set}
                /set)
              </Para>
            )}
          </div>
          <Para>₹{summary?.subtotal}</Para>
        </div>
        {summary?.discount > 0 && (
          <div className={styles.infoWrapper}>
            <Para>Discount ({summary?.discount}%)</Para>
            <Para>- ₹{summary?.discount_amount}</Para>
          </div>
        )}

        {summary?.discount > 0 && (
          <div className={styles.infoWrapper}>
            <Para>Subtotal After Discount</Para>
            <Para>₹{summary?.subtotal_after_discount}</Para>
          </div>
        )}

        <div className={styles.infoWrapper}>
          <Para>GST ({summary?.tax}%)</Para>
          <Para>₹{summary?.tax_amount}</Para>
        </div>

        <div className={styles.infoWrapper}>
          <div>
            <Para>{t('deliveryCharges')}</Para>
            <Badges
              label={t('freeDelivery')}
              type={BADGES_CONSTANTS.TYPE.PRIMARY}
              showIcon={false}
              size={BADGES_CONSTANTS.SIZE.SMALL}
              className={styles.subtext}
            />
          </div>
          <Para className={styles.freeDeliveryValue}>
            ₹{summary?.delivery_charge}
          </Para>
        </div>
      </div>

      <div className={styles.footer}>
        <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}>
          {t('total')}
        </Heading>

        <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}>
          ₹{summary?.total}
        </Heading>
      </div>
    </div>
  )
}
