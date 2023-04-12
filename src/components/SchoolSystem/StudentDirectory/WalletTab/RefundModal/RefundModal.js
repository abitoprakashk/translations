import React from 'react'
import {Button, Heading, Icon, Para} from '@teachmint/krayon'
import {Modal} from '@teachmint/common'
import styles from './RefundModal.module.css'
import classNames from 'classnames'
import {useTranslation} from 'react-i18next'
import {useDispatch} from 'react-redux'
import {studentProfileWalletMakeRefundAction} from '../../redux/feeAndWallet/actions'
import {useStudentProfileWalletTabWalletRefundSelector} from '../../redux/selectros/walletTabSelectors'
import {useStudentProfileFeeTabSummarySelector} from '../../redux/selectros/feeTabSelectors'
import {getAmountFixDecimalWithCurrency} from '../../../../../utils/Helpers'
import {events} from '../../../../../utils/EventsConstants'

export default function RefundModal({
  isModalOpen = false,
  setIsModalOpen = null,
  walletBalance = 0,
  studentId = null,
  sendClickEvents = () => {},
}) {
  const {t} = useTranslation()
  const dispatch = useDispatch()

  const {error, isDataSending} =
    useStudentProfileWalletTabWalletRefundSelector()

  const {data: summaryData} = useStudentProfileFeeTabSummarySelector()

  const handleCancleRefund = () => {
    sendClickEvents(events.ISSUE_REFUND_CANCEL_CLICKED_TFI)
    setIsModalOpen()
  }
  const handleMakeRefund = () => {
    sendClickEvents(events.MARK_AS_REFUNDED_CLICKED_TFI)
    dispatch(
      studentProfileWalletMakeRefundAction({
        studentId,
      })
    )
  }

  return (
    <Modal
      show={isModalOpen}
      className={classNames(styles.feeDownloadReportModal, styles.modalMain)}
    >
      <div className={styles.modalSection}>
        <div className={styles.feeModalHeadingSection}>
          <div className={styles.iconAndHeadingSection}>
            <Heading textSize="l">{t('issueRefund')}</Heading>
          </div>
          <div>
            <button onClick={handleCancleRefund}>
              <Icon type="basic" name="close" size="x_s" version="filled" />
            </button>
          </div>
        </div>

        <div className={styles.contentSection}>
          <div className={styles.amountInfoSection}>
            <Heading textSize="xx_s">
              {t('amountEligibleForAdjustmentOrRefund')}
            </Heading>{' '}
            <Heading textSize="s" weight="bold">
              {getAmountFixDecimalWithCurrency(walletBalance)}
            </Heading>
          </div>
          {error ?? <Para type="error">{error}</Para>}

          {walletBalance < summaryData.total_due && (
            <div>
              <Para type={'error'}>
                This can not be perform because due is more than wallet balance
              </Para>
            </div>
          )}

          {/* <div>
            <Input
              defaultText="This is helper Text"
              fieldName="refundAmountField"
              isRequired
              maxLength={10}
              onChange={({value}) => {
                var pattern = new RegExp(/^-?\d*\.?\d*$/)
                if (pattern.test(value.toString())) setRefundAmount(value)
              }}
              placeholder="eg. 3000"
              title={t('enterAmountYouWantToRefund')}
              type="text"
              classes={{wrapper: styles.inputWrapper}}
              value={walletBalance}
            />
          </div> */}
          <div
            className={classNames(styles.buttonSection, {
              [styles.buttonSectionLoding]: isDataSending,
            })}
          >
            {isDataSending ? (
              <div
                className={classNames('loader', {
                  [styles.loadingSection]: isDataSending,
                })}
              ></div>
            ) : (
              <>
                {walletBalance > summaryData.total_due && (
                  <>
                    <Button
                      classes={{}}
                      onClick={handleCancleRefund}
                      type="outline"
                    >
                      {t('cancel')}
                    </Button>
                    <Button classes={{}} onClick={handleMakeRefund}>
                      {t('markAsRefunded')}
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Modal>
  )
}
