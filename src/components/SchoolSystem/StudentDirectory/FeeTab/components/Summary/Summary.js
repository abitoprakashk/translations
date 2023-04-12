import React, {useState} from 'react'
import {
  PlainCard,
  Heading,
  Para,
  Divider,
  Button,
  Badges,
  Tooltip,
} from '@teachmint/krayon'
import styles from './Summary.module.css'
import classNames from 'classnames'
import FeeUpdateHistoryModal from './FeeUpdateHistoryModal/FeeUpdateHistoryModal'
import {ErrorBoundary} from '@teachmint/common'
import {useTranslation} from 'react-i18next'
import {useSelector} from 'react-redux'
import {DateTime} from 'luxon'
import DiscountTillDateModal from '../DiscountTillDateModal/DiscountTillDateModal'
import {
  getAmountFixDecimalWithCurrency,
  numDifferentiationWithoutStyling,
} from '../../../../../../utils/Helpers'
import SummarySkeleton from '../../skeletons/SummarySkeleton/SummarySkeleton'
import {events} from '../../../../../../utils/EventsConstants'

export default function Summary({
  studentId = null,
  isDataFetching = false,
  sendClickEvents = () => {},
}) {
  const {t} = useTranslation()
  const [isFeeUpdateHistoryModalOpen, setIsFeeUpdateHistoryModal] =
    useState(false)

  const {data} = useSelector(
    (state) => state.studentProfileFeeAndWalletTab.feeTab.summary
  )

  const {instituteInfo} = useSelector((state) => state)

  const [isDiscountTillDateModalOpen, setIsDiscountTillDateModalOpen] =
    useState(false)

  const handleClickUpdateHistory = () => {
    sendClickEvents(events.STUDENT_FEE_VIEW_UPDATE_HISTORY_CLICKED_TFI)
    setIsFeeUpdateHistoryModal(true)
  }

  const summaryCards = [
    {
      id: 1,
      amount: data?.fee,
      cardClassName: styles.cardBgDefault,
      subText: <Para className="capitalize">{t('totalApplicableTxt')}</Para>,
      additionalInfo: (
        <Para className={styles.additionalInfo}>
          {t('beforeDiscountAdditionalInfo')}
        </Para>
      ),
    },
    {
      id: 2,
      amount: data?.discount,
      cardClassName: styles.cardBgDefault,
      subText: (
        <Para className={styles.cardSubText}>
          {t('totalDiscount')}
          {data?.discount > 0 && (
            <Button
              classes={{
                button: classNames(styles.viewBtn, styles.higerSpecificity),
              }}
              onClick={() => {
                sendClickEvents(events.STUDENT_FEE_VIEW_DISCOUNT_CLICKED_TFI)
                setIsDiscountTillDateModalOpen(true)
              }}
              type="text"
            >
              {t('viewDetails')}
            </Button>
          )}
        </Para>
      ),
    },
    {
      id: 3,
      amount: data?.paid,
      cardClassName: styles.cardBgPaid,
      subText: <Para>{t('totalPaid')}</Para>,
    },
    {
      id: 4,
      amount: data?.due,
      cardClassName: styles.cardBgDue,
      subText: <Para>{t('totalDue')}</Para>,
    },
    {
      id: 5,
      amount: data?.dueTillDate,
      cardClassName: styles.cardBgDue,
      subText: (
        <Badges
          inverted
          label={<span className="capitalize">{t('dueTillDate')}</span>}
          showIcon={false}
          type="error"
          size="s"
        />
      ),
    },
  ]

  if (isDataFetching) {
    // return <div className="loading"></div>
    return (
      <>
        <SummarySkeleton />
        <Divider length="100%" spacing="20px" thickness="1px" />
      </>
    )
  }

  return (
    <>
      {isFeeUpdateHistoryModalOpen && (
        <ErrorBoundary>
          <FeeUpdateHistoryModal
            isOpen={isFeeUpdateHistoryModalOpen}
            setIsOpen={setIsFeeUpdateHistoryModal}
            studentId={studentId}
          />
        </ErrorBoundary>
      )}
      {isDiscountTillDateModalOpen && (
        <DiscountTillDateModal
          studentId={studentId}
          isOpen={isDiscountTillDateModalOpen}
          setIsOpen={setIsDiscountTillDateModalOpen}
        />
      )}
      <ErrorBoundary>
        <div className={styles.section}>
          <div className={styles.headerSection}>
            <div>
              <Heading textSize="s">{t('summary')}</Heading>
              {data?.lastUpdatedHistoryTimestamp && (
                <Para type="text-secondary">
                  <div className={classNames(styles.lastUpdatedOnDiv)}>
                    <span className={styles.lastUpdatedOnText}>
                      {t('lastUpdatedOn')}{' '}
                      {DateTime.fromSeconds(
                        data?.lastUpdatedHistoryTimestamp
                      ).toFormat('d LLL yyyy')}
                    </span>
                    <div>
                      <Button onClick={handleClickUpdateHistory} type="text">
                        {t('viewUpdateHistory')}
                      </Button>
                    </div>
                  </div>
                </Para>
              )}
            </div>
          </div>
          <div className={styles.cardSection}>
            {summaryCards.map((summary, idx) => {
              return (
                <a key={idx} data-for={`extraInfo${idx}`} data-tip>
                  <PlainCard
                    key={summary.id}
                    className={classNames(
                      summary.cardClassName,
                      styles.plainCard
                    )}
                  >
                    <Heading textSize="s">
                      {numDifferentiationWithoutStyling(
                        summary.amount ?? 0,
                        instituteInfo.currency
                      )}
                    </Heading>
                    <div>{summary.subText}</div>
                    <Para>{summary.additionalInfo}</Para>
                    <Tooltip
                      place="top"
                      effect="solid"
                      toolTipBody={getAmountFixDecimalWithCurrency(
                        summary.amount ?? 0,
                        instituteInfo.currency
                      )}
                      toolTipId={`extraInfo${idx}`}
                    />
                  </PlainCard>
                </a>
              )
            })}
          </div>
          <Divider length="100%" spacing="20px" thickness="1px" />
        </div>
      </ErrorBoundary>
    </>
  )
}
