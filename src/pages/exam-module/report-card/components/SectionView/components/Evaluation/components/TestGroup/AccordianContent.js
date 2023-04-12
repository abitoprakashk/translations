import React, {useEffect} from 'react'
import {EmptyState, Para, PARA_CONSTANTS} from '@teachmint/krayon'
import {useDispatch, useSelector} from 'react-redux'
import {getTermEvaluationDetails} from '../../../../../../redux/actions'
import SubjectList from '../SubjectList/SubjectList'

import styles from './TestGroup.module.css'
import Loader from '../../../../../../../../../components/Common/Loader/Loader'
import {EVALUATION_TYPE} from '../../../../../../constants'
import {events} from '../../../../../../../../../utils/EventsConstants'
import {useTranslation} from 'react-i18next'

const childTypeMap = {
  'co-scholastic': EVALUATION_TYPE.CO_SCHOLASTIC,
  attendance: EVALUATION_TYPE.ATTENDANCE,
  remarks: EVALUATION_TYPE.REMARKS,
  results: EVALUATION_TYPE.RESULTS,
}

const AccordionContent = ({termId, scholastic, classId, sectionId}) => {
  const dispatch = useDispatch()
  const {t} = useTranslation()
  const eventManager = useSelector((state) => state.eventManager)
  const tests = useSelector(
    (state) =>
      state.reportCard.evaluationDetails?.[
        `${scholastic ? termId : 'other'}/${sectionId}`
      ]
  )

  const {loading, data = []} = tests || {}

  useEffect(() => {
    if (data.length == 0)
      dispatch(
        getTermEvaluationDetails({
          term_id: scholastic ? termId : 'other',
          evaluation_type: scholastic
            ? EVALUATION_TYPE.SCHOLASTIC
            : EVALUATION_TYPE.OTHER,
          section_id: sectionId,
          class_id: classId,
        })
      )

    eventManager.send_event(
      events.REPORT_CARD_EVALUATION_TERM_TAB_CLICKED_TFI,
      {
        class_id: classId,
        section_id: sectionId,
        tab_type: scholastic ? 'term' : 'other',
        term_id: scholastic ? termId : null,
      }
    )
  }, [])

  return (
    <>
      <Loader
        show={loading}
        style={{position: 'absolute', width: '100%', height: '100%'}}
      />
      {data.length > 0
        ? data.map(({testName, subjects, testId}) =>
            subjects.length > 0 ? (
              <div key={testId}>
                <Para
                  textSize={PARA_CONSTANTS.TEXT_SIZE.LARGE}
                  type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
                  className={styles.testName}
                >
                  {testName}
                </Para>
                <SubjectList
                  list={subjects}
                  type={
                    scholastic
                      ? EVALUATION_TYPE.SCHOLASTIC
                      : childTypeMap[testName]
                  }
                />
              </div>
            ) : null
          )
        : !scholastic && (
            <EmptyState
              iconName="assignment"
              content={t('emptyCoscholasticPlaceholder')}
              button={false}
              classes={{iconFrame: styles.white, wrapper: styles.emptyState}}
            />
          )}
    </>
  )
}

export default React.memo(AccordionContent)
