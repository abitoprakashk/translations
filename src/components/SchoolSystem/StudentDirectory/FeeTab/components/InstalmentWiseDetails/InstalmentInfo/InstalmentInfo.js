import React, {useCallback, useState} from 'react'
import {PlainCard, Badges, Button} from '@teachmint/krayon'
import styles from './InstalmentInfo.module.css'
import CalloutCard from '../../CalloutCard/CalloutCard'
import classNames from 'classnames'
import InstalmentDetail from '../InstalmentDetail/InstalmentDetail'
import {Trans, useTranslation} from 'react-i18next'
import {DateTime} from 'luxon'
import {getOrdinalNum} from '../../../../../../../pages/YearlyCalendar/commonFunctions'
import {PAYMENT_HISTORY_MODALS_FOR} from '../../../FeeTabConstant'
import {ErrorBoundary} from '@teachmint/common'
import {getAmountFixDecimalWithCurrency} from '../../../../../../../utils/Helpers'
import {events} from '../../../../../../../utils/EventsConstants'
import {useSelector} from 'react-redux'
import {PERMISSION_CONSTANTS} from '../../../../../../../utils/permission.constants'
import Permission from '../../../../../../Common/Permission/Permission'

export default function InstalmentInfo({
  instalmentInfo = {},
  index = 1,
  currentDate = DateTime.now().startOf('day'),
  handlePaymentHistoryModalBtnClick = () => {},
  sendClickEvents = () => {},
  handleSetEditInstallmentModalData = () => {},
}) {
  const {t} = useTranslation()
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const {instituteInfo} = useSelector((state) => state)

  const dueDate = DateTime.fromSeconds(
    instalmentInfo?.installment_timestamp
  ).startOf('day')

  const isFullyPaid = instalmentInfo?.due === 0
  const isOverDue =
    instalmentInfo?.due != 0 && dueDate < currentDate ? true : false
  const isDue =
    instalmentInfo?.due != 0 && dueDate >= currentDate ? true : false

  const dueDateTimestamp = new Date(
    instalmentInfo?.installment_timestamp * 1000
  )
  let currDate = new Date()
  let diffInDays = Math.abs(dueDateTimestamp - currDate)
  const dayNumber = Math.ceil(diffInDays / (1000 * 60 * 60 * 24))
  const dayText = dayNumber === 1 ? t('day') : t('days')

  const callouts = [
    {
      id: 1,
      text: DateTime.fromSeconds(
        instalmentInfo?.installment_timestamp
      ).toFormat('dd LLL yyyy'),
      subText: t('dueDate'),
      borderClassName: '',
    },
    {
      id: 2,
      text: getAmountFixDecimalWithCurrency(
        instalmentInfo?.fee,
        instituteInfo.currency
      ),
      subText: t('amount'),
      borderClassName: '',
    },
    {
      id: 3,
      text: getAmountFixDecimalWithCurrency(
        instalmentInfo?.discount,
        instituteInfo.currency
      ),
      subText: t('discount'),
      borderClassName: '',
    },
    {
      id: 4,
      text: getAmountFixDecimalWithCurrency(
        instalmentInfo?.paid,
        instituteInfo.currency
      ),
      subText: (
        <span className={styles.fullyPaidParaSection}>
          {t('paidFee')}{' '}
          {instalmentInfo?.paid > 0 && (
            <Button
              classes={{label: styles.showHideText}}
              onClick={() => {
                sendClickEvents(events.STUDENT_FEE_VIEW_RECEIPTS_CLICKED_TFI)
                handlePaymentHistoryModalBtnClick(
                  PAYMENT_HISTORY_MODALS_FOR.viewReceipts,
                  instalmentInfo?.installment_timestamp
                )
              }}
              type="text"
              size={'s'}
            >
              {t('viewReceipts')}
            </Button>
          )}{' '}
        </span>
      ),
      borderClassName: classNames(styles.borderGreen, styles.higerSpeficity),
    },
    {
      id: 4,
      text: getAmountFixDecimalWithCurrency(
        instalmentInfo?.due,
        instituteInfo.currency
      ),
      subText: isOverDue ? t('dueAmount') : t('due'),
      borderClassName: classNames(styles.borderRed, styles.higerSpeficity),
    },
  ]

  const badgeType = useCallback(() => {
    if (isFullyPaid) return {type: 'success', text: t('fullyPaid')}
    if (isOverDue)
      return {
        type: 'error',
        text: (
          <Trans i18nKey="overDueSince">
            overdue since {`${dayNumber} ${dayText}`}
          </Trans>
        ),
      }
    if (isDue)
      return {
        type: 'basic',
        text: (
          <Trans i18nKey="dueInText">
            due in {`${Math.abs(dayNumber)} ${dayText}`}
          </Trans>
        ),
      }
  }, [isFullyPaid, isOverDue, isDue])

  return (
    <ErrorBoundary>
      <PlainCard className={styles.borderColor}>
        <div className={styles.headingSection}>
          <div className={styles.headingTextSection}>
            <div className={styles.headingText}>
              {`${getOrdinalNum(index)} ${t('installment')}`}
            </div>
            <Badges
              inverted={badgeType().type === 'basic' ? false : true}
              showIcon={false}
              iconName=""
              label={
                <span className={styles.badgeLabel}>{badgeType().text}</span>
              }
              size="s"
              type={badgeType().type}
            />
          </div>
          <Permission
            permissionId={
              PERMISSION_CONSTANTS.feeModuleController_feeStudentPayment_create
            }
          >
            <Button
              onClick={() => {
                handleSetEditInstallmentModalData({
                  ...instalmentInfo,
                  index: index,
                })
              }}
              type="text"
            >
              {t('edit')}
            </Button>
          </Permission>
        </div>
        <div className={styles.calloutSection}>
          {callouts.length > 0 &&
            callouts.map((callout) => {
              return (
                <CalloutCard
                  key={callout.id}
                  text={callout.text}
                  subText={callout.subText}
                  borderClassName={callout.borderClassName}
                />
              )
            })}
        </div>
        <div>
          <div className={styles.detailBtnSection}>
            <Button
              classes={{label: styles.showHideText}}
              onClick={() => {
                if (!isDetailOpen)
                  sendClickEvents(events.STUDENT_FEE_SHOW_DETAILS_CLICKED_TFI)
                setIsDetailOpen(!isDetailOpen)
              }}
              type="text"
            >
              {isDetailOpen ? t('hideDetails') : t('viewDetails')}
            </Button>
          </div>
          {isDetailOpen && (
            <InstalmentDetail instalmentDetail={instalmentInfo?.details} />
          )}
        </div>
      </PlainCard>
    </ErrorBoundary>
  )
}
