import {useState, useMemo} from 'react'
import {useTranslation} from 'react-i18next'
import {useDispatch, useSelector} from 'react-redux'
import {
  Button,
  Divider,
  Modal,
  MODAL_CONSTANTS,
  Icon,
  ICON_CONSTANTS,
} from '@teachmint/krayon'
import {ErrorBoundary} from '@teachmint/common'
import {checkRegex} from '../../../../../utils/Validations'
import styles from './LeadProfileEnquiryForm.module.css'
import globalActions from '../../../../../redux/actions/global.actions'
import {
  admissionCrmFormType,
  IMIS_SETTING_TYPES,
  admissionCrmFieldTypes,
  staticImisFields,
} from '../../../utils/constants'
import {useAdmissionCrmSettings} from '../../../redux/admissionManagement.selectors'
import EnquiryForm from '../../AddLead/EnquiryForm'
import classNames from 'classnames'

export default function LeadProfileEnquiryForm({
  profileData,
  showEnquiryModal,
  setShowEnquiryModal,
}) {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const [formValues, setFormValues] = useState(profileData?.profile_data ?? {})
  const [formErrors, setFormErrors] = useState({})
  const [errorMessage, setErrorMessage] = useState('')
  const currentAdminInfo = useSelector((state) => state.currentAdminInfo)
  const admissionCrmSettings = useAdmissionCrmSettings()
  const {categorizedFields} = admissionCrmSettings.data

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
    setFormValues('')
    dispatch(globalActions.getLeadList.request())
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
      globalActions.updateLead.request(
        {
          lead_id: profileData._id,
          profile_data: formValues,
          class_id: formValues.standard,
          u_by: currentAdminInfo.imember_id,
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
      isOpen={showEnquiryModal}
      shouldCloseOnEsc={false}
      shouldCloseOnOverlayClick={false}
      header={t('addNewLeadOptionEnquiryForm')}
      onClose={() => setShowEnquiryModal(false)}
      footer={getModalFooter()}
    >
      <ErrorBoundary>
        <EnquiryForm
          formType={admissionCrmFormType.ENQUIRY_FORM}
          formValues={formValues}
          formErrors={formErrors}
          setFormValues={setFormValues}
          disabledFields={[staticImisFields.PHONE_NUMBER]}
        />
      </ErrorBoundary>
    </Modal>
  )
}
