import React from 'react'
import {PlainCard, Heading, Para} from '@teachmint/krayon'
import styles from './Summary.module.css'
import {ErrorBoundary} from '@teachmint/common'
import {useTranslation} from 'react-i18next'
import {useSelector} from 'react-redux'
import {getAmountFixDecimalWithCurrency} from '../../../../../../../../utils/Helpers'
import classNames from 'classnames'

export default function FeeSummary({data}) {
  const {t} = useTranslation()

  const {instituteInfo} = useSelector((state) => state)

  const summaryCards = [
    {
      id: 1,
      amount: getAmountFixDecimalWithCurrency(
        data?.due ?? 0,
        instituteInfo.currency
      ),
      cardClassName: styles.cardBgDue,
      subText: <Para>{t('due')}</Para>,
    },
    {
      id: 2,
      amount: getAmountFixDecimalWithCurrency(
        data?.paid ?? 0,
        instituteInfo.currency
      ),
      cardClassName: styles.cardBgPaid,
      subText: <Para>{t('paidFee')}</Para>,
    },
    {
      id: 3,
      amount: getAmountFixDecimalWithCurrency(
        data?.discount ?? 0,
        instituteInfo.currency
      ),
      cardClassName: styles.cardBgDefault,
      subText: <Para className={styles.cardSubText}>{t('discount')}</Para>,
    },
    {
      id: 4,
      amount: getAmountFixDecimalWithCurrency(
        data?.fee ?? 0,
        instituteInfo.currency
      ),
      cardClassName: styles.cardBgDefault,
      subText: <Para>{t('totalAnnualFee')}</Para>,
    },
  ]

  return (
    <>
      <ErrorBoundary>
        <div className={styles.section}>
          <div className={styles.cardSection}>
            {summaryCards.map((summary) => {
              return (
                <PlainCard
                  key={summary.id}
                  className={classNames(
                    styles.statsCard,
                    summary.cardClassName
                  )}
                >
                  <Heading textSize="s">{summary.amount}</Heading>
                  <div>{summary.subText}</div>
                </PlainCard>
              )
            })}
          </div>
        </div>
      </ErrorBoundary>
    </>
  )
}
