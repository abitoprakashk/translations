import {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useTranslation} from 'react-i18next'
import {showToast} from '../../../../../redux/actions/commonAction'
import {utilsGetExamSubjectDetails} from '../../../../../routes/examPlanner'
import {events} from '../../../../../utils/EventsConstants'
import {EXAM_TYPES} from '../../../../../utils/ExamPlannerConstants'
import ConfirmationPopup from '../../../../../components/Common/ConfirmationPopup/ConfirmationPopup'
import Loader from '../../../../../components/Common/Loader/Loader'
import {deleteCalendarItem} from '../../../apiService'
export default function DeleteExam({
  selectedExam,
  setDeleteExam,
  getExamScheduleList,
}) {
  if (!selectedExam) return null

  const [examDetails, setExamDetails] = useState(null)
  const [getExamSubjectDetailsLoading, setGetExamSubjectDetailsLoading] =
    useState(false)
  const [deleteExamLoading, setDeleteExamLoading] = useState(false)

  const dispatch = useDispatch()
  const {t} = useTranslation()
  const {instituteInfo, eventManager} = useSelector((state) => state)
  const setToastData = (type, message) => dispatch(showToast({type, message}))

  useEffect(() => {
    getExamSubjectDetails()
  }, [selectedExam])

  const getExamSubjectDetails = () => {
    if (selectedExam?._id) {
      setGetExamSubjectDetailsLoading(true)
      utilsGetExamSubjectDetails(instituteInfo?._id, selectedExam?._id)
        .then(({obj}) => {
          setExamDetails(obj[selectedExam?._id])
        })
        .catch(() => setToastData('error', t('unableToGetAssessments')))
        .finally(() => setGetExamSubjectDetailsLoading(false))
    }
  }

  const getPopup = (examDetails) => {
    if (examDetails) {
      const assessmentNum = examDetails?.subject_details?.filter(
        ({status}) => status !== EXAM_TYPES.HOLIDAY
      )?.length

      return (
        <ConfirmationPopup
          onClose={() => setDeleteExam(null)}
          onAction={() => {
            if (assessmentNum > 0) setDeleteExam(null)
            else deleteExam(selectedExam?._id)
          }}
          icon={
            assessmentNum > 0
              ? 'https://storage.googleapis.com/tm-assets/icons/colorful/warning-orange.svg'
              : 'https://storage.googleapis.com/tm-assets/icons/colorful/remove-bg-red.svg'
          }
          title={
            assessmentNum > 0
              ? t('deleteTheExamSchedulePopupTitle2')
              : t('deleteTheExamSchedulePopupTitle1')
          }
          desc={
            assessmentNum > 0 ? (
              <span className="tm-cr-og-1">
                {t('deleteTheExamSchedulePopupDesc1')}
              </span>
            ) : (
              t('deleteTheExamSchedulePopupDesc2')
            )
          }
          primaryBtnText={t('cancel')}
          secondaryBtnText={assessmentNum > 0 ? t('edit') : t('delete')}
          secondaryBtnStyle={assessmentNum > 0 ? '' : 'tm-btn2-red'}
        />
      )
    }
    return null
  }

  const deleteExam = (examId) => {
    if (instituteInfo?._id && examId) {
      setDeleteExamLoading(true)
      deleteCalendarItem(examId)
        .then(() => {
          getExamScheduleList()
          setToastData('success', t('examScheduleSuccessfullyDeleted'))
          eventManager.send_event(events.EXAM_SCHEDULE_DELETED_TFI, {
            exam_name: selectedExam?.exam_name,
          })
        })
        .catch(() => setToastData('error', t('unableToDeleteExamSchedule')))
        .finally(() => {
          setDeleteExam(null)
          setDeleteExamLoading(false)
        })
    }
  }

  return (
    <div>
      <Loader show={getExamSubjectDetailsLoading || deleteExamLoading} />
      {getPopup(examDetails)}
    </div>
  )
}
