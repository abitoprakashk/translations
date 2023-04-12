import {t} from 'i18next'
import produce from 'immer'
import classNames from 'classnames'
import {
  Accordion,
  Heading,
  HEADING_CONSTANTS,
  Input,
  INPUT_TYPES,
  Para,
  PARA_CONSTANTS,
  RadioGroup,
  Table,
  Toggle,
  Alert,
  ALERT_CONSTANTS,
} from '@teachmint/krayon'
import FormPreview from '../FormPreview/FormPreview'
import styles from './EnquiryForm.module.css'
import {
  admissionFormDefaultFields,
  admissionFormSettingsHiddenFields,
  IMIS_SETTING_TYPES,
  onboardingFlowStepsId,
  permanentAddressFields,
} from '../../../utils/constants'
import {useAdmissionCrmSettings} from '../../../redux/admissionManagement.selectors'

export default function EnquiryForm({formData, setFormData, setErrorMessage}) {
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
    if (property === 'enabled') {
      const enabledFields = Object.values(formData?.profile_fields).filter(
        (field) => field.enabled
      )
      const totalAllowedFields = enabledFields.length + (value ? 1 : -1)
      if (totalAllowedFields > 15) {
        setErrorMessage(t('enquiryFormFieldsErrorMsg'))
      } else {
        setErrorMessage('')
      }
    }
  }

  const applyFeeOptions = [
    {
      label: (
        <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}>
          {t('enquiryFormApplyFeeOptionYes')}
        </Heading>
      ),
      value: true,
    },
    {
      label: (
        <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}>
          {t('enquiryFormApplyFeeOptionNo')}
        </Heading>
      ),
      value: false,
    },
  ]

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
        <Alert
          hideClose
          type={ALERT_CONSTANTS.TYPE.INFO}
          content={t('enquiryFormSettingsAlertMsg')}
          className={styles.alertStyling}
        />
        <div className={styles.mainContent}>
          {Object.values(admissionCrmSettings?.data?.categorizedFields)
            .filter(
              (category) =>
                category.setting_type === IMIS_SETTING_TYPES.CATEGORY
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
          <div>
            <div className={styles.declarationDisplay}>
              <Para
                type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
                weight={PARA_CONSTANTS.WEIGHT.MEDIUM}
              >
                {t('enquiryFormDeclarationOptionsLabel')}
              </Para>
              <div className={styles.declarationOptions}>
                <RadioGroup
                  name="display"
                  selectedOption={formData?.declaration?.display}
                  options={applyFeeOptions}
                  handleChange={({selected}) =>
                    setFormData({
                      ...formData,
                      declaration: {...formData.declaration, display: selected},
                    })
                  }
                />
              </div>
            </div>
            {formData?.declaration?.display && (
              <div>
                <Input
                  rows={3}
                  type={INPUT_TYPES.TEXT_AREA}
                  isRequired={true}
                  title={t('enquiryFormDeclarationTextLabel')}
                  classes={{input: styles.declaration}}
                  value={formData?.declaration?.text}
                  onChange={({value}) =>
                    setFormData({
                      ...formData,
                      declaration: {...formData.declaration, text: value},
                    })
                  }
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <FormPreview type={onboardingFlowStepsId.ENQUIRY_FORM} />
    </div>
  )
}
