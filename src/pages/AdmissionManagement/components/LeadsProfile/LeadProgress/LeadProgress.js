import {useState} from 'react'
import {t} from 'i18next'
import {
  Divider,
  Heading,
  HEADING_CONSTANTS,
  Para,
  ProgressTracker,
  Alert,
  ALERT_CONSTANTS,
  Button,
  BUTTON_CONSTANTS,
} from '@teachmint/krayon'
import {ErrorBoundary} from '@teachmint/common'
import {calculateAmount, getClassName} from '../../../utils/helpers'
import {
  useAdmissionCrmSettings,
  useCrmInstituteHierarchy,
  useLeadData,
} from '../../../redux/admissionManagement.selectors'
import {
  progressTrackerLabels,
  feeStatusLeadProfile,
  FEES_STEPPER_IDS,
  admissionFormLeadProfileStatus,
  crmFormType,
} from '../../../utils/constants'
import ViewDocuments from './ViewDocuments/ViewDocuments'
import SyncFeeModal from './SyncFeeModal/SyncFeeModal'
import ViewReciept from './ViewReciept/ViewReciept'
import TakeAction from './TakeAction'
import styles from './LeadProgress.module.css'
import LeadProfileAdmissionForm from '../LeadProfileAdmissionForm/LeadProfileAdmissionForm'
import {useSelector} from 'react-redux'
import {events} from '../../../../../utils/EventsConstants'
import LeadProfileEnquiryForm from '../LeadProfileEnquiryForm/LeadProfileEnquiryForm'

export default function LeadProgress({leadData}) {
  const [showDocument, setShowDocument] = useState(false)
  const [showAdmissionModal, setShowAdmissionModal] = useState(false)
  const [showEnquiryModal, setShowEnquiryModal] = useState(false)
  const [showReciept, setShowReciept] = useState(false)
  const [showSyncFeeModal, setShowSyncFeeModal] = useState(false)
  const [isAlert, setIsAlert] = useState(true)
  const [feeType, setFeeType] = useState(t('formFeeCapital'))
  const eventManager = useSelector((state) => state.eventManager)

  const admissionFormFields = useAdmissionCrmSettings()
  const leadFollowupData = useLeadData()
  const {fee_settings: feesData} = admissionFormFields.data
  const instituteHierarchy = useCrmInstituteHierarchy()

  const leadName = `${leadData?.profile_data?.name ?? ''} ${
    leadData?.profile_data?.last_name ?? ''
  }`
  let formFee = feesData.form_fees.class_fees[leadData.class_id]
  let admissionFormFee = feesData.admission_fees.class_fees[leadData.class_id]
  let applicationFormFees = calculateAmount(formFee?.fee_amount, formFee?.tax)
  let applicationAdmissionFees = calculateAmount(
    admissionFormFee?.fee_amount,
    admissionFormFee?.tax
  )

  const leadStages = Object.values(admissionFormFields?.data?.lead_stages)
  const admissionConfirmedStageId = leadStages[leadStages.length - 1]._id

  const handleReciept = (fee_type) => {
    setFeeType(fee_type)
    setShowReciept(!showReciept)
  }

  const documentFields = Object.values(
    admissionFormFields?.data?.documentFormFields?.profile_fields
  )

  const isDocumentRequired = () => {
    if (documentFields.some((field) => field.enabled)) {
      return false
    }
    return true
  }

  const isMandatoryDocumentsUploaded = () => {
    let fields = Object.keys(leadData?.profile_data || [])

    for (let i = 0; i < documentFields.length; i++) {
      if (
        documentFields[i].enabled === true &&
        fields.includes(documentFields[i].imis_key_id) &&
        typeof leadData?.profile_data[documentFields[i].imis_key_id] ===
          'string'
      ) {
        return true
      }
    }
    return false
  }

  const steps = [
    {
      label: progressTrackerLabels.ENQUIRY_STARTED,
      actionLabel:
        leadData?.form_type === crmFormType.ENQUIRY ? (
          t('viewEnquiry')
        ) : (
          <Para>{t('leadProfileProgressTrackerCompletedState')}</Para>
        ),
      handleClick:
        leadData?.form_type === crmFormType.ENQUIRY
          ? () => {
              setShowEnquiryModal(true)
            }
          : '',
    },
    {
      label: progressTrackerLabels.FORM_FEE,
      actionLabel:
        leadData?.status_form_fee === feeStatusLeadProfile.PAID ? (
          t('viewReceipt')
        ) : leadData.lead_stage_id === admissionConfirmedStageId ||
          leadData?.status_adm_fee === feeStatusLeadProfile.PAID ||
          leadData?.status_adm_form ===
            admissionFormLeadProfileStatus.COMPLETED ||
          isMandatoryDocumentsUploaded() ? (
          <Para>{t('leadProfileProgressTrackerSkippedState')}</Para>
        ) : (
          ''
        ),
      handleClick:
        leadData?.status_form_fee === feeStatusLeadProfile.PAID
          ? () => handleReciept(FEES_STEPPER_IDS.FORM_FEE)
          : '',
    },
    {
      label: progressTrackerLabels.APPLICATION_FORM,
      actionLabel:
        leadData?.status_adm_form ===
        admissionFormLeadProfileStatus.COMPLETED ? (
          t('viewForm')
        ) : leadData.lead_stage_id === admissionConfirmedStageId ||
          leadData?.status_adm_fee === feeStatusLeadProfile.PAID ||
          isMandatoryDocumentsUploaded() ? (
          <Para>{t('leadProfileProgressTrackerSkippedState')}</Para>
        ) : (
          ''
        ),
      handleClick:
        leadData?.status_adm_form === admissionFormLeadProfileStatus.COMPLETED
          ? () => {
              setShowAdmissionModal(!showAdmissionModal)
              eventManager.send_event(
                events.ADMISSION_LEAD_PROFILE_VIEW_FORM_CLICKED_TFI,
                {lead_id: leadData._id}
              )
            }
          : '',
    },
    {
      label: progressTrackerLabels.DOCUMENT_UPLOAD,
      actionLabel: isMandatoryDocumentsUploaded() ? (
        t('viewDocuments')
      ) : leadData.lead_stage_id === admissionConfirmedStageId ||
        leadData?.status_adm_fee === feeStatusLeadProfile.PAID ? (
        <Para>{t('leadProfileProgressTrackerSkippedState')}</Para>
      ) : (
        ''
      ),
      handleClick: isMandatoryDocumentsUploaded()
        ? () => {
            setShowDocument(!showDocument)
            eventManager.send_event(
              events.ADMISSION_LEAD_PROFILE_VIEW_DOCUMENTS_CLICKED_TFI
            )
          }
        : '',
    },
    {
      label: progressTrackerLabels.ADMISSION_FEE,
      actionLabel:
        leadData?.status_adm_fee === feeStatusLeadProfile.PAID ? (
          t('viewReceipt')
        ) : leadData.lead_stage_id === admissionConfirmedStageId ? (
          <Para>{t('leadProfileProgressTrackerSkippedState')}</Para>
        ) : (
          ''
        ),
      handleClick:
        leadData?.status_adm_fee === feeStatusLeadProfile.PAID
          ? () => handleReciept(FEES_STEPPER_IDS.ADMISSION_FEE)
          : '',
    },
    {
      label: progressTrackerLabels.ADMITTED,
      actionLabel: '',
      handleClick: () => {},
    },
  ]

  const getProgressTrackerSteps = () => {
    if (!feesData?.admission_fees_required || applicationAdmissionFees === 0) {
      const index = steps.findIndex((object) => {
        return object.label === progressTrackerLabels.ADMISSION_FEE
      })
      if (index > -1) {
        steps.splice(index, 1)
      }
    }
    if (!feesData?.form_fees_required || applicationFormFees === 0) {
      const index = steps.findIndex((object) => {
        return object.label === progressTrackerLabels.FORM_FEE
      })
      if (index > -1) {
        steps.splice(index, 1)
      }
    }
    if (isDocumentRequired()) {
      const index = steps.findIndex((object) => {
        return object.label === progressTrackerLabels.DOCUMENT_UPLOAD
      })
      if (index > -1) {
        steps.splice(index, 1)
      }
    }
    return steps
  }

  const getCurrentStep = () => {
    if (leadData.lead_stage_id === admissionConfirmedStageId) {
      return (
        steps.findIndex((object) => {
          return object.label === progressTrackerLabels.ADMITTED
        }) + 1
      )
    } else if (
      steps.some((e) => e.label === progressTrackerLabels.ADMISSION_FEE) &&
      leadData?.status_adm_fee === feeStatusLeadProfile.PAID
    ) {
      return (
        steps.findIndex((object) => {
          return object.label === progressTrackerLabels.ADMISSION_FEE
        }) + 1
      )
    } else if (
      steps.some((e) => e.label === progressTrackerLabels.DOCUMENT_UPLOAD) &&
      isMandatoryDocumentsUploaded()
    ) {
      return (
        steps.findIndex((object) => {
          return object.label === progressTrackerLabels.DOCUMENT_UPLOAD
        }) + 1
      )
    } else if (
      leadData?.status_adm_form === admissionFormLeadProfileStatus.COMPLETED
    ) {
      return (
        steps.findIndex((object) => {
          return object.label === progressTrackerLabels.APPLICATION_FORM
        }) + 1
      )
    } else if (
      steps.some((e) => e.label === progressTrackerLabels.FORM_FEE) &&
      leadData?.status_form_fee === feeStatusLeadProfile.PAID
    ) {
      return (
        steps.findIndex((object) => {
          return object.label === progressTrackerLabels.FORM_FEE
        }) + 1
      )
    }
    return 1
  }

  const getSkippedStep = () => {
    let skipSteps = []
    if (
      steps.some((e) => e.label === progressTrackerLabels.FORM_FEE) &&
      leadData?.status_form_fee != feeStatusLeadProfile.PAID
    ) {
      skipSteps.push(
        steps.findIndex((object) => {
          return object.label === progressTrackerLabels.FORM_FEE
        })
      )
    }
    if (
      steps.some((e) => e.label === progressTrackerLabels.ADMISSION_FEE) &&
      leadData?.status_adm_fee != feeStatusLeadProfile.PAID
    ) {
      skipSteps.push(
        steps.findIndex((object) => {
          return object.label === progressTrackerLabels.ADMISSION_FEE
        })
      )
    }
    if (leadData?.status_adm_form != admissionFormLeadProfileStatus.COMPLETED) {
      skipSteps.push(
        steps.findIndex((object) => {
          return object.label === progressTrackerLabels.APPLICATION_FORM
        })
      )
    }
    if (
      steps.some((e) => e.label === progressTrackerLabels.DOCUMENT_UPLOAD) &&
      !isMandatoryDocumentsUploaded()
    ) {
      skipSteps.push(
        steps.findIndex((object) => {
          return object.label === progressTrackerLabels.DOCUMENT_UPLOAD
        })
      )
    }
    return skipSteps
  }

  return (
    <ErrorBoundary>
      {leadData.lead_stage_id === admissionConfirmedStageId &&
        leadData?.status_adm_fee === feeStatusLeadProfile.PAID &&
        leadFollowupData?.data?.fees_settled && (
          <Alert
            content={t('admissionFeeSyncLeadProfilePopupMsg')}
            type={ALERT_CONSTANTS.TYPE.SUCCESS}
            hideClose={false}
            className={styles.alert}
          />
        )}
      {leadData.lead_stage_id === admissionConfirmedStageId &&
        leadData?.status_adm_fee === feeStatusLeadProfile.PAID &&
        isAlert &&
        leadFollowupData?.data?.fees_settled == false && (
          <Alert
            content={
              <div className={styles.syncWrapper}>
                <Para
                  children={t('settleAdmissionFeesHeadingLeadProfilePage')}
                  className={styles.syncStyle}
                />
                <Button
                  type={BUTTON_CONSTANTS.TYPE.TEXT}
                  size={BUTTON_CONSTANTS.SIZE.SMALL}
                  category={BUTTON_CONSTANTS.CATEGORY.PRIMARY}
                  onClick={() => {
                    eventManager.send_event(
                      events.ADMISSION_FEE_SYNCNOW_CLICKED_TFI,
                      {lead_id: leadData._id}
                    )
                    setShowSyncFeeModal(!showSyncFeeModal)
                  }}
                >
                  {t('syncNowLeadProfilePage')}
                </Button>
              </div>
            }
            type={ALERT_CONSTANTS.TYPE.WARNING}
            hideClose={true}
            className={styles.alert}
          />
        )}
      {showSyncFeeModal && (
        <SyncFeeModal
          leadId={leadData?._id}
          showSyncFeeModal={showSyncFeeModal}
          setShowSyncFeeModal={setShowSyncFeeModal}
          setIsAlert={setIsAlert}
        />
      )}
      {showAdmissionModal && (
        <LeadProfileAdmissionForm
          profileData={leadData}
          showAdmissionForm={showAdmissionModal}
          setShowAdmissionForm={setShowAdmissionModal}
        />
      )}
      {showEnquiryModal && (
        <LeadProfileEnquiryForm
          profileData={leadData}
          showEnquiryModal={showEnquiryModal}
          setShowEnquiryModal={setShowEnquiryModal}
        />
      )}
      {showDocument && (
        <ViewDocuments leadData={leadData} setShowDocument={setShowDocument} />
      )}
      {showReciept && (
        <ViewReciept
          feeType={feeType}
          leadId={leadData?._id}
          leadName={leadName}
          showReciept={showReciept}
          setShowReciept={setShowReciept}
          leadClass={getClassName(
            instituteHierarchy,
            leadData?.profile_data?.standard
          )}
        />
      )}
      <Heading
        textSize={HEADING_CONSTANTS.TEXT_SIZE.MEDIUM}
        className={styles.progressTrackerHeading}
      >
        {t('progressTracker')}
      </Heading>
      <Para className={styles.para}>{t('progressTrackerComment')}</Para>
      <div className={styles.stepper}>
        <ProgressTracker
          steps={getProgressTrackerSteps()}
          currentstep={getCurrentStep()}
          skipState={getSkippedStep()}
        />
      </div>
      {leadData.lead_stage_id !== admissionConfirmedStageId && (
        <TakeAction leadData={leadData} />
      )}
      <Divider />
    </ErrorBoundary>
  )
}
