import React from 'react'
import styles from './FeeDownloadModal.module.css'
// import reportStyles from '../Reports.module.css'
import classNames from 'classnames'
import {Card, Icon, Modal} from '@teachmint/common'
import Cash from '../../../../assets/images/icons/cash.svg'
import {useHistory} from 'react-router-dom'
import {
  COLLECTION_REPORT,
  COLLECTION_REPORT_SUB_TITLE,
  DOWNLOAD_FEE_REPORT,
  FEE_REPORT_MODAL_CARD_IDS,
  TRANSACTIONCS_REPORT,
  YOU_CAN_VIEW_AND_DOWNLOAD_CUSTOMIESED_TRANSACTION_REPORTS,
} from '../constant'
import {useTranslation} from 'react-i18next'
import {events} from '../../../../utils/EventsConstants'

export default function FeeDownloadModal({
  showFeeDownloadReportModal,
  setShowFeeDownloadReportModal,
  trackEvent,
}) {
  const {t} = useTranslation()
  const history = useHistory()

  const handleCardItemClick = (selectedCard) => {
    if (selectedCard === FEE_REPORT_MODAL_CARD_IDS.transactionReport) {
      trackEvent(events.FEE_TRANSACTION_REPORT_CLICKED_TFI, {
        screen_name: 'download_fee_report',
      })
      history.push(`dashboard/fees/transactions`)
    }
    if (selectedCard === FEE_REPORT_MODAL_CARD_IDS.collectionReport) {
      trackEvent(events.FEE_COLLECTION_REPORT_CLICKED_TFI, {
        screen_name: 'download_fee_report',
      })
      history.push(`dashboard/fees/collection`)
    }
  }

  const items = [
    {
      num: 1,
      icon: (
        <div className={styles.modalListIconBg}>
          <img src={Cash} className="h-8 w-8" />
        </div>
      ),
      title: t(TRANSACTIONCS_REPORT),
      subTitle: t(YOU_CAN_VIEW_AND_DOWNLOAD_CUSTOMIESED_TRANSACTION_REPORTS),
      onClick: () =>
        handleCardItemClick(FEE_REPORT_MODAL_CARD_IDS.transactionReport),
    },
    {
      num: 2,
      icon: (
        <div className={styles.modalListIconBg}>
          <Icon color="inverted" name="download" size="m" type="filled" />
        </div>
      ),
      title: t(COLLECTION_REPORT),
      subTitle: t(COLLECTION_REPORT_SUB_TITLE),
      onClick: () =>
        handleCardItemClick(FEE_REPORT_MODAL_CARD_IDS.collectionReport),
    },
  ]

  return (
    <Modal
      show={showFeeDownloadReportModal}
      className={classNames(styles.feeDownloadReportModal, styles.modalMain)}
    >
      <div className={styles.modalSection}>
        <div className={styles.feeModalHeadingSection}>
          <div className={styles.iconAndHeadingSection}>
            <div className={classNames(styles.iconBg, styles.feeIconbg)}>
              <img src={Cash} className="h-8 w-8" />
            </div>
            <div className={styles.feeModalHeadingText}>
              {t(DOWNLOAD_FEE_REPORT)}
            </div>
          </div>
          <div>
            <button
              onClick={() =>
                setShowFeeDownloadReportModal(!showFeeDownloadReportModal)
              }
            >
              <Icon color="basic" name="close" size="xs" type="filled" />
            </button>
          </div>
        </div>

        <div>
          {items.map((item) => {
            return (
              <Card
                className={classNames(
                  styles.itemCard,
                  styles.higherspecifisity
                )}
                key={item.title}
                onClick={item.onClick}
              >
                <div className={styles.itemCardChildrenSection}>
                  <div>{item.icon}</div>
                  <div>
                    <div className={styles.itemCardTitleText}>
                      {item.title}
                      {/* <Icon
                        color="basic"
                        name="downArrow"
                        size="xs"
                        type="filled"
                        className={reportStyles.subTextIconRotate}
                      /> */}
                    </div>
                    <div className={styles.itemCardSubTitleText}>
                      {item.subTitle}
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </Modal>
  )
}
