import {t} from 'i18next'
import produce from 'immer'
import classNames from 'classnames'
import {Para, PARA_CONSTANTS, Table, Toggle} from '@teachmint/krayon'
import FormPreview from '../FormPreview/FormPreview'
import styles from './Documents.module.css'
import {
  IMIS_SETTING_TYPES,
  onboardingFlowStepsId,
} from '../../../utils/constants'
import {useAdmissionCrmSettings} from '../../../redux/admissionManagement.selectors'

export default function Documents({formData, setFormData}) {
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
          {t('documentsTheadLabelListOfDocuments')}
        </Para>
      ),
    },
    {
      key: 'visible',
      label: (
        <Para weight={PARA_CONSTANTS.WEIGHT.MEDIUM}>
          {t('documentsTheadLabelVisible')}
        </Para>
      ),
    },
    {
      key: 'mandatory',
      label: (
        <Para weight={PARA_CONSTANTS.WEIGHT.MEDIUM}>
          {t('documentsTheadLabelMandatory')}
        </Para>
      ),
    },
  ]

  const getTableRows = () => {
    let rows = []
    Object.values(admissionCrmSettings?.data?.categorizedFields)
      .filter(
        (category) => category.setting_type === IMIS_SETTING_TYPES.DOCUMENT
      )
      .forEach((category) => {
        category.fields.map((field) => {
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
                isDisabled={field.is_value_mandatory}
                handleChange={(e) => handleChange(e, 'enabled')}
                isSelected={formData.profile_fields[field.key_id]?.enabled}
              />
            ),
            mandatory: (
              <Toggle
                fieldName={field.key_id}
                isDisabled={
                  !formData.profile_fields[field.key_id]?.enabled ||
                  field.is_value_mandatory
                }
                handleChange={(e) => handleChange(e, 'required')}
                isSelected={formData.profile_fields[field.key_id]?.required}
              />
            ),
          })
        })
      })
    return rows
  }

  return (
    <div className={styles.bodyContent}>
      <div className={styles.formContent}>
        <Table
          cols={cols}
          rows={getTableRows()}
          classes={{
            table: styles.table,
            th: classNames(styles.tableThead, styles.tableTh),
          }}
        />
      </div>
      <FormPreview type={onboardingFlowStepsId.DOCUMENTS} />
    </div>
  )
}
