import {useEffect} from 'react'
import produce from 'immer'
import {t} from 'i18next'
import {Trans} from 'react-i18next'
import {Heading, HEADING_CONSTANTS, RadioGroup} from '@teachmint/krayon'
import styles from './FormFees.module.css'
import {FEES_STEPPER_IDS} from '../../../utils/constants'
import {
  useAdmissionCrmSettings,
  useCrmInstituteHierarchy,
} from '../../../redux/admissionManagement.selectors'
import FormFeeDetails from './FormFeeDetails'

export default function FormFees({currentStep, formData, setFormData}) {
  const admissionCrmSettings = useAdmissionCrmSettings()
  const instituteHierarchy = useCrmInstituteHierarchy()
  const stepKey =
    currentStep === FEES_STEPPER_IDS.FORM_FEE ? 'form_fees' : 'admission_fees'

  const classes = {}
  instituteHierarchy?.children.forEach((department) => {
    department?.children.forEach((standard) => {
      classes[standard.id] = standard.name
    })
  })

  const isFeeApplicable =
    currentStep === FEES_STEPPER_IDS.FORM_FEE
      ? formData.form_fees_required
      : formData.admission_fees_required

  useEffect(() => {
    // If form fee is applicable then check whether all the IDs of classes
    // are present or not, if not then add blank object and set the formData
    if (isFeeApplicable) {
      const selectedClasses =
        admissionCrmSettings?.data?.enable_session.enabled_node_ids
      if (
        selectedClasses.length !==
        Object.keys(formData[stepKey].class_fees).length
      ) {
        let newClasses = {...formData[stepKey].class_fees}
        selectedClasses.map((classId) => {
          if (!(classId in newClasses)) {
            newClasses[classId] = {
              class_id: classId,
              fee_amount: 0,
              tax: 0,
            }
          }
        })
        setFormData(
          produce(formData, (draft) => {
            draft[stepKey].class_fees = newClasses
          })
        )
      }
    }
  }, [isFeeApplicable, currentStep])

  const applyFeeOptions = [
    {
      label: (
        <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}>
          {t('feesFormApplyFeeOptionYes')}
        </Heading>
      ),
      value: true,
    },
    {
      label: (
        <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}>
          {t('feesFormApplyFeeOptionNo')}
        </Heading>
      ),
      value: false,
    },
  ]

  const handleOptionsChange = ({selected}) => {
    setFormData({
      ...formData,
      [currentStep === FEES_STEPPER_IDS.FORM_FEE
        ? 'form_fees_required'
        : 'admission_fees_required']: selected,
    })
  }

  return (
    <div className={styles.formContent}>
      <div className={styles.applyFeeSection}>
        <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.X_SMALL}>
          <Trans i18nKey={'feesFormApplyFeeText'}>
            Apply
            {{
              step:
                currentStep === FEES_STEPPER_IDS.FORM_FEE
                  ? 'form'
                  : 'admission',
            }}
            fee?
          </Trans>
        </Heading>
        <div className={styles.feeOptions}>
          <RadioGroup
            selectedOption={isFeeApplicable}
            options={applyFeeOptions}
            handleChange={handleOptionsChange}
          />
        </div>
      </div>
      {isFeeApplicable && (
        <FormFeeDetails
          stepKey={stepKey}
          formData={formData}
          setFormData={setFormData}
        />
      )}
    </div>
  )
}
