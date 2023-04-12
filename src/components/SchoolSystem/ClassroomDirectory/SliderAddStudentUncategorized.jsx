import React from 'react'
import SliderScreen from '../../Common/SliderScreen/SliderScreen'
import SliderScreenHeader from '../../Common/SliderScreenHeader/SliderScreenHeader'
import SliderAddStudent from '../SectionDetails/SliderAddStudent'
import {useState, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import CheckBoxListWithSearch from '../SectionDetails/ImportStudents/CheckBoxListWithSearch'
import {
  showErrorOccuredAction,
  showLoadingAction,
  showToast,
} from '../../../redux/actions/commonAction'
import {utilsGetUncategorizedClassUsers} from '../../../routes/dashboard'
import {utilsAddRemoveStudentsOptionalSubject} from '../../../routes/instituteSystem'
import {getActiveStudents} from '../../../redux/reducers/CommonSelectors'
import {getStudentListAction} from '../../../pages/user-profile/redux/actions/studentActions'

export default function SliderAddStudentUncategorized({
  setSliderScreen,
  classroomDetails,
  getInstituteClasses,
}) {
  classroomDetails.id = classroomDetails?._id
  const dispatch = useDispatch()
  const [classStudentList, setClassStudentList] = useState([])
  const {instituteInfo} = useSelector((state) => state)
  const instituteStudentList = getActiveStudents(true)
  const ADD_STUDENT = 'Add Student'
  const DIRECTORY_STUDENT = 'Student Directory'
  const [activeTab, setActiveTab] = useState('ADD_STUDENT')
  const tabOptions = [{id: 'ADD_STUDENT', label: ADD_STUDENT}]
  if (instituteStudentList?.length > 0)
    tabOptions.push({id: 'DIRECTORY_STUDENT', label: DIRECTORY_STUDENT})

  useEffect(() => {
    getStudentsList()
  }, [instituteInfo])

  const existingStudents = classStudentList?.map((b) => b._id)
  const getStudentsList = () => {
    dispatch(showLoadingAction(true))
    utilsGetUncategorizedClassUsers(classroomDetails._id, instituteInfo._id)
      .then(({data}) => {
        setClassStudentList(data)
      })
      .catch(() => dispatch(showErrorOccuredAction(true)))
      .finally(() => dispatch(showLoadingAction(false)))
  }

  const assignStudents = async (data) => {
    const studentsToAdd = []
    const studentsToRemove = []
    data.forEach((item) => {
      //if (item.checked) add_student_iids.push(item._id)
      let doesExist = false
      existingStudents.forEach((elem) => {
        if (item._id === elem) doesExist = true
        if (item._id === elem && !item.checked) studentsToRemove.push(item._id)
      })
      if (item.checked && !doesExist) studentsToAdd.push(item._id)
    })
    const res = await utilsAddRemoveStudentsOptionalSubject(
      classroomDetails._id,
      studentsToRemove,
      studentsToAdd
    )
    if (res.status) {
      getStudentsList()
      getInstituteClasses()
      dispatch(getStudentListAction())
      dispatch(
        showToast({
          type: 'success',
          message: `Student Assigned Successfully.`,
        })
      )
      setSliderScreen(false)
    } else
      dispatch(
        showToast({
          type: 'error',
          message: `Failed to Assign Students.`,
        })
      )
    //closeSliderAndReloadSectionData()
  }

  const renderComponent = () => {
    switch (activeTab) {
      case 'ADD_STUDENT':
        return (
          <SliderAddStudent
            callback={() => {
              setSliderScreen(null)
              getInstituteClasses()
            }}
            nodeDetails={classroomDetails}
            screenName="uncategorized"
            classId={classroomDetails?._id}
          />
        )

      case 'DIRECTORY_STUDENT':
        return (
          <div className="p-5 lg:p-10 h-4/5 overflow-y-auto">
            <div className="mt-8 mb-4 h-3/5">
              <CheckBoxListWithSearch
                setSliderScreen={() => setSliderScreen(null)}
                sectionId={classroomDetails.id}
                list={instituteStudentList?.map((item) => {
                  return {
                    ...item,
                    title: item.name,
                    checked: existingStudents?.includes(item._id),
                    num: item._id,
                  }
                })}
                extraField="phone_number"
                primaryButtonText={`Assign students to ${classroomDetails?.name}`}
                isAllSelected={false}
                instituteId={instituteInfo?._id}
                onSubmit={assignStudents}
              />
            </div>
          </div>
        )
    }
  }

  return (
    <SliderScreen setOpen={() => setSliderScreen(null)} width="900">
      <>
        <SliderScreenHeader
          icon="https://storage.googleapis.com/tm-assets/icons/primary/students-primary.svg"
          title={`Add students to ${classroomDetails?.name}`}
          options={tabOptions.length > 1 ? tabOptions : null}
          optionsSelected={activeTab}
          handleChange={(value) => setActiveTab(value)}
        />

        {renderComponent()}
      </>
    </SliderScreen>
  )
}
