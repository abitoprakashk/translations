import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useTranslation} from 'react-i18next'
import {
  showErrorOccuredAction,
  showLoadingAction,
} from '../../../redux/actions/commonAction'

import {
  instituteTeacherListAction,
  teacherListLoadingAction,
} from '../../../redux/actions/instituteInfoActions'
import {utilsGetUsersList} from '../../../routes/dashboard'

import {events} from '../../../utils/EventsConstants'
import {createAndDownloadCSV} from '../../../utils/Helpers'
import {dynamicStaffSampleData} from '../../../utils/SampleCSVRows'
import AcknowledgementPopup from '../../Common/AcknowledgementPopup/AcknowledgementPopup'

import {processDataSettingsKeyIdCSV} from './DynamicSettingsKeyIdCSV'
import {CSVDataToQuery} from './UploadCSVDynamic'
import {
  addPersonaMembersAction,
  getInstitutePersonaSettingsAction,
  resetPersonaSettingsAction,
} from '../../../pages/InstituteSettings/InstituteSettings.actions'
import Teacher from '../../../pages/user-profile/components/Teacher/Teacher'
import {INSTITUTE_MEMBER_TYPE} from './../../../constants/institute.constants'

export default function SliderAddTeacher({
  callback = () => {},
  nodeDetails = null,
  screenName = '',
  handleAssignClassTeacherCheckbox,
  assignClassTeacherCheckbox,
}) {
  const [showPopup, setShowPopup] = useState(false)
  const [validationObject, setValidationObject] = useState({})
  const [ifBulkUpload, setIfBulkUpload] = useState(false)
  const {eventManager, instituteInfo} = useSelector((state) => state)
  const institutePersonaSettings = useSelector(
    (store) => store.globalData?.institutePersonaSettings?.data
  )
  const [proccessedObject, setProccessedOject] = useState([])
  const [downloadSampleList, setDownloadSampleList] = useState(false)
  const dispatch = useDispatch()
  const {t} = useTranslation()

  const downloadTeacherSample = () => {
    createAndDownloadCSV(
      'Teacher-Sample',
      processDataSettingsKeyIdCSV(
        institutePersonaSettings,
        dynamicStaffSampleData
      )
    )
    dispatch(resetPersonaSettingsAction())
    setDownloadSampleList(false)
  }

  const uploadTeachersCSV = () => {
    const addTeacherData = CSVDataToQuery(
      institutePersonaSettings,
      proccessedObject,
      'TEACHER',
      false,
      false,
      instituteInfo.institute_type
    )
    if ('status' in addTeacherData && addTeacherData['status'] === false) {
      setValidationObject(addTeacherData)
      setShowPopup(true)
      dispatch(showLoadingAction(false))
      return
    }

    addTeacherData['check'] = true
    dispatch(
      addPersonaMembersAction({
        personaData: addTeacherData,
        persona: 'TEACHER',
      })
    )
    callback()
    dispatch(showLoadingAction(false))
    dispatch(resetPersonaSettingsAction())
    setIfBulkUpload(false)
  }

  useEffect(() => {
    if (downloadSampleList === true && institutePersonaSettings?.length > 0) {
      downloadTeacherSample()
    }
    if (ifBulkUpload === true && institutePersonaSettings?.length > 0) {
      uploadTeachersCSV()
    }
  }, [institutePersonaSettings])

  const getInstituteTeachers = () => {
    dispatch(teacherListLoadingAction(true))
    utilsGetUsersList({type: [INSTITUTE_MEMBER_TYPE.TEACHER]})
      .then(({status, obj}) => {
        if (status) dispatch(instituteTeacherListAction(obj))
      })
      .catch(() => dispatch(showErrorOccuredAction(true)))
      .finally(() => dispatch(teacherListLoadingAction(false)))
  }

  const dynamicCSVUpload = (check, processedCSVObject) => {
    setProccessedOject(processedCSVObject)
    dispatch(getInstitutePersonaSettingsAction('STAFF'))
    setIfBulkUpload(true)
  }

  const downloadSampleCSVFile = () => {
    eventManager.send_event(events.DOWNLOAD_TEACHER_SAMPLE_FORMAT_CLICKED, {
      screen_name: 'add_teachers_slider',
      section_id: nodeDetails?.id,
    })

    dispatch(getInstitutePersonaSettingsAction('STAFF'))
    setDownloadSampleList(true)
  }

  return (
    <div>
      {showPopup && validationObject ? (
        <AcknowledgementPopup
          onClose={setShowPopup}
          onAction={() => setShowPopup(false)}
          icon={
            validationObject.status
              ? 'https://storage.googleapis.com/tm-assets/icons/colorful/tick-bg-green.svg'
              : 'https://storage.googleapis.com/tm-assets/icons/colorful/remove-bg-red.svg'
          }
          title={validationObject.status ? t('success') : t('failure')}
          desc={validationObject.msg}
          primaryBtnText={t('confirm')}
        />
      ) : null}
      <Teacher
        isAddProfile={true}
        handleCSV={dynamicCSVUpload}
        downloadSampleCSVFile={downloadSampleCSVFile}
        nodeDetails={nodeDetails}
        assignClassTeacherCheckbox={assignClassTeacherCheckbox}
        handleAssignClassTeacherCheckbox={handleAssignClassTeacherCheckbox}
        closeSlider={(id) => {
          getInstituteTeachers()
          callback(id)
        }}
        screenName={screenName}
      />
    </div>
  )
}
