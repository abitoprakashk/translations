import {
  Badges,
  BADGES_CONSTANTS,
  Button,
  BUTTON_CONSTANTS,
  Icon,
  ICON_CONSTANTS,
  Para,
  PARA_CONSTANTS,
  PlainCard,
} from '@teachmint/krayon'
import classNames from 'classnames'
import {t} from 'i18next'
import React, {useEffect, useState} from 'react'
import styles from './OrderStatusCard.module.css'
import {PURCHASE_ORDER_STATUS as POS} from '../../../CustomId.constants'
import OrderDetailsModal from '../OrderDetailsModal/OrderDetailsModal'
import {useSelector} from 'react-redux'
import {events} from '../../../../../utils/EventsConstants'

const STATUS_CODES = {
  DONE: 'DONE',
  IN_PROGRESS: 'IN_PROGRESS',
  INACTIVE: 'INACTIVE',
}

const statusDetailsItems = [
  {
    title: t('orderProcessed'),
    desc: t('orderProcessedDesc'),
    status: STATUS_CODES.IN_PROGRESS,
    active: false,
  },
  {
    title: t('printingInProcess'),
    desc: t('printingInProcessDesc'),
    status: STATUS_CODES.INACTIVE,
    active: false,
  },
  {
    title: t('orderDispatched'),
    desc: t('orderDispatchedDesc'),
    status: STATUS_CODES.INACTIVE,
    active: false,
  },
  {
    title: t('delivery'),
    desc: t('deliveryDesc'),
    status: STATUS_CODES.INACTIVE,
    active: false,
  },
]

export default function OrderStatusCard({item, showTrackOrder = true}) {
  const [openTrackAccordion, setOpenTrackAccordion] = useState(true)
  const [showModal, setshowModal] = useState(false)
  const [statusItems, setStatusItems] = useState([])

  const eventManager = useSelector((state) => state.eventManager)

  const getStatusBadges = (statusType) => {
    switch (statusType) {
      case POS.ORDER_PROCESSING:
        return (
          <Badges
            label={t('orderProcessing')}
            type={BADGES_CONSTANTS.TYPE.WARNING}
            showIcon={false}
            size={BADGES_CONSTANTS.SIZE.SMALL}
          />
        )
      case POS.IN_PRINTING:
        return (
          <Badges
            label={t('inPrinting')}
            type={BADGES_CONSTANTS.TYPE.PRIMARY}
            showIcon={false}
            size={BADGES_CONSTANTS.SIZE.SMALL}
          />
        )
      case POS.PREPARING_FOR_DISPATCH:
        return (
          <Badges
            label={t('preparingForDispatch')}
            type={BADGES_CONSTANTS.TYPE.PRIMARY}
            showIcon={false}
            size={BADGES_CONSTANTS.SIZE.SMALL}
          />
        )
      case POS.DISPATCHED:
        return (
          <Badges
            label={t('dispatched')}
            type={BADGES_CONSTANTS.TYPE.PRIMARY}
            showIcon={false}
            size={BADGES_CONSTANTS.SIZE.SMALL}
          />
        )
      case POS.DELIVERED:
        return (
          <Badges
            label={t('delivered')}
            type={BADGES_CONSTANTS.TYPE.SUCCESS}
            showIcon={false}
            size={BADGES_CONSTANTS.SIZE.SMALL}
          />
        )
      default:
        return (
          <Badges
            label={t('cancelled')}
            type={BADGES_CONSTANTS.TYPE.ERROR}
            showIcon={false}
            size={BADGES_CONSTANTS.SIZE.SMALL}
          />
        )
    }
  }

  useEffect(() => {
    const items = JSON.parse(JSON.stringify(statusDetailsItems))

    if (item.status === POS.ORDER_PROCESSING) {
      items[0].active = true
    } else if (item.status === POS.IN_PRINTING) {
      items[0].status = STATUS_CODES.DONE
      items[1].status = STATUS_CODES.IN_PROGRESS
      items[1].active = true
    } else if (item.status === POS.PREPARING_FOR_DISPATCH) {
      items[0].status = STATUS_CODES.DONE
      items[1].status = STATUS_CODES.DONE
      items[2].status = STATUS_CODES.IN_PROGRESS
      items[2].active = true
    } else if (item.status === POS.DISPATCHED) {
      items[0].status = STATUS_CODES.DONE
      items[1].status = STATUS_CODES.DONE
      items[2].status = STATUS_CODES.DONE
      items[2].active = true
      items[2].desc = (
        <div className={styles.trackOrderDescWrapper}>
          <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>
            {`${t('deliveryTrackDesc')} ${item?.tracking_id}`}
          </Para>
          <a href={item?.tracking_url} target="_blank" rel="noreferrer">
            <Para
              textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
              type={PARA_CONSTANTS.TYPE.PRIMARY}
            >
              {t('trackOrder')}
            </Para>
          </a>
        </div>
      )
    } else if (item.status === POS.DELIVERED) {
      items[0].status = STATUS_CODES.DONE
      items[1].status = STATUS_CODES.DONE
      items[2].status = STATUS_CODES.DONE
      items[3].status = STATUS_CODES.DONE
      items[3].active = true
    }
    setStatusItems(items)
  }, [item])

  return (
    <PlainCard className={styles.wrapper}>
      <div className={styles.firstSetion}>
        {getStatusBadges(item?.status)}

        <div className={styles.headingWrapper}>
          <div>
            <Para type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}>
              Order - {item?.receipt_order_id}
            </Para>
            <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>
              ID Card + Lanyard + Holder
            </Para>
          </div>

          <Para type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}>
            ₹ {item?.summary?.total || 0}
          </Para>
        </div>

        <div className={styles.actionButtonWrapper}>
          {item?.invoice_generated && (
            <Button
              type={BUTTON_CONSTANTS.TYPE.TEXT}
              classes={{label: styles.actionButtonLabel}}
              onClick={() => window.open(item?.invoice, '_blank')}
              prefixIcon={
                <Icon
                  name="download"
                  size={ICON_CONSTANTS.SIZES.XXX_SMALL}
                  type={ICON_CONSTANTS.TYPES.PRIMARY}
                />
              }
            >
              {t('invoice')}
            </Button>
          )}
          {item?.receipt && !item?.invoice_generated && (
            <Button
              type={BUTTON_CONSTANTS.TYPE.TEXT}
              classes={{label: styles.actionButtonLabel}}
              onClick={() => window.open(item?.receipt, '_blank')}
              prefixIcon={
                <Icon
                  name="download"
                  size={ICON_CONSTANTS.SIZES.XXX_SMALL}
                  type={ICON_CONSTANTS.TYPES.PRIMARY}
                />
              }
            >
              {t('receiptId')}
            </Button>
          )}
          <Button
            type={BUTTON_CONSTANTS.TYPE.TEXT}
            classes={{label: styles.actionButtonLabel}}
            onClick={() => {
              eventManager.send_event(events.VIEW_ID_CARD_ORDER_DETAILS_TFI, {
                screen_name: showTrackOrder ? 'id_card' : 'purshase_history',
              })
              setshowModal(true)
            }}
          >
            {t('viewOrderDetails')}
          </Button>
        </div>
      </div>

      {showTrackOrder && (
        <div className={styles.trackSection}>
          <div
            className={styles.trackAccordion}
            onClick={() => setOpenTrackAccordion(!openTrackAccordion)}
          >
            <Para
              type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
              textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
            >
              {t('trackOrder')}
            </Para>

            <Icon
              name={openTrackAccordion ? 'upArrow' : 'downArrow'}
              size={ICON_CONSTANTS.SIZES.XXX_SMALL}
            />
          </div>

          {openTrackAccordion && (
            <div className={styles.trackDetailsWrapper}>
              {statusItems?.map(({title, desc, status, active}, i) => (
                <div className={styles.trackItem} key={i}>
                  <div
                    className={classNames(
                      styles.trackStatusCircle,
                      status === STATUS_CODES.DONE
                        ? styles.trackStatusCircleSuccess
                        : status === STATUS_CODES.IN_PROGRESS
                        ? styles.trackStatusCircleProgress
                        : ''
                    )}
                  ></div>
                  <div className={styles.trackItemContent}>
                    <Para
                      type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
                      textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
                    >
                      {title}
                    </Para>
                    {active && (
                      <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>
                        {desc}
                      </Para>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showModal && (
        <OrderDetailsModal
          item={item}
          handleClose={() => setshowModal(false)}
        />
      )}
    </PlainCard>
  )
}
