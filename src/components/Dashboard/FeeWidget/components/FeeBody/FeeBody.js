import {
  Heading,
  HEADING_CONSTANTS,
  Icon,
  ICON_CONSTANTS,
  Para,
  PARA_CONSTANTS,
} from '@teachmint/krayon'
import classNames from 'classnames'
import {DateTime} from 'luxon'
import React from 'react'
import {Trans, useTranslation} from 'react-i18next'
import {useSelector} from 'react-redux'
import {Link} from 'react-router-dom'
import {getAmountFixDecimalWithCurrency} from '../../../../../utils/Helpers'
import {FEE_WIDGET_EVENTS} from '../../events'
import Shimmer from '../Shimmer/Shimmer'
import styles from './FeeBody.module.css'

const DATE_FORMAT = `yyyy-MM-dd`
const ROUTE = `/institute/dashboard/fee-transactions/bank?startDate=${DateTime.fromJSDate(
  new Date()
).toFormat(DATE_FORMAT)}&endDate=${DateTime.fromJSDate(new Date()).toFormat(
  DATE_FORMAT
)}`

function FeeBody() {
  const {t} = useTranslation()
  const {instituteInfo, eventManager} = useSelector((state) => state)
  const {isLoading, data} = useSelector((state) => state.globalData.feeWidget)
  const {feeStructuresLoading} = useSelector((state) => state.feeStructure)
  return (
    <div className={styles.contentWrapper}>
      {isLoading || feeStructuresLoading ? (
        <Shimmer />
      ) : (
        <Link
          to={ROUTE}
          onClick={() => {
            eventManager.send_event(
              FEE_WIDGET_EVENTS.DASHBOARD_FEES_REPORTS_TRANSACTIONS_CLICKED_TFI
            )
          }}
        >
          <div className={classNames('flex justify-between')}>
            <div className={styles.wrapper}>
              <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.MEDIUM}>
                {getAmountFixDecimalWithCurrency(
                  data?.today_collection,
                  instituteInfo.currency
                )}
              </Heading>
              <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>
                {t('todaysCollection')}
              </Para>
              {data?.collected_from?.length ? (
                <Para
                  type={PARA_CONSTANTS.TYPE.SUCCESS}
                  textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
                >
                  <Trans i18nKey={'feeCollect'}>
                    Collected from{' '}
                    {{studentCount: data?.collected_from?.length}} students
                  </Trans>
                </Para>
              ) : null}
            </div>
            <Icon
              size={ICON_CONSTANTS.SIZES.XXX_SMALL}
              name="arrowForwardIos"
            />
          </div>
        </Link>
      )}
    </div>
  )
}

export default FeeBody
