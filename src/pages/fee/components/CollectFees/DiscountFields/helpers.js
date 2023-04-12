import getSymbolFromCurrency from 'currency-symbol-map'
import {t} from 'i18next'
import {Trans} from 'react-i18next'
import {DEFAULT_CURRENCY} from '../../../../../constants/common.constants'
import {getPlainAmountFixDecimalWithCurrency} from '../../../../../utils/Helpers'

export const onLumpsumAmountChange = (value, extraData = {}) => {
  const {
    collectFees,
    collectFeesDuration,
    instituteInfo,
    lumpsumAmountDiscount,
    setLumpsumAmountDiscount,
    setLumpsumAmountError,
    lumpsumAmountError,
    setLumpsumAmount,
  } = extraData
  var validNumber = new RegExp(/^\d*\.?\d*$/)
  let dueAmount = collectFees[`${collectFeesDuration}TotalDue`].toFixed(2)
  let isValueValid = validNumber.test(value)
  let errorMsg = (
    <Trans i18nKey={'lumpsumpAmountErrorMsg'}>
      Lump sum can&quot;t be more than due fee{' '}
      <div className="inline-flex">
        <span>
          {getSymbolFromCurrency(instituteInfo.currency || DEFAULT_CURRENCY)}
        </span>
        <span className="ml-1">{`${getPlainAmountFixDecimalWithCurrency(
          dueAmount,
          instituteInfo.currency
        )}`}</span>
      </div>
    </Trans>
  )

  if (isValueValid) {
    if (
      //   lumpsumAmountDiscount?.isAdded &&
      lumpsumAmountDiscount?.discountAmount + +value < dueAmount &&
      lumpsumAmountDiscount?.error
    ) {
      setLumpsumAmountDiscount({
        ...lumpsumAmountDiscount,
        error: '',
      })
    } else if (
      lumpsumAmountDiscount?.isAdded &&
      lumpsumAmountDiscount?.discountAmount + +value > dueAmount
    ) {
      setLumpsumAmountError({
        ...lumpsumAmountError,
        isLumpErr: true,
        errorMsg: t('discountPlusLumpSumError'),
      })
    } else if (+value > dueAmount && !lumpsumAmountError?.isLumpErr) {
      setLumpsumAmountError({
        ...lumpsumAmountError,
        isLumpErr: true,
        errorMsg,
      })
    } else if (+value <= dueAmount && lumpsumAmountError?.isLumpErr) {
      setLumpsumAmountError({
        ...lumpsumAmountError,
        isLumpErr: false,
        errorMsg: '',
      })
    }
  }

  setLumpsumAmount(value)
}

export const onValidateLumpsumDiscount = (
  discountAmount = 0,
  extraData = {}
) => {
  const {collectFees, collectFeesDuration, lumpsumAmount} = extraData
  let dueAmount = collectFees[`${collectFeesDuration}TotalDue`].toFixed(2)
  let totalofLumpsumAndDiscount = +lumpsumAmount + discountAmount
  // check if sum of lumpsum amount and discount amount can't be more than due amount
  // check if discount amount can't be more than due amount
  if (!discountAmount) {
    return {isSuccess: true, error: ''}
  }
  if (discountAmount > dueAmount) {
    return {isSuccess: false, error: t('discountCantBeMoreThanDueFee')}
  } else if (totalofLumpsumAndDiscount > dueAmount) {
    return {isSuccess: false, error: t('discountPlusLumpSumError')}
  } else {
    return {isSuccess: true, error: ''}
  }
}

export const onChangeLumpsumDiscount = (obj, extraData = {}) => {
  const {
    setLumpsumAmountDiscount,
    // lumpsumAmountDiscount,
    dispatch,
    isCreateReasonModalOpen,
    setDiscountStatesAction,
    collectFees,
    collectFeesDuration,
    lumpsumAmount,
  } = extraData
  let modalValue = false
  if (obj.fieldName === 'discountAmount') {
    let value = obj.value !== '' && obj.value >= 0 ? +obj.value : ''
    let error = ''
    // validate
    let validation = onValidateLumpsumDiscount(+value, {
      collectFees,
      collectFeesDuration,
      lumpsumAmount,
    })
    if (!validation.isSuccess) {
      // value = lumpsumAmountDiscount?.discountAmount ?? ''
      error = validation.error
    } else {
      error = ''
    }

    setLumpsumAmountDiscount((prev) => {
      return {
        ...prev,
        discountAmount: value,
        error,
      }
    })
  } else if (obj.fieldName === 'remarks') {
    setLumpsumAmountDiscount((prev) => {
      return {...prev, remarks: obj.value}
    })
  } else if (obj.fieldName === 'reason') {
    if (obj?.value === 'noneOfAbove') {
      modalValue = true
    } else if (isCreateReasonModalOpen) {
      modalValue = false
    }

    setLumpsumAmountDiscount((prev) => {
      return {
        ...prev,
        reasonId: obj.value,
      }
    })

    dispatch(
      setDiscountStatesAction({
        isCreateReasonModalOpen: modalValue,
      })
    )
  }
}
