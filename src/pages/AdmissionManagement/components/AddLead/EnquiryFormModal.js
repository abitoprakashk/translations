import {useMemo, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {useDispatch, useSelector} from 'react-redux'
import {events} from '../../../../utils/EventsConstants'
import {
  Button,
  Divider,
  Icon,
  ICON_CONSTANTS,
  Modal,
  MODAL_CONSTANTS,
} from '@teachmint/krayon'
import {ErrorBoundary} from '@teachmint/common'
import {
  admissionCrmFieldTypes,
  admissionCrmFormType,
  admissionCrmFormTypes,
  crmFormType,
  IMIS_SETTING_TYPES,
} from '../../utils/constants'
import {checkRegex} from '../../../../utils/Validations'
import globalActions from '../../../../redux/actions/global.actions'
import {useAdmissionCrmSettings} from '../../redux/admissionManagement.selectors'
import EnquiryForm from './EnquiryForm'
import classNames from 'classnames'
import styles from './EnquiryFormModal.module.css'

export default function EnquiryFormModal({formType, setFormType}) {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const [formValues, setFormValues] = useState({})
  const [formErrors, setFormErrors] = useState({})
  const [errorMessage, setErrorMessage] = useState('')
  const eventManager = useSelector((state) => state.eventManager)

  const admissionCrmSettings = useAdmissionCrmSettings()
  const {lead_stages: leadStageData, categorizedFields} =
    admissionCrmSettings.data

  const getFirstLeadStage = () => {
    return leadStageData ? Object.values(leadStageData).shift()._id : ''
  }

  const requiredFields = useMemo(() => {
    let categorywiseRequiredFields = []
    Object.values(admissionCrmSettings?.data?.profile_fields).map((field) => {
      if (field.required_in.includes(admissionCrmFieldTypes.ENQUIRY_FORM)) {
        categorywiseRequiredFields.push(field.imis_key_id)
      }
    })
    return categorywiseRequiredFields
  }, [])

  const checkFieldRegexPattern = () => {
    let errors = {}
    Object.values(categorizedFields)
      ?.filter((field) => field.setting_type === IMIS_SETTING_TYPES.CATEGORY)
      ?.forEach((admissionFields) => {
        admissionFields.fields.forEach((field) => {
          if (
            formValues?.[field.key_id] &&
            field.pattern &&
            !checkRegex(new RegExp(field.pattern), formValues[field.key_id])
          ) {
            errors[field.key_id] = t('thisFieldHasIncorrectValue')
          }
        })
      })
    return errors
  }

  const closeModal = () => {
    setFormType('')
    setFormValues('')
    dispatch(globalActions.getLeadList.request())
    eventManager.send_event(events.ADD_NEW_LEAD_ENQUIRY_DONE_CLICKED_TFI, {
      field_values: Object.keys(formValues),
    })
  }

  const handleFormvalues = () => {
    const errors = checkFieldRegexPattern()
    setFormErrors(errors)
    if (Object.keys(errors).length > 0) {
      return
    }
    const successAction = () => {
      closeModal()
    }

    dispatch(
      globalActions.addLead.request(
        {
          leads: [
            {
              is_unique: true,
              class_id: formValues.standard,
              lead_stage_id: getFirstLeadStage(),
              profile_data: formValues,
              phone_number: formValues.phone_number,
              form_type: crmFormType.ENQUIRY,
            },
          ],
        },
        successAction,
        (error) => setErrorMessage(error)
      )
    )
  }

  const getModalFooter = () => {
    return (
      <div>
        <Divider spacing="0" />
        <div className={classNames(styles.modalFooter)}>
          <div className={styles.modalErrorSection}>
            {errorMessage && (
              <>
                <Icon name="info" type={ICON_CONSTANTS.TYPES.ERROR} />
                <div>{errorMessage}</div>
              </>
            )}
          </div>
          <Button
            onClick={handleFormvalues}
            children={t('save')}
            isDisabled={
              !requiredFields.every((field) => Boolean(formValues?.[field])) &&
              Boolean(Object.keys(formErrors))
            }
          />
        </div>
      </div>
    )
  }

  return (
    <Modal
      size={MODAL_CONSTANTS.SIZE.X_LARGE}
      isOpen={!!formType}
      shouldCloseOnEsc={false}
      shouldCloseOnOverlayClick={false}
      header={admissionCrmFormTypes[formType].label}
      onClose={() => setFormType('')}
      footer={getModalFooter()}
    >
      <ErrorBoundary>
        <EnquiryForm
          formType={admissionCrmFormType.ENQUIRY_FORM}
          formValues={formValues}
          formErrors={formErrors}
          setFormValues={setFormValues}
        />
      </ErrorBoundary>
    </Modal>
  )
}
