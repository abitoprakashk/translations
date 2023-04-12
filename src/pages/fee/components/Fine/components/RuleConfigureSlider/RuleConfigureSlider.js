import React from 'react'
import styles from './RuleConfigureSlider.module.css'
import perDayStyles from '../PerDay/PerDay.module.css'
import SliderScreen from '../../../../../../components/Common/SliderScreen/SliderScreen'
import SliderScreenHeader from '../../../../../../components/Common/SliderScreenHeader/SliderScreenHeader'
import {Button, Input, MultiSelectInput, StickyFooter} from '@teachmint/common'
import {useTranslation} from 'react-i18next'
import {
  APPLIED_FROM_START_DATE_LBL,
  CONFIGURE_FEE_RULES_SLIDER_HEADING,
  CONFIGURE_RULE_SLIDER_CLOSE_POPUP,
  // CREATE_FINE_RULEs_LABEL,
  FEE_TYPE_LABEL,
  FIELDS,
  PLACEHOLDER,
  // RULES_OPTIONS,
  RULES_OPTION_VALUE,
} from '../../FineConstant'
import {useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import classNames from 'classnames'
import PerDay from '../PerDay/PerDay'
import SlotWise from '../SlotWise/SlotWise'
import {validateSaveRules} from '../../validations'
import {saveRuleConfigurationAction} from '../../redux/FineActions'
import {useEffect} from 'react'
import ConfirmationPopup from '../../../../../../components/Common/ConfirmationPopup/ConfirmationPopup'
import {events} from '../../../../../../utils/EventsConstants'
import {getFeeTypeNames} from '../../commonFunctions'

export default function RuleConfigureSlider({setOpen, feeTypes}) {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const eventManager = useSelector((state) => state.eventManager)
  const {saveFineRuleLoader} = useSelector((state) => state.feeFine)
  const [selectedRuleType, setSelectedRuleType] = useState(
    RULES_OPTION_VALUE.perDay
  )
  const [selectedFeeTypes, setSelectedFeeTypes] = useState([])
  const [isGracePeriodChecked, setIsGracePeriodChecked] = useState(false)
  const [perdayFineAmountValue, setPerdayFineAmountValue] = useState('')
  const [gracePeriodDays, setGracePeriodDays] = useState('')
  const slotWiseDataBlankRow = {
    from: '',
    to: '',
    amount: '',
  }
  const [slotWiseData, setSlotWiseData] = useState([{...slotWiseDataBlankRow}])
  const [showConfirmPopup, setShowConfirmPopup] = useState(false)
  const [isAppliedFromStartDate, setIsAppliedFromStartDate] = useState(true)

  useEffect(() => {
    return () => {
      setSelectedRuleType(null)
      setSelectedFeeTypes([])
      setIsGracePeriodChecked(false)
      setPerdayFineAmountValue('')
      setGracePeriodDays('')
      setSlotWiseData([{...slotWiseDataBlankRow}])
    }
  }, [])

  const handleChange = (obj) => {
    if (obj.fieldName === FIELDS.rules) {
      setSelectedRuleType(obj.value)
    } else if (obj.fieldName === FIELDS.gracePeriod) {
      setIsGracePeriodChecked(obj.checked)
    } else if (obj.fieldName === FIELDS.perDayFineAmount) {
      setPerdayFineAmountValue(obj.value < 0 ? '' : obj.value)
    } else if (obj.fieldName === FIELDS.selectDays) {
      setGracePeriodDays(obj.value < 0 ? '' : obj.value)
    } else if (obj.fieldName === FIELDS.feeType) {
      setSelectedFeeTypes(obj.value)
    } else if (obj.fieldName === FIELDS.appliedFromStartDate) {
      setIsAppliedFromStartDate(obj.checked)
    } else if (
      [FIELDS.amount, FIELDS.from, FIELDS.to].includes(obj.fieldName)
    ) {
      let newSlotWiseData = [...slotWiseData]
      newSlotWiseData[obj.index][obj.fieldName] = obj.value
      setSlotWiseData(newSlotWiseData)
    }
  }

  const handleClickOnSaveButton = () => {
    let data = {}
    data.type = selectedRuleType
    data.master_categories = selectedFeeTypes
    data.per_day_amount =
      perdayFineAmountValue !== ''
        ? parseFloat(+perdayFineAmountValue).toFixed(2)
        : 0.0
    data.grace_period = isGracePeriodChecked ? +gracePeriodDays : 0
    data.slot_wise_amounts =
      selectedRuleType === RULES_OPTION_VALUE.slotWise ? slotWiseData : []
    data.applied_from_start = isAppliedFromStartDate

    let feeTypesName = getFeeTypeNames({feeTypes, selectedFeeTypes})

    eventManager.send_event(events.FINE_RULES_SAVE_BUTTON_CLICKED_TFI, {
      fee_type: feeTypesName,
    })
    dispatch(saveRuleConfigurationAction(data, {eventManager, feeTypesName}))
  }

  return (
    <div>
      {showConfirmPopup && (
        <ConfirmationPopup
          onClose={() => setShowConfirmPopup(false)}
          onAction={() => {
            // eventManager.send_event(events.EXIT_POPUP_SHOWN_TFI, {
            //   fee_type: feestype,
            //   screen_name: 'create_fee_structure',
            // })
            setShowConfirmPopup(false)
            setOpen()
          }}
          icon={
            'https://storage.googleapis.com/tm-assets/icons/colorful/warning-orange.svg'
          }
          title={t(CONFIGURE_RULE_SLIDER_CLOSE_POPUP.title)}
          desc={t(CONFIGURE_RULE_SLIDER_CLOSE_POPUP.desc)}
          primaryBtnText={t(CONFIGURE_RULE_SLIDER_CLOSE_POPUP.primaryBtnText)}
          secondaryBtnText={t(
            CONFIGURE_RULE_SLIDER_CLOSE_POPUP.secondaryBtnText
          )}
        />
      )}

      <SliderScreen setOpen={() => setShowConfirmPopup(true)} width="1000">
        <>
          <SliderScreenHeader title={t(CONFIGURE_FEE_RULES_SLIDER_HEADING)} />
          <div
            className={classNames(
              styles.contentSection,
              'show-scrollbar-big show-scrollbar'
            )}
          >
            {saveFineRuleLoader ? (
              <div className="loading"></div>
            ) : (
              <div>
                <div
                  className={classNames(
                    styles.blockSection,
                    styles.borderBottom
                  )}
                >
                  <div>
                    {t(FEE_TYPE_LABEL)}{' '}
                    <span className={styles.required}>*</span>
                  </div>
                  <div className={styles.inputFieldSection}>
                    <MultiSelectInput
                      showSelectAll={true}
                      options={feeTypes.map((type) => {
                        return {
                          label: type.name,
                          value: type._id,
                        }
                      })}
                      selectedOptions={selectedFeeTypes}
                      onChange={(obj) =>
                        handleChange({value: obj, fieldName: FIELDS.feeType})
                      }
                      withTags={true}
                      placeholderClassName={styles.inputField}
                      placeholder={PLACEHOLDER.feeType}
                      dropdownClassName={'show-scrollbar show-scrollbar-small'}
                    />
                  </div>
                </div>

                {/* ===== FOR NEXT ===== */}

                {/* <div className={styles.blockSection}>
                  <div className={styles.numberLabelSection}>
                    <NumberLabel
                      number={2}
                      label={t(CREATE_FINE_RULEs_LABEL)}
                      labelClassName={styles.textCapitalize}
                    />
                  </div>
                  <div className={styles.inputFieldSection}>
                    <Input
                      type="radio"
                      fieldName={FIELDS.rules}
                      value={selectedRuleType}
                      options={RULES_OPTIONS}
                      onChange={(obj) => handleChange(obj)}
                      classes={{wrapper: styles.radioWarpper}}
                    />
                  </div>
                </div> */}

                {selectedRuleType === RULES_OPTION_VALUE.perDay && (
                  <PerDay
                    isGracePeriodChecked={isGracePeriodChecked}
                    perdayFineAmountValue={perdayFineAmountValue}
                    gracePeriodDays={gracePeriodDays}
                    handleChange={handleChange}
                  />
                )}
                {selectedRuleType === RULES_OPTION_VALUE.slotWise && (
                  <SlotWise
                    slotWiseData={slotWiseData}
                    handleChange={handleChange}
                    setSlotWiseData={setSlotWiseData}
                    blankRow={slotWiseDataBlankRow}
                  />
                )}
              </div>
            )}
          </div>

          {!saveFineRuleLoader && (
            <StickyFooter forSlider={true}>
              <div className={styles.footerSection}>
                <div>
                  <div className={perDayStyles.checkboxDiv}>
                    <Input
                      type="checkbox"
                      isChecked={isAppliedFromStartDate}
                      fieldName={FIELDS.appliedFromStartDate}
                      onChange={(obj) => handleChange(obj)}
                      labelTxt={t(APPLIED_FROM_START_DATE_LBL)}
                      classes={{wrapper: styles.wrapper}}
                    />
                  </div>
                </div>
                <div>
                  <Button
                    size={'big'}
                    className={styles.downloadReportBtn}
                    disabled={validateSaveRules({
                      fieldsToValidate: {
                        selectedRuleType,
                        selectedFeeTypes,
                        isGracePeriodChecked,
                        perdayFineAmountValue,
                        gracePeriodDays,
                        slotWiseData,
                      },
                    })}
                    onClick={handleClickOnSaveButton}
                  >
                    {t('save')}
                  </Button>
                </div>
              </div>
            </StickyFooter>
          )}
        </>
      </SliderScreen>
    </div>
  )
}
