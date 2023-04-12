import React from 'react'
import styles from './FeeFineData.module.css'
import collectFeeStyles from '../CollectFees.module.css'
import {APPLIED_FEE_FINE} from '../../../fees.constants'
import {useTranslation} from 'react-i18next'
import {useSelector} from 'react-redux'
import {getAmountFixDecimalWithCurrency} from '../../../../../utils/Helpers'
import {getSymbolFromCurrency} from '../../../../../utils/Helpers'
import {
  Button,
  Divider,
  Heading,
  Icon,
  Input,
  Para,
  PlainCard,
} from '@teachmint/krayon'
import classNames from 'classnames'
// import {useState} from 'react'
import {DEFAULT_CURRENCY} from '../../../../../constants/common.constants'

export default function FeeFineData({
  fineData = {},
  handleAppliedFineChecbox = () => {},
  isFeeFineApplied = true,
  fineAmountValue = 0,
  setFineAmountValue = () => {},
}) {
  const {t} = useTranslation()
  const {instituteInfo} = useSelector((state) => state)
  // if (isNewDesign) {
  return (
    <div className={styles.feeDataSection}>
      {isFeeFineApplied ? (
        <PlainCard className={styles.plainCard}>
          <div className={styles.feeDataContentSection}>
            <div className={styles.feeDataInnerContentSection}>
              <div>
                <Para textSize="l">{t('dueFine')}</Para>
                <Para type="error" className={styles.dueFineText}>
                  {getAmountFixDecimalWithCurrency(
                    fineData.due,
                    instituteInfo.currency
                  )}
                </Para>
              </div>
              <Divider
                isVertical
                length="70px"
                spacing="40px"
                thickness="1px"
              />
              <div>
                <Input
                  fieldName="fineAmount"
                  onChange={(obj) => {
                    if (obj.value > fineData.due) {
                      return
                    }
                    setFineAmountValue(obj.value)
                  }}
                  placeholder="200"
                  title={t('fineAmount')}
                  type="number"
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
                  classes={{wrapper: styles.fineInputField}}
                  value={fineAmountValue}
                />
              </div>
            </div>
            <div
              role="button"
              onClick={() =>
                handleAppliedFineChecbox({
                  fieldName: APPLIED_FEE_FINE.feeCollectionCheckbox.fieldName,
                  checked: false,
                })
              }
            >
              <Icon
                className={classNames(
                  collectFeeStyles.errorColor,
                  collectFeeStyles.higherSpecificity
                )}
                name={'delete1'}
                size="x_s"
                type={'error'}
              />
            </div>
          </div>
        </PlainCard>
      ) : (
        <Button
          onClick={() =>
            handleAppliedFineChecbox({
              fieldName: APPLIED_FEE_FINE.feeCollectionCheckbox.fieldName,
              checked: true,
            })
          }
          type="text"
          classes={{button: styles.collectDueFineBtn}}
        >
          {t('collectDueFine')}
        </Button>
      )}
    </div>
  )
  // }

  // return (
  //   <div className={styles.section}>
  //     <div>
  //       <Input
  //         type="checkbox"
  //         isChecked={isFeeFineApplied}
  //         fieldName={APPLIED_FEE_FINE.feeCollectionCheckbox.fieldName}
  //         onChange={(obj) => handleAppliedFineChecbox(obj)}
  //         labelTxt={t(APPLIED_FEE_FINE.feeCollectionCheckbox.labelTxt)}
  //         classes={{wrapper: styles.commonWrapper}}
  //       />
  //     </div>
  //     <div>
  //       <div className={styles.appliedAmountText}>
  //         {getAmountFixDecimalWithCurrency(fineData.applied)}
  //       </div>
  //       <div className={styles.subText}>{t('applied')}</div>
  //     </div>
  //     <div>
  //       <div className={styles.dueAmountText}>
  //         {getAmountFixDecimalWithCurrency(fineData.due)}
  //       </div>
  //       <div className={styles.subText}>{t('due')}</div>
  //     </div>
  //     <div>
  //       {isFeeFineApplied ? (
  //         <>
  //           <Input
  //             type="number"
  //             fieldName="fineAmount"
  //             isRequired={false}
  //             value={fineAmountValue}
  //             className={styles.amountInput}
  //             onChange={(obj) => {
  //               if (obj.value > fineData.due) {
  //                 // setShowFineAmountValueErrMsg(true)
  //                 return
  //               }
  //               // if (showFineAmountValueErrMsg) {
  //               //   setShowFineAmountValueErrMsg(false)
  //               // }
  //               setFineAmountValue(obj.value)
  //             }}
  //             classes={{wrapper: styles.commonWrapper}}
  //           />
  //           {/* {showFineAmountValueErrMsg && (
  //             <div className={styles.dueAmountText}>
  //               {fineAmountValueErrMsg}
  //             </div>
  //           )} */}
  //         </>
  //       ) : (
  //         <span>{getSymbolFromCurrency(instituteInfo.currency || 'INR')} 0 0</span>
  //       )}
  //     </div>
  //   </div>
  // )
}
