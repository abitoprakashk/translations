import {EVALUATION_TYPE} from '../../../../../../../constants'

export const evaluationHeading = (type = null, data = {}) => {
  switch (type) {
    case EVALUATION_TYPE.SCHOLASTIC:
    case EVALUATION_TYPE.CO_SCHOLASTIC:
      return `${data?.subject_name} - Evaluation`

    case EVALUATION_TYPE.ATTENDANCE:
      return 'Attendance - Evaluation'

    case EVALUATION_TYPE.REMARKS:
      return `Remarks`

    case EVALUATION_TYPE.RESULTS:
      return `Results`

    default:
      return ''
  }
}

export const evaluationAlertMessage = (type = null, total, remaining, t) => {
  switch (type) {
    case EVALUATION_TYPE.SCHOLASTIC:
    case EVALUATION_TYPE.CO_SCHOLASTIC:
    case EVALUATION_TYPE.ATTENDANCE:
      return remaining == 0
        ? t('evaluationCompleted')
        : `${remaining || 0}/${total || 0} ${t('evaluationLeft')}`

    case EVALUATION_TYPE.REMARKS:
      return remaining == 0
        ? t('remarksCompleted')
        : `${remaining || 0}/${total || 0} ${t('remarksLeft')}`

    case EVALUATION_TYPE.RESULTS:
      return remaining == 0
        ? t('resultsCompleted')
        : `${remaining || 0}/${total || 0} ${t('resultsLeft')}`

    default:
      return ''
  }
}
