import React, {useEffect} from 'react'
import {Button, Heading, Input} from '@teachmint/krayon'
import {useTranslation} from 'react-i18next'
import styles from '../CollectFees.module.css'
import {LUMPSUM_DISCOUNT} from '../../../fees.constants'
import DiscountFields from '../DiscountFields/DiscountFields'
import {getSymbolFromCurrency} from '../../../../../utils/Helpers'
import {
  fetchAdHocDiscountListingRequestAction,
  setDiscountStatesAction,
} from '../../../redux/feeDiscountsActions'
import {useDispatch, useSelector} from 'react-redux'
import CustomReason from '../AdHocDiscountModal/components/CustomReason/CustomReason'
import {DEFAULT_CURRENCY} from '../../../../../constants/common.constants'

export default function LumpSumAmount({
  handleLumpsumAmountChange = () => {},
  handleAddRemoveLumpsumDiscount = () => {},
  handleValidateLumpsumDiscount = () => {},
  lumpsumAmount = null,
  lumpsumAmountDiscount = null,
  lumpsumAmountError = null,
  setLumpsumAmountDiscount = () => {},
  isCreateReasonModalOpen = false,
  handleChangeAdHocDiscountValue,
  adHocDiscountReasons = [],
}) {
  const {t} = useTranslation()
  const {instituteInfo} = useSelector((state) => state)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchAdHocDiscountListingRequestAction())
    return () => {
      dispatch(
        setDiscountStatesAction({
          selectedAdHocReason: null,
        })
      )
    }
  }, [])

  const handleDeclineAddCustomReason = () => {
    setLumpsumAmountDiscount({
      ...lumpsumAmountDiscount,
      reasonId: null,
    })
    dispatch(
      setDiscountStatesAction({
        isCreateReasonModalOpen: false,
      })
    )
  }

  const handleOnChangeLumpsumDiscount = (obj) => {
    let modalValue = false
    if (obj.fieldName === 'discountAmount') {
      let value = obj.value !== '' && obj.value >= 0 ? +obj.value : ''
      let error = ''
      // validate
      let validation = handleValidateLumpsumDiscount(+value)
      if (!validation.isSuccess) {
        // value = lumpsumAmountDiscount?.discountAmount ?? ''
        error = validation.error
      } else {
        error = ''
      }

      setLumpsumAmountDiscount({
        ...lumpsumAmountDiscount,
        discountAmount: value,
        error,
      })
    } else if (obj.fieldName === 'remarks') {
      setLumpsumAmountDiscount({...lumpsumAmountDiscount, remarks: obj.value})
    } else if (obj.fieldName === 'reason') {
      if (obj?.value === 'noneOfAbove') {
        modalValue = true
      } else if (isCreateReasonModalOpen) {
        modalValue = false
      }

      setLumpsumAmountDiscount({
        ...lumpsumAmountDiscount,
        reasonId: obj.value,
      })

      dispatch(
        setDiscountStatesAction({
          isCreateReasonModalOpen: modalValue,
        })
      )
    }
  }

  return (
    <div className={styles.lumpsumAmount}>
      {isCreateReasonModalOpen && (
        <CustomReason
          isModalOpen={isCreateReasonModalOpen}
          handleDecline={handleDeclineAddCustomReason}
        />
      )}
      <div>
        <Input
          isRequired
          onChange={(value) => {
            handleLumpsumAmountChange(value.value)
          }}
          placeholder="10000"
          title={t('lumpsumAmountTitle')}
          type="number"
          value={lumpsumAmount}
          //   prefix={'₹'}
          prefix={
            <Heading textSize="s" className={styles.rupeeSymobol}>
              {getSymbolFromCurrency(
                instituteInfo.currency || DEFAULT_CURRENCY
              )}
            </Heading>
          }
          classes={{wrapper: styles.lumpsumAmountBox}}
          showMsg={lumpsumAmountError && lumpsumAmountError?.isLumpErr}
          infoMsg={lumpsumAmountError && lumpsumAmountError?.errorMsg}
          infoType={
            lumpsumAmountError && lumpsumAmountError?.isLumpErr && 'error'
          }
        />
      </div>
      <div className={styles.discountMargin}>
        {lumpsumAmountDiscount?.isAdded ? (
          <div>
            <DiscountFields
              lumpsumAmountDiscount={lumpsumAmountDiscount}
              handleOnChangeLumpsumDiscount={handleOnChangeLumpsumDiscount}
              adHocDiscountReasons={adHocDiscountReasons}
              handleAddRemoveLumpsumDiscount={handleAddRemoveLumpsumDiscount}
              handleChangeAdHocDiscountValue={handleChangeAdHocDiscountValue}
            />
          </div>
        ) : (
          <Button
            classes={{button: styles.lumpsumDiscountButton}}
            onClick={() => {
              handleAddRemoveLumpsumDiscount(LUMPSUM_DISCOUNT.ADD)
            }}
            type="text"
          >
            {t('addDiscount')}
          </Button>
        )}
      </div>
    </div>
  )
}
