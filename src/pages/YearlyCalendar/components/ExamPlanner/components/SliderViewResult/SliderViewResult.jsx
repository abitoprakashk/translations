import React, {useState, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {Trans, useTranslation} from 'react-i18next'
import {Input} from '@teachmint/common'
import {getNodeDataWithChildrensParent} from '../../../../../../utils/HierarchyHelpers'
import {showToast} from '../../../../../../redux/actions/commonAction'
import SliderScreen from '../../../../../../components/Common/SliderScreen/SliderScreen'
import SliderScreenHeader from '../../../../../../components/Common/SliderScreenHeader/SliderScreenHeader'
import RadioInput from '../../../../../../components/Common/RadioInput/RadioInput'
import Table from '../../../../../../components/Common/Table/Table'
import UserProfile from '../../../../../../components/Common/UserProfile/UserProfile'
import ScoreCardProgressBar from '../examScoreCard/ScoreCardProgressBar'
import ConfirmationPopup from '../../../../../../components/Common/ConfirmationPopup/ConfirmationPopup'
import {
  utilsGetExamAssessmentResult,
  utilsUpdateExamSubjectDetails,
} from '../../../../../../routes/examPlanner'
import {EXAM_TYPES} from '../../../../../../utils/ExamPlannerConstants'
import emptyResultImage from '../../../../../../assets/images/dashboard/empty-exam-result.svg'
import EmptyScreenV1 from '../../../../../../components/Common/EmptyScreenV1/EmptyScreenV1'
import {ErrorBoundary, ErrorOverlay} from '@teachmint/common'
import Loader from '../../../../../../components/Common/Loader/Loader'
import {subjectListClearAction} from '../../redux/ExamPlannerActions'
import {events} from '../../../../../../utils/EventsConstants'
import styles from './SliderViewResult.module.css'
import Permission from '../../../../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../../../utils/permission.constants'

export default function SliderViewResult({
  selectedClass,
  setSliderScreen,
  hasExamStructure,
  getExamSubjectDetails,
}) {
  const [subjectsData, setSubjectsData] = useState({})
  const [subjectTabList, setSubjectTabList] = useState([])
  const [selectedSubjectTab, setSelectedSubjectTab] = useState(null)
  const [selectedSectionAssessmentId, setSelectedSectionAssessmentId] =
    useState(null)
  const [examResult, setExamResult] = useState([])
  const [getAssessmentLoading, setGetAssessmentLoading] = useState(false)
  const [getAssessmentError, setGetAssessmentError] = useState(false)
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(null)

  const {instituteHierarchy, eventManager} = useSelector((state) => state)
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const close = () => setSliderScreen(null)

  useEffect(() => {
    // Create Subjects and section data form created assessments
    const subjectDataTemp = {}
    selectedClass?.class?.subjects?.forEach((item) => {
      if ([EXAM_TYPES.DRAFT, EXAM_TYPES.PUBLISHED].includes(item?.status)) {
        let subjectItem = subjectDataTemp[item?.subject_name] || []

        // Get Section Name from hierarchy
        const sectionSubjectData = getNodeDataWithChildrensParent(
          instituteHierarchy,
          item?.subject_id
        )

        subjectItem.push({
          ...item,
          parentDetails: sectionSubjectData?.parentDetails,
        })
        subjectDataTemp[item?.subject_name] = subjectItem
      }
    })

    let subjectList = Object.keys(subjectDataTemp)

    setSubjectsData(subjectDataTemp)
    setSubjectTabList(
      subjectList.map((item) => {
        return {value: item, label: item}
      })
    )
    setSelectedSubjectTab(subjectList?.[0])
    setSelectedSectionAssessmentId(
      subjectDataTemp[subjectList?.[0]]?.[0]?.assessment_id
    )
  }, [selectedClass])

  // Get updated data when setion in changed
  useEffect(() => {
    getExamAssessmentResult()
  }, [selectedSectionAssessmentId])

  const getExamAssessmentResult = () => {
    if (selectedSectionAssessmentId) {
      setGetAssessmentLoading(true)
      utilsGetExamAssessmentResult(selectedSectionAssessmentId)
        .then(({obj}) => setExamResult(obj))
        .catch(() => setGetAssessmentError(true))
        .finally(() => setGetAssessmentLoading(false))
    }
  }

  const getRows = (studentRows) => {
    let rows = []

    studentRows?.forEach(
      ({
        name,
        img_url,
        enrollment_number,
        phone_number,
        email,
        verification_status,
        score,
      }) => {
        rows.push({
          id: phone_number,
          studentName: (
            <UserProfile
              image={img_url}
              name={name}
              phoneNumber={
                enrollment_number?.trim() ||
                phone_number?.trim() ||
                email?.trim()
              }
              joinedState={verification_status}
            />
          ),
          marks: (
            <div className="tm-para tm-para-14">
              {score === undefined ? 'NA' : score}
            </div>
          ),
        })
      }
    )
    return rows
  }

  const deleteSubject = () => {
    let subjectDataList = subjectsData[selectedSubjectTab]
    let param = subjectDataList.map((item) => ({
      assessment_id: item.assessment_id,
      date: item.date,
      end_time: item.end_time,
      standard_id: item.standard_id,
      start_time: item.start_time,
      status: 4,
      subject_id: item.subject_id,
      _id: item._id,
    }))

    utilsUpdateExamSubjectDetails(selectedClass?.examId, param)
      .then(() => {
        getExamSubjectDetails()
        dispatch(subjectListClearAction())
        dispatch(
          showToast({
            type: 'success',
            message: t('assessmentDeletedSuccessfullyCreated'),
          })
        )
        close()
        eventManager.send_event(events.SUBJECT_EXAM_DELETED_TFI, {
          subject_name: selectedSubjectTab,
        })
      })
      .catch((res) =>
        dispatch(
          showToast({
            type: 'error',
            message: res.error || t('unableToDeleteAssessment'),
          })
        )
      )
  }

  const viewResultTableHeader = [
    {key: 'studentName', label: t('studentName')},
    {
      key: 'marks',
      label: (
        <Trans i18nKey="marksValue">
          Marks({`${examResult?.stats?.totalMarks || 0}`})
        </Trans>
      ),
    },
  ]

  return (
    <>
      <Loader show={getAssessmentLoading} />

      {showConfirmationPopup && (
        <ConfirmationPopup
          onClose={setShowConfirmationPopup}
          onAction={deleteSubject}
          icon="https://storage.googleapis.com/tm-assets/icons/colorful/remove-bg-red.svg"
          title={
            <>
              <Trans i18nKey="deleteExamSubject">
                Delete {`${selectedSubjectTab}`} Exam?
              </Trans>
              <span>?</span>
            </>
          }
          desc={t('deleteExamSubjectDesc')}
          primaryBtnText={t('cancel')}
          secondaryBtnStyle={'tm-btn2-red w-9/10'}
          secondaryBtnText={t('delete')}
        />
      )}

      {getAssessmentError && (
        <ErrorOverlay>
          {/* {t('assessmentCouldNotBeLoadedErrorOverlay')} */}
        </ErrorOverlay>
      )}

      <SliderScreen setOpen={() => close()}>
        <>
          <SliderScreenHeader
            icon="https://storage.googleapis.com/tm-assets/icons/primary/website-builder-primary.svg"
            title={t('viewResults')}
          />

          <ErrorBoundary>
            <div className="pb-10 pt-5 lg:px-10 h-4/5 overflow-y-auto mb-6">
              <div className="grid grid-cols-2 gap-4 mb-7">
                <div className="flex flex-col p-4 justify-center rounded-lg tm-border1 h-24">
                  <div className="tm-hdg tm-hdg-24">
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
              </div>

              <div className="mt-6">
                <div className={styles.labels}>
                  <span>{t('subjectName')}</span>
                  {!hasExamStructure && (
                    <Permission
                      permissionId={
                        PERMISSION_CONSTANTS.examController_updateSubjectsDetails_update
                      }
                    >
                      <span
                        className={styles.deleteTxt}
                        onClick={() => setShowConfirmationPopup(true)}
                      >
                        <Trans i18nKey="deleteExamSubject">
                          Delete {`${selectedSubjectTab}`} Exam
                        </Trans>
                      </span>
                    </Permission>
                  )}
                </div>
                <Input
                  type="select"
                  options={subjectTabList}
                  value={selectedSubjectTab}
                  onChange={(obj) => {
                    setSelectedSubjectTab(obj.value)
                    setSelectedSectionAssessmentId(
                      subjectsData?.[obj.value]?.[0]?.assessment_id
                    )
                  }}
                  classes={{wrapper: styles.selectboxWrapper}}
                />

                <div className="mt-4">
                  <RadioInput
                    value={selectedSectionAssessmentId}
                    fieldName="section"
                    handleChange={(_, value) =>
                      setSelectedSectionAssessmentId(value)
                    }
                    dropdownItems={(
                      subjectsData?.[selectedSubjectTab] || []
                    )?.map(({assessment_id, class_name, parentDetails}) => {
                      return {
                        key: assessment_id,
                        value: `${class_name} ${parentDetails?.name}`,
                      }
                    })}
                  />
                </div>

                <ErrorBoundary>
                  {examResult?.stats?.evaluatedExams > 0 ? (
                    <>
                      <div className="flex items-center p-4 rounded-lg tm-box-shadow2 mt-6">
                        <img
                          src="https://storage.googleapis.com/tm-assets/icons/primary/calendar-clock-primary.svg"
                          alt=""
                          className="w-3 h-3 mr-1"
                        />
                        <div className="tm-para tm-para-14">
                          {examResult?.stats?.evaluatedExams || 0}/
                          {examResult?.total_students || 0} {t('submitted')}
                        </div>
                      </div>

                      <div className="flex">
                        <div className="w-full mt-4">
                          <ScoreCardProgressBar
                            paperMarks={examResult?.stats?.totalMarks}
                            totalMarks={examResult?.stats?.totalMarks}
                            avgScore={examResult?.stats?.paperStats?.avgScore}
                            top10AvgScore={
                              examResult?.stats?.paperStats?.top10AvgScore
                            }
                          />
                        </div>
                      </div>

                      <div className="mt-6">
                        <Table
                          rows={getRows(examResult?.student_result)}
                          cols={viewResultTableHeader}
                        />
                      </div>
                    </>
                  ) : (
                    <div className="mt-20">
                      <EmptyScreenV1
                        image={emptyResultImage}
                        title={t('resultHasNotbeenPublishedYet')}
                      />
                    </div>
                  )}
                </ErrorBoundary>
              </div>
            </div>
          </ErrorBoundary>
        </>
      </SliderScreen>
    </>
  )
}
