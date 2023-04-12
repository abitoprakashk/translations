import React, {useState} from 'react'
import {Trans, useTranslation} from 'react-i18next'
import SliderScreen from '../../Common/SliderScreen/SliderScreen'
import SliderScreenHeader from '../../Common/SliderScreenHeader/SliderScreenHeader'
import SliderAddStudent from './SliderAddStudent'
import ImportStudents from './ImportStudents/ImportStudents'
// import {ADD_STUDENT, UNASSIGNED_STUDENT, IMPORT_STUDENT} from './constant'
import {useSelector} from 'react-redux'
import CheckBoxListWithSearch from './ImportStudents/CheckBoxListWithSearch'
import {instituteStudentListAction} from '../../../redux/actions/instituteInfoActions'
import {useDispatch} from 'react-redux'
import {utilsGetUsersList, utilsAssignToClass} from '../../../routes/dashboard'
import {
  showErrorOccuredAction,
  showToast,
} from '../../../redux/actions/commonAction'
import {getActiveStudents} from '../../../redux/reducers/CommonSelectors'
import {INSTITUTE_MEMBER_TYPE} from '../../../constants/institute.constants'

export const checkPropKey = (extraField, item) => {
  if (typeof extraField === 'string') return item[extraField]
  else if (typeof extraField === 'function') return item[extraField(item)]
  else return extraField
}

export const getPropKey = (item) => {
  if (item?.enrollment_number != null) return 'enrollment_number'
  else if (item?.phone_number != null) return 'phone_number'
  else return 'email'
}

export default function SliderStudent({
  setSliderScreen,
  sectionDetails,
  getSectionDetails,
  defaultActiveTab = 'ADD_STUDENT',
}) {
  const [activeTab, setActiveTab] = useState(defaultActiveTab)
  const {
    instituteAcademicSessionInfo,
    instituteActiveAcademicSessionId,
    instituteInfo,
  } = useSelector((state) => state)
  const instituteStudentList = getActiveStudents(true)
  const dispatch = useDispatch()
  const {t} = useTranslation()

  const unAssignedStudents =
    instituteStudentList &&
    instituteStudentList.filter((item) => !item.classroom)

  const tabOptions = [{id: 'ADD_STUDENT', label: t('addStudent')}]
  if (instituteAcademicSessionInfo?.length > 1)
    tabOptions.push({id: 'IMPORT_STUDENT', label: t('importStudent')})
  if (unAssignedStudents?.length)
    tabOptions.push({id: 'UNASSIGNED_STUDENT', label: t('unassignedStudent')})

  const closeSliderAndReloadSectionData = (noRefresh) => {
    getSectionDetails(sectionDetails?.id)
    if (!noRefresh) getInstituteStudents()
    setSliderScreen(false)
  }

  const getInstituteStudents = () => {
    utilsGetUsersList({type: [INSTITUTE_MEMBER_TYPE.STUDENT]})
      .then(({status, obj}) => {
        if (status) dispatch(instituteStudentListAction(obj))
      })
      .catch(() => dispatch(showErrorOccuredAction(true)))
  }

  const assignStudents = async (data) => {
    const student_iids = []
    data.forEach((item) => {
      if (item.checked) student_iids.push(item._id)
    })
    const res = await utilsAssignToClass({
      student_iids,
      section_id: sectionDetails?.id,
    })
    if (res.status)
      dispatch(
        showToast({
          type: 'success',
          message: t('studentAssignedSuccessfully'),
        })
      )
    else
      dispatch(
        showToast({
          type: 'error',
          message: t('failedToAssignStudents'),
        })
      )
    closeSliderAndReloadSectionData()
  }

  const renderComponent = () => {
    switch (activeTab) {
      case 'ADD_STUDENT':
        return (
          <div className="h-5/6 lg:h-full overflow-y-auto">
            <SliderAddStudent
              callback={() => closeSliderAndReloadSectionData(true)}
              nodeDetails={sectionDetails}
              getSectionDetails={getSectionDetails}
              screenName="section"
            />
          </div>
        )
      case 'IMPORT_STUDENT':
        return (
          <div className="px-5 lg:px-10 h-full overflow-y-auto">
            <div className="mt-8 mb-4 h-3/5">
              <ImportStudents
                setSliderScreen={closeSliderAndReloadSectionData}
                sessionInfo={instituteAcademicSessionInfo.filter(
                  (item) => item._id != instituteActiveAcademicSessionId
                )}
                onSubmit={assignStudents}
              />
            </div>
          </div>
        )
      case 'UNASSIGNED_STUDENT':
        return (
          <div className="px-5 lg:px-10 h-full overflow-y-auto">
            <div className="mt-8 mb-4 h-3/5">
              <CheckBoxListWithSearch
                setSliderScreen={closeSliderAndReloadSectionData}
                sectionId={sectionDetails.id}
                list={unAssignedStudents.map((item) => {
                  return {
                    ...item,
                    title: item.name,
                    checked: false,
                    num: item._id,
                  }
                })}
                extraField={getPropKey}
                primaryButtonText={`Assign students to ${sectionDetails?.parent?.name} - ${sectionDetails?.name}`}
                isAllSelected={false}
                instituteId={instituteInfo?._id}
                onSubmit={assignStudents}
              />
            </div>
          </div>
        )
      case 'DUPLICATE_STUDENT':
        return (
          <div className="mt-8 mb-4 h-3/5">
            <CheckBoxListWithSearch
              setSliderScreen={closeSliderAndReloadSectionData}
              sectionId={sectionDetails.id}
              list={unAssignedStudents.map((item) => {
                return {
                  ...item,
                  title: item.name,
                  checked: false,
                  num: item._id,
                }
              })}
              extraField="phone_number"
              primaryButtonText={
                <Trans i18nKey="AssignStudentCheckBoxListWithSearchBtnText">
                  Assign students to {sectionDetails?.parent?.name} -{' '}
                  {sectionDetails?.name}
                </Trans>
              }
              isAllSelected={false}
              instituteId={instituteInfo?._id}
              onSubmit={assignStudents}
            />
          </div>
        )
    }
  }

  return (
    <SliderScreen
      setOpen={() => setSliderScreen(null)}
      width={activeTab === 'ADD_STUDENT' ? '900' : '600'}
    >
      <>
        <SliderScreenHeader
          icon="https://storage.googleapis.com/tm-assets/icons/primary/students-primary.svg"
          title={
            <Trans i18nKey="addStudentsSliderScreenHeader">
              Add students to {sectionDetails?.parent?.name} -
              {sectionDetails?.name}
            </Trans>
          }
          options={tabOptions.length > 1 ? tabOptions : null}
          optionsSelected={activeTab}
          handleChange={(value) => setActiveTab(value)}
        />
        {renderComponent()}
      </>
    </SliderScreen>
  )
}
