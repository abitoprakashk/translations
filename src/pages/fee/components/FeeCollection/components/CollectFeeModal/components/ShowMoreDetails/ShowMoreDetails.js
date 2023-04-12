import React, {useContext, useState} from 'react'
import styles from './ShowMoreDetails.module.css'
import {
  Para,
  Icon,
  ICON_CONSTANTS,
  Input,
  Heading,
  PARA_CONSTANTS,
  HEADING_CONSTANTS,
} from '@teachmint/krayon'
import {
  collectFeeOptionsEvents,
  collectFeeOptionsIds,
} from '../../../../../../fees.constants'
import classNames from 'classnames'
import {DEFAULT_CURRENCY} from '../../../../../../../../constants/common.constants'
import {useDispatch, useSelector} from 'react-redux'
import getSymbolFromCurrency from 'currency-symbol-map'
import {getAmountFixDecimalWithCurrency} from '../../../../../../../../utils/Helpers'
import DiscountFields from '../../../../../CollectFees/DiscountFields/DiscountFields'
import {CollectFeeModalContext} from '../../../../../context/CollectFeeModalContext/CollectFeeModalContext'
import {onChangeLumpsumDiscount} from '../../../../../CollectFees/DiscountFields/helpers'
import {setDiscountStatesAction} from '../../../../../../redux/feeDiscountsActions'
import {t} from 'i18next'
import {events} from '../../../../../../../../utils/EventsConstants'
import {ErrorBoundary} from '@teachmint/common'

export function ShowMoreDetails({
  additionalNote,
  updateAdditionalNote,
  removeDiscount,
  removeDueFine,
  selectedRecordType,
  showDiscount,
  setShowDiscount,
  adHocDiscountReasons,
  showFine,
  setShowFine,
  collectFees,
  updateDueFine,
  dueFine,
}) {
  const {
    lumpsumAmountDiscount,
    setLumpsumAmountDiscount,
    collectFeesDuration,
    isCreateReasonModalOpen,
    lumpsumAmount,
    sendClickEvent,
  } = useContext(CollectFeeModalContext)
  const instituteInfo = useSelector((state) => state.instituteInfo)
  const [showAdditionalNote, setShowAdditionalNote] = useState(false)
  const [showMoreDetails, setShowMoreDetails] = useState(false)

  const dispatch = useDispatch()

  const handleOnChangeLumpsumDiscount = (obj) => {
    onChangeLumpsumDiscount(obj, {
      setLumpsumAmountDiscount,
      dispatch,
      isCreateReasonModalOpen,
      setDiscountStatesAction,
      collectFees,
      collectFeesDuration,
      lumpsumAmount,
    })
  }
  const handleAddRemoveLumpsumDiscount = (obj) => {
    if (obj === 'REMOVE') {
      removeDiscount()
    }
  }

  return (
    <ErrorBoundary>
      <div className={classNames(styles.d_flex)}>
        <Para
          textSize={PARA_CONSTANTS.TEXT_SIZE.X_LARGE}
          type={PARA_CONSTANTS.TYPE.PRIMARY}
          className={styles.title}
          onClick={() => {
            setShowMoreDetails(!showMoreDetails)
            if (!showMoreDetails) {
              sendClickEvent(events.RECORD_FEE_ADD_MORE_DETAILS_CLICKED_TFI, {
                type:
                  selectedRecordType === collectFeeOptionsIds.BY_FEE_STRUCTURE
                    ? collectFeeOptionsEvents.BY_FEE_STRUCTURE
                    : collectFeeOptionsEvents.BY_LUMPSUM_AMOUNT,
              })
            }
          }}
        >
          {showMoreDetails ? t('hideMoreDetails') : t('showMoreDetails')}
        </Para>
        <Icon
          name={showMoreDetails ? 'upArrow' : 'downArrow'}
          size={ICON_CONSTANTS.SIZES.XX_SMALL}
          type={ICON_CONSTANTS.TYPES.PRIMARY}
          className={styles.icon}
        />
      </div>
      {showMoreDetails && (
        <>
          {selectedRecordType === collectFeeOptionsIds.BY_LUMPSUM_AMOUNT && (
            <>
              {!showDiscount && (
                <div className={classNames(styles.d_flex)}>
                  <Para
                    textSize={PARA_CONSTANTS.TEXT_SIZE.X_LARGE}
                    type={PARA_CONSTANTS.TYPE.PRIMARY}
                    className={styles.title}
                    onClick={() => {
                      setShowDiscount(true)
                      sendClickEvent(events.RECORD_BY_ADD_DISCOUNT_TFI, {
                        type:
                          selectedRecordType ===
                          collectFeeOptionsIds.BY_FEE_STRUCTURE
                            ? collectFeeOptionsEvents.BY_FEE_STRUCTURE
                            : collectFeeOptionsEvents.BY_LUMPSUM_AMOUNT,
                      })
                    }}
                  >
                    {t('addDiscount')}
                  </Para>
                </div>
              )}
              {showDiscount && (
                <div>
                  <DiscountFields
                    lumpsumAmountDiscount={lumpsumAmountDiscount}
                    handleOnChangeLumpsumDiscount={
                      handleOnChangeLumpsumDiscount
                    }
                    adHocDiscountReasons={adHocDiscountReasons}
                    handleAddRemoveLumpsumDiscount={
                      handleAddRemoveLumpsumDiscount
                    }
                    sendClickEvent={sendClickEvent}
                    recordType={
                      selectedRecordType ===
                      collectFeeOptionsIds.BY_FEE_STRUCTURE
                        ? collectFeeOptionsEvents.BY_FEE_STRUCTURE
                        : collectFeeOptionsEvents.BY_LUMPSUM_AMOUNT
                    }
                  />
                </div>
              )}
            </>
          )}
          {!showFine && (
            <div className={classNames(styles.d_flex)}>
              <Para
                textSize={PARA_CONSTANTS.TEXT_SIZE.X_LARGE}
                type={PARA_CONSTANTS.TYPE.PRIMARY}
                className={styles.title}
                onClick={() => {
                  setShowFine(true)
                  sendClickEvent(events.RECORD_BY_ADD_DUE_FINE_TFI, {
                    type:
                      selectedRecordType ===
                      collectFeeOptionsIds.BY_FEE_STRUCTURE
                        ? collectFeeOptionsEvents.BY_FEE_STRUCTURE
                        : collectFeeOptionsEvents.BY_LUMPSUM_AMOUNT,
                  })
                }}
              >
                {t('collectDueFine')}
              </Para>
            </div>
          )}
          {showFine && (
            <div className={styles.collectFineWrapper}>
              <div className={styles.inputFieldGroup}>
                <div className={styles.dueAmount}>
                  <Para
                    textSize={PARA_CONSTANTS.TEXT_SIZE.LARGE}
                    type={PARA_CONSTANTS.TYPE.TEXT_SECONDARY}
                    className={styles.title}
                  >
                    {t('dueFine')}
                  </Para>
                  <Para
                    textSize={PARA_CONSTANTS.TEXT_SIZE.LARGE}
                    type={PARA_CONSTANTS.TYPE.ERROR}
                    className={styles.title}
                  >
                    {getAmountFixDecimalWithCurrency(
                      collectFees?.fine.due || 0,
                      instituteInfo.currency
                    )}
                  </Para>
                </div>
                <Input
                  fieldName="textField"
                  isRequired
                  onChange={(e) =>
                    updateDueFine(
                      e.value > collectFees?.fine.due
                        ? collectFees?.fine.due
                        : e.value
                    )
                  }
                  placeholder="100"
                  showMsg
                  value={dueFine}
                  title={t('fine')}
                  type="number"
                  prefix={
                    <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.SMALL}>
                      {getSymbolFromCurrency(
                        instituteInfo.currency || DEFAULT_CURRENCY
                      )}
                    </Heading>
                  }
                  classes={{wrapper: styles.inputWrapper}}
                />
              </div>
              <div className={styles.deleteIconWrapper}>
                <span className={styles.deleteIconTitle}>{t('fine')}</span>
                <Icon
                  name="delete1"
                  size={ICON_CONSTANTS.SIZES.X_SMALL}
                  type={ICON_CONSTANTS.TYPES.ERROR}
                  onClick={() => {
                    removeDueFine()
                    sendClickEvent(events.RECORD_BY_DELETE_DUE_FINE_TFI, {
                      type:
                        selectedRecordType ===
                        collectFeeOptionsIds.BY_FEE_STRUCTURE
                          ? collectFeeOptionsEvents.BY_FEE_STRUCTURE
                          : collectFeeOptionsEvents.BY_LUMPSUM_AMOUNT,
                    })
                  }}
                  className={classNames(
                    styles.icon,
                    styles.errorColor,
                    styles.higherSpecificity
                  )}
                />
              </div>
            </div>
          )}
          {!showAdditionalNote && (
            <div className={classNames(styles.d_flex)}>
              <Para
                textSize={PARA_CONSTANTS.TEXT_SIZE.X_LARGE}
                type={PARA_CONSTANTS.TYPE.PRIMARY}
                className={styles.title}
                onClick={() => {
                  setShowAdditionalNote(true)
                  sendClickEvent(events.RECORD_FEE_ADD_NOTE_CLICKED_TFI, {
                    type:
                      selectedRecordType ===
                      collectFeeOptionsIds.BY_FEE_STRUCTURE
                        ? collectFeeOptionsEvents.BY_FEE_STRUCTURE
                        : collectFeeOptionsEvents.BY_LUMPSUM_AMOUNT,
                  })
                }}
              >
                {t('addNote')}
              </Para>
            </div>
          )}
          {showAdditionalNote && (
            <Input
              fieldName="textField"
              isRequired={false}
              onChange={(e) => updateAdditionalNote(e.value)}
              placeholder={t('typeHereWithDot')}
              rows={2}
              value={additionalNote}
              showMsg
              title={t('additionalNote')}
              type="textarea"
            />
          )}
        </>
      )}
    </ErrorBoundary>
  )
}
