import {ErrorBoundary} from '@teachmint/common'
import {
  Para,
  PARA_CONSTANTS,
  PlainCard,
  Tooltip,
  TOOLTIP_CONSTANTS,
} from '@teachmint/krayon'
import classNames from 'classnames'
import {useTranslation} from 'react-i18next'
import {useSelector} from 'react-redux'
import {
  getAmountFixDecimalWithCurrency,
  numDifferentiationWithoutStyling,
} from '../../../../../../utils/Helpers'
import styles from './FeeCollectionOverview.module.css'
import FeeCollectionOverviewSkeleton from './FeeCollectionOverviewSkeleton'
export default function FeeCollectionOverview({feeStatistics}) {
  const {t} = useTranslation()
  const instituteInfo = useSelector((state) => state.instituteInfo)
  const summaryCards = [
    {
      id: 1,
      amount: feeStatistics.total_payable,
      cardClassName: styles.cardBgTotalApplied,
      subText: <Para className="capitalize">{t('totalApplied')}</Para>,
      additionalInfo: t('beforeDiscountAdditionalInfo'),
    },
    {
      id: 2,
      amount: feeStatistics.total_discount,
      cardClassName: styles.cardBgDiscount,
      subText: <Para className="capitalize">{t('totalDiscount')}</Para>,
    },
    {
      id: 3,
      amount: feeStatistics.total_paid,
      cardClassName: styles.cardBgPaid,
      subText: <Para className="capitalize">{t('totalPaid')}</Para>,
    },
    {
      id: 4,
      amount: feeStatistics.total_due,
      cardClassName: styles.cardBgDue,
      subText: <Para className="capitalize">{t('totalDue')}</Para>,
    },
  ]

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <span className={styles.title}>{t('feeCollectionOverview')}</span>
        {feeStatistics.length == 0 ? (
          <FeeCollectionOverviewSkeleton />
        ) : (
          <div className={styles.cardSection}>
            {summaryCards.map((summaryCard, idx) => {
              return (
                <a
                  key={idx}
                  data-for={`extraInfo${idx}`}
                  data-tip
                  className={styles.amount}
                >
                  <PlainCard
                    key={summaryCard.id}
                    className={classNames(
                      summaryCard.cardClassName,
                      styles.plainCard
                    )}
                  >
                    <span className="overflow-anywhere ">
                      {numDifferentiationWithoutStyling(
                        summaryCard.amount ?? 0,
                        instituteInfo.currency
                      )}
                    </span>
                    <span className={styles.subText}>
                      {summaryCard.subText}
                    </span>
                    {summaryCard.additionalInfo && (
                      <Para
                        className={styles.additionalInfo}
                        textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
                        type={PARA_CONSTANTS.TYPE.TEXT_SECONDARY}
                      >
                        {summaryCard.additionalInfo}
                      </Para>
                    )}

                    <Tooltip
                      place={TOOLTIP_CONSTANTS.TOOLTIP_POSITIONS.TOP}
                      effect={TOOLTIP_CONSTANTS.TOOLTIP_EFFECTS.SOLID}
                      toolTipBody={getAmountFixDecimalWithCurrency(
                        summaryCard.amount ?? 0,
                        instituteInfo.currency
                      )}
                      toolTipId={`extraInfo${idx}`}
                    />
                  </PlainCard>
                </a>
              )
            })}
          </div>
        )}
      </div>
    </ErrorBoundary>
  )
}
