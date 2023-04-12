import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {showToast} from '../../../../../redux/actions/commonAction'
import {utilsUpdateExamSubjectDetails} from '../../../../../routes/examPlanner'
import {getNodeDataWithChildrensParent} from '../../../../../utils/HierarchyHelpers'
import InputField from '../../../../../components/Common/InputField/InputField'
import SliderScreen from '../../../../../components/Common/SliderScreen/SliderScreen'
import SliderScreenHeader from '../../../../../components/Common/SliderScreenHeader/SliderScreenHeader'
import TimePickerWrapper from '../../../../../components/Common/TimePicker/TimePicker'
import ToggleSwitch from '../../../../../components/Common/ToggleSwitch/ToggleSwitch'
import {DateTime} from 'luxon'
import {
  EXAM_TYPES,
  TIME_FORMAT,
} from '../../../../../utils/ExamPlannerConstants'
import holidayImage from '../../../../../assets/images/dashboard/holiday.png'
import Label from '../../../../../components/Common/Label/Label'
import {ErrorBoundary} from '@teachmint/common'
import Loader from '../../../../../components/Common/Loader/Loader'
import {events} from '../../../../../utils/EventsConstants'
import {t} from 'i18next'
import Permission from '../../../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../../utils/permission.constants'

const subjectExamItem = {
  subjectName: t('select'),
  startTime: '09:00 AM',
  endTime: '10:00 AM',
  status: EXAM_TYPES.DRAFT,
  timeslot: '',
  isUpdated: true,
}

export default function SliderCreateSingleTest({
  selectedClass,
  setSliderScreen,
  globalTimeslot,
  getExamSubjectDetails,
  selectedExam,
}) {
  const [subjectGlobalList, setSubjectGlobalList] = useState([])
  const [subjectInputData, setSubjectInputData] = useState([])
  const [errObj, setErrObj] = useState([])
  const [isHoliday, setIsHoliday] = useState(false)
  const [createExamSubjectDetailsLoading, setCreateExamSubjectDetailsLoading] =
    useState(false)

  const {instituteHierarchy, eventManager} = useSelector((state) => state)
  const dispatch = useDispatch()

  const close = () => setSliderScreen(null)
  const setToastData = (type, message) => dispatch(showToast({type, message}))
  const [isSubjectDelete, setIsSubjectDelete] = useState(false)
  const [deletedSubjects, setDeletedSubjects] = useState([])

  useEffect(() => {
    if (selectedClass?.class?._id && instituteHierarchy) {
      // Get selected class info from hierarchy
      const classInfo = getNodeDataWithChildrensParent(
        instituteHierarchy,
        selectedClass?.class?._id
      )

      // Get all subjects for selected class
      const subjects = []
      classInfo?.children?.forEach(({children}) => {
        children?.forEach(({id, name}) => {
          if (subjects[name]) subjects[name].push({subjectId: id, name})
          else subjects[name] = [{subjectId: id, name}]
        })
      })

      // Create Input Data from previously created assessments
      const subjectInputDataTemp = []
      selectedClass?.class?.subjects?.forEach(
        ({
          _id,
          assessment_id,
          subject_id,
          subject_name,
          start_time,
          end_time,
          status,
          timeslotIndex,
        }) => {
          // If Status Holiday
          if (status === EXAM_TYPES.HOLIDAY) {
            setIsHoliday(true)
          } else {
            // Find the subject from global list and add ObjectId of assessment
            const objIndex = subjects[subject_name]?.findIndex(
              ({subjectId}) => subjectId === subject_id
            )
            if (objIndex !== undefined && objIndex !== -1) {
              subjects[subject_name][objIndex] = {
                ...subjects[subject_name][objIndex],
                subjectAssessmentId: _id,
                assessmentId: assessment_id,
                start_time,
                end_time,
              }
            }

            // Add previously created assesments to input Data if not present for taht classroom
            const selectedAssessment = subjectInputDataTemp?.find(
              (x) => x.subjectName == subject_name
            )

            if (!selectedAssessment) {
              subjectInputDataTemp.push({
                subjectName: subject_name,
                startTime: DateTime.fromSeconds(Number(start_time))?.toFormat(
                  TIME_FORMAT
                ),
                endTime: DateTime.fromSeconds(Number(end_time))?.toFormat(
                  TIME_FORMAT
                ),
                status,
                timeslot: timeslotIndex,
              })
            }
          }
        }
      )

      if (subjectInputDataTemp.length < 1)
        subjectInputDataTemp.push({
          ...subjectExamItem,
          timeslot: globalTimeslot?.length > 0 ? 0 : 'customTimeslot',
        })

      setSubjectGlobalList(subjects)
      setSubjectInputData(subjectInputDataTemp)
    }
  }, [selectedClass])

  const getSubjectNames = () => {
    let subjectNames = []

    if (subjectInputData.length) {
      subjectNames = subjectInputData.map((subject) => {
        return subject.subjectName
      })
    }
    return subjectNames
  }

  const getRemainingSubjectList = (curSubjectName = '') => {
    const subjectGlobalListTemp = Object.keys(subjectGlobalList)
    const selectedSubjectList = subjectInputData
      ?.filter(({status}) => status !== EXAM_TYPES.DELETED)
      ?.map(({subjectName}) => subjectName)

    const subjectList = subjectGlobalListTemp.filter(
      (item) => !selectedSubjectList.includes(item) || item === curSubjectName
    )

    return ['Select', ...subjectList].map((item) => {
      return {key: item, value: item}
    })
  }

  const handleChange = (fieldName, value, index = 0) => {
    const subjectInputDataTemp = JSON.parse(JSON.stringify(subjectInputData))

    subjectInputDataTemp[index].isUpdated = true
    subjectInputDataTemp[index][fieldName] = value

    // Remove subject object if subject in not selected and subject deleted
    if (fieldName === 'status' && value === EXAM_TYPES.DELETED) {
      setIsSubjectDelete(true)
      setDeletedSubjects([
        ...deletedSubjects,
        subjectInputDataTemp[index].subjectName,
      ])
      eventManager.send_event(events.DELETE_SUBJECT_EXAM_CLICKED_TFI, {
        subject_name: subjectInputDataTemp[index].subjectName,
      })
      subjectInputDataTemp.splice(index, 1)
    }

    setSubjectInputData(subjectInputDataTemp)
  }

  const handleAddMoreSubjects = () => {
    if (getRemainingSubjectList()?.length > 1) {
      setSubjectInputData([
        ...JSON.parse(JSON.stringify(subjectInputData)),
        {
          ...subjectExamItem,
          timeslot: globalTimeslot?.length > 0 ? 0 : 'customTimeslot',
        },
      ])

      eventManager.send_event(events.ADD_SUBJECT_EXAM_SCHEDULE_TFI, {
        exam_name: selectedExam.exam_name,
        screen_name: 'side_drawer',
      })
    }
  }

  const handleHoliday = () => {
    let holidayObjExist = false

    // Send delete status of all objects except holiday
    const finalObj = (selectedClass?.class?.subjects || [])?.map((item) => {
      if (item?.status === EXAM_TYPES.HOLIDAY) {
        holidayObjExist = true
        return item
      } else return {...item, status: EXAM_TYPES.DELETED}
    })

    // Find a holiday Object Exist
    if (!holidayObjExist)
      finalObj.push({
        standard_id: selectedClass?.class?._id,
        status: EXAM_TYPES.HOLIDAY,
        date: selectedClass?.date?.toSeconds(),
      })

    addExamSubjectDetails(finalObj)
  }

  const onSubmit = () => {
    if (isHoliday) {
      handleHoliday()
      return
    }

    let flag = true
    const errObjTemp = []

    // Check validations
    subjectInputData.forEach(
      ({subjectName, startTime, endTime, timeslot}, index) => {
        if (!subjectName || subjectName === t('select')) {
          flag = false
          errObjTemp[index] = {...errObjTemp[index], subjectName: t('required')}
        }

        if (timeslot === 'customTimeslot') {
          const st = DateTime.fromFormat(startTime, 'h:mm a').toSeconds()
          const et = DateTime.fromFormat(endTime, 'h:mm a').toSeconds()

          if (!startTime || !endTime || st >= et) {
            flag = false
            errObjTemp[index] = {
              ...errObjTemp[index],
              timeslot: t('enterValidTime'),
            }
          }
        }
        setErrObj(errObjTemp)
      }
    )

    if (flag) {
      let subjectDetails = []

      Object.values(subjectGlobalList)?.map((items) => {
        const subjectNameSelected = items?.[0]?.name
        if (subjectNameSelected) {
          // Find the subject input object
          const inputData = subjectInputData?.find(
            ({subjectName}) => subjectNameSelected === subjectName
          )
          // Add objects only if something in updated
          if (inputData?.isUpdated) {
            items?.map(({subjectAssessmentId, assessmentId, subjectId}) => {
              let startTimeTemp = inputData?.startTime
              let endTimeTemp = inputData?.endTime

              if (inputData?.timeslot !== 'customTimeslot') {
                startTimeTemp =
                  globalTimeslot[inputData?.timeslot].startTimeString
                endTimeTemp = globalTimeslot[inputData?.timeslot].endTimeString
              }

              // Convert start and end time to timestamp
              const st = DateTime.fromFormat(startTimeTemp, 'h:mm a')
              const et = DateTime.fromFormat(endTimeTemp, 'h:mm a')

              startTimeTemp = selectedClass?.date?.plus({
                hours: st.hour,
                minutes: st.minute,
              })

              endTimeTemp = selectedClass?.date?.plus({
                hours: et.hour,
                minutes: et.minute,
              })

              subjectDetails.push({
                standard_id: selectedClass?.class?._id,
                subject_id: subjectId,
                status: inputData?.status,
                start_time: startTimeTemp.toSeconds(),
                end_time: endTimeTemp.toSeconds(),
                date: selectedClass?.date.toSeconds(),
                _id: subjectAssessmentId,
                assessment_id: assessmentId,
                duration: endTimeTemp.diff(startTimeTemp, 'minutes').toObject()
                  .minutes,
              })
            })
          }

          // Case when subject is deleted:- send all section-subject objects with status 4(DELETED)
          if (!inputData) {
            items?.map(
              ({
                subjectAssessmentId,
                assessmentId,
                subjectId,
                classId,
                start_time,
                end_time,
              }) => {
                if (subjectAssessmentId) {
                  subjectDetails.push({
                    standard_id: selectedClass?.class?._id,
                    classroom_id: classId,
                    subject_id: subjectId,
                    status: EXAM_TYPES.DELETED,
                    _id: subjectAssessmentId,
                    assessment_id: assessmentId,
                    start_time,
                    end_time,
                    date: selectedClass?.date.toSeconds(),
                  })
                }
              }
            )
          }
        }
      })
      // Update the status of holiday to deleted
      const holidayObj = (selectedClass?.class?.subjects || [])?.find(
        ({status}) => status === EXAM_TYPES.HOLIDAY
      )
      if (holidayObj)
        subjectDetails.push({
          _id: holidayObj?._id,
          standard_id: holidayObj?.standard_id,
          date: holidayObj?.date,
          status: EXAM_TYPES.DELETED,
        })

      addExamSubjectDetails(subjectDetails)
    }
  }

  const addExamSubjectDetails = (subjectDetails) => {
    setCreateExamSubjectDetailsLoading(true)
    utilsUpdateExamSubjectDetails(selectedClass?.examId, subjectDetails)
      .then(() => {
        getExamSubjectDetails()
        setToastData('success', t('assessmentSuccessfullyCreated'))
        // dispatch(subjectListClearAction())
        close()
        if (isHoliday) {
          eventManager.send_event(events.HOLIDAY_MARKED_TFI, {
            class_name: selectedClass.class.name,
          })
        } else {
          eventManager.send_event(events.SAVE_SUBJECT_EXAM_SCHEDULE_TFI, {
            class_name: selectedClass.class.name,
            subject_name: getSubjectNames(),
            screen_name: 'side_drawer',
          })
        }
        if (isSubjectDelete) {
          eventManager.send_event(events.SUBJECT_EXAM_DELETED_TFI, {
            subject_name: deletedSubjects,
          })
          setDeletedSubjects([])
        }

        setIsSubjectDelete(false)
      })
      .catch((res) =>
        setToastData('error', res.error || t('unableToCreateAssessment'))
      )
      .finally(() => {
        setCreateExamSubjectDetailsLoading(false)
      })
  }

  return (
    <>
      <Loader show={createExamSubjectDetailsLoading} />

      <SliderScreen setOpen={() => close()}>
        <>
          <SliderScreenHeader
            icon="https://storage.googleapis.com/tm-assets/icons/primary/calendar-clock-primary.svg"
            title={t('addSubject')}
          />
          <ErrorBoundary>
            <div className="pb-10 pt-5 lg:px-10 h-4/5 overflow-y-auto mb-6">
              <p className="w-full pb-5 pt-1 tm-color-text-primary">
                {t('addSubjectAndTimeToCreateAnExam')}
              </p>
              <div className="grid grid-cols-4 gap-4 mb-7">
                <div className="flex flex-col p-4 justify-center rounded-lg tm-border1 h-24">
                  <div className="tm-hdg tm-hdg-24 truncate">
                    {selectedClass?.class?.name}
                  </div>
                  <div className="tm-para tm-para-14 mt-1.5">{t('class')}</div>
                </div>
                <div className="flex flex-col p-4 justify-center rounded-lg tm-border1 h-24">
                  <div className="tm-hdg tm-hdg-24">
                    {selectedClass?.date?.day} {selectedClass?.date?.monthShort}
                  </div>
                  <div className="tm-para tm-para-14 mt-1.5">
                    {selectedClass?.date?.weekdayShort}
                  </div>
                </div>
                <div className="flex col-span-2 p-4 justify-between items-center rounded-lg tm-border1 h-24">
                  <div className="tm-pra-14 color-text-primary">
                    {t('markAsHoliday')}
                  </div>
                  <ToggleSwitch
                    handleChange={() => {
                      setIsHoliday(!isHoliday)
                      eventManager.send_event(events.MARK_HOLIDAY_CLICKED_TFI, {
                        class_name: selectedClass.class.name,
                      })
                    }}
                    value={isHoliday}
                    permissionId={
                      PERMISSION_CONSTANTS.examController_updateSubjectsDetails_update
                    }
                  />
                </div>
              </div>

              <hr className="mb-6" />

              <ErrorBoundary>
                {isHoliday ? (
                  <div className="flex flex-col items-center my-20">
                    <img src={holidayImage} alt="" className="w-80" />
                    <div className="tm-h7 mt-4">
                      {t('noExamsEcheduledErrorMSG')}
                    </div>
                  </div>
                ) : (
                  <>
                    {subjectInputData
                      ?.filter(({status}) => status !== EXAM_TYPES.DELETED)
                      .map(
                        (
                          {subjectName, timeslot, startTime, endTime, status},
                          i
                        ) => (
                          <div
                            key={i}
                            className="mb-8 tm-border1-dark p-4 rounded-xl"
                          >
                            <div className="flex justify-between mb-2">
                              {status === EXAM_TYPES.PUBLISHED ? (
                                <Label
                                  text={t('publised')}
                                  textStyle="tm-bgcr-bl-4"
                                />
                              ) : (
                                <Label text="Draft" textStyle="tm-bgcr-gy-2" />
                              )}
                              <Permission
                                permissionId={
                                  PERMISSION_CONSTANTS.examController_updateSubjectsDetails_update
                                }
                              >
                                <img
                                  src="https://storage.googleapis.com/tm-assets/icons/colorful/delete-red.svg"
                                  className="w-4 h-4 cursor-pointer"
                                  onClick={() =>
                                    handleChange(
                                      'status',
                                      EXAM_TYPES.DELETED,
                                      i
                                    )
                                  }
                                />
                              </Permission>
                            </div>

                            <InputField
                              fieldType="dropdown"
                              title={t('subject')}
                              placeholder={t('selectSubject')}
                              fieldName="subjectName"
                              dropdownItems={[
                                ...getRemainingSubjectList(subjectName),
                              ]}
                              value={subjectName}
                              handleChange={(a, b) => handleChange(a, b, i)}
                              errorText={errObj[i]?.subjectName}
                            />

                            <InputField
                              fieldType="radio"
                              title={t('timeslots')}
                              fieldName="timeslot"
                              dropdownItems={[
                                ...globalTimeslot,
                                {
                                  key: 'customTimeslot',
                                  value: t('customTime'),
                                },
                              ]}
                              value={timeslot}
                              handleChange={(a, b) => handleChange(a, b, i)}
                              options={{isVerticalRadio: true}}
                            />

                            {timeslot === 'customTimeslot' && (
                              <>
                                <div className="flex">
                                  <div className="mr-6">
                                    <div className="tm-para2 tm-color-text-primary mb-1">
                                      {t('startTime')}
                                    </div>
                                    <TimePickerWrapper
                                      time={startTime}
                                      setTime={(a) =>
                                        handleChange('startTime', a, i)
                                      }
                                      index={1}
                                      base="to"
                                      placeholder={t('startTime')}
                                    />
                                  </div>
                                  <div className="">
                                    <div className="tm-para2 tm-color-text-primary mb-1">
                                      {t('endTime')}
                                    </div>
                                    <TimePickerWrapper
                                      time={endTime}
                                      setTime={(a) =>
                                        handleChange('endTime', a, i)
                                      }
                                      index={1}
                                      base="from"
                                      placeholder={t('endTime')}
                                    />
                                  </div>
                                </div>
                                <div className="tm-para4 mt-1 h-4 tm-color-red mb-6">
                                  {errObj[i]?.timeslot}
                                </div>
                              </>
                            )}
                          </div>
                        )
                      )}

                    {Object.keys(subjectGlobalList)?.length >
                      subjectInputData?.length && (
                      <Permission
                        permissionId={
                          PERMISSION_CONSTANTS.examController_updateSubjectsDetails_update
                        }
                      >
                        <div
                          className="tm-hdg-14 tm-cr-bl-2 cursor-pointer"
                          onClick={handleAddMoreSubjects}
                        >
                          {t('addMoreSubject')}
                        </div>
                      </Permission>
                    )}
                  </>
                )}
              </ErrorBoundary>
              <Permission
                permissionId={
                  PERMISSION_CONSTANTS.examController_updateSubjectsDetails_update
                }
              >
                <div className="tm-btn2-blue mt-6" onClick={onSubmit}>
                  {t('save')}
                </div>
              </Permission>
            </div>
          </ErrorBoundary>
        </>
      </SliderScreen>
    </>
  )
}
