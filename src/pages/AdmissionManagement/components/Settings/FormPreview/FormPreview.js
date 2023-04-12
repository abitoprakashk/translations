import {onboardingFlowStepsId} from '../../../utils/constants'
import styles from './FormPreview.module.css'
import leadStagePreview from '../../../assets/lead-stage-preview.svg'
import webPagePreview from '../../../assets/web-page-preview.svg'
import enquiryFormPreview from '../../../assets/enquiry-form-preview.svg'
import admissionFormPreview from '../../../assets/admission-form-preview.svg'
import documentsPreview from '../../../assets/documents-preview.svg'

const previewImages = {
  [onboardingFlowStepsId.LEAD_STAGES]: leadStagePreview,
  [onboardingFlowStepsId.WEB_PAGE]: webPagePreview,
  [onboardingFlowStepsId.ENQUIRY_FORM]: enquiryFormPreview,
  [onboardingFlowStepsId.ADMISSION_FORM]: admissionFormPreview,
  [onboardingFlowStepsId.DOCUMENTS]: documentsPreview,
}

export default function FormPreview({type}) {
  return (
    <div className={styles.previewContent}>
      <img src={previewImages[type]} />
    </div>
  )
}
