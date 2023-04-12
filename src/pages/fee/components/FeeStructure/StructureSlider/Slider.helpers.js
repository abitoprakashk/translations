import {DateTime} from 'luxon'
import {events} from '../../../../../utils/EventsConstants'
import {FEE_STRUCTURE} from '../../../intl'
import {getAmountFixDecimalWithCurrency} from '../../../../../utils/Helpers'
import {
  alphaNumericRegex,
  alphaRegex,
  floatingRegex,
  numericRegex,
} from '../../../../../utils/Validations'
import {
  ALL_STRUCTURE_SLIDER_TABS,
  CUSTOM_CATEGORY,
  FEE_STRUCTURE_SLIDER_TABS_IDS,
  FEE_STRUCTURE_TYPES_IDS,
  getStructureFeeType,
  MASTER_ID,
  PROFILE_CATEGORY_OPTIONS,
} from '../../../fees.constants'
import {
  alphaFields,
  alphaNumericFields,
  floatingFields,
  numericFields,
  validate,
} from '../StructureValidations/FeeStructureValidations'

export const validateCurrentTab = (
  formValues,
  setFormErrors,
  currentTab,
  selectedTab
) => {
  let currentTabSequenceNo = getSequenceNoOfSelectedTab(formValues, currentTab)
  let selectedTabSequenceNo = getSequenceNoOfSelectedTab(
    formValues,
    selectedTab
  )
  if (currentTabSequenceNo < selectedTabSequenceNo) {
    const errors = validate(formValues, currentTab)
    setFormErrors(errors)
    if (Object.keys(errors).length > 0) {
      return false
    } else {
      if (currentTabSequenceNo + 1 !== selectedTabSequenceNo) {
        return false
      }
      // Allow next tab switching
      return true
    }
  }
  // Allow previous tabs switching
  return true
}

export const handleStructureValueChange = (
  {name, value, event},
  index = null,
  formValues,
  setFormValues = () => {},
  handleCustomCategorySelection = () => {}
) => {
  // validation
  if (
    (alphaFields.includes(name) && !alphaRegex(value)) ||
    (alphaNumericFields.includes(name) && !alphaNumericRegex(value)) ||
    (floatingFields.includes(name) && !floatingRegex(value)) ||
    (numericFields.includes(name) && !numericRegex(value))
  ) {
    return false
  }
  const formData = {...formValues}
  if (index !== null) {
    formData.fee_categories[index][name] = value
    if (
      name === MASTER_ID &&
      (formData.fee_categories[index]?.customCategory !== undefined ||
        value === CUSTOM_CATEGORY.value)
    ) {
      handleCustomCategorySelection(index, value)
    }
  } else if (name === 'name') {
    formData.name = value
  } else if (name === 'applicable_months') {
    if (event.target.checked) {
      formData.applicable_months = formData.applicable_months.concat(value)
    } else {
      formData.applicable_months = formData.applicable_months.filter(
        (v) => v !== value
      )
      if (formData.fee_type === FEE_STRUCTURE_TYPES_IDS.RECURRING_FEE) {
        formData.fee_categories.forEach((category, i) => {
          delete formData.fee_categories[i].schedule[
            formData.schedule_timestamps[value]
          ]
        })
      }
      delete formData.schedule_timestamps[value]
    }
  } else if (name === 'schedule_timestamps') {
    if (formData.fee_type === FEE_STRUCTURE_TYPES_IDS.RECURRING_FEE) {
      formData.fee_categories.forEach((category, i) => {
        Object.keys(category.schedule).forEach((timestamp) => {
          if (!Object.values(value).includes(parseInt(timestamp))) {
            delete formData.fee_categories[i].schedule[timestamp]
          }
        })
        Object.values(value).forEach((timestamp) => {
          if (!(timestamp in category.schedule)) {
            formData.fee_categories[i].schedule[timestamp] = ''
          }
        })
      })
    }
    formData.schedule_timestamps = value
  } else if (name === 'category') {
    if (event.target.checked) {
      let newCategories = []
      if (value === 'all') {
        newCategories = PROFILE_CATEGORY_OPTIONS.map((cat) => cat.value)
      } else {
        newCategories = [...formData[name], value]
      }
      formData[name] = newCategories
    } else {
      let newCategories = []
      if (value !== 'all') {
        newCategories = formData[name]?.filter(function (ele) {
          return ele !== value
        })
      }
      formData[name] = newCategories
    }
  } else if (name === 'onetime_due_date') {
    const onetimeDate = parseInt(DateTime.fromJSDate(value).toSeconds())
    formData[name] = onetimeDate
    formData.due_date = parseInt(DateTime.fromJSDate(value).toFormat('d'))
    formData.schedule_timestamps['onetime'] = onetimeDate
  } else if (name === 'gender') {
    formData[name] = value
  } else {
    formData[name] = name === 'receipt_prefix' ? value.toUpperCase() : value
  }
  setFormValues(formData)
}

export const isSubmitDisabled = (formValues, currentTab) => {
  if (currentTab === FEE_STRUCTURE_SLIDER_TABS_IDS.CLASSES) {
    return formValues.assigned_to.length === 0
  } else if (
    currentTab === FEE_STRUCTURE_SLIDER_TABS_IDS.FEE_STRUCTURE ||
    currentTab === FEE_STRUCTURE_SLIDER_TABS_IDS.FEE_TYPE
  ) {
    return (
      !formValues.name ||
      !formValues.receipt_prefix ||
      !formValues.series_starting_number
    )
  } else if (currentTab === FEE_STRUCTURE_SLIDER_TABS_IDS.DUE_DATES) {
    return Object.keys(formValues.schedule_timestamps).length === 0
  }
}

export const getSequenceNoOfSelectedTab = (formValues, selectedTab) =>
  ALL_STRUCTURE_SLIDER_TABS[formValues.fee_type].find((tab) => {
    return tab.id === selectedTab
  }).sequenceNo

export const isLastTab = (formValues, currentTab) =>
  getSequenceNoOfSelectedTab(formValues, currentTab) ===
  ALL_STRUCTURE_SLIDER_TABS[formValues.fee_type].length

export const switchToNextTab = (formValues, currentTab) => {
  return ALL_STRUCTURE_SLIDER_TABS[formValues.fee_type].find(
    (tab) =>
      tab.sequenceNo === getSequenceNoOfSelectedTab(formValues, currentTab) + 1
  ).id
}

const publishFeeStructureEvent = (formValues, eventManager) => {
  eventManager.send_event(events.PUBLISH_FEE_STRUCTURE_CLICKED_TFI, {
    fee_type: getStructureFeeType(formValues),
    no_of_fees: formValues.fee_categories.length,
    type: formValues?._id ? 'edit' : 'new',
    strucutre_id: formValues?._id,
  })
}

export const sendSubmitEvents = (formValues, currentTab, eventManager) => {
  if (currentTab === FEE_STRUCTURE_SLIDER_TABS_IDS.CLASSES) {
    eventManager.send_event(events.CLASSES_AND_PROFILES_SELECTED_TFI, {
      fee_type: getStructureFeeType(formValues),
      classes: formValues.assigned_to,
      applicable_students: formValues.applicable_students,
    })
  } else if (
    currentTab === FEE_STRUCTURE_SLIDER_TABS_IDS.FEE_STRUCTURE ||
    currentTab === FEE_STRUCTURE_SLIDER_TABS_IDS.FEE_TYPE
  ) {
    if (formValues.fee_type === FEE_STRUCTURE_TYPES_IDS.ONE_TIME_FEE) {
      publishFeeStructureEvent(formValues, eventManager)
    } else {
      eventManager.send_event(events.FEE_STRUCTURE_SELECTED_TFI, {
        fee_type: getStructureFeeType(formValues),
        no_of_fees: formValues.fee_categories.length,
      })
    }
  } else if (currentTab === FEE_STRUCTURE_SLIDER_TABS_IDS.DUE_DATES) {
    eventManager.send_event(events.DUEDATES_SELECTED_TFI, {
      fee_type: getStructureFeeType(formValues),
      timestamps: formValues.schedule_timestamps,
    })
    if (formValues.fee_type === FEE_STRUCTURE_TYPES_IDS.TRANSPORT_FEE) {
      publishFeeStructureEvent(formValues, eventManager)
    }
  } else if (currentTab === FEE_STRUCTURE_SLIDER_TABS_IDS.AMOUNT) {
    publishFeeStructureEvent(formValues, eventManager)
  }
}

const getTotalAnnualFees = (formValues) => {
  let total = 0
  formValues.fee_categories.forEach((category) => {
    // Calculate only non-deleted categories
    if (!category.isDelete) {
      if (
        formValues.fee_type === FEE_STRUCTURE_TYPES_IDS.ONE_TIME_FEE &&
        category.amount // Amount must not be blank
      ) {
        total +=
          parseFloat(category.amount) +
          (category.tax
            ? (parseFloat(category.amount) * parseFloat(category.tax)) / 100
            : 0)
      } else if (
        !Object.values(category.schedule).find((amount) => amount === '')
      ) {
        const feeTypeTotal = Object.values(category.schedule).reduce(
          (sum, amount) => sum + +amount,
          0
        )
        total += feeTypeTotal
        if (category.tax) {
          total += (feeTypeTotal * parseFloat(category.tax)) / 100
        }
      }
    }
  })
  return total
}

export const calculateGrandTotal = (formValues, styles, institute_currency) => {
  return (
    <div className={styles.footerAmount}>
      {getAmountFixDecimalWithCurrency(
        getTotalAnnualFees(formValues),
        institute_currency
      )}
      <div className={styles.footerAmountText}>
        {FEE_STRUCTURE.totalAnnualFeeWithTax}
      </div>
    </div>
  )
}
