import {RULES_OPTION_VALUE} from './FineConstant'

export const validateSaveRules = ({fieldsToValidate}) => {
  const {
    selectedRuleType,
    selectedFeeTypes,
    isGracePeriodChecked,
    perdayFineAmountValue,
    gracePeriodDays,
    slotWiseData,
  } = fieldsToValidate
  //   console.log('log', 'selectedRuleType', selectedRuleType)

  if (
    selectedFeeTypes.length === 0 ||
    ![RULES_OPTION_VALUE.perDay, RULES_OPTION_VALUE.slotWise].includes(
      selectedRuleType
    )
  ) {
    return true
  }

  //   per day
  if (selectedRuleType === RULES_OPTION_VALUE.perDay) {
    if (perdayFineAmountValue.trim() === '') {
      return true
    }

    if (isGracePeriodChecked && !gracePeriodDays) {
      return true
    }
  }

  //   slot wise
  if (selectedRuleType === RULES_OPTION_VALUE.slotWise) {
    // console.log(
    //   'slotWiseData',
    //   slotWiseData,
    //   'vali',
    //   slotWiseData
    //     .filter((data) => !data.isDelete)
    //     .every(
    //       (data) =>
    //         data.amount?.trim() !== '' && data.from !== '' && data.to !== ''
    //     )
    // )

    return !slotWiseData
      .filter((data) => !data.isDelete)
      .every(
        (data) =>
          data.amount?.trim() !== '' && data.from !== '' && data.to !== ''
      )
  }

  return false
}
