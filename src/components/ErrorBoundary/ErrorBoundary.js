import {ErrorBoundary as CommonErrorBoundary} from '@teachmint/common'
import {t} from 'i18next'
// import {GENERIC_ERROR_MESSAGE} from '../../constants/common.constants'

// const {t} = useTranslation()
const ErrorBoundary = (props) => (
  // <CommonErrorBoundary errorMessage={GENERIC_ERROR_MESSAGE} {...props} />
  <CommonErrorBoundary errorMessage={t('genericErrorMessage')} {...props} />
)

export default ErrorBoundary
