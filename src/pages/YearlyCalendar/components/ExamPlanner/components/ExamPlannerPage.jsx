import React, {useState, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {Trans, useTranslation} from 'react-i18next'
import * as EPC from '../../../../../utils/ExamPlannerConstants'
import SliderCreateExam from './SliderCreateExam/SliderCreateExam'
import ExamPlannerTable from './ExamPlannerTable/ExamPlannerTable'
import SubjectTooltipOptions from '../../../../../components/SchoolSystem/SectionDetails/SubjectTooltipOptions'
import {EXAM_TOOLTIP_OPTIONS} from '../../../../../utils/ExamPlannerOptions'
import {showToast} from '../../../../../redux/actions/commonAction'
import {utilsUpdateExamSubjectDetails} from '../../../../../routes/examPlanner'
import ConfirmationPopup from '../../../../../components/Common/ConfirmationPopup/ConfirmationPopup'
import {DateTime} from 'luxon'
import DeleteExam from './DeleteExam'
import EmptyScreenV1 from '../../../../../components/Common/EmptyScreenV1/EmptyScreenV1'
import emptyExamImage from '../../../../../assets/images/dashboard/empty-exam.png'
import examNewSessionImage from '../../../../../assets/images/dashboard/exam-new-session.svg'
import examMobileImage from '../../../../../assets/images/dashboard/exam-mobile.svg'
import {isHierarchyAvailable} from '../../../../../utils/HierarchyHelpers'
import {DASHBOARD} from '../../../../../utils/SidebarItems'
import history from '../../../../../history'
import {ErrorBoundary, ErrorOverlay} from '@teachmint/common'
import Loader from '../../../../../components/Common/Loader/Loader'
import {events} from '../../../../../utils/EventsConstants'
import {getCalendarData} from '../../../apiService'
import {PERMISSION_CONSTANTS} from '../../../../../utils/permission.constants'
import Permission from '../../../../../components/Common/Permission/Permission'

export default function ExamPlannerPage({expandAllowed = true}) {
  const [sliderScreen, setSliderScreen] = useState(null)
  const [examList, setExamList] = useState([])
  const [selectedExam, setSelectedExam] = useState(null)
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(null)
  const [publishData, setPublishData] = useState(null)
  const [deleteExam, setDeleteExam] = useState(null)
  const [getExamListLoading, setGetExamListLoading] = useState(false)
  const [getExamListError, setGetExamListError] = useState(false)
  const [publishExamLoading, setPublishExamLoading] = useState(false)

  const {
    instituteInfo,
    instituteHierarchy,
    instituteActiveAcademicSessionId,
    eventManager,
  } = useSelector((state) => state)
  const dispatch = useDispatch()
  const {t} = useTranslation()
  const setToastData = (type, message) => dispatch(showToast({type, message}))

  useEffect(() => {
    getExamScheduleList()
  }, [instituteInfo?._id, instituteActiveAcademicSessionId])

  const handleChange = (action, examItem) => {
    switch (action) {
      case EPC.ACT_EXAM_EDIT: {
        eventManager.send_event(events.EDIT_EXAM_STRUCTURE_CLICKED_TFI, {
          exam_name: examItem.exam_name,
        })
        setSelectedExam(examItem)
        setSliderScreen(EPC.SCN_SLI_UPDATE_EXAM)
        break
      }
      case EPC.ACT_EXAM_DELETE: {
        eventManager.send_event(events.DELETE_EXAM_SCHEDULE_CLICKED_TFI, {
          exam_name: examItem.exam_name,
        })
        setDeleteExam(examItem)
        break
      }
      default:
        break
    }
  }

  const getExamScheduleList = () => {
    if (instituteInfo?._id) {
      setGetExamListLoading(true)
      getCalendarData(4)
        .then(({obj}) => {
          const updatedObj = obj?.map((item) => {
            return {
              ...item,
              convertedStartDate: DateTime.fromSeconds(
                Number(item?.starts_on)
              ).toFormat('dd LLL'),
              convertedEndDate: DateTime.fromSeconds(
                Number(item?.ends_on)
              ).toFormat('dd LLL'),
            }
          })
          updatedObj.reverse()
          // console.log(updatedObj)
          setExamList(updatedObj)

          // Set default selected exam
          let selectedExamTemp = updatedObj?.find(
            ({_id}) => _id === selectedExam?._id
          )

          if (updatedObj?.length > 0) {
            if (!selectedExamTemp && selectedExamTemp)
              selectedExamTemp = JSON.parse(JSON.stringify(updatedObj[0]))
            setSelectedExam(selectedExamTemp)
          } else setSelectedExam([])
        })
        .catch(() => {
          setToastData('error', t('unableToGetExamSchedules'))
          setGetExamListError(true)
        })
        .finally(() => setGetExamListLoading(false))
    }
  }

  const getSubjectCounts = () => {
    let subjectNames = []

    publishData.forEach((subject) => {
      if (!subjectNames.includes(subject.subject_name)) {
        subjectNames.push(subject.subject_name)
      }
    })

    return subjectNames.length
  }

  const publishAssessments = () => {
    const updatedData = publishData?.map((item) => {
      return {...item, status: EPC.EXAM_TYPES.PUBLISHED}
    })

    eventManager.send_event(events.PUBLISH_EXAM_SCHEDULE_CLICKED_TFI, {
      subjects_count: getSubjectCounts(),
    })

    setPublishExamLoading(true)
    utilsUpdateExamSubjectDetails(selectedExam?._id, updatedData)
      .then(() => {
        eventManager.send_event(events.EXAM_SCHEDULE_PUBLISHED_TFI, {
          subjects_count: getSubjectCounts(),
        })
        setToastData('success', t('examsSuccessfullyPublished'))
        setSelectedExam(JSON.parse(JSON.stringify(selectedExam)))
      })
      .catch((res) =>
        setToastData('error', res.error || t('unableToPublishExams'))
      )
      .finally(() => setPublishExamLoading(false))
  }

  const getSliderScreen = (id) => {
    switch (id) {
      case EPC.SCN_SLI_CREATE_EXAM:
        return (
          <SliderCreateExam
            setSliderScreen={setSliderScreen}
            getExamScheduleList={getExamScheduleList}
          />
        )
      case EPC.SCN_SLI_UPDATE_EXAM:
        return (
          <SliderCreateExam
            setSliderScreen={setSliderScreen}
            getExamScheduleList={getExamScheduleList}
            selectedExam={selectedExam}
          />
        )
    }
  }

  const handleCreateScheduleClickEvent = () => {
    eventManager.send_event(events.CREATE_SCHEDULE_CLICKED_TFI)
  }
  return (
    <>
      <Loader show={getExamListLoading || publishExamLoading} />

      {getExamListError && (
        <ErrorOverlay>{t('errorOverlayExamsNotFound')}</ErrorOverlay>
      )}

      <div className="lg:hidden mt-20">
        <EmptyScreenV1
          image={examMobileImage}
          title={t('examPlannerEmptyScreenTitle')}
          desc=""
          btnText={t('goToDashboard')}
          handleChange={() => history.push(DASHBOARD)}
          btnType="primary"
        />
      </div>

      <div className="hidden lg:block">
        <ErrorBoundary>
          {!isHierarchyAvailable(instituteHierarchy) ? (
            <div className="mt-32">
              <EmptyScreenV1
                image={examNewSessionImage}
                title={t('examPlannerAcademicSessionEmptyScreenTitle')}
                desc={t('examPlannerAcademicSessionEmptyScreenDesc')}
              />
            </div>
          ) : (
            <div>
              {showConfirmationPopup && (
                <ConfirmationPopup
                  onClose={setShowConfirmationPopup}
                  onAction={showConfirmationPopup?.onAction}
                  icon={showConfirmationPopup?.imgSrc}
                  title={showConfirmationPopup?.title}
                  desc={showConfirmationPopup?.desc}
                  primaryBtnText={showConfirmationPopup?.primaryBtnText}
                  secondaryBtnText={showConfirmationPopup?.secondaryBtnText}
                  secondaryBtnStyle="tm-btn2-red"
                />
              )}

              {examList?.length > 0 ? (
                <>
                  <div className="flex justify-end my-4">
                    <Permission
                      permissionId={
                        PERMISSION_CONSTANTS.academicPlannerController_upsert_create
                      }
                    >
                      <div
                        className="flex tm-btn2-white-blue w-44 ml-3 whitespace-nowrap"
                        onClick={() => {
                          setSliderScreen(EPC.SCN_SLI_CREATE_EXAM)
                          handleCreateScheduleClickEvent()
                        }}
                      >
                        {t('createSchedule')}
                      </div>
                    </Permission>
                  </div>

                  <ErrorBoundary>
                    {examList?.map((item) => (
                      <div
                        key={item?._id}
                        className="bg-white mb-4 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div
                            className="flex items-center cursor-pointer"
                            onClick={() =>
                              expandAllowed &&
                              setSelectedExam(
                                selectedExam?._id === item?._id ? null : item
                              )
                            }
                          >
                            <div className="w-52">
                              <div className="tm-hdg tm-hdg-16">
                                {item?.event_name}
                              </div>
                              <div className="tm-para tm-para-14 mt-2">
                                {t('examName')}
                              </div>
                            </div>
                            {selectedExam?._id !== item?._id && (
                              <div className="w-52">
                                <div className="tm-hdg tm-hdg-16">
                                  {[...item?.tfi_classes]
                                    .splice(0, 3)
                                    .map(({name}) => name)
                                    .join(', ')}{' '}
                                  {item?.tfi_classes?.length > 3 && (
                                    <span className="tm-para-12 tm-cr-bl-2">
                                      <Trans i18nKey="examPlanerPagetfiClassesLength">
                                        {(
                                          item.tfi_classes.length - 3
                                        ).toString()}
                                      </Trans>
                                    </span>
                                  )}
                                </div>
                                <div className="tm-para tm-para-14 mt-2">
                                  {t('classes')}
                                </div>
                              </div>
                            )}
                            {selectedExam?._id !== item?._id && (
                              <div className="w-52">
                                <div className="tm-hdg tm-hdg-16">{`${item?.convertedStartDate} - ${item?.convertedEndDate}`}</div>
                                <div className="tm-para tm-para-14 mt-2">
                                  {t('date')}
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center">
                            {selectedExam?._id === item?._id &&
                              publishData?.length > 0 &&
                              !item.exam_structure_ids && (
                                <>
                                  <div className="tm-hdg-14 tm-cr-og-1">
                                    {t('publishDraft')}
                                  </div>
                                  <Permission
                                    permissionId={
                                      PERMISSION_CONSTANTS.examController_updateSubjectsDetails_update
                                    }
                                  >
                                    <div
                                      className="tm-btn2-blue mx-6"
                                      onClick={publishAssessments}
                                    >
                                      {t('publishNow')}
                                    </div>
                                  </Permission>
                                </>
                              )}

                            {expandAllowed && !item.exam_structure_ids && (
                              <SubjectTooltipOptions
                                subjectItem={item}
                                options={EXAM_TOOLTIP_OPTIONS}
                                trigger={
                                  <img
                                    src="https://storage.googleapis.com/tm-assets/icons/secondary/settings-dots-secondary.svg"
                                    alt=""
                                    className="w-4 h-4"
                                  />
                                }
                                handleChange={handleChange}
                              />
                            )}
                            {expandAllowed && (
                              <img
                                className="w-3 h-3 ml-8"
                                src={
                                  selectedExam?._id === item?._id
                                    ? 'https://storage.googleapis.com/tm-assets/icons/primary/down-arrow-primary.svg'
                                    : 'https://storage.googleapis.com/tm-assets/icons/primary/right-arrow-primary.svg'
                                }
                                alt="arrow"
                                onClick={() =>
                                  setSelectedExam(
                                    selectedExam?._id === item?._id
                                      ? null
                                      : item
                                  )
                                }
                              />
                            )}
                          </div>
                        </div>

                        {expandAllowed && selectedExam?._id === item?._id && (
                          <div
                            className={'flex justify-between items-center py-4'}
                          >
                            <ExamPlannerTable
                              selectedExam={selectedExam}
                              setPublishData={setPublishData}
                              hasExamStructure={item.exam_structure_ids}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </ErrorBoundary>
                </>
              ) : (
                <div className="mt-20">
                  <EmptyScreenV1
                    image={emptyExamImage}
                    title=""
                    desc={t('createScheduleEmptyScreenDesc')}
                    btnText={t('createSchedule')}
                    handleChange={() => {
                      setSliderScreen(EPC.SCN_SLI_CREATE_EXAM)
                      handleCreateScheduleClickEvent()
                    }}
                    btnType="primary"
                    permissionId={
                      PERMISSION_CONSTANTS.academicPlannerController_upsert_create
                    }
                  />
                </div>
              )}
              <div>{getSliderScreen(sliderScreen)}</div>

              <DeleteExam
                selectedExam={deleteExam}
                setDeleteExam={setDeleteExam}
                getExamScheduleList={getExamScheduleList}
              />
            </div>
          )}
        </ErrorBoundary>
      </div>
    </>
  )
}
