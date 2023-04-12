import styles from '../ImportPreviousSessionDuesModal.module.css'
import {Input, Icon, ICON_CONSTANTS} from '@teachmint/krayon'
import {useTranslation, Trans} from 'react-i18next'
import {useSelector} from 'react-redux'
import {events} from '../../../../../../../../utils/EventsConstants'
import {
  ACCEPTED_SHEET_EXTENSIONS,
  handleSheetUpload,
} from '../../../../../../../../utils/fileUtils'
import {useFeeStructure} from '../../../../../../redux/feeStructure/feeStructureSelectors'

export default function UploadCSVSection({
  formFields,
  setFormFields,
  downloadExistingStudentCSV,
  formatSheetData,
  setUploadedCSVData,
}) {
  const {t} = useTranslation()
  const {feeTypes} = useFeeStructure()
  const eventManager = useSelector((state) => state.eventManager)
  return (
    <div className={styles.leftSection}>
      <Input
        fieldName="feeTypes"
        isMultiSelect={true}
        options={feeTypes.map((type) => {
          return {
            label: type.name,
            value: type._id,
          }
        })}
        placeholder={t('feeTypePlaceholder')}
        showMsg
        withChips={true}
        title={t('feeTypeTitle')}
        type="dropdown"
        value={formFields.fee_types}
        selectionPlaceholder={
          formFields.fee_types.length == 0
            ? t('feeTypePlaceholder')
            : t('selectedFeeTypePlaceholder', {
                counter: formFields.fee_types.length,
              })
        }
        onChange={({value}) =>
          setFormFields((formFields) => ({
            ...formFields,
            fee_types: [...value],
          }))
        }
      />
      <div className={styles.horizontalDivider}></div>
      <span className={styles.downloadCSVText}>
        <Icon
          name="download"
          size={ICON_CONSTANTS.SIZES.X_SMALL}
          type={ICON_CONSTANTS.TYPES.DEFAULT}
        />
        <Trans i18nKey="downloadStudentListCSV">
          <div>Download student list</div>
          <div
            className={styles.downloadCSVLink}
            onClick={() => downloadExistingStudentCSV()}
          >
            CSV file
          </div>
        </Trans>
      </span>
      <div className={styles.horizontalDivider}></div>
      <Input
        fieldName="file"
        isRequired
        onChange={(e) => {
          if (e.value) {
            handleSheetUpload(e.value, () => {}, formatSheetData)
          } else {
            setUploadedCSVData({})
          }
        }}
        onClick={() =>
          eventManager.send_event(
            events.FEE_PREVIOUS_SESSION_DUES_CHOOSE_FILE_CLICKED_TFI
          )
        }
        placeholder={t('exampleCSV')}
        showMsg
        title={t('uploadCSVTitle')}
        type="file"
        acceptableTypes={ACCEPTED_SHEET_EXTENSIONS}
      />
    </div>
  )
}
