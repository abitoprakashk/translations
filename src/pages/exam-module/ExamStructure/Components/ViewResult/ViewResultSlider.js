import React, {useState, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {Trans, useTranslation} from 'react-i18next'
import {getNodeDataWithChildrensParent} from '../../../../utils/HierarchyHelpers'
import LinearTabOptions from '../../../../components/Common/LinearTabOptions/LinearTabOptions'
import SliderScreen from '../../../../components/Common/SliderScreen/SliderScreen'
import SliderScreenHeader from '../../../../components/Common/SliderScreenHeader/SliderScreenHeader'
import RadioInput from '../../../../components/Common/RadioInput/RadioInput'
import {Table} from '@teachmint/common'
import ScoreCardProgressBar from '../../../../components/ExamPlanner/components/examScoreCard/ScoreCardProgressBar'
import UserProfile from '../../../../components/Common/UserProfile/UserProfile'
import {utilsGetExamAssessmentResult} from '../../../../routes/examPlanner'
import {EXAM_TYPES} from '../../../../utils/ExamPlannerConstants'
import emptyResultImage from '../../../../assets/images/dashboard/empty-exam-result.svg'
import EmptyScreenV1 from '../../../../components/Common/EmptyScreenV1/EmptyScreenV1'
import {ErrorBoundary, ErrorOverlay} from '@teachmint/common'
import Loader from '../../../../components/Common/Loader/Loader'
import history from '../../../../history'
import styles from './ViewResultSlider.module.css'
import useQuery from '../../../../hooks/UseQuery'
import {fetchExamResultsAction} from '../../Redux/ExamStructureActions'

export default function ViewResultSlider({selectedClass}) {
  const [subjectsData, setSubjectsData] = useState({})
  const [subjectTabList, setSubjectTabList] = useState([])
  const [selectedSubjectTab, setSelectedSubjectTab] = useState(null)
  const [selectedSectionAssessmentId, setSelectedSectionAssessmentId] =
    useState(null)
  const [examResult, setExamResult] = useState([])
  const [getAssessmentLoading, setGetAssessmentLoading] = useState(false)
  const [getAssessmentError, setGetAssessmentError] = useState(false)

  const {instituteHierarchy} = useSelector((state) => state)
  const {t} = useTranslation()
  const close = () => history.goBack()

  const query = useQuery()
  const dispatch = useDispatch()

  const examId = query.get('examId')

  useEffect(() => {
    dispatch(fetchExamResultsAction(examId))
  }, [examId])

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
        return {id: item, label: item}
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
                enrollment_number?.trim() ? enrollment_number : phone_number
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

      {getAssessmentError && (
        <ErrorOverlay>
          {t('assessmentCouldNotBeLoadedErrorOverlay')}
        </ErrorOverlay>
      )}

      <SliderScreen setOpen={() => close()}>
        <>
          <SliderScreenHeader
            icon="https://storage.googleapis.com/tm-assets/icons/primary/website-builder-primary.svg"
            title={t('viewResults')}
          />

          <ErrorBoundary>
            <div className={styles.sliderBody}>
              <div className={styles.sliderBodyGrid}>
                <div className={styles.standardNameContainer}>
                  <div className={styles.standardName}>
                    {selectedClass?.class?.name}
                  </div>
                  <div className={styles.classTitle}>{t('class')}</div>
                </div>
                <div className={styles.standardNameContainer}>
                  <div className={styles.standardName}>
                    {selectedClass?.date?.day} {selectedClass?.date?.monthShort}
                  </div>
                  <div className={styles.classTitle}>
                    {selectedClass?.date?.weekdayShort}
                  </div>
                </div>
              </div>

              <div className={styles.tabContainer}>
                <LinearTabOptions
                  options={subjectTabList}
                  selected={selectedSubjectTab}
                  handleChange={(subject) => {
                    setSelectedSubjectTab(subject)
                    setSelectedSectionAssessmentId(
                      subjectsData?.[subject]?.[0]?.assessment_id
                    )
                  }}
                />

                <div className={styles.sectionContainer}>
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
                      <div className={styles.imageContainer}>
                        <img
                          src="https://storage.googleapis.com/tm-assets/icons/primary/calendar-clock-primary.svg"
                          alt=""
                          className={styles.icon}
                        />
                        <div className={styles.statsContainer}>
                          {examResult?.stats?.evaluatedExams || 0}/
                          {examResult?.total_students || 0} {t('submitted')}
                        </div>
                      </div>

                      <div className={styles.progressBarContainer}>
                        <ScoreCardProgressBar
                          paperMarks={examResult?.stats?.totalMarks}
                          totalMarks={examResult?.stats?.totalMarks}
                          avgScore={examResult?.stats?.paperStats?.avgScore}
                          top10AvgScore={
                            examResult?.stats?.paperStats?.top10AvgScore
                          }
                        />
                      </div>

                      <div className={styles.tableContainer}>
                        <Table
                          rows={getRows(examResult?.student_result)}
                          cols={viewResultTableHeader}
                        />
                      </div>
                    </>
                  ) : (
                    <div className={styles.emptyScreenContainer}>
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
