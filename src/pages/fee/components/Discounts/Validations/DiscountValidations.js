import {t} from 'i18next'
import {
  DISCOUNT_SLIDER_TABS_IDS,
  IS_ABSOLUTE_VALUE,
} from '../../../fees.constants'

export const alphaNumericFields = ['name']
export const floatingFields = ['value']
export const numericFields = ['value']

export const validate = (values, currentTab) => {
  const errors = {}

  if (currentTab === DISCOUNT_SLIDER_TABS_IDS.DISCOUNT) {
    if (!values.name) {
      // errors.name = 'Name is required'
      errors.name = t('nameIsRequired')
    } else if (values.name.length < 1) {
      // errors.name = 'Name must be more than 1 character'
      errors.name = t('nameMustBeMoreThan1Character')
    } else if (values.name.length > 25) {
      // errors.name = 'Name cannot exceed more than 25 characters'
      errors.name = t('nameCannotExceedMoreThan25Characters')
    }

    if (!values.is_absolute_value) {
      // errors.is_absolute_value = 'Select any one value'
      errors.is_absolute_value = t('selectAnyOneValue')
    }

    if (!values.value) {
      errors.value = t('valueIsRequired')
    } else if (values.is_absolute_value === IS_ABSOLUTE_VALUE.ABSOLUTE) {
      if (values.value.length > 7) {
        errors.value = t('amountCannotBeGreaterThan7Digits')
      } else if (!parseFloat(values.value) > 0) {
        errors.value = t('amountMustBeGreaterThan0')
      }
    } else if (values.is_absolute_value === IS_ABSOLUTE_VALUE.PERCENTAGE) {
      if (parseFloat(values.value) < 0) {
        errors.value = t('percentageMustBeGreaterThan0')
      } else if (parseFloat(values.value) > 100) {
        errors.value = t('percentageCannotExceedMoreThan100')
      }
    }

    if (values.fee_types.length === 0) {
      errors.fee_types = t('feeTypePlaceholder')
    }
  } else if (currentTab === DISCOUNT_SLIDER_TABS_IDS.STUDENT_PROFILES) {
    if (values.students.length === 0) {
      errors.students = t('selectAtleastOneStudentToCreateDiscount')
    }
  }

  return errors
}
