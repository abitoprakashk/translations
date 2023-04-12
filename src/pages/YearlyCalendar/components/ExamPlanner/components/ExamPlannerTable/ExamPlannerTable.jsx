import React, {useEffect, useState} from 'react'
import classNames from 'classnames'
import styles from './ExamPlannerTable.module.css'
import SliderCreateSingleTest from '../SliderCreateSingleTest'
import {DateTime} from 'luxon'
import {useDispatch, useSelector} from 'react-redux'
import {Trans, useTranslation} from 'react-i18next'
import {showToast} from '../../../../../../redux/actions/commonAction'
import {utilsGetExamSubjectDetails} from '../../../../../../routes/examPlanner'
import {arrayUniqueByKeys} from '../../../../../../utils/Helpers'
import {createTableStructure} from '../../../../../../utils/ExamPlannerHelpers'
import {
  EXAM_TYPES,
  TIME_FORMAT,
} from '../../../../../../utils/ExamPlannerConstants'
import * as EPC from '../../../../../../utils/ExamPlannerConstants'
import SliderViewResult from '../SliderViewResult/SliderViewResult'
import {ErrorBoundary} from '@teachmint/common'
import Loader from '../../../../../../components/Common/Loader/Loader'
import {events} from '../../../../../../utils/EventsConstants'
import {subjectListClearAction} from '../../redux/ExamPlannerActions'
export default function ExamPlannerTable({
  selectedExam,
  setPublishData,
  hasExamStructure,
}) {
  const [selectedClass, setSelectedClass] = useState(null)
  const [sliderScreen, setSliderScreen] = useState(null)
  const [tableStructure, setTableStructure] = useState(null)
  const [globalTimeslot, setGlobalTimeslot] = useState([])
  const [examId, setExamId] = useState(null)
  const [getExamSubjectDetailsLoading, setgetExamSubjectDetailsLoading] =
    useState(false)

  const dispatch = useDispatch()
  const {t} = useTranslation()
  const {instituteInfo, eventManager} = useSelector((state) => state)

  const setToastData = (type, message) => dispatch(showToast({type, message}))

  useEffect(() => {
    getExamSubjectDetails()
  }, [selectedExam])

  const handleAddSubjectExamScheduleClickEvent = () => {
    eventManager.send_event(events.ADD_SUBJECT_EXAM_SCHEDULE_TFI, {
      exam_name: selectedExam.exam_name,
      screen_name: 'schedule_calendar',
    })
  }

  // const getSubjectNames = ({subjects}) => {
  //   let subjectNames = []

  //   subjects.forEach((subject) => {
  //     if (!subjectNames.includes(subject.subject_name)) {
  //       subjectNames.push(subject.subject_name)
  //     }
  //   })

  //   return subjectNames
  // }

  // const handleViewExamResultClicked = (item) => {
  //   eventManager.send_event(events.VIEW_EXAM_RESULT_CLICKED_TFI, {
  //     subject_name: getSubjectNames(item),
  //   })
  // }

  const getExamSubjectDetails = () => {
    if (selectedExam?._id) {
      setgetExamSubjectDetailsLoading(true)
      utilsGetExamSubjectDetails(instituteInfo?._id, selectedExam?._id)
        .then(({obj}) => {
          getTableStructure(obj[selectedExam?._id])
        })
        .catch(() => setToastData('error', t('unableToGetAssessments')))
        .finally(() => setgetExamSubjectDetailsLoading(false))
    }
  }

  const getTableStructure = (tableData) => {
    if (tableData.exam_structure_ids) {
      setExamId(tableData._id)
    } else {
      dispatch(subjectListClearAction())
    }
    const {tableStructure, globalTimeslotsTemp} = createTableStructure(
      tableData,
      selectedExam?.tfi_classes
    )

    setGlobalTimeslot(globalTimeslotsTemp)
    setTableStructure(tableStructure)

    setPublishData(
      tableData?.subject_details?.filter(
        ({status}) => status === EXAM_TYPES.DRAFT
      ),
      'subject_name'
    )
  }

  const getSubjectNames = ({subjects}) => {
    let subjectNames = []

    subjects.forEach((subject) => {
      if (!subjectNames.includes(subject.subject_name)) {
        subjectNames.push(subject.subject_name)
      }
    })

    return subjectNames
  }

  const handleViewExamResultClicked = (item) => {
    eventManager.send_event(events.VIEW_EXAM_RESULT_CLICKED_TFI, {
      subject_name: getSubjectNames(item),
    })
  }

  const getSubjectUI = (subjects, selectedDate) => {
    if (subjects?.length > 0) {
      const startTime = DateTime.fromSeconds(Number(subjects[0].start_time))
      const endTime = DateTime.fromSeconds(Number(subjects[0].end_time))
      const timeString = `${startTime.toFormat(
        TIME_FORMAT
      )} - ${endTime.toFormat(TIME_FORMAT)} `
      const uniqueSubjects = arrayUniqueByKeys(subjects, ['subject_name'])

      // If date is passed
      if (
        selectedDate < DateTime.now().startOf('day') &&
        (subjects[0].status === EXAM_TYPES.DRAFT ||
          subjects[0].status === EXAM_TYPES.PUBLISHED)
      )
        return (
          <div className="p-2 rounded-lg tm-bgcr-bl-4 w-full h-full flex flex-col justify-end">
            <div className="">
              <div className="tm-hdg-12">{subjects[0].subject_name}</div>
              <div className="tm-para-12 tm-cr-bl-2">View Result</div>
            </div>
            <div className="tm-hdg-12 tm-cr-bl-2 mt-6 h-3">
              {uniqueSubjects.length > 1
                ? `+${uniqueSubjects.length - 1} more`
                : ''}
            </div>
          </div>
        )

      // If Draft
      if (subjects[0].status === EXAM_TYPES.DRAFT) {
        return (
          <div className="p-2 rounded-lg tm-bgcr-gy-2 w-full h-full relative flex flex-col justify-end">
            <div className="">
              <div className="tm-hdg tm-hdg-12 mb-1">
                {subjects[0].subject_name}
              </div>
              <div className="tm-para tm-para-14">{timeString}</div>
            </div>
            <div className="tm-hdg-12 tm-cr-bl-2 mt-6 h-3">
              {uniqueSubjects.length > 1 ? (
                <Trans i18nKey="uniqueSubjects">
                  + {`${uniqueSubjects.length - 1}`} more
                </Trans>
              ) : (
                ''
              )}
            </div>

            <img
              className="absolute top-2 left-2 w-3 h-3"
              src="https://storage.googleapis.com/tm-assets/icons/primary/bookmark-primary.svg"
              alt=""
            />
          </div>
        )
      }
      // If Holiday
      else if (subjects[0].status === EXAM_TYPES.HOLIDAY) {
        return (
          <div className="p-2 rounded-lg tm-bgcr-gy-3 w-full h-full flex flex-col justify-center">
            <div className="tm-hdg tm-hdg-12">{t('holiday')}</div>
          </div>
        )
      }
      // If Publised
      else if (subjects[0].status === EXAM_TYPES.PUBLISHED) {
        return (
          <div className="p-2 rounded-lg tm-bgcr-bl-4 w-full h-full flex flex-col justify-end">
            <div className="">
              <div className="tm-hdg tm-hdg-12">{subjects[0].subject_name}</div>
              <div className="tm-para tm-para-14">{timeString}</div>
            </div>
            <div className="tm-hdg-12 tm-cr-bl-2 mt-6 h-3">
              {uniqueSubjects.length > 1 ? (
                <Trans i18nKey="uniqueSubjects">
                  + {`${uniqueSubjects.length - 1}`} more
                </Trans>
              ) : (
                ''
              )}
            </div>
          </div>
        )
      }
    }
    if (hasExamStructure) {
      return null
    }
    // if (selectedDate < DateTime.now().startOf('day')) return null
    return (
      <div className={styles.wrapper}>
        <div className={styles.defaultDiv}>{'+'}</div>
        <div className={styles.hoverDiv}>
          <div className="tm-hdg-12 tm-cr-bl-2">{t('clickToAddSubject')}</div>
        </div>
      </div>
    )
  }

  const getSliderScreen = (id) => {
    switch (id) {
      case EPC.SCN_SLI_CREATE_SUBJECT_ASSESSMENT:
        return (
          <SliderCreateSingleTest
            selectedClass={selectedClass}
            setSliderScreen={setSliderScreen}
            globalTimeslot={globalTimeslot}
            getExamSubjectDetails={getExamSubjectDetails}
            selectedExam={selectedExam}
            // existingSubjectList={subjectList}
            examId={examId}
          />
        )
      case EPC.SCN_SLI_VIEW_SUBJECT_ASSESSMENT_RESULT:
        return (
          <SliderViewResult
            selectedClass={selectedClass}
            getExamSubjectDetails={getExamSubjectDetails}
            setSliderScreen={setSliderScreen}
            hasExamStructure={hasExamStructure}
          />
        )
    }
  }

  return (
    <>
      <Loader show={getExamSubjectDetailsLoading} />

      <div
        className={`${classNames(
          styles.con
        )} show-scrollbar show-scrollbar-small`}
      >
        <ErrorBoundary>
          <table className={classNames(styles.table)}>
            <thead>
              <tr>
                <th></th>
                {selectedExam?.tfi_classes?.map(({_id, name}) => (
                  <th
                    className={classNames(
                      styles.colHeaders,
                      'tm-para-18 tm-color-text-primary py-8'
                    )}
                    key={_id}
                  >
                    <Trans i18nKey="examPlannerClassName">Class {{name}}</Trans>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="show-scrollbar show-scrollbar-small">
              {tableStructure?.map(({date, classes}, rowIndex) => (
                <tr key={`${rowIndex}-${date}`}>
                  <th scope="row">
                    <div className="tm-bg-light-gray text-center p-5">
                      <div className="tm-para tm-para-14">
                        {date?.weekdayShort}
                      </div>
                      <div className="tm-hdg tm-hdg-18">{date?.day}</div>
                      <div className="tm-para tm-para-14">
                        {date?.monthShort}
                      </div>
                    </div>
                  </th>
                  {classes?.map((item, colIndex) => (
                    <td
                      key={colIndex}
                      className={`p-1 h-20 ${
                        hasExamStructure ? '' : 'cursor-pointer'
                      }`}
                      onClick={() => {
                        // If date is passed
                        // If draft or publised open view result screen
                        if (
                          date < DateTime.now().startOf('day') &&
                          (item?.subjects?.[0]?.status === EXAM_TYPES.DRAFT ||
                            item?.subjects?.[0]?.status ===
                              EXAM_TYPES.PUBLISHED)
                        ) {
                          handleViewExamResultClicked(item)
                          setSelectedClass({
                            date,
                            class: item,
                            examId: selectedExam?._id,
                          })
                          setSliderScreen(
                            EPC.SCN_SLI_VIEW_SUBJECT_ASSESSMENT_RESULT
                          )
                        } else {
                          if (hasExamStructure) return
                          setSelectedClass({
                            date,
                            class: item,
                            examId: selectedExam?._id,
                          })
                          setSliderScreen(EPC.SCN_SLI_CREATE_SUBJECT_ASSESSMENT)
                          handleAddSubjectExamScheduleClickEvent()
                        }
                      }}
                    >
                      {getSubjectUI(item?.subjects, date)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {getSliderScreen(sliderScreen)}
        </ErrorBoundary>
      </div>
    </>
  )
}
