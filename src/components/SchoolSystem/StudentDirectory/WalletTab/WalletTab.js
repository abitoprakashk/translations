import React, {useEffect} from 'react'
import {Button, IconFrame, Icon, Heading, Alert, Table} from '@teachmint/krayon'
import classNames from 'classnames'
import styles from './WalletTab.module.css'
import {useTranslation} from 'react-i18next'
import RefundModal from './RefundModal/RefundModal'
import {getAmountFixDecimalWithCurrency} from '../../../../utils/Helpers'
import {useDispatch} from 'react-redux'
import {
  getStudentProfileWalletSummaryAction,
  setStudentProfileWalletRefundStateAction,
} from '../redux/feeAndWallet/actions'
import {
  useStudentProfileWalletTabSummarySelector,
  useStudentProfileWalletTabWalletRefundSelector,
} from '../redux/selectros/walletTabSelectors'
import {ErrorBoundary, ErrorOverlay} from '@teachmint/common'
import {
  WALLET_TRANSACTIONS_TABLE_COLS,
  WALLET_TRANSACTIONS_TABLE_NO_DATA,
  WALLET_TRANSACTION_DEBIT_ID,
  WALLET_TRANSACTION_META_ORIGIN,
  WALLET_TRANSACTION_REFUND_ID,
} from './WalletTabConstant'
import {DateTime} from 'luxon'
import WalletTabSkeleton from '../FeeTab/skeletons/WalletTabSkeleton/WalletTabSkeleton'
import NoDataComp from '../FeeTab/components/NoDataComp/NoDataComp'
import {events} from '../../../../utils/EventsConstants'

export default function WalletTab({
  studentId = null,
  sendClickEvents = () => {},
}) {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const {isDataFetching, data, error} =
    useStudentProfileWalletTabSummarySelector()
  const {isRefundModalOpen} = useStudentProfileWalletTabWalletRefundSelector()

  useEffect(() => {
    if (studentId && Object.keys(data).length === 0) {
      dispatch(getStudentProfileWalletSummaryAction(studentId))
    }
  }, [studentId])

  const rows = data?.transactions
    ? data?.transactions.map((rowData, i) => {
        let isAmountDebited = [
          WALLET_TRANSACTION_REFUND_ID,
          WALLET_TRANSACTION_DEBIT_ID,
        ].includes(rowData?.type)
        return {
          id: `walletTab${i}`,
          transactionType:
            WALLET_TRANSACTION_META_ORIGIN[rowData.meta.origin]?.text ?? '-',
          amount: (
            <div
              className={classNames({
                [styles.textRed]: isAmountDebited,
                [styles.textGreen]: !isAmountDebited,
              })}
            >
              {isAmountDebited ? ' - ' : ' + '}
              {getAmountFixDecimalWithCurrency(rowData.amount)}
            </div>
          ),
          date: rowData?.timestamp
            ? DateTime.fromSeconds(rowData?.timestamp).toFormat(
                'dd MMM yyyy, hh:mm a'
              )
            : '-',
        }
      })
    : WALLET_TRANSACTIONS_TABLE_NO_DATA

  if (isDataFetching) {
    // return <div className="loading"></div>
    return (
      <div className={styles.section}>
        <WalletTabSkeleton />
      </div>
    )
  }

  return (
    <>
      {isRefundModalOpen && (
        <ErrorBoundary>
          <RefundModal
            isModalOpen={isRefundModalOpen}
            setIsModalOpen={() =>
              dispatch(
                setStudentProfileWalletRefundStateAction({
                  isRefundModalOpen: !isRefundModalOpen,
                })
              )
            }
            walletBalance={data.walletBalance ?? 0}
            studentId={studentId}
            sendClickEvents={sendClickEvents}
          />
        </ErrorBoundary>
      )}

      <ErrorBoundary>
        <div className={styles.section}>
          <div
            className={classNames(
              styles.dFlex,
              styles.justifyBetween,
              styles.alignCenter
            )}
          >
            <div
              className={classNames(
                styles.dFlex,
                styles.headingIconSection,
                styles.alignCenter
              )}
            >
              <IconFrame className={styles.iconFrameBg}>
                <Icon name="walletBalance" type="inverted" />
              </IconFrame>
              <Heading textSize="xx_s">
                {t('walletBalance')}:{' '}
                {getAmountFixDecimalWithCurrency(data.walletBalance ?? 0)}
              </Heading>
            </div>
            {data?.walletBalance > 0 && (
              <div>
                <Button
                  classes={{}}
                  onClick={() => {
                    sendClickEvents(events.REFUND_WALLET_BALANCE_CLICKED_TFI)
                    dispatch(
                      setStudentProfileWalletRefundStateAction({
                        isRefundModalOpen: true,
                      })
                    )
                  }}
                  type="text"
                >
                  {t('refundWalletBalance')}
                </Button>
              </div>
            )}
          </div>

          <Alert
            content={t('walletAlertMsg')}
            className={classNames(
              styles.dFlex,
              styles.alignCenter,
              styles.alertBox
            )}
            type="warning"
            icon="caution"
          />
          {error ?? <ErrorOverlay>{error}</ErrorOverlay>}
          <div>
            <Table
              uniqueKey={'id'}
              rows={rows}
              cols={WALLET_TRANSACTIONS_TABLE_COLS}
              isSelectable={false}
            />
          </div>
          {rows?.length === 0 && <NoDataComp msg={t('noTransactionsFound')} />}
        </div>
      </ErrorBoundary>
    </>
  )
}
