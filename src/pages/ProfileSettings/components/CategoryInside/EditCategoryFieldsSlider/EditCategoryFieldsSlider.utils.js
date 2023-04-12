export const getEditCategoryFieldFormState = (fieldEditFormData) => {
  const editFieldFormState = {
    fieldId: fieldEditFormData?._id,
    fieldName: fieldEditFormData?.label,
    isValueMandatory: fieldEditFormData?.is_value_mandatory,
    isVisibleToPersona: fieldEditFormData?.is_visible_to_persona,
    isValueEditableByPersona: fieldEditFormData?.is_value_editable_by_persona,
    isThisFieldInActive: !fieldEditFormData?.is_active,
  }
  return editFieldFormState
}
