import {Alert, Button, Para} from '@teachmint/krayon'
import {useTranslation} from 'react-i18next'
import styles from './ImportValidationAlert.module.css'

const ImportValidationAlert = ({feeValidation, handleEditSession}) => {
  const {t} = useTranslation()

  return feeValidation?.type ? (
    <Alert
      className={styles.feeValidationAlert}
      type={feeValidation.type}
      content={
        <div className={styles.alertContent}>
          <Para type={feeValidation.type}>{feeValidation.message}</Para>
          {feeValidation.showEditSession && (
            <Button
              classes={{button: styles.alertActionBtn}}
              onClick={handleEditSession}
            >
              {t('editSessionLabel')}
            </Button>
          )}
        </div>
      }
      hideClose
    />
  ) : null
}

export default ImportValidationAlert
