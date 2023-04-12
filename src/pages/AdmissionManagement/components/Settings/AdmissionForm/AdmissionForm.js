import {t} from 'i18next'
import produce from 'immer'
import classNames from 'classnames'
import {
  Accordion,
  Heading,
  HEADING_CONSTANTS,
  Para,
  PARA_CONSTANTS,
  Table,
  Toggle,
} from '@teachmint/krayon'
import FormPreview from '../FormPreview/FormPreview'
import styles from './AdmissionForm.module.css'
import {
  admissionFormDefaultFields,
  admissionFormSettingsHiddenFields,
  IMIS_SETTING_TYPES,
  onboardingFlowStepsId,
  permanentAddressFields,
} from '../../../utils/constants'
import {useAdmissionCrmSettings} from '../../../redux/admissionManagement.selectors'

export default function AdmissionForm({formData, setFormData}) {
  const admissionCrmSettings = useAdmissionCrmSettings()

  const handleChange = ({fieldName, value}, property) => {
    setFormData(
      produce(formData, (draft) => {
        draft.profile_fields[fieldName][property] = value
        if (!value && property === 'enabled') {
          draft.profile_fields[fieldName].required = value
        }
      })
    )
  }

  const cols = [
    {
      key: 'fields',
      label: (
        <Para weight={PARA_CONSTANTS.WEIGHT.MEDIUM}>
          {t('enquiryFormTheadLabelFields')}
        </Para>
      ),
    },
    {
      key: 'visible',
      label: (
        <Para weight={PARA_CONSTANTS.WEIGHT.MEDIUM}>
          {t('enquiryFormTheadLabelVisible')}
        </Para>
      ),
    },
    {
      key: 'mandatory',
      label: (
        <Para weight={PARA_CONSTANTS.WEIGHT.MEDIUM}>
          {t('enquiryFormTheadLabelMandatory')}
        </Para>
      ),
    },
  ]

  const getTableRows = (categoryFields) => {
    const rows = []
    categoryFields.forEach((field) => {
      if (
        !admissionFormSettingsHiddenFields.includes(field.key_id) &&
        !permanentAddressFields.includes(field.key_id)
      ) {
        rows.push({
          fields: (
            <Para
              weight={PARA_CONSTANTS.WEIGHT.MEDIUM}
              type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
            >
              {field.label}
            </Para>
          ),
          visible: (
            <Toggle
              fieldName={field.key_id}
              handleChange={(e) => handleChange(e, 'enabled')}
              isDisabled={admissionFormDefaultFields.includes(field.key_id)}
              isSelected={formData.profile_fields?.[field.key_id]?.enabled}
            />
          ),
          mandatory: (
            <Toggle
              fieldName={field.key_id}
              handleChange={(e) => handleChange(e, 'required')}
              isDisabled={
                !formData.profile_fields[field.key_id]?.enabled ||
                admissionFormDefaultFields.includes(field.key_id)
              }
              isSelected={formData.profile_fields?.[field.key_id]?.required}
            />
          ),
        })
      }
    })
    return rows
  }

  return (
    <div className={styles.bodyContent}>
      <div className={styles.formContent}>
        {Object.values(admissionCrmSettings?.data?.categorizedFields)
          .filter(
            (category) => category.setting_type === IMIS_SETTING_TYPES.CATEGORY
          )
          .map((category) => {
            return (
              <Accordion
                key={category._id}
                isOpen={false}
                allowHeaderClick={true}
                headerContent={
                  <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.X_SMALL}>
                    {category.label}
                  </Heading>
                }
                classes={{accordionWrapper: styles.accordionWrapper}}
              >
                <Table
                  rows={getTableRows(category.fields)}
                  cols={cols}
                  classes={{
                    table: styles.table,
                    th: classNames(styles.tableThead, styles.tableTh),
                  }}
                />
              </Accordion>
            )
          })}
      </div>
      <FormPreview type={onboardingFlowStepsId.ADMISSION_FORM} />
    </div>
  )
}
