import React from 'react'
import styles from './DiscountFields.module.css'
import collectFeeStyles from '../CollectFees.module.css'
import {
  Heading,
  Icon,
  ICON_CONSTANTS,
  Input,
  PlainCard,
} from '@teachmint/krayon'
import classNames from 'classnames'
import {useTranslation} from 'react-i18next'
import {LUMPSUM_DISCOUNT} from '../../../fees.constants'
import {useSelector} from 'react-redux'
import {DEFAULT_CURRENCY} from '../../../../../constants/common.constants'
import {getSymbolFromCurrency} from '../../../../../utils/Helpers'
import {events} from '../../../../../utils/EventsConstants'
import {ErrorBoundary} from '@teachmint/common'

export default function DiscountFields({
  lumpsumAmountDiscount = {},
  handleOnChangeLumpsumDiscount = () => {},
  adHocDiscountReasons = [],
  handleAddRemoveLumpsumDiscount = () => {},
  sendClickEvent = () => {},
  recordType = '',
}) {
  const {t} = useTranslation()
  const {instituteInfo} = useSelector((state) => state)

  return (
    <ErrorBoundary>
      <PlainCard>
        <div className={styles.section}>
          <div
            className={classNames(
              styles.showInMobile,
              styles.deleteIconSectionForMobile
            )}
          >
            <Heading textSize="xx_s">{t('discount')}</Heading>
            <Icon
              className={classNames(
                styles.errorColor,
                styles.higherSpecificity
              )}
              name={'delete1'}
              size="x_s"
              type={'error'}
              role="button"
              onClick={() => {
                handleAddRemoveLumpsumDiscount(LUMPSUM_DISCOUNT.REMOVE)
                sendClickEvent(events.RECORD_BY_DELETE_DISCOUNT_TFI, {
                  type: recordType,
                })
              }}
            />
          </div>
          <div className={styles.fieldsSection}>
            <div className={styles.inputWrapper}>
              <Input
                fieldName="discountAmount"
                isRequired
                onChange={(e) => handleOnChangeLumpsumDiscount(e)}
                placeholder="200"
                title={t('valueAmountLabel')}
                type="text"
                validationError={lumpsumAmountDiscount?.error ? true : false}
                prefix={
                  <Heading
                    textSize="s"
                    className={collectFeeStyles.rupeeSymobol}
                  >
                    {getSymbolFromCurrency(
                      instituteInfo.currency || DEFAULT_CURRENCY
                    )}
                  </Heading>
                }
                classes={{
                  wrapper: classNames(styles.inputWrapper),
                }}
                value={lumpsumAmountDiscount?.discountAmount}
              />
              {lumpsumAmountDiscount?.error && (
                <div className={collectFeeStyles.errorDiv}>
                  {lumpsumAmountDiscount?.error}
                </div>
              )}
            </div>
            <div className={classNames(styles.inputWrapper)}>
              <Input
                fieldName="reason"
                isRequired
                onChange={(e) => handleOnChangeLumpsumDiscount(e)}
                placeholder={t('select')}
                title={t('reason')}
                classes={{wrapper: styles.inputWrapper, optionsClass: 'z-1'}}
                options={adHocDiscountReasons}
                type="dropdown"
                value={lumpsumAmountDiscount?.reasonId}
              />
              {lumpsumAmountDiscount?.reasonIdError && (
                <div className={collectFeeStyles.errorDiv}>
                  {lumpsumAmountDiscount?.reasonIdError}
                </div>
              )}
            </div>
            <Input
              fieldName="remarks"
              onChange={(e) => handleOnChangeLumpsumDiscount(e)}
              placeholder={t('typeHere')}
              title={t('remark')}
              type="text"
              classes={{wrapper: styles.inputWrapper}}
              value={lumpsumAmountDiscount?.remarks}
            />
          </div>

          <div
            className={styles.deleteBtnIconDiv}
            role="button"
            onClick={() =>
              handleAddRemoveLumpsumDiscount(LUMPSUM_DISCOUNT.REMOVE)
            }
          >
            <Icon
              className={classNames(
                styles.errorColor,
                styles.higherSpecificity,
                styles.hideInMobile
              )}
              name={'delete1'}
              size={ICON_CONSTANTS.SIZES.X_SMALL}
              type={ICON_CONSTANTS.TYPES.ERROR}
            />
          </div>
        </div>
      </PlainCard>
    </ErrorBoundary>
  )
}
