import React, {useState, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useTranslation} from 'react-i18next'
import {getNodesListOfSimilarType} from '../../../../../../utils/HierarchyHelpers'
import InputField from '../../../../../../components/Common/InputField/InputField'
import SliderScreen from '../../../../../../components/Common/SliderScreen/SliderScreen'
import SliderScreenHeader from '../../../../../../components/Common/SliderScreenHeader/SliderScreenHeader'
import * as SHC from '../../../../../../utils/SchoolSetupConstants'
import {validateInputs} from '../../../../../../utils/Validations'
import {DateTime} from 'luxon'
import {utilsGetExamSubjectDetails} from '../../../../../../routes/examPlanner'
import {showToast} from '../../../../../../redux/actions/commonAction'
import {
  createTableStructure,
  getAssessmentsAgainstClassId,
} from '../../../../../../utils/ExamPlannerHelpers'
import ConfirmationPopup from '../../../../../../components/Common/ConfirmationPopup/ConfirmationPopup'
import {EXAM_TYPES} from '../../../../../../utils/ExamPlannerConstants'
import {ErrorBoundary, Input} from '@teachmint/common'
import Loader from '../../../../../../components/Common/Loader/Loader'
import {events} from '../../../../../../utils/EventsConstants'
import {createCalendarItem} from '../../../../apiService'
import styles from './SliderCreateExam.module.css'

export default function SliderCreateExam({
  setSliderScreen,
  getExamScheduleList,
  selectedExam = null,
}) {
  const [examName, setExamName] = useState('')
  const [examNameErr, setExamNameErr] = useState('')
  const [examClassList, setExamClassList] = useState([])
  const [examClassListErr, setExamClassListErr] = useState('')
  const [startDate, setStartDate] = useState('')
  const [startDateErr, setStartDateErr] = useState('')
  const [endDate, setEndDate] = useState('')
  const [endDateErr, setEndDateErr] = useState('')
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(null)
  const [getExamSubjectDetailsLoading, setGetExamSubjectDetailsLoading] =
    useState(false)
  const [createExamLoading, setCreateExamLoading] = useState(false)
  const {t} = useTranslation()

  const {instituteInfo, instituteHierarchy, eventManager} = useSelector(
    (state) => state
  )
  const dispatch = useDispatch()

  const close = () => setSliderScreen(null)
  const setToastData = (type, message) => dispatch(showToast({type, message}))

  useEffect(() => {
    if (instituteInfo?.hierarchy_id) {
      // Get Classes List from Hierarchy
      const classes = getNodesListOfSimilarType(
        instituteHierarchy,
        SHC.NODE_CLASS
      )
      const classesOptions = classes?.map(({id, name}) => {
        return {key: id, value: name, selected: false}
      })

      // Select classes previosly selected in case of update
      if (selectedExam?.tfi_classes) {
        classesOptions?.forEach((item, index, arr) => {
          if (selectedExam.tfi_classes?.find(({_id}) => _id === item?.key))
            arr[index].selected = true
        })
      }

      if (classesOptions?.length > 0) setExamClassList(classesOptions)
    }

    // Add previous values in state in case of update
    if (selectedExam?._id) {
      const {event_name, starts_on, ends_on} = selectedExam
      setExamName(event_name)
      setStartDate(new Date(Number(starts_on) * 1000))
      setEndDate(new Date(Number(ends_on) * 1000))
    }
  }, [instituteInfo, selectedExam])

  const handleSaveExamScheduleClickEvent = (exam_name, isUpdated) => {
    eventManager.send_event(events.SAVE_EXAM_SCHEDULE_CLICKED_TFI, {
      exam_name,
      updated: isUpdated,
    })
  }

  const getExamSubjectDetails = async () => {
    if (selectedExam?._id) {
      setGetExamSubjectDetailsLoading(true)
      const data = await utilsGetExamSubjectDetails(
        instituteInfo?._id,
        selectedExam?._id
      )
        .catch(() => setToastData('error', t('unableToGetAssessments')))
        .finally(() => setGetExamSubjectDetailsLoading(false))
      return data?.status ? data?.obj[selectedExam?._id] : {}
    }
  }

  const handleChange = (fieldName, value) => {
    switch (fieldName) {
      case 'examName':
        if (validateInputs('examName', value)) setExamName(value)
        break
      case 'examClassList':
        setExamClassList(value)
        break
      case 'startDate':
        setStartDate(value)
        setEndDate('')
        break
      case 'endDate':
        setEndDate(value)
        break
      default:
        break
    }
  }

  const onSubmit = async () => {
    let flag = true

    if (!examName?.length > 0) {
      flag = false
      setExamNameErr(t('required'))
    } else setExamNameErr('')

    if (
      instituteInfo?.hierarchy_id &&
      !examClassList?.filter(({selected}) => selected)?.length > 0
    ) {
      flag = false
      setExamClassListErr(t('required'))
    } else setExamClassListErr('')
    if (!startDate) {
      flag = false
      setStartDateErr(t('required'))
    } else setStartDateErr('')
    if (!endDate) {
      flag = false
      setEndDateErr(t('required'))
    } else setEndDateErr('')

    let startDateTemp = '',
      endDateTemp = ''

    if (flag) {
      // Convert date to timestamp
      startDateTemp = DateTime.fromJSDate(startDate).toSeconds()
      endDateTemp = DateTime.fromJSDate(endDate).toSeconds()
      // const curDate = DateTime.now().startOf('day').toSeconds()

      // Check if start date is current or future date
      // if (startDateTemp < curDate) {
      //   flag = false
      //   setStartDateErr(t('selectFutureDate'))
      // }
      // Check id end date is greater than start date
      if (startDateTemp > endDateTemp) {
        flag = false
        setEndDateErr(t('enterAValidDate'))
      }
    }

    if (flag) {
      // Get selected class Node ids
      const classList = examClassList
        .filter(({selected}) => selected)
        .map(({key}) => key)

      if (selectedExam?._id) {
        let editFlag = true

        // Get Calendar data
        const examSubjectDetails = await getExamSubjectDetails()

        const {tableStructure} = createTableStructure(
          examSubjectDetails,
          selectedExam?.tfi_classes
        )

        // Find if any assessment is present on removed starting dates
        let oldStartDate = Number(selectedExam?.starts_on)
        let oldEndDate = Number(selectedExam?.ends_on)

        while (oldStartDate < startDateTemp) {
          const curDateAssessmentObjs = tableStructure?.find(
            ({date}) => date.toSeconds() === oldStartDate
          )

          if (curDateAssessmentObjs?.classes) {
            for (let item of curDateAssessmentObjs.classes) {
              const assessmentNum = item?.subjects?.filter(
                ({status}) => status !== EXAM_TYPES.HOLIDAY
              ).length

              if (assessmentNum > 0) {
                editFlag = false
                break
              }
            }
          }

          // Add 1 Day to oldStartDate
          oldStartDate += 86400
        }

        // Find if any assessment is present on removed ending dates
        while (editFlag && oldEndDate > endDateTemp) {
          const curDateAssessmentObjs = tableStructure?.find(
            ({date}) => date.toSeconds() === oldEndDate
          )

          if (curDateAssessmentObjs?.classes) {
            for (let item of curDateAssessmentObjs.classes) {
              const assessmentNum = item?.subjects?.filter(
                ({status}) => status !== EXAM_TYPES.HOLIDAY
              ).length

              if (assessmentNum > 0) {
                editFlag = false
                break
              }
            }
          }

          // Add 1 Day to oldEndDate
          oldEndDate -= 86400
        }

        // Check if removed classes contains assessment
        if (editFlag) {
          const assessmentsAgainstClassId =
            getAssessmentsAgainstClassId(examSubjectDetails)

          for (let item of selectedExam.tfi_classes) {
            const classPresent = classList.findIndex((i) => i === item?._id)
            if (
              classPresent === -1 &&
              assessmentsAgainstClassId[item?._id]?.filter(
                ({status}) => status !== 2
              )?.length > 0
            ) {
              editFlag = false
              break
            }
          }
        }

        if (editFlag) {
          handleSaveExamScheduleClickEvent(examName, 'yes')
          setCreateExamLoading(true)
          const payload = {
            starts_on: startDateTemp,
            ends_on: endDateTemp,
            event_name: examName,
            event_type: 4,
            type: 1,
            node_ids: classList,
            applicable_to: 2,
            _id: selectedExam?._id,
          }
          createCalendarItem(payload)
            .then(() => {
              getExamScheduleList()
              setToastData('success', t('examScheduleSuccessfullyUpdated'))
              close()
            })
            .catch(() => setToastData('error', t('unableToUpdateExamSchedule')))
            .finally(() => setCreateExamLoading(false))
        } else {
          setShowConfirmationPopup(true)
        }
      } else {
        handleSaveExamScheduleClickEvent(examName, 'no')
        setCreateExamLoading(true)
        const payload = {
          starts_on: startDateTemp,
          ends_on: endDateTemp,
          event_name: examName,
          event_type: 4,
          type: 1,
          node_ids: classList,
          applicable_to: 2,
        }
        createCalendarItem(payload)
          .then(() => {
            getExamScheduleList()
            setToastData('success', t('examScheduleSuccessfullyCreated'))
            close()
          })
          .catch(() => setToastData('error', t('unableToCreateExamSchedule')))
          .finally(() => setCreateExamLoading(false))
      }
    }
  }

  return (
    <>
      <Loader show={createExamLoading || getExamSubjectDetailsLoading} />

      {showConfirmationPopup && (
        <ConfirmationPopup
          onClose={setShowConfirmationPopup}
          onAction={close}
          icon="https://storage.googleapis.com/tm-assets/icons/colorful/warning-orange.svg"
          title={t('editExamConfirmationPopupTitle')}
          desc={t('editExamConfirmationPopupDesc')}
          primaryBtnText={t('cancel')}
          secondaryBtnText={t('editExam')}
        />
      )}
      <SliderScreen setOpen={() => close()}>
        <>
          <SliderScreenHeader
            icon="https://storage.googleapis.com/tm-assets/icons/primary/calendar-clock-primary.svg"
            title={
              selectedExam?._id
                ? t('updateExamSchedule')
                : t('createExamSchedule')
            }
          />

          <div className="p-5 lg:p-10 h-4/5 overflow-y-auto">
            <ErrorBoundary>
              <InputField
                fieldType="text"
                title={t('examName')}
                placeholder={t('examNamePlaceholder')}
                value={examName}
                handleChange={handleChange}
                fieldName="examName"
                errorText={examNameErr}
              />

              <ErrorBoundary>
                {instituteInfo?.hierarchy_id && (
                  <InputField
                    fieldType="multipleSelectionDropdown"
                    title={t('selectClass')}
                    placeholder=""
                    value={examClassList}
                    handleChange={handleChange}
                    fieldName="examClassList"
                    errorText={examClassListErr}
                  />
                )}
              </ErrorBoundary>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="date"
                  title={t('startDate')}
                  fieldName="startDate"
                  placeholder="Start Date"
                  value={startDate}
                  showError={startDateErr.length}
                  errorMsg={startDateErr}
                  onChange={(obj) => handleChange(obj.fieldName, obj.value)}
                  classes={{wrapper: styles.dateInput}}
                />
                <Input
                  type="date"
                  title={t('endDate')}
                  fieldName="endDate"
                  placeholder="End Date"
                  value={endDate}
                  showError={endDateErr.length}
                  errorMsg={endDateErr}
                  onChange={(obj) => handleChange(obj.fieldName, obj.value)}
                  classes={{wrapper: styles.dateInput}}
                  minDate={startDate}
                />
              </div>

              <div className="tm-btn2-blue mt-6" onClick={onSubmit}>
                {t('saveExamSchedule')}
              </div>
            </ErrorBoundary>
          </div>
        </>
      </SliderScreen>
    </>
  )
}
