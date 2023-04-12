import {
  FEE_STRUCTURE_SLIDER_TABS_IDS,
  FEE_STRUCTURE_TYPES_IDS,
  TRANSPORT_METHODS,
} from '../../../fees.constants'

export const alphaFields = ['receipt_prefix']
export const alphaNumericFields = ['name']
export const floatingFields = ['tax']
export const numericFields = [
  'series_starting_number',
  'distanceFrom',
  'distanceTo',
  'amount',
]

const validateClassesTabData = (structure, errors) => {
  if (structure.assigned_to.length === 0) {
    errors.assigned_to = 'Please select atleast one department/class'
  }
  // if (
  //   !structure.applicable_students &&
  //   structure.fee_type == FEE_STRUCTURE_TYPES_IDS.ONE_TIME_FEE
  // ) {
  //   errors.applicable_students = 'Please select the applicable students'
  // }
  return errors
}

const validateFeeStructureTabData = (structure, errors) => {
  // Name validation
  if (!structure.name.trim()) {
    errors.name = 'Name is required'
  } else if (structure.name.length < 1) {
    errors.name = 'Name must be more than 1 character'
  } else if (structure.name.length > 25) {
    errors.name = 'Name cannot exceed more than 25 characters'
  }

  // Receipt prefix validation
  if (!structure.receipt_prefix.trim()) {
    errors.receipt_prefix = 'Prefix is required'
  } else if (structure.receipt_prefix.length < 1) {
    errors.receipt_prefix = 'Prefix must be more than 1 character'
  } else if (structure.receipt_prefix.length > 25) {
    errors.receipt_prefix = 'Prefix cannot exceed more than 25 characters'
  }

  // Prefix starting number validation
  if (!structure.series_starting_number) {
    errors.series_starting_number = 'Starting number is required'
  } else if (structure.series_starting_number.length < 1) {
    errors.series_starting_number =
      'Starting number must be more than 1 character'
  } else if (structure.series_starting_number.length > 16) {
    errors.series_starting_number =
      'Starting number cannot exceed more than 16 characters'
  }

  // Structure wise validation for middle section
  if (structure.fee_type === FEE_STRUCTURE_TYPES_IDS.ONE_TIME_FEE) {
    if (!structure.onetime_due_date) {
      errors.onetime_due_date = 'Due date is required'
    }
  } else if (structure.fee_type === FEE_STRUCTURE_TYPES_IDS.TRANSPORT_FEE) {
    if (parseFloat(structure.tax) < 0) {
      errors.tax = 'Tax must be greater than 0'
    } else if (parseFloat(structure.tax) > 100) {
      errors.tax = 'Tax cannot exceed more than 100'
    }
  }

  // Structure wise validation for last section
  let nonDeletedCategories = structure.fee_categories.filter((category) => {
    return category.isDelete ? category.isDelete === false : true
  })
  if (nonDeletedCategories.length === 0) {
    errors.feeCategoriesRequired = 'Please add atleast one fee type'
  } else {
    let categories = []
    let duplicateFeeType = []
    let duplicatePickup = []
    for (let index = 0; index < structure.fee_categories.length; index++) {
      if (structure.fee_categories[index].isDelete) {
        continue
      }
      let category = {}
      if (structure.fee_type !== FEE_STRUCTURE_TYPES_IDS.TRANSPORT_FEE) {
        if (!structure.fee_categories[index].master_id) {
          category.master_id = 'Select fee type'
        } else {
          // Check for duplicate fee type
          if (
            duplicateFeeType.includes(structure.fee_categories[index].master_id)
          ) {
            category.master_id = 'Fee type already selected'
          } else {
            duplicateFeeType.push(structure.fee_categories[index].master_id)
          }
        }
        if (parseFloat(structure.fee_categories[index].tax) < 0) {
          category.tax = 'Tax must be greater than 0'
        } else if (parseFloat(structure.fee_categories[index].tax) > 100) {
          category.tax = 'Tax cannot exceed more than 100'
        }
      }
      if (structure.fee_type !== FEE_STRUCTURE_TYPES_IDS.RECURRING_FEE) {
        if (!structure.fee_categories[index].amount) {
          category.amount = 'Amount is required'
        } else if (structure.fee_categories[index].amount.length > 7) {
          category.amount = 'Amount cannot be greater than 7 digits'
        } else if (!parseFloat(structure.fee_categories[index].amount) > 0) {
          category.amount = 'Amount must be greater than 0'
        }
      }
      if (structure.fee_type === FEE_STRUCTURE_TYPES_IDS.TRANSPORT_FEE) {
        if (structure.transport_type === TRANSPORT_METHODS.WAYPOINT) {
          if (!structure.fee_categories[index].pickup) {
            category.pickup = 'Pickup point is required'
          } else {
            // Check for duplicate pickup points
            if (
              !duplicatePickup.includes(structure.fee_categories[index].pickup)
            ) {
              duplicatePickup.push(structure.fee_categories[index].pickup)
            } else {
              category.pickup = 'Pickup point already selected'
            }
          }
        } else {
          if (!structure.fee_categories[index].distanceTo) {
            category.distance = 'Distance is required'
          } else if (structure.fee_categories[index].distanceFrom.length > 5) {
            category.distance = 'Distance cannot be greater than 5 digits'
          } else if (structure.fee_categories[index].distanceTo.length > 5) {
            category.distance = 'Distance cannot be greater than 5 digits'
          } else if (
            !parseFloat(structure.fee_categories[index].distanceTo) > 0
          ) {
            category.distance = 'Distance must be greater than 0'
          } else if (
            parseFloat(structure.fee_categories[index].distanceTo) <=
            parseFloat(structure.fee_categories[index].distanceFrom)
          ) {
            category.distance =
              'Distance must be greater than ' +
              structure.fee_categories[index].distanceFrom
          }
        }
      }
      if (Object.keys(category).length > 0) {
        categories[index] = category
      }
    }

    // Only add errors if any categories has error
    if (categories.length > 0) {
      errors.fee_categories = categories
    }
  }

  return errors
}

const validateDueDatesTabData = (structure, errors) => {
  if (Object.keys(structure.schedule_timestamps).length === 0) {
    errors.schedule_timestamps = 'Select due date of atleast one month'
  }
  return errors
}

export const validate = (values, currentTab = null) => {
  const errors = {}

  if (currentTab === FEE_STRUCTURE_SLIDER_TABS_IDS.CLASSES) {
    validateClassesTabData(values, errors)
  } else if (currentTab === FEE_STRUCTURE_SLIDER_TABS_IDS.DUE_DATES) {
    validateDueDatesTabData(values, errors)
  } else if (
    currentTab === FEE_STRUCTURE_SLIDER_TABS_IDS.FEE_TYPE ||
    currentTab === FEE_STRUCTURE_SLIDER_TABS_IDS.FEE_STRUCTURE
  ) {
    validateFeeStructureTabData(values, errors)
  } else {
    // Check all form values before publishing/updating the structure
    if (values.fee_type === FEE_STRUCTURE_TYPES_IDS.ONE_TIME_FEE) {
      validateClassesTabData(values, errors)
      validateFeeStructureTabData(values, errors)
    } else {
      validateClassesTabData(values, errors)
      validateFeeStructureTabData(values, errors)
      validateDueDatesTabData(values, errors)
    }
  }

  return errors
}
