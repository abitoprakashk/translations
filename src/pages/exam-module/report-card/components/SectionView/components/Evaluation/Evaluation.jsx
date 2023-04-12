import {lazy, Suspense, useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import classNames from 'classnames'
import {createPortal} from 'react-dom'
import {useParams} from 'react-router-dom'
import {Button, BUTTON_CONSTANTS} from '@teachmint/krayon'
import TestGroup from './components/TestGroup/TestGroup'
import {useDispatch, useSelector} from 'react-redux'
import Loader from '../../../../../../../components/Common/Loader/Loader'

import styles from './Evaluation.module.css'
import {
  getSectionEvaluationStructure,
  getTermEvaluationDetails,
} from '../../../../redux/actions'
import BulkUpload from '../Evaluation/components/BulkUpload/BulkUpload'
import {events} from '../../../../../../../utils/EventsConstants'
import {EVALUATION_TYPE} from '../../../../constants'

const StudentEvaluationDrawer = lazy(() =>
  import('./components/StudentEvaluationDrawer/StudentEvaluationDrawer')
)

const Evaluation = () => {
  const dispatch = useDispatch()
  const {t} = useTranslation()
  const sectionEvaluationStructure = useSelector(
    (state) => state.reportCard.sectionEvaluationStructure
  )
  const evaluationDetails = useSelector(
    (state) => state.reportCard.evaluationDetails
  )

  const updatedFromCSV = useSelector((state) => state.reportCard.updatedFromCSV)

  const eventManager = useSelector((state) => state.eventManager)

  const {sectionId, standardId: classId} = useParams()
  const [isSliderOpen, setIsSliderOpen] = useState(false)
  const [portalEl, setPortalEl] = useState(null)

  const getSectionEvaluationStructureData = () => {
    dispatch(
      getSectionEvaluationStructure({
        section_id: sectionId,
        class_id: classId,
      })
    )
  }

  useEffect(() => {
    setPortalEl(document.getElementById('reportcardCtaWrapper'))
    getSectionEvaluationStructureData()
  }, [])

  useEffect(() => {
    const cardClickHandler = (e) => {
      if (!e.target.closest('[data-name="subject-card"]')) {
        document.cardList.subjectcard.value = 'none'
      }
    }

    document.cardList.addEventListener('click', cardClickHandler)
    return () =>
      document.cardList?.removeEventListener('click', cardClickHandler)
  }, [])

  const {loading, data} = sectionEvaluationStructure || {}
  const scholastic = (data || {})?.scholastic || []
  const others = (data || {})?.other || {}

  useEffect(() => {
    if (updatedFromCSV) {
      getSectionEvaluationStructureData()
      if (evaluationDetails[`other/${sectionId}`]) {
        dispatch(
          getTermEvaluationDetails({
            term_id: 'other',
            evaluation_type: EVALUATION_TYPE.OTHER,
            section_id: sectionId,
            class_id: classId,
          })
        )
      }
      scholastic.map(({term_id}) => {
        if (evaluationDetails[`${term_id}/${sectionId}`]) {
          dispatch(
            getTermEvaluationDetails({
              term_id,
              section_id: sectionId,
              class_id: classId,
              evaluation_type: EVALUATION_TYPE.SCHOLASTIC,
            })
          )
        }
      })
    }
  }, [updatedFromCSV, sectionId, classId, evaluationDetails, scholastic])

  return (
    <div className={styles.relative}>
      <Loader
        show={loading}
        style={{position: 'absolute', width: '100%', height: '100%'}}
      />
      {portalEl &&
        createPortal(
          <Button
            type={BUTTON_CONSTANTS.TYPE.OUTLINE}
            prefixIcon="uploadAlt"
            onClick={() => {
              eventManager.send_event(
                events.REPORT_CARD_UPLOAD_CSV_CLICKED_TFI,
                {
                  class_id: classId,
                  section_id: sectionId,
                }
              )
              setIsSliderOpen(true)
            }}
          >
            {t('uploadCsv')}
          </Button>,
          portalEl
        )}
      <form
        name="cardList"
        className={classNames(styles.flex, styles.flexColumn)}
      >
        <input type="radio" name="subjectcard" hidden value="none" />
        {scholastic.map((scholasticData) => (
          <TestGroup
            key={scholasticData.term_id}
            heading={scholasticData.term_name}
            data={scholasticData}
            scholastic
            sectionId={sectionId}
            classId={classId}
          />
        ))}
        <TestGroup
          heading="Other"
          data={others}
          sectionId={sectionId}
          classId={classId}
        />
      </form>
      <Suspense>
        <StudentEvaluationDrawer />
      </Suspense>
      <div
        id="evaluationDrawerModals"
        className={styles.evaluationDrawerModals}
      />
      {isSliderOpen && (
        <BulkUpload setIsSliderOpen={setIsSliderOpen} sectionId={sectionId} />
      )}
    </div>
  )
}

export default Evaluation
