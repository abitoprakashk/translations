import React, {useEffect, useRef, useState} from 'react'
import {t} from 'i18next'
import {useDispatch, useSelector} from 'react-redux'
import {showLoadingAction} from '../../../../redux/actions/commonAction'
import {
  getInstitutePersonaMembersAction,
  getInstitutePersonaSettingsAction,
  resetPersonaSettingsAction,
  updatePersonaMembersAction,
} from '../../../InstituteSettings/InstituteSettings.actions'
import {processDataSettingsKeyIdCSV} from '../../../../components/SchoolSystem/SectionDetails/DynamicSettingsKeyIdCSV'
import {createAndDownloadCSV} from '../../../../utils/Helpers'
import {CSVDataToQuery} from '../../../../components/SchoolSystem/SectionDetails/UploadCSVDynamic'
import {
  Button,
  BUTTON_CONSTANTS,
  Heading,
  HEADING_CONSTANTS,
  Para,
  PARA_CONSTANTS,
  PlainCard,
  Popup,
} from '@teachmint/krayon'
import styles from './UpdateStudentInfomation.module.css'
import DragAndDropCSVUpload from '../../../../components/Common/DragAndDropCSVUpload/DragAndDropCSVUpload'
import {createPortal} from 'react-dom'

export default function UpdateStudentInfomation({setShow}) {
  const [processedObject, setProcessedObject] = useState([])
  const [showPopup, setShowPopup] = useState(false)
  const [validationObject, setValidationObject] = useState({})

  const dispatch = useDispatch()

  const portalContainer = useRef(null)

  if (!portalContainer.current) {
    portalContainer.current = document.getElementById(
      'student-update-data-modal'
    )
  }

  const {instituteInfo} = useSelector((store) => store)
  const institutePersonaSettings = useSelector(
    (store) => store.globalData?.institutePersonaSettings?.data
  )
  const institutePersonaMembers = useSelector(
    (store) => store.globalData?.institutePersonaMembers?.data
  )

  useEffect(() => {
    dispatch(getInstitutePersonaMembersAction(4))
    dispatch(getInstitutePersonaSettingsAction('STUDENT'))
  }, [])

  const downloadExistingStudentsDynamicCSV = () => {
    if (institutePersonaMembers?.length && institutePersonaSettings?.length) {
      const csvData = processDataSettingsKeyIdCSV(
        institutePersonaSettings,
        institutePersonaMembers,
        true
      )
      createAndDownloadCSV('Existing-Students', csvData)
    }
  }

  const handleDataUpdate = () => {
    dispatch(showLoadingAction(true))
    if (institutePersonaSettings?.length) {
      const updateStudentsData = CSVDataToQuery(
        institutePersonaSettings,
        processedObject,
        'STUDENT',
        true,
        false,
        instituteInfo.institute_type
      )
      if (
        'status' in updateStudentsData &&
        updateStudentsData['status'] === false
      ) {
        setValidationObject(updateStudentsData)
        setShowPopup(true)
        dispatch(showLoadingAction(false))
        return
      }
      dispatch(updatePersonaMembersAction(updateStudentsData))
      dispatch(resetPersonaSettingsAction())
    }
    dispatch(showLoadingAction(false))
    setShow(false)
  }

  return (
    <PlainCard className={styles.wrapper}>
      <div className={styles.header}>
        <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}>
          {t('bulkupdate')}
        </Heading>

        <Button
          type={BUTTON_CONSTANTS.TYPE.TEXT}
          onClick={downloadExistingStudentsDynamicCSV}
        >
          {t('downloadList')}
        </Button>
      </div>

      <div className={styles.body}>
        <DragAndDropCSVUpload
          onUpload={(processedCSVObject) =>
            setProcessedObject(processedCSVObject)
          }
          onRemove={() => setProcessedObject(null)}
          uploadHelperText={{
            heading: t('newToBulkUpdate'),
            rows: [
              t('csvUploadLiPoint1'),
              t('openTheDownloadedFileInMsExcel'),
              t('editTheExistingDataOfStudentsAccordingToYourNeed'),
              t('DoNotAddNewStudentEntriesOrEditUniqueId'),
              t('uploadTheModifiedCSVFileAbove'),
            ],
          }}
        />

        {portalContainer.current &&
          createPortal(
            <>
              <Button
                type={BUTTON_CONSTANTS.TYPE.OUTLINE}
                onClick={() => setShow(false)}
              >
                {t('cancel')}
              </Button>

              <Button
                type={BUTTON_CONSTANTS.TYPE.FILLED}
                category={BUTTON_CONSTANTS.CATEGORY.PRIMARY}
                onClick={handleDataUpdate}
                isDisabled={!(processedObject?.rows?.length > 0)}
              >
                {t('update')}
              </Button>
            </>,
            portalContainer.current
          )}

        {showPopup && validationObject && (
          <Popup
            isOpen={true}
            onClose={() => setShowPopup(false)}
            header={t('failed')}
            actionButtons={[
              {
                id: 'ok-btn',
                onClick: () => setShowPopup(false),
                body: t('ok'),
              },
            ]}
          >
            <Para
              type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
              className={styles.errorPopupContent}
            >
              {validationObject?.msg}
            </Para>
          </Popup>
        )}
      </div>
    </PlainCard>
  )
}
