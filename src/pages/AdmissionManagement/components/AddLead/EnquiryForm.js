import {useMemo} from 'react'
import {ErrorBoundary} from '@teachmint/common'
import {
  useAdmissionCrmSettings,
  useCrmInstituteHierarchy,
} from '../../redux/admissionManagement.selectors'
import {
  admissionCrmFieldTypes,
  ENQUIRY_FORM_KEYS,
  IMIS_SETTING_TYPES,
} from '../../utils/constants'
import styles from './AddLead.module.css'
import FormField from '../Common/FormField/FormField'
import {INSTITUTE_HIERARCHY_TYPES} from '../Common/InstituteHierarchy/InstituteHierarchy'

const EnquiryForm = ({
  formValues,
  setFormValues,
  formErrors,
  disabledFields = [],
}) => {
  const instituteHierarchy = useCrmInstituteHierarchy()
  const admissionCrmSettings = useAdmissionCrmSettings()
  const {imis_fields_info: imsisFieldData, profile_fields: profileFieldData} =
    admissionCrmSettings.data

  const getEnquiryFormFieldsInSequence = (fields) => {
    let sequenceFieldsArray = []
    ENQUIRY_FORM_KEYS.forEach((key) => {
      for (let i = 0; i < fields.length; i++) {
        if (fields[i].key_id === key) {
          sequenceFieldsArray.push(fields[i])
          break
        }
      }
    })
    fields.forEach((item) => {
      if (!ENQUIRY_FORM_KEYS.includes(item.key_id)) {
        sequenceFieldsArray.push(item)
      }
    })
    return sequenceFieldsArray
  }

  const standardData = useMemo(() => {
    let classesInfo = {}
    instituteHierarchy?.children.forEach((department) => {
      if (department.type === INSTITUTE_HIERARCHY_TYPES.DEPARTMENT) {
        department?.children.forEach((standard) => {
          if (
            admissionCrmSettings.data.enable_session.enabled_node_ids.includes(
              standard.id
            )
          ) {
            classesInfo[standard.id] = {...standard}
            classesInfo[standard.id].sections = []
            standard?.children.forEach((section) => {
              if (section.type === INSTITUTE_HIERARCHY_TYPES.SECTION) {
                classesInfo[standard.id].sections.push(section)
              }
            })
          }
        })
      }
    })
    return classesInfo
  }, [instituteHierarchy])

  const renderField = (field) => {
    if (profileFieldData?.[field.key_id]) {
      return (
        <div key={field.key_id} className={styles.container}>
          <div className={styles.subContainer}>
            <FormField
              field={field}
              formData={formValues}
              formErrors={formErrors}
              setFormData={setFormValues}
              standardData={standardData}
              isRequired={profileFieldData[field.key_id].required_in.includes(
                admissionCrmFieldTypes.ENQUIRY_FORM
              )}
              isDisabled={disabledFields.includes(field.key_id)}
            />
          </div>
        </div>
      )
    }
    return
  }

  return (
    <ErrorBoundary>
      <div className={styles.enquiryContainer}>
        {getEnquiryFormFieldsInSequence(
          imsisFieldData?.filter(
            (field) => field.setting_type === IMIS_SETTING_TYPES.FIELD
          )
        )?.map((field) => {
          return (
            profileFieldData?.[field.key_id]?.enabled_in?.includes(
              admissionCrmFieldTypes.ENQUIRY_FORM
            ) && renderField(field)
          )
        })}
      </div>
    </ErrorBoundary>
  )
}

export default EnquiryForm
