import {
  FIELD_TYPES,
  FIELD_TYPES_OBJECT,
} from '../../../ProfileSettings.constant'

export const getRequestParamsObject = ({
  instituteInfo,
  userType,
  categoryFieldsData,
  addNewFieldFormInputsValue,
}) => {
  const requestPrams = {
    institute_type: instituteInfo.institute_type,
    persona: userType,
    category_id: categoryFieldsData?._id,
    label: addNewFieldFormInputsValue?.fieldName,
    field_type: FIELD_TYPES['DOCUMENT'].key,
    setting_type: 2,
    permissible_values:
      addNewFieldFormInputsValue.permissibleValues.length > 0
        ? addNewFieldFormInputsValue.permissibleValues
        : [],
    is_value_mandatory: addNewFieldFormInputsValue.isValueMandatory,
    is_visible_to_persona: addNewFieldFormInputsValue.isVisibleToPersona,
    is_value_editable_by_persona:
      addNewFieldFormInputsValue.isValueEditableByPersona,
  }
  return requestPrams
}

export const isFieldNameExist = ({fieldTitle, categoryFieldsData}) => {
  let getCategoryFieldsNames = []
  if (categoryFieldsData && categoryFieldsData?.childrenFields.length > 0) {
    getCategoryFieldsNames = categoryFieldsData?.childrenFields.map((value) => {
      return value.label.trim()
    })
  }
  const isCategoryFieldNameExist = getCategoryFieldsNames.includes(
    fieldTitle.trim()
  )
  return isCategoryFieldNameExist
}

export const addCategoryFieldFormState = {
  fieldName: '',
  fieldTypeName: FIELD_TYPES_OBJECT[0].value,
  isDateChecked: false,
  charLimit: '50',
  permissibleValues: [],
  dateRange: [],
  isValueMandatory: false,
  isVisibleToPersona: true,
  isValueEditableByPersona: true,
}

export const dropDownOptionItemsState = [{dropDownOptionName: ''}]
