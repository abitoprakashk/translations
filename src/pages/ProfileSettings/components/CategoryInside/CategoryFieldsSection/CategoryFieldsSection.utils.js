import {t} from 'i18next'
import {Icon, Tooltip} from '@teachmint/common'
import {FIELD_TYPES, SETTING_TYPE} from '../../../ProfileSettings.constant'
import {getShortTxnId, upperCaseArrayValue} from '../../../../../utils/Helpers'
import styles from './CategoryFieldsSection.module.css'
import Permission from '../../../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../../utils/permission.constants'

export const getFieldTypeData = (categoryDetails, rowData) => {
  let typeData = null
  if (categoryDetails?.setting_type == 1) {
    typeData = getFieldTypeName(rowData.field_type)
  } else if (categoryDetails?.setting_type == 3) {
    typeData = getDocsAllowTypes(rowData)
  }
  return typeData
}

export const getDocsAllowTypes = (rowData) => {
  const docsTypeValues = rowData.permissible_values
  let docAllowTypes = getFieldTypeName(rowData.field_type)
  if (docsTypeValues.length > 0) {
    docAllowTypes = upperCaseArrayValue(docsTypeValues)
  }
  return docAllowTypes
}

export const getFieldTypeName = (typeValue) => {
  return FIELD_TYPES[typeValue].label
}

export const getCategoryFieldsTableHeader = (
  userType,
  categoryAndFieldsSettingsData
) => {
  let tableHeaderHTMLrender = null
  if (categoryAndFieldsSettingsData?.setting_type == 1) {
    tableHeaderHTMLrender = profileInformationTableHeader(userType)
  } else if (categoryAndFieldsSettingsData?.setting_type == 3) {
    tableHeaderHTMLrender = documentTableHeader(userType)
  }
  return tableHeaderHTMLrender
}

export const profileInformationTableHeader = (userType) => {
  const tableHeader = [
    {key: 'fieldName', label: 'Field name'},
    {key: 'fieldType', label: 'Field type'},
    {key: 'mandatory', label: 'Mandatory'},
    {key: 'visibleTo', label: `Visible to ${userType.toLowerCase()}s`},
    {
      key: 'editableBy',
      label: `Editable by ${userType.toLowerCase()}s`,
    },
    {key: 'status', label: 'Status'},
    {key: 'action', label: 'Action'},
  ]
  return tableHeader
}

export const documentTableHeader = (userType) => {
  const docTableHeader = [
    {key: 'fieldName', label: 'Document name'},
    {key: 'fieldType', label: 'Document type'},
    // {key: 'mandatory', label: 'Mandatory'},
    {key: 'visibleTo', label: `Visible to ${userType.toLowerCase()}s`},
    {
      key: 'editableBy',
      label: `${userType.toLowerCase()}s Can Upload`,
    },
    {key: 'status', label: 'Status'},
    {key: 'action', label: 'Action'},
  ]
  return docTableHeader
}

export const getCategoryFieldsTableData = ({
  categoryAndFieldsSettingsData,
  openEditFieldSlider,
}) => {
  const categoryFieldsFlatData = categoryAndFieldsSettingsData?.childrenFields
  const rows = categoryFieldsFlatData.map((rowData) => {
    const fieldValueObj = rowData.is_active
      ? {label: t('active'), class: 'greenText'}
      : {label: t('inActive'), class: 'redText'}
    const fieldTitle = rowData.label
    const charCount = fieldTitle.length > 40
    const fieldTypeData = getFieldTypeData(
      categoryAndFieldsSettingsData,
      rowData
    )
    return {
      fieldName: (
        <div className={styles.fieldTitle}>
          <span data-tip data-for={rowData._id}>
            {getShortTxnId(fieldTitle, 40)}
          </span>
          {charCount && (
            <Tooltip
              toolTipId={rowData._id}
              place="top"
              type="info"
              className={styles.toolTipBlock}
            >
              <span>{fieldTitle}</span>
            </Tooltip>
          )}
        </div>
      ),
      fieldType: <span>{fieldTypeData}</span>,
      ...(categoryAndFieldsSettingsData?.setting_type == 1 && {
        mandatory: (
          <span>{rowData.is_value_mandatory ? t('yes') : t('no')}</span>
        ),
      }),
      visibleTo: (
        <span>{rowData.is_visible_to_persona ? t('yes') : t('no')}</span>
      ),
      editableBy: (
        <span>{rowData.is_value_editable_by_persona ? t('yes') : t('no')}</span>
      ),
      status: (
        <span className={styles[fieldValueObj.class]}>
          {fieldValueObj.label}
        </span>
      ),
      action: (
        <div className={styles.editField}>
          {rowData.is_setting_editable_by_admin ? (
            <Permission
              permissionId={
                PERMISSION_CONSTANTS.profileSettingsController_updateField_update
              }
            >
              <a
                className={styles.link}
                style={{cursor: 'pointer'}}
                onClick={() => openEditFieldSlider(rowData)}
              >
                <Icon color="primary" name="edit2" size="m" />
              </a>
            </Permission>
          ) : (
            '-'
          )}
        </div>
      ),
    }
  })
  return rows
}

export const getEmptyStateDescription = (categoryAndFieldsSettingsData) => {
  let emptyStateHtml = ''
  if (
    categoryAndFieldsSettingsData?.setting_type ==
    SETTING_TYPE['CATEGORY_FOR_DOCUMENT']
  ) {
    emptyStateHtml = t('noDocumentsDesc')
  } else {
    emptyStateHtml = t('noFieldsDesc')
  }
  return emptyStateHtml
}
