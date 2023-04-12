import {PERSONA_STATUS} from '../../ProfileSettings.constant'

export const getCategoryFieldsSettings = (
  categoryId,
  categoryFieldsSettings
) => {
  let categoryCollection = {}
  let innerFieldsCollection = []
  categoryFieldsSettings.forEach((outerElement) => {
    if (
      outerElement._id == categoryId &&
      [1, 3].includes(outerElement.setting_type)
    ) {
      categoryCollection = {
        ...outerElement,
      }
    } else {
      if (outerElement.category_id && categoryId == outerElement.category_id) {
        innerFieldsCollection.push(outerElement)
      }
    }
  })
  if (innerFieldsCollection.length > 0) {
    innerFieldsCollection.sort((a, b) => a.sequence - b.sequence)
  }
  categoryCollection = {
    ...categoryCollection,
    childrenFields: innerFieldsCollection,
  }
  return categoryCollection
}

// Get Add Category field slider tooltips options data
export const getAddCategoryFieldToolTips = (userType) => {
  const toolTipsData = [
    {
      id: 'isFieldMandatoryToggle',
      fieldName: 'isValueMandatory',
      text: PERSONA_STATUS[userType].isValueMandatoryInfoToggleText,
      toolTipId: 'isFieldMandatoryToolTip',
      toolTipText: PERSONA_STATUS[userType].isValueMandatoryInfoToolTipText,
    },
    {
      id: 'isFieldVisibleToPersonaToggle',
      fieldName: 'isVisibleToPersona',
      text: PERSONA_STATUS[userType].isVisibleInfoToggleText,
      toolTipId: 'isFieldVisibleToPersonaToolTip',
      toolTipText: PERSONA_STATUS[userType].isVisibleInfoToolTipText,
    },
    {
      id: 'isFieldEditableByPersonaToggle',
      fieldName: 'isValueEditableByPersona',
      text: PERSONA_STATUS[userType].isValueEditableInfoToggleText,
      toolTipId: 'isFieldEditableByPersonaToolTip',
      toolTipText: PERSONA_STATUS[userType].isValueEditableInfoToolTipText,
    },
  ]
  return toolTipsData
}

// Get Edit Category field slider tooltips options data
export const getEditCategoryFieldToolTips = ({userType, fieldEditFormData}) => {
  const addToolTipsData = getAddCategoryFieldToolTips(userType)
  const isActiveStatusToggleObject = {
    id: 'isThisFieldInactiveToggle',
    fieldName: 'isThisFieldInActive',
    text: PERSONA_STATUS[userType].isInActiveInfoToggleText,
    toolTipId: 'isThisFieldInactiveToolTip',
    toolTipText: PERSONA_STATUS[userType].isInActiveInfoToolTipText,
  }
  const isActiveToggle = fieldEditFormData?.is_active_status_editable_by_admin
    ? isActiveStatusToggleObject
    : null
  let toolTipsData = []
  if (isActiveToggle) {
    toolTipsData = [...addToolTipsData, isActiveToggle]
  } else {
    toolTipsData = [...addToolTipsData]
  }

  return toolTipsData
}

// Get Add Document category field slider tooltips options data
export const getAddDocumentCategoryFieldToolTips = (userType) => {
  const toolTipsData = [
    // {
    //   id: 'isFieldMandatoryToggle',
    //   fieldName: 'isValueMandatory',
    //   text: PERSONA_STATUS[userType].isValueMandatoryDocToggleText,
    //   toolTipId: 'isFieldMandatoryToolTip',
    //   toolTipText: PERSONA_STATUS[userType].isValueMandatoryDocToolTipText,
    // },
    {
      id: 'isFieldVisibleToPersonaToggle',
      fieldName: 'isVisibleToPersona',
      text: PERSONA_STATUS[userType].isVisibleDocToggleText,
      toolTipId: 'isFieldVisibleToPersonaToolTip',
      toolTipText: PERSONA_STATUS[userType].isVisibleDocToolTipText,
    },
    {
      id: 'isFieldEditableByPersonaToggle',
      fieldName: 'isValueEditableByPersona',
      text: PERSONA_STATUS[userType].isValueEditableDocToggleText,
      toolTipId: 'isFieldEditableByPersonaToolTip',
      toolTipText: PERSONA_STATUS[userType].isValueEditableDocToolTipText,
    },
  ]
  return toolTipsData
}

// Get Edit Document Category field slider tooltips options data
export const getEditDocumentCategoryFieldToolTips = ({
  userType,
  fieldEditFormData,
}) => {
  const addToolTipsData = getAddDocumentCategoryFieldToolTips(userType)
  const isActiveStatusToggleObject = {
    id: 'isThisFieldInactiveToggle',
    fieldName: 'isThisFieldInActive',
    text: PERSONA_STATUS[userType].isInActiveDocToggleText,
    toolTipId: 'isThisFieldInactiveToolTip',
    toolTipText: PERSONA_STATUS[userType].isInActiveDocToolTipText,
  }
  const isActiveToggle = fieldEditFormData?.is_active_status_editable_by_admin
    ? isActiveStatusToggleObject
    : null
  let toolTipsData = []
  if (isActiveToggle) {
    toolTipsData = [...addToolTipsData, isActiveToggle]
  } else {
    toolTipsData = [...addToolTipsData]
  }

  return toolTipsData
}

// Dropdown existing objects is vaild or not
export const createVaildDropdownObjects = (dropDownOptionItems) => {
  const optionValues = dropDownOptionItems
    .map((item) => {
      if (
        item.dropDownOptionName !== null &&
        item.dropDownOptionName.trim() !== ''
      ) {
        return item.dropDownOptionName
      }
    })
    .filter((n) => n)
  return optionValues
}
export const isExistingObjectsVaild = (dropDownOptionItems) => {
  const arrayValues = createVaildDropdownObjects(dropDownOptionItems)
  let isValid = false
  if (
    arrayValues.length > 0 &&
    arrayValues.length == dropDownOptionItems.length
  ) {
    isValid = !checkSameValuesExistInObject(arrayValues)
  }
  return isValid
}
export const checkSameValuesExistInObject = (arrayValues) => {
  let existingArray = arrayValues
  let result = false
  // Create a Set with array elements
  const setSize = new Set(existingArray)
  // Compare the size of array and Set
  if (existingArray.length !== setSize.size) {
    result = true
  }
  return result
}
