import {useMemo} from 'react'
import {Divider, Heading, HEADING_CONSTANTS} from '@teachmint/krayon'
import {ErrorBoundary} from '@teachmint/common'
import {
  useAdmissionCrmSettings,
  useConfirmLeadAdmission,
  useCrmInstituteHierarchy,
} from '../../../redux/admissionManagement.selectors'
import FormField from '../FormField/FormField'
import styles from './AdmissionForm.module.css'
import {
  admissionFormSettingsHiddenFields,
  confirmAdmissionRequiredFields,
  IMIS_SETTING_TYPES,
  permanentAddressFields,
  currentAddressFields,
  staticImisFields,
} from '../../../utils/constants'
import {INSTITUTE_HIERARCHY_TYPES} from '../InstituteHierarchy/InstituteHierarchy'
import {useSelector} from 'react-redux'
import {DateTime} from 'luxon'
import {Trans} from 'react-i18next'

export default function AdmissionForm({
  formData,
  formErrors,
  setFormData,
  ignoreFields = [],
  requiredFields = [],
  nonVisibleFields = [],
  disabledFields = [],
  isConfirmAdmissionForm = false,
  renderFeeStructure,
}) {
  const confirmLeadAdmission = useConfirmLeadAdmission()
  const admissionCrmSettings = useAdmissionCrmSettings()
  const instituteHierarchy = useCrmInstituteHierarchy()
  const {
    enable_session: enableSession,
    categorizedFields: admissionFormFields,
  } = admissionCrmSettings.data
  const instituteAcademicSessionInfo = useSelector(
    (state) => state.instituteAcademicSessionInfo
  )

  const getSessionDuration = () => {
    const sessionDetails = instituteAcademicSessionInfo.find(
      (session) =>
        session._id === admissionCrmSettings.data?.enable_session?.session_id
    )
    return (
      DateTime.fromMillis(parseInt(sessionDetails?.start_time)).toFormat(
        'dd LLL, yyyy'
      ) +
      ' to ' +
      DateTime.fromMillis(parseInt(sessionDetails?.end_time)).toFormat(
        'dd LLL, yyyy'
      )
    )
  }

  const getDateOfJoiningMessage = () => {
    return (
      <div className={styles.paraText}>
        <Trans i18nKey={'dateOfAdmissionText'}>
          <span className={styles.note}></span>
          <span></span>
          <span className={styles.sessionText}>
            {{currentSession: getSessionDuration()}}
          </span>
          <span></span>
        </Trans>
      </div>
    )
  }

  const standardData = useMemo(() => {
    let classesInfo = {}
    instituteHierarchy?.children.forEach((department) => {
      if (department.type === INSTITUTE_HIERARCHY_TYPES.DEPARTMENT) {
        department?.children.forEach((standard) => {
          if (
            enableSession.enabled_node_ids.includes(standard.id) ||
            formData.standard === standard.id
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

  const isAllFieldsNonVisible = (category) => {
    return category.fields.every((field) =>
      nonVisibleFields.includes(field.key_id)
    )
  }

  const isAddressLabelRequired = () => {
    for (let i = 0; i < currentAddressFields.length; i++) {
      if (!nonVisibleFields.includes(currentAddressFields[i])) {
        return false
      }
    }
    return true
  }

  const formFieldCategories = Object.values(admissionFormFields)?.filter(
    (field) => field.setting_type === IMIS_SETTING_TYPES.CATEGORY
  )

  const renderFormField = (field, isAdmissionDate = false) => {
    return isAdmissionDate ? (
      <div className={styles.dateOfAdmissionField}>
        <FormField
          field={field}
          formData={formData}
          setFormData={setFormData}
          formErrors={formErrors}
          standardData={standardData}
          isRequired={requiredFields.includes(field.key_id)}
          isDisabled={disabledFields.includes(field.key_id)}
        />
      </div>
    ) : (
      <div key={field.key_id} className={styles.formGroup}>
        <div className={styles.subContainer}>
          <FormField
            field={field}
            formData={formData}
            setFormData={setFormData}
            formErrors={formErrors}
            standardData={standardData}
            isRequired={requiredFields.includes(field.key_id)}
            isDisabled={disabledFields.includes(field.key_id)}
          />
        </div>
      </div>
    )
  }

  const renderRequiredFormFields = () => {
    return (
      <div>
        <div className={styles.formContainer}>
          {formFieldCategories?.map((category) => {
            return category.fields.map((field) => {
              if (confirmAdmissionRequiredFields.includes(field.key_id)) {
                if (field.key_id != staticImisFields.ADMISSION_DATE) {
                  return renderFormField(field)
                }
              }
            })
          })}
          <div className={styles.formGroup}>
            <div className={styles.subContainer}>{renderFeeStructure()}</div>
          </div>
        </div>
        <div className={styles.divider}>
          <Divider />
        </div>
        <div className={styles.dateWrapper}>
          {formFieldCategories?.map((category) => {
            return category.fields.map((field) => {
              if (confirmAdmissionRequiredFields.includes(field.key_id)) {
                if (field.key_id === staticImisFields.ADMISSION_DATE) {
                  return renderFormField(field, true)
                }
              }
            })
          })}
          <div className={styles.paraText}>{getDateOfJoiningMessage()}</div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {confirmLeadAdmission.isLoading ? (
        <div className="loader"></div>
      ) : (
        <div className={styles.errorBoundary}>
          <ErrorBoundary>
            {isConfirmAdmissionForm && (
              <div>
                {renderRequiredFormFields()}
                <Divider spacing="10px" />
              </div>
            )}
            {formFieldCategories?.map((category, index) => {
              if (
                isAllFieldsNonVisible(category) ||
                (category.key_id === staticImisFields.ADDRESS &&
                  isAddressLabelRequired())
              ) {
                return
              }
              return (
                <div key={category._id} className={styles.headingMargin}>
                  {index !== 0 && <Divider spacing="20px" />}
                  <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}>
                    {category.label}
                  </Heading>
                  <Divider spacing="20px" />
                  <div className={styles.formContainer}>
                    {category.fields.map((field) => {
                      if (
                        !permanentAddressFields.includes(field.key_id) &&
                        !admissionFormSettingsHiddenFields.includes(
                          field.key_id
                        )
                      ) {
                        return (
                          !ignoreFields.includes(field.key_id) &&
                          !nonVisibleFields.includes(field.key_id) &&
                          renderFormField(field)
                        )
                      }
                    })}
                  </div>
                </div>
              )
            })}
          </ErrorBoundary>
        </div>
      )}
    </div>
  )
}
