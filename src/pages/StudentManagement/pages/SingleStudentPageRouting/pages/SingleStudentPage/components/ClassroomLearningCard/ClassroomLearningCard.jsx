import {
  Button,
  BUTTON_CONSTANTS,
  EmptyState,
  Heading,
  HEADING_CONSTANTS,
  Para,
  PlainCard,
} from '@teachmint/krayon'
import {t} from 'i18next'
import React, {useState} from 'react'
import {useEffect} from 'react'
import {useDispatch} from 'react-redux'
import {useRouteMatch} from 'react-router-dom'
import Permission from '../../../../../../../../components/Common/Permission/Permission'
import history from '../../../../../../../../history'
import {
  showErrorOccuredAction,
  showLoadingAction,
} from '../../../../../../../../redux/actions/commonAction'
import {PERMISSION_CONSTANTS} from '../../../../../../../../utils/permission.constants'
import AssignToClassModal from '../../../../../../components/AssignToClassModal/AssignToClassModal'
import SectionOverviewCard from '../../../../../../components/SectionOverviewCard/SectionOverviewCard'
import {SINGLE_STUDENT_CLASSROOM_LEARNING_ROUTE} from '../../../../SingleStudentPageRouting'
import {
  fetchStudentWiseHomeworkData,
  fetchStudentWiseTestData,
} from '../../../ClassroomLearningPage/classroomLearning.apis'
import styles from './ClassroomLearningCard.module.css'

export default function ClassroomLearningCard({currentStudent}) {
  const [homeworkData, setHomeworkData] = useState(null)
  const [testData, setTestData] = useState(null)
  const [showAssignClassModal, setShowAssignClassModal] = useState(false)

  const dispatch = useDispatch()
  let {url} = useRouteMatch()

  useEffect(() => {
    if (currentStudent?._id) {
      fetchHomewordData(currentStudent._id)
      fetchTestData(currentStudent._id)
    }
  }, [currentStudent?._id])

  const fetchHomewordData = (iid) => {
    dispatch(showLoadingAction(true))
    fetchStudentWiseHomeworkData(iid)
      .then(({obj}) => setHomeworkData(obj))
      .catch(() => dispatch(showErrorOccuredAction(true)))
      .finally(() => dispatch(showLoadingAction(false)))
  }

  const fetchTestData = (iid) => {
    dispatch(showLoadingAction(true))
    fetchStudentWiseTestData(iid)
      .then(({obj}) => setTestData(obj))
      .catch(() => dispatch(showErrorOccuredAction(true)))
      .finally(() => dispatch(showLoadingAction(false)))
  }

  const items = [
    {
      label: 'homeworkSubmissions',
      value: homeworkData?.total_submissions || 0,
      total: homeworkData?.total_assigned || 0,
    },
    {
      label: 'testsSubmissions',
      value: testData?.total_submissions || 0,
      total: testData?.total_assigned || 0,
    },
  ]

  return (
    <SectionOverviewCard
      cardLabel={t('classroomLearning')}
      icon="file"
      classes={{header: styles.header, iconFrame: styles.iconFrame}}
      actionLabel={currentStudent?.hierarchy_nodes?.[0] ? t('view') : ''}
      actionHandle={() =>
        history.push(`${url}${SINGLE_STUDENT_CLASSROOM_LEARNING_ROUTE}`)
      }
      actionShowInMobile={false}
    >
      {currentStudent?.hierarchy_nodes?.[0] ? (
        <div className={styles.body}>
          {items?.map(({label, value, total}, i) => (
            <PlainCard key={i} className={styles.overviewItem}>
              <div className={styles.totalDaysCardValueWrapper}>
                <Heading
                  textSize={HEADING_CONSTANTS.TEXT_SIZE.SMALL}
                  className={styles.overviewItemValue}
                >
                  {value}
                </Heading>
                <Heading
                  type={HEADING_CONSTANTS.TYPE.TEXT_SECONDARY}
                  textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}
                  className={styles.overviewItemValue}
                >
                  /{total}
                </Heading>
              </div>

              <Para>{t(label)}</Para>
            </PlainCard>
          ))}
        </div>
      ) : (
        <EmptyState
          iconName="personAddRight"
          content={
            <div>
              <Para>{t('noClassAassigned')}</Para>
              <Permission
                permissionId={
                  PERMISSION_CONSTANTS.instituteClassController_moveStudentSection_update
                }
              >
                <Button
                  onClick={() => {
                    setShowAssignClassModal(true)
                  }}
                  classes={{button: styles.emptyButtonWrapper}}
                  type={BUTTON_CONSTANTS.TYPE.TEXT}
                >
                  {t('assign')}
                </Button>
              </Permission>
            </div>
          }
          button={null}
          classes={{iconFrame: styles.emptyStateIconFrame}}
        />
      )}

      {showAssignClassModal && (
        <AssignToClassModal
          showModal={showAssignClassModal}
          setShowModal={setShowAssignClassModal}
          student={currentStudent}
          screenName="attendance_card"
        />
      )}
    </SectionOverviewCard>
  )
}
