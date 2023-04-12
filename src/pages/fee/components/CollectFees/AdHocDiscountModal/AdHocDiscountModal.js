import React, {useEffect} from 'react'
import {Button, Icon, Input, Modal} from '@teachmint/common'
import styles from './AdHocDiscountModal.module.css'
import classNames from 'classnames'
import {
  ADD_AD_ON_DISCOUNT,
  collectFeeOptionsIds,
  EXISTING_DISCOUNT,
  PLACEHOLDERS,
} from '../../../fees.constants'
import {Trans, useTranslation} from 'react-i18next'
import {useSelector} from 'react-redux'
import TextArea from './components/TextArea/TextArea'
import CustomReason from './components/CustomReason/CustomReason'
import {setDiscountStatesAction} from '../../../redux/feeDiscountsActions'
import {useDispatch} from 'react-redux'
import {roundWithPrecision} from '../../../../../utils/Helpers'
import {fetchAdHocDiscountListingRequestAction} from '../../../redux/feeDiscountsActions'
import {useFeeDiscount} from '../../../redux/feeDiscounts.selectors'
import {getSymbolFromCurrency} from '../../../../../utils/Helpers'
import {DEFAULT_CURRENCY} from '../../../../../constants/common.constants'

export default function AdHocDiscountModal({
  isShowOpen = false,
  handleCancleAddAdHocDiscount = () => {},
  handleAddAdHocDiscountClick = () => {},
  isPreviousSession,

  isCreateReasonModalOpen = false,
  recordSelectedForAdHoc = {},
  adHocDiscountValues = {},
  handleChangeAdHocDiscountValue = () => {},
  resetAdHocValues = () => {},
  setAdHocDiscountValues = () => {},
  isEditAdHocDiscount = false,
  collectFeeType = collectFeeOptionsIds.BY_FEE_STRUCTURE,
}) {
  const {t} = useTranslation()
  const {instituteInfo} = useSelector((state) => state)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchAdHocDiscountListingRequestAction())
    return () => {
      resetAdHocValues()
      dispatch(
        setDiscountStatesAction({
          selectedAdHocReason: null,
        })
      )
    }
  }, [])

  const handleDeclineAddCustomReason = () => {
    setAdHocDiscountValues({
      ...adHocDiscountValues,
      adHocReasonId: null,
    })
    dispatch(
      setDiscountStatesAction({
        isCreateReasonModalOpen: false,
      })
    )
  }

  const {adHocDiscountReasons} = useFeeDiscount()

  return (
    <>
      {isCreateReasonModalOpen && (
        <CustomReason
          isModalOpen={isCreateReasonModalOpen}
          handleDecline={handleDeclineAddCustomReason}
        />
      )}

      <Modal
        show={isShowOpen}
        className={classNames(styles.modalMainSection, styles.modalMain)}
      >
        <div className={styles.modalSection}>
          <div className={styles.modalHeadingSection}>
            <div className={styles.iconAndHeadingSection}>
              <div className={styles.feeModalHeadingText}>
                {collectFeeType === collectFeeOptionsIds.BY_FEE_STRUCTURE
                  ? t(ADD_AD_ON_DISCOUNT)
                  : t('discount')}
              </div>
            </div>
            <div>
              <button onClick={handleCancleAddAdHocDiscount}>
                <Icon
                  color="secondary"
                  name="circledClose"
                  size="xs"
                  type="filled"
                />
              </button>
            </div>
          </div>

          {recordSelectedForAdHoc?.discount > 0 && (
            <div className={styles.alertSection}>
              <div className={styles.exisitingDiscountSection}>
                <Icon color="success" name="error" size="xxxs" type="filled" />
                <span className={styles.existingDiscountText}>
                  {t(EXISTING_DISCOUNT)}
                </span>
              </div>
              <div className={styles.existingDiscountInfoText}>
                <Trans i18nKey={'existingDiscountInfo'}>
                  <span className={styles.existingDiscountInfoTextMainWord}>
                    {recordSelectedForAdHoc?.studentName}
                  </span>{' '}
                  already has a discount of{' '}
                  <span className={styles.existingDiscountInfoTextMainWord}>
                    {getSymbolFromCurrency(
                      instituteInfo.currency || DEFAULT_CURRENCY
                    )}
                    {`${roundWithPrecision(recordSelectedForAdHoc?.discount)}`}{' '}
                  </span>
                  on{' '}
                  <span className={styles.existingDiscountInfoTextMainWord}>
                    {recordSelectedForAdHoc?.name}
                  </span>{' '}
                  for{' '}
                  <span className={styles.existingDiscountInfoTextMainWord}>
                    {recordSelectedForAdHoc?.monthDetail}
                  </span>
                </Trans>
              </div>
            </div>
          )}
          <div className={styles.fieldsSection}>
            {collectFeeType === collectFeeOptionsIds.BY_FEE_STRUCTURE && (
              <div className={styles.discountInfoTextDiv}>
                <span className={styles.discountInfoText}>
                  <Trans i18nKey={'addingAdHocDiscountFor'}>
                    Adding discount for {recordSelectedForAdHoc.feeTypeName} (
                    {recordSelectedForAdHoc?.monthDetail}) in{' '}
                    {recordSelectedForAdHoc?.name}
                  </Trans>
                </span>
              </div>
            )}
            <div className={styles.InputFieldSection}>
              <Input
                type="number"
                title={t('enterDiscountAmount')}
                fieldName="discountAmount"
                value={adHocDiscountValues?.discountAmount}
                className={styles.fieldsSectionInput}
                placeholder={PLACEHOLDERS.discountAmount}
                onChange={(obj) => handleChangeAdHocDiscountValue(obj)}
                classes={{wrapper: styles.inputWrapper, title: 'tm-para'}}
                minLength="0"
              />
              {recordSelectedForAdHoc?.discountAmountError && (
                <div className={styles.error}>
                  {recordSelectedForAdHoc?.discountAmountError}
                </div>
              )}

              <Input
                type="select"
                title={t('selectReason')}
                fieldName="reason"
                value={adHocDiscountValues?.adHocReasonId}
                options={adHocDiscountReasons}
                className={styles.fieldsSectionInput}
                onChange={(obj) => handleChangeAdHocDiscountValue(obj)}
                classes={{wrapper: styles.inputWrapper, title: 'tm-para'}}
              />
              <TextArea
                label={t('remarks')}
                // placeholder={t('studentIsNotAbleToPayDueTo')}
                wrapperClassName={styles.textAreaDiv}
                textAreaClassName={styles.textArea}
                fieldName={'remarks'}
                value={adHocDiscountValues?.remarks}
                onChange={(obj) => handleChangeAdHocDiscountValue(obj)}
              />
            </div>
          </div>

          <div className={styles.modalFooterSection}>
            <Button
              size="big"
              className={classNames(
                styles.higherspecifisity,
                styles.button,
                styles.cancelBtn
              )}
              onClick={handleCancleAddAdHocDiscount}
            >
              {t('cancel')}
            </Button>
            <Button
              size="big"
              className={classNames(styles.higherspecifisity, styles.button)}
              disabled={
                adHocDiscountValues.discountAmount === '' ||
                adHocDiscountValues.adHocReasonId === 'noneOfAbove' ||
                adHocDiscountValues.adHocReasonId === null
              }
              onClick={() => {
                handleAddAdHocDiscountClick(isPreviousSession)
              }}
            >
              {isEditAdHocDiscount ? t('updateDiscount') : t('addDiscount')}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
