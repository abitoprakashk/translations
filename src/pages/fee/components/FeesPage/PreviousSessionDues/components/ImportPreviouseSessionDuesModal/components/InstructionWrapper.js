import styles from '../ImportPreviousSessionDuesModal.module.css'
import {
  Alert,
  Icon,
  ICON_CONSTANTS,
  Para,
  PARA_CONSTANTS,
} from '@teachmint/krayon'
import {useTranslation} from 'react-i18next'
import {
  IMPORT_PREVIOUS_DUES_INSTRUCTIONS,
  IMPORT_PREVIOUS_DUES_INSTRUCTIONS_DONTS,
} from '../../../PreviousSessionDues.constants'
import NumberLabel from '../../../../../tfi-common/NumberLabel/NumberLabel'
import classNames from 'classnames'

export default function InstructionWrapper({importResponse, prepareErrorCSV}) {
  const {t} = useTranslation()
  return (
    <div className={styles.instructionWrapper}>
      {importResponse.successCount > 0 && (
        <Alert
          content={t('updatedSuccessAlertMessage', {
            count: importResponse.successCount,
          })}
          icon="checkCircle"
          type="success"
          hideClose
        />
      )}
      {(importResponse.notFoundCount > 0 ||
        importResponse.negativeDueCount > 0) && (
        <div className={styles.errorBox}>
          <span className={styles.errorBoxTitle}>
            {t('errorsInFileUploaded')}
          </span>
          {importResponse.notFoundCount > 0 && (
            <span className={styles.errorTextContainer}>
              <Icon
                name="caution"
                size={ICON_CONSTANTS.SIZES.XX_SMALL}
                type={ICON_CONSTANTS.TYPES.ERROR}
              />
              <span className={styles.errorBoxText}>
                {t('previousSessionDueStudentsNotFound', {
                  notFoundCount: importResponse.notFoundCount,
                })}
              </span>
            </span>
          )}
          {importResponse.negativeDueCount > 0 && (
            <span className={styles.errorTextContainer}>
              <Icon
                name="caution"
                size={ICON_CONSTANTS.SIZES.XX_SMALL}
                type={ICON_CONSTANTS.TYPES.ERROR}
              />
              <span className={styles.errorBoxText}>
                {t('negativeDueErrorMessage', {
                  negativeDueCount: importResponse.negativeDueCount,
                })}
              </span>
            </span>
          )}
          <Para
            textSize={PARA_CONSTANTS.TEXT_SIZE.SMALL}
            type={PARA_CONSTANTS.TYPE.PRIMARY}
            weight={PARA_CONSTANTS.WEIGHT.MEDIUM}
            className={styles.downloadCSVText}
            onClick={() => prepareErrorCSV()}
          >
            {t('downloadErrorCSV')}
          </Para>
        </div>
      )}
      <Para
        textSize={PARA_CONSTANTS.TEXT_SIZE.LARGE}
        type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
        weight={PARA_CONSTANTS.WEIGHT.MEDIUM}
        className={styles.instructionTitle}
      >
        {t('howToImport')}
      </Para>
      <div className={styles.instructions}>
        {IMPORT_PREVIOUS_DUES_INSTRUCTIONS.map((instruction, i) => (
          <span className={styles.instruction} key={i}>
            <NumberLabel
              number={i + 1}
              numberClassName={classNames(
                styles.instructionLabel,
                styles.higherSpecificity
              )}
              labelClassName={classNames(
                styles.labelClassName,
                styles.higherSpecificity
              )}
            />
            <Para
              textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
              type={PARA_CONSTANTS.TYPE.TEXT_SECONDARY}
              weight={PARA_CONSTANTS.WEIGHT.MEDIUM}
            >
              {t(instruction)}
            </Para>
          </span>
        ))}
      </div>
      <br />
      <Para
        textSize={PARA_CONSTANTS.TEXT_SIZE.LARGE}
        type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
        weight={PARA_CONSTANTS.WEIGHT.MEDIUM}
        className={styles.instructionTitle}
      >
        {t('donts')}
      </Para>
      {IMPORT_PREVIOUS_DUES_INSTRUCTIONS_DONTS.map((instruction, i) => (
        <span className={styles.instruction} key={i}>
          <Icon
            name="error"
            size={ICON_CONSTANTS.SIZES.X_SMALL}
            type={ICON_CONSTANTS.TYPES.WARNING}
          />
          <Para
            textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
            type={PARA_CONSTANTS.TYPE.TEXT_SECONDARY}
            weight={PARA_CONSTANTS.WEIGHT.MEDIUM}
          >
            {t(instruction)}
          </Para>
        </span>
      ))}
    </div>
  )
}
