import React from 'react'
import styles from './StudentInfo.module.css'
import collectFeesStyles from '../CollectFees.module.css'
import {Avatar, Badges, Divider, Para, Toggle} from '@teachmint/krayon'
import {useTranslation} from 'react-i18next'
import {getAmountFixDecimalWithCurrency} from '../../../../../utils/Helpers'
import classNames from 'classnames'
import {useSelector} from 'react-redux'
import {FEE_DATE_TOGGLE_SWITCH} from '../../../fees.constants'

export default function StudentInfo({
  collectFees = {},
  collectFeesDuration = {},
  handleDurationChange = () => {},
  advancePaymentStatus = '',
}) {
  const {t} = useTranslation()
  const {instituteInfo} = useSelector((state) => state)
  return (
    <div className={styles.mainSection}>
      <div className={styles.section}>
        <div className={styles.avatarAndName}>
          <Avatar name={collectFees?.name} variant="variant3" size="l" />
          <div>
            <Para type="text-primary" className={styles.fontWeight600}>
              {collectFees?.name}
            </Para>
            <div className={styles.numberAndJoinSection}>
              <Para type="text-primary">
                {collectFees?.enrollmentNumber ||
                  collectFees?.phoneNumber ||
                  collectFees?.email}
              </Para>
              <div className={styles.dot}></div>
              <Badges
                label={
                  collectFees?.verificationStatus === 1
                    ? t('joined')
                    : t('notJoined')
                }
                showIcon={false}
                type={
                  collectFees?.verificationStatus === 1 ? 'success' : 'error'
                }
              />
            </div>
          </div>
        </div>
        <Divider isVertical length="40px" spacing="20px" thickness="1px" />
        <div>
          <Para>{t('class')}</Para>
          <Para type="text-primary" className={styles.classText}>
            {collectFees.class} {collectFees.section}
          </Para>
        </div>
        <Divider isVertical length="40px" spacing="20px" thickness="1px" />
        <div>
          <Para>
            {advancePaymentStatus === FEE_DATE_TOGGLE_SWITCH.CURRENT
              ? t('dueTillDate')
              : t('totalAnnualFee')}
          </Para>
          <Para
            type="error"
            className={classNames(
              styles.dueFee,
              collectFeesStyles.krErrorColor
            )}
          >
            {getAmountFixDecimalWithCurrency(
              collectFees[`${collectFeesDuration}TotalDue`],
              instituteInfo.currency
            )}
          </Para>
        </div>
      </div>
      <div>
        <div className={styles.toggleSwitchSection}>
          <Para>{t('showFeeTillDate')}</Para>
          <Toggle
            isSelected={advancePaymentStatus === FEE_DATE_TOGGLE_SWITCH.ENTIRE}
            classes={{wrapper: styles.toggleSwitch}}
            handleChange={(obj) =>
              handleDurationChange(
                obj.value
                  ? FEE_DATE_TOGGLE_SWITCH.ENTIRE
                  : FEE_DATE_TOGGLE_SWITCH.CURRENT
              )
            }
          />
          <Para>{t('showFeeForFullSession')}</Para>
        </div>
      </div>
    </div>
  )
}
