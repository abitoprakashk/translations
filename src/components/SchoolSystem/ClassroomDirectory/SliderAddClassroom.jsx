import React, {useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {StickyFooter} from '@teachmint/common'
import {validateInputs} from '../../../utils/Validations'
import InputField from '../../Common/InputField/InputField'
import {utilsAddClassroomsByData} from '../../../routes/dashboard'
import {useDispatch, useSelector} from 'react-redux'
import {
  showErrorOccuredAction,
  showLoadingAction,
  showToast,
} from '../../../redux/actions/commonAction'
import {instituteAllClassesAction} from '../../../redux/actions/instituteInfoActions'
import TimePicker from '../../Common/TimePicker/TimePicker'
import {subjectOptions} from '../../../utils/SampleCSVRows'
import moment from 'moment'
import {days, getClassroomTimingsStructure} from '../../../utils/Helpers'
import {events} from '../../../utils/EventsConstants'
// import styles from './SliderAddClassroom.module.css'
import ErrorBoundary from '../../ErrorBoundary/ErrorBoundary'
import {
  utilsAssignSubjectTeacher,
  utilsGetUncatergorizedClasses,
} from '../../../routes/instituteSystem'
import {getActiveTeachers} from '../../../redux/reducers/CommonSelectors'

export default function SliderAddClassroom({setSliderScreen}) {
  const [classroomName, setClassroomName] = useState('')
  const {t} = useTranslation()
  const [subject, setSubject] = useState('')
  const [teacher, setTeacher] = useState(t('select'))
  const [timetableObj, setTimetableObj] = useState([])
  const [lastSelectedTime, setLastSelectedTime] = useState({
    from: '9:00 AM',
    to: '10:00 AM',
  })
  // const [studentCSVFile, setStudentCSVFile] = useState(null)
  const [errorObject, setErrorObject] = useState({})

  const {instituteInfo, eventManager} = useSelector((state) => state)
  const instituteTeacherList = getActiveTeachers(true)
  const dispatch = useDispatch()
  const setToastData = (type, message) => dispatch(showToast({type, message}))

  useEffect(() => {
    setTimetableObj(
      days.map((day) => {
        return {day: day, from: null, to: null, status: false}
      })
    )
  }, [])

  const getTeacherDropdownList = () => {
    if (instituteTeacherList && instituteTeacherList.length > 0) {
      return [
        {key: 'Select', value: t('select')},
        ...instituteTeacherList
          .filter(({verification_status}) => verification_status !== 3)
          .map(({_id, phone_number, name, email}) => {
            return {
              key: _id,
              value: `${name} (${phone_number ? phone_number : email})`,
            }
          }),
      ]
    }
    return []
  }

  const teacherInputItems = {
    classroomName: {
      fieldType: 'text',
      title: t('classroomName'),
      value: classroomName,
      placeholder: t('classroomNamePlaceholder'),
      fieldName: 'classroomName',
    },
    subject: {
      fieldType: 'searchDropdown',
      title: t('subject'),
      value: subject,
      placeholder: t('subjectPlaceholder'),
      fieldName: 'subject',
      dropdownItems: subjectOptions,
    },
    teacher: {
      fieldType: 'dropdown',
      dropdownItems: getTeacherDropdownList(),
      title: t('teacherAll'),
      value: teacher,
      placeholder: t('teacherPlaceholder'),
      fieldName: 'teacher',
    },
  }

  const getInstituteClasses = (instituteId) => {
    utilsGetUncatergorizedClasses(instituteId)
      .then(({status, obj}) => {
        if (status) dispatch(instituteAllClassesAction(obj))
      })
      .catch((_err) => dispatch(showErrorOccuredAction(true)))
      .finally(() => dispatch(showLoadingAction(false)))
  }

  const handleInputChange = (fieldName, value) => {
    switch (fieldName) {
      case 'classroomName': {
        if (validateInputs(fieldName, value, false)) setClassroomName(value)
        break
      }
      case 'subject': {
        if (validateInputs('subject', value, false)) setSubject(value)
        break
      }
      case 'teacher': {
        setTeacher(value)
        break
      }
      default:
        break
    }
  }

  const handleSetError = (fieldName, error) => {
    let obj = {}
    obj[fieldName] = error
    setErrorObject((errorObject) => ({...errorObject, ...obj}))
  }

  const handleFormSubmit = async () => {
    setErrorObject({})
    let flag = true

    // Validate Classroom Name
    if (
      String(classroomName).length <= 0 ||
      !validateInputs('classroomName', classroomName, true)
    ) {
      handleSetError('classroomName', t('required'))
      flag = false
    }

    // Validate Subject
    if (
      String(subject).length <= 0 ||
      !validateInputs('subject', subject, true)
    ) {
      handleSetError('subject', t('required'))
      flag = false
    }

    // Validate Teacher
    if (teacher === 'Select') {
      handleSetError('teacher', t('required'))
      flag = false
    }

    if (flag && instituteInfo?._id) {
      // Get timetable structure
      const timetable = getClassroomTimingsStructure(timetableObj)

      dispatch(showLoadingAction(true))
      // Send Data to server
      let response = await utilsAddClassroomsByData(
        classroomName,
        subject,
        timetable
      )
        .catch(() => dispatch(showErrorOccuredAction(true)))
        .finally(() => dispatch(showLoadingAction(false)))

      // If class added
      if (response?.status) {
        eventManager.send_event(events.CLASSROOM_ADDED, {
          stu_bulk_upload: false,
        })
        getInstituteClasses(instituteInfo._id)
        setSliderScreen && setSliderScreen(null)
        setToastData('success', t('classroomSuccessfullyCreated'))

        utilsAssignSubjectTeacher(response?.obj, teacher)
          .catch(() =>
            setToastData('error', t('unableToAddTeacherToTheClassroom'))
          )
          .finally(() => dispatch(showLoadingAction(false)))
      } else setToastData('error', t('unableToCreateClassroom'))
    }
  }

  const handleTimetableStatusChange = (status, index) => {
    let obj = [...timetableObj]
    obj[index].status = status

    if (status) {
      obj[index].from = lastSelectedTime.from
      obj[index].to = lastSelectedTime.to
    }
    setTimetableObj(obj)
  }

  const handleTimetableChange = (value, index, base) => {
    let obj = [...timetableObj]
    let last = {...lastSelectedTime}

    obj[index][base] = value
    last[base] = value

    if (base === 'from') {
      let time = moment(value, 'h:m A')
      time = time.add(1, 'hours')
      time = `${time.format('hh')}:${time.format('mm')} ${time.format('A')}`
      obj[index]['to'] = time
      last['to'] = time
    }

    setLastSelectedTime(last)
    setTimetableObj(obj)
  }

  return (
    <div>
      <ErrorBoundary>
        <div className="flex flex-wrap">
          <ErrorBoundary>
            {Object.values(teacherInputItems).map(
              ({
                fieldType,
                title,
                value,
                placeholder,
                fieldName,
                dropdownItems,
                countryCodeItem,
              }) => (
                <div className="w-full mb-2" key={fieldName}>
                  <InputField
                    fieldType={fieldType}
                    title={title}
                    placeholder={placeholder}
                    value={value}
                    handleChange={handleInputChange}
                    fieldName={fieldName}
                    dropdownItems={dropdownItems}
                    countryCodeItem={countryCodeItem}
                    errorText={errorObject[fieldName]}
                  />
                </div>
              )
            )}
          </ErrorBoundary>
        </div>

        <hr />
        <div className="tm-h5 pb-5 pt-5">{t('createTimetable')}</div>
        <ErrorBoundary>
          <table className="w-full">
            <tbody>
              {timetableObj.map(({day, status, from, to}, index) => {
                return (
                  <tr key={day} className="h-20 lg:h-12 py-2">
                    <td className="align-middle-imp">
                      <input
                        type="checkbox"
                        checked={status}
                        onChange={(e) =>
                          handleTimetableStatusChange(e.target.checked, index)
                        }
                      />
                    </td>
                    <td className="pl-2 pr-2 lg:pl-4 lg:pr-8 align-middle-imp">
                      <div className="flex flex-col lg:flex-row">
                        <span
                          className={`w-32 flex items-center tm-h6 mb-1 lg:m-0`}
                        >
                          {day}
                        </span>
                        {status ? (
                          <div className="flex items-center">
                            <span>
                              <TimePicker
                                time={from}
                                setTime={handleTimetableChange}
                                index={index}
                                base="from"
                                placeholder={t('startTime')}
                              />
                            </span>
                            <span className="tm-h6 px-2 lg:px-4">-</span>
                            <span>
                              <TimePicker
                                time={to}
                                setTime={handleTimetableChange}
                                index={index}
                                base="to"
                                placeholder={t('endTime')}
                              />
                            </span>
                          </div>
                        ) : (
                          <span className="tm-para2">
                            {t('selectDayAndTimeSlot')}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </ErrorBoundary>

        <StickyFooter forSlider>
          <div className="tm-btn2-blue mt-2" onClick={handleFormSubmit}>
            {t('addClassroom')}
          </div>
        </StickyFooter>
      </ErrorBoundary>
    </div>
  )
}
