import React, {useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import styles from './SliderUpdateStudentCSV.module.css'
import {showLoadingAction} from '../../../redux/actions/commonAction'
import SliderScreen from '../../Common/SliderScreen/SliderScreen'
import SliderScreenHeader from '../../Common/SliderScreenHeader/SliderScreenHeader'
import AcknowledgementPopup from '../../Common/AcknowledgementPopup/AcknowledgementPopup'
import {createAndDownloadCSV} from '../../../utils/Helpers'
import CsvUpload from '../../../pages/user-profile/components/common/CsvUpload/CsvUpload'
import {Icon} from '@teachmint/common'
import {useTranslation} from 'react-i18next'
import {processDataSettingsKeyIdCSV} from './DynamicSettingsKeyIdCSV'
import {CSVDataToQuery} from './UploadCSVDynamic'
import {
  getInstitutePersonaMembersAction,
  getInstitutePersonaSettingsAction,
  resetPersonaMembersAction,
  resetPersonaSettingsAction,
  updatePersonaMembersAction,
} from '../../../pages/InstituteSettings/InstituteSettings.actions'
import {useEffect} from 'react'
import {events} from '../../../utils/EventsConstants'
// import {INSTITUTE_MEMBER_TYPE} from '../../../constants/institute.constants'

export default function SliderUpdateStudentCSV({setSliderScreen}) {
  const [showPopup, setShowPopup] = useState(false)
  const [validationObject, setValidationObject] = useState({})
  const {instituteInfo, eventManager} = useSelector((store) => store)
  const institutePersonaSettings = useSelector(
    (store) => store.globalData?.institutePersonaSettings?.data
  )
  const institutePersonaMembers = useSelector(
    (store) => store.globalData?.institutePersonaMembers?.data
  )

  const [downloadExistingMembers, setDownloadExistingMembers] = useState(false)
  const [isBulkUpdate, setIsBulkUpdate] = useState(false)
  const [processedObject, setProcessedObject] = useState([])
  const dispatch = useDispatch()
  const {t} = useTranslation()

  // const getInstituteStudents = () => {
  //   if (instituteInfo?._id) {
  //     dispatch(showLoadingAction(true))
  //     utilsGetUsersList({type: [INSTITUTE_MEMBER_TYPE.STUDENT]})
  //       .then(({status, obj}) => {
  //         if (status) dispatch(instituteStudentListAction(obj))
  //       })
  //       .catch(() => dispatch(showErrorOccuredAction(true)))
  //       .finally(() => dispatch(showLoadingAction(false)))
  //   }
  // }

  useEffect(() => {
    if (institutePersonaMembers === null || institutePersonaSettings === null) {
      return
    }
    if (
      downloadExistingMembers === true &&
      institutePersonaMembers.length > 0 &&
      institutePersonaSettings.length > 0
    ) {
      const csvData = processDataSettingsKeyIdCSV(
        institutePersonaSettings,
        institutePersonaMembers,
        true
      )
      createAndDownloadCSV('Existing-Students', csvData)
      dispatch(resetPersonaSettingsAction())
      dispatch(resetPersonaMembersAction())
      setDownloadExistingMembers(false)
    }
  }, [institutePersonaMembers, institutePersonaSettings])

  useEffect(() => {
    dispatch(showLoadingAction(true))
    if (isBulkUpdate && institutePersonaSettings.length) {
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
      setSliderScreen(false)
    }
    dispatch(showLoadingAction(false))
  }, [institutePersonaSettings])

  const downloadExistingStudentsDynamicCSV = () => {
    eventManager.send_event(events.SIS_DOWNLOAD_EXISTING_LIST_CLICKED_TFI)
    dispatch(getInstitutePersonaMembersAction(4))
    dispatch(getInstitutePersonaSettingsAction('STUDENT'))
    setDownloadExistingMembers(true)
  }

  const handleDynamicUpdatedCSV = (check, processedCSVObject) => {
    setProcessedObject(processedCSVObject)
    setIsBulkUpdate(true)
    dispatch(getInstitutePersonaSettingsAction('STUDENT'))
    dispatch(showLoadingAction(false))
  }

  return (
    <div>
      <SliderScreen setOpen={() => setSliderScreen(null)} width="700">
        <>
          {showPopup && validationObject ? (
            <AcknowledgementPopup
              onClose={setShowPopup}
              onAction={() => setShowPopup(false)}
              icon={
                validationObject.status
                  ? 'https://storage.googleapis.com/tm-assets/icons/colorful/tick-bg-green.svg'
                  : 'https://storage.googleapis.com/tm-assets/icons/colorful/remove-bg-red.svg'
              }
              title={validationObject.status ? t('success') : t('failed')}
              desc={validationObject.msg}
              primaryBtnText={t('ok')}
            />
          ) : null}
          <SliderScreenHeader
            icon="https://storage.googleapis.com/tm-assets/icons/primary/students-primary.svg"
            title={t('studentDetails')}
          />
          {/* {localLoader ? (
            <div className="loading" />
          ) : ( */}
          <div className="p-8">
            <CsvUpload
              downloadSampleCSVFile={() => {
                downloadExistingStudentsDynamicCSV()
              }}
              handleCSV={handleDynamicUpdatedCSV}
              userType={'Student'}
              hasExisting={true}
            />
            <div className={styles.divider} />
            <div className={styles.heading}>{t('newToBulkUpdate')}</div>
            <ol className={styles.points}>
              <li>{t('csvUploadLiPoint1')}</li>
              <li>{t('openTheDownloadedFileInMsExcel')}</li>
              <li>{t('editTheExistingDataOfStudentsAccordingToYourNeed')}</li>
              <li>{t('uploadTheModifiedCSVFileAbove')}</li>
            </ol>
            <div className={styles.note}>
              <Icon name="caution" type="outlined" color="error" size="xxs" />
              {t('DoNotAddNewStudentEntriesOrEditUniqueId')}
            </div>
          </div>
          {/* )} */}
        </>
      </SliderScreen>
    </div>
  )
}
