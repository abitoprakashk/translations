import React, {useState, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useTranslation} from 'react-i18next'
import {showLoadingAction, showToast} from '../../../redux/actions/commonAction'
import {events} from '../../../utils/EventsConstants'
import {createAndDownloadCSV} from '../../../utils/Helpers'
import {dynamicStudentSampleData} from '../../../utils/SampleCSVRows'
import AcknowledgementPopup from '../../Common/AcknowledgementPopup/AcknowledgementPopup'
import * as SHC from '../../../utils/SchoolSetupConstants'
import {
  getNodeDataWithChildrensParent,
  getNodesListOfSimilarType,
  isHierarchyAvailable,
} from '../../../utils/HierarchyHelpers'

import Student from '../../../pages/user-profile/components/Student/Student'
import {processDataSettingsKeyIdCSV} from './DynamicSettingsKeyIdCSV'
import {CSVDataToQuery} from './UploadCSVDynamic'
import {dummySubscriptionData} from '../../../utils/DummyStats'
import {utilsGetSubscriptionData} from '../../../routes/dashboard'
import {
  addPersonaMembersAction,
  getInstitutePersonaSettingsAction,
  resetPersonaSettingsAction,
} from '../../../pages/InstituteSettings/InstituteSettings.actions'
import {getActiveStudents} from '../../../redux/reducers/CommonSelectors'
import {INSTITUTE_TYPES} from '../../../constants/institute.constants'

export default function SliderAddStudent({
  showClassSectionField = false,
  callback = () => {},
  nodeDetails = null,
  screenName = '',
  ignoreClassAndSection = false,
  classId = null,
}) {
  const dispatch = useDispatch()
  const {t} = useTranslation()
  const {instituteInfo, eventManager, instituteHierarchy} = useSelector(
    (state) => state
  )
  const institutePersonaSettings = useSelector(
    (store) => store.globalData?.institutePersonaSettings?.data
  )

  const [showPopup, setShowPopup] = useState(false)
  const [validationObject, setValidationObject] = useState({})
  const [selectedClass, setSelectedClass] = useState(null)
  const [downloadSampleList, setDownloadSampleList] = useState(false)
  const [ifBulkUpload, setIfBulkUpload] = useState(false)
  const [proccessedObject, setProccessedOject] = useState([])

  const [subscriptionData, setSubscriptionData] = useState(
    dummySubscriptionData
  )
  const instituteStudentList = getActiveStudents(true)

  const canAdd =
    parseInt(instituteStudentList.length) <
    parseInt(subscriptionData.obj.lms_order_form_students)

  const canAddMore =
    parseInt(subscriptionData.obj.lms_order_form_students) -
    parseInt(instituteStudentList.length)

  useEffect(() => {
    getSubscriptionData()
  }, [])

  function getSubscriptionData() {
    if (subscriptionData?.obj?.subscription_type === 0) {
      utilsGetSubscriptionData(instituteInfo._id).then(({data}) => {
        if (data.obj.subscription_type === 1)
          data.obj.lms_order_form_students = 10
        setSubscriptionData(data)
      })
    }
  }

  const downloadStudentSample = () => {
    if (instituteInfo.institute_type === INSTITUTE_TYPES.TUITION) {
      dynamicStudentSampleData[0].standard = 'Department 1'
      dynamicStudentSampleData[0].section = 'Batch 1'
    }
    createAndDownloadCSV(
      'Student-Sample',
      processDataSettingsKeyIdCSV(
        institutePersonaSettings,
        dynamicStudentSampleData
      )
    )
    dispatch(resetPersonaSettingsAction())
    setDownloadSampleList(false)
  }

  const uploadStudentsCSV = () => {
    const addStudentData = CSVDataToQuery(
      institutePersonaSettings,
      proccessedObject,
      'STUDENT',
      false,
      ignoreClassAndSection,
      instituteInfo.institute_type
    )
    if ('status' in addStudentData && addStudentData['status'] === false) {
      setValidationObject(addStudentData)
      setShowPopup(true)
      dispatch(showLoadingAction(false))
      return
    }
    if (classId || nodeDetails) {
      addStudentData['nodeId'] = classId || nodeDetails.id
    }
    addStudentData['check'] = true
    dispatch(
      addPersonaMembersAction({
        personaData: addStudentData,
        persona: 'STUDENT',
      })
    )
    callback()
    dispatch(showLoadingAction(false))
    dispatch(resetPersonaSettingsAction())
    setIfBulkUpload(false)
  }

  useEffect(() => {
    if (downloadSampleList === true && institutePersonaSettings?.length > 0) {
      downloadStudentSample()
    }
    dispatch(showLoadingAction(true))
    if (ifBulkUpload === true && institutePersonaSettings?.length > 0) {
      uploadStudentsCSV()
    }
    dispatch(showLoadingAction(false))
  }, [institutePersonaSettings])

  // Get Classes List
  useEffect(() => {
    const classes = getNodesListOfSimilarType(
      instituteHierarchy,
      SHC.NODE_CLASS
    )
    const classesOptions = [
      {key: '', value: t('select')},
      ...classes?.map(({id, name}) => {
        return {key: id, value: name}
      }),
    ]

    if (classesOptions?.length > 0) {
      // setClassList(classesOptions)
      setSelectedClass(classesOptions[0].key)
    }
  }, [])

  // Get Section List on updating class
  useEffect(() => {
    if (selectedClass) {
      const sections = getNodeDataWithChildrensParent(
        instituteHierarchy,
        selectedClass
      )

      const sectionsOptions = [
        {key: '', value: t('select')},
        ...sections?.children
          ?.filter(({type}) => type === SHC.NODE_SECTION)
          .map(({id, name}) => {
            return {key: id, value: name}
          }),
      ]

      if (sectionsOptions?.length > 0) {
        // setSectionList(sectionsOptions)
        // setSelectedSection(sectionsOptions[0].key)
      }
    } else {
      // setSectionList([])
      // setSelectedSection('')
    }
  }, [selectedClass])

  const uploadDynamicCSV = (check, processedCSVObject) => {
    // setProccessedOject(processedCSVObject)
    // setIfBulkUpload(true)
    // dispatch(getInstitutePersonaSettingsAction('STUDENT'))
    if (
      processedCSVObject &&
      canAddMore >= processedCSVObject?.rows?.length - 1
    ) {
      setProccessedOject(processedCSVObject)
      setIfBulkUpload(true)
      dispatch(getInstitutePersonaSettingsAction('STUDENT'))
    } else {
      dispatch(
        showToast({
          type: 'error',
          message: `You can only add ${canAddMore} ${
            canAddMore === 1 ? 'student' : 'students'
          } to your institute`,
        })
      )
      dispatch(showLoadingAction(false))
    }
  }

  const downloadSampleCSVFile = () => {
    eventManager.send_event(events.DOWNLOAD_STUDENT_SAMPLE_FORMAT_CLICKED, {
      screen_name: screenName,
      section_id: nodeDetails?.id,
    })

    dispatch(getInstitutePersonaSettingsAction('STUDENT'))
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
          title={validationObject.status ? t('success') : t('failed')}
          desc={validationObject.msg}
          primaryBtnText={t('ok')}
        />
      ) : null}
      <>
        <Student
          instituteType={instituteInfo?.institute_type}
          isAddProfile={true}
          handleCSV={uploadDynamicCSV}
          downloadSampleCSVFile={downloadSampleCSVFile}
          screenName={screenName}
          assignedToClass={
            showClassSectionField && isHierarchyAvailable(instituteHierarchy)
              ? false
              : {
                  standard: nodeDetails?.parent?.name,
                  section: nodeDetails?.name,
                  sectionId: nodeDetails?.id,
                }
          }
          nodeId={nodeDetails?.id}
          closeSlider={(id) => {
            callback(id)
          }}
          canAdd={canAdd}
          subscriptionData={subscriptionData}
        />
      </>
    </div>
  )
}
