import {
  Heading,
  HEADING_CONSTANTS,
  Icon,
  ICON_CONSTANTS,
  Para,
  PARA_CONSTANTS,
  Tooltip,
} from '@teachmint/krayon'
import classNames from 'classnames'
import React from 'react'
import {Trans, useTranslation} from 'react-i18next'
import {useSelector} from 'react-redux'
import {
  getAmountFixDecimalWithCurrency,
  numDifferentiation,
} from '../../../../../utils/Helpers'
import styles from './FeeFooter.module.css'

function DueApplicable() {
  const {data} = useSelector((state) => state.globalData.feeWidget)
  const {instituteInfo} = useSelector((state) => state)

  const {t} = useTranslation()
  return (
    <div>
      <div
        className={classNames('flex gap-1  items-end', styles.collectionPara)}
      >
        <Heading
          textSize={HEADING_CONSTANTS.TEXT_SIZE.X_SMALL}
          data-for="due-fee"
          data-tip
        >
          {numDifferentiation(data?.due_applicable, instituteInfo.currency)}
          <Tooltip
            classNames={{wrapper: styles.toolTipWrapper}}
            toolTipBody={
              <Para className={styles.tooltip}>
                {getAmountFixDecimalWithCurrency(
                  data?.due_applicable,
                  instituteInfo.currency
                )}
              </Para>
            }
            toolTipId="due-fee"
          />
        </Heading>
        {data?.fee_collected_lastweek ? (
          <div data-for="trending-fee" data-tip>
            <Para
              className={classNames('flex items-center gap-1 font-medium')}
              type={PARA_CONSTANTS.TYPE.SUCCESS}
            >
              {numDifferentiation(
                data?.fee_collected_lastweek,
                instituteInfo.currency
              )}
              <Icon
                type={ICON_CONSTANTS.TYPES.SUCCESS}
                name={'trendingDown'}
                size={ICON_CONSTANTS.SIZES.XXX_SMALL}
              />
            </Para>
            <Tooltip
              classNames={{wrapper: styles.toolTipWrapper}}
              toolTipBody={
                <Para className={styles.tooltip}>
                  <Icon
                    name={'info'}
                    type={ICON_CONSTANTS.TYPES.INVERTED}
                    version={ICON_CONSTANTS.VERSION.FILLED}
                    size={ICON_CONSTANTS.SIZES.XX_SMALL}
                  />
                  <Trans key={`lastWeekCollection`}>
                    {getAmountFixDecimalWithCurrency(
                      data?.fee_collected_lastweek,
                      instituteInfo.currency
                    )}{' '}
                    fee collected last 7 days
                  </Trans>
                </Para>
              }
              toolTipId="trending-fee"
            />
          </div>
        ) : null}
      </div>
      <Para className={classNames('mt-1', styles.footerFont12)}>
        {t('totalDueTillDate')}
      </Para>
    </div>
  )
}

export default DueApplicable
