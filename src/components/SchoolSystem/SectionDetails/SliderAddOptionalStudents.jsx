import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {Trans, useTranslation} from 'react-i18next'
import {
  showErrorOccuredAction,
  showLoadingAction,
  showToast,
} from '../../../redux/actions/commonAction'
import {utilsAddRemoveStudentsOptionalSubject} from '../../../routes/instituteSystem'
import SliderScreen from '../../Common/SliderScreen/SliderScreen'
import SliderScreenHeader from '../../Common/SliderScreenHeader/SliderScreenHeader'
import {events} from '../../../utils/EventsConstants'
import CheckBoxListWithSearch from './ImportStudents/CheckBoxListWithSearch'
export default function SliderAddOptionalStudents({
  setSliderScreen,
  sectionDetails,
  getSectionDetails,
  selectedSubject,
  setSelectedSubject,
}) {
  const [studentsList, setStudentsList] = useState([])
  const dispatch = useDispatch()
  const {t} = useTranslation()
  const {eventManager} = useSelector((state) => state)

  useEffect(() => {
    let studentsList = []

    if (sectionDetails?.section_students?.length > 0)
      studentsList = [...sectionDetails?.section_students]

    setStudentsList(studentsList)
    // setFilteredStudents(studentsList)
  }, [sectionDetails, selectedSubject])

  const close = () => {
    setSliderScreen(null)
    setSelectedSubject(null)
  }

  const handleSubmit = async (list) => {
    const {students} = selectedSubject
    const studentsToAdd = [],
      studentsToRemove = []

    dispatch(showLoadingAction(true))
    list.forEach((item) => {
      // if (item.checked) studentsToAdd.push(item._id)
      let doesExist = false
      students.forEach((elem) => {
        if (item._id === elem) doesExist = true
        if (item._id === elem && !item.checked) studentsToRemove.push(item._id)
      })
      if (item.checked && !doesExist) studentsToAdd.push(item._id)
    })
    eventManager.send_event(events.ASSIGN_STUDENT_CLICKED_TFI, {
      section_id: sectionDetails?.id,
      class_id: selectedSubject?.id,
    })
    try {
      const res = await utilsAddRemoveStudentsOptionalSubject(
        selectedSubject?.id,
        studentsToRemove,
        studentsToAdd
      )
      if (res.status) {
        getSectionDetails(sectionDetails?.id)
        dispatch(
          showToast({
            type: 'success',
            message: t('studentsAssignedSuccessfully'),
          })
        )
      } else
        dispatch(
          showToast({
            type: 'error',
            message: t('failedToAssignStudents'),
          })
        )
    } catch (err) {
      dispatch(showErrorOccuredAction(true))
    } finally {
      dispatch(showLoadingAction(false))
      setSliderScreen(null)
    }
  }

  return (
    <SliderScreen setOpen={() => close()}>
      <>
        <SliderScreenHeader
          icon="https://storage.googleapis.com/tm-assets/icons/primary/students-primary.svg"
          title={
            <Trans i18nKey="sliderAddOptionalStudentsTitle">
              {sectionDetails?.parent?.name} - {sectionDetails?.name}{' '}
              {selectedSubject?.name} Students
            </Trans>
          }
        />

        <div className="p-5 lg:p-10 h-4/5">
          <CheckBoxListWithSearch
            list={studentsList.map((item) => {
              const checked =
                selectedSubject &&
                selectedSubject?.students.some((i) => i === item._id)
              return {
                ...item,
                title: item.name,
                checked: checked,
                num: item._id,
              }
            })}
            extraField="phone_number"
            primaryButtonText={t('updateStudents')}
            isAllSelected={false}
            onSubmit={handleSubmit}
            submitDisableAllowed={false}
          />
        </div>
      </>
    </SliderScreen>
  )
}
