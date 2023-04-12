import {
  Badges,
  Button,
  BUTTON_CONSTANTS,
  EmptyState,
  Heading,
  HEADING_CONSTANTS,
  Para,
  PARA_CONSTANTS,
  PlainCard,
} from '@teachmint/krayon'
import classNames from 'classnames'
import {t} from 'i18next'
import React, {useEffect, useState} from 'react'
import {useDispatch} from 'react-redux'
import Permission from '../../../../components/Common/Permission/Permission'
import {showLoadingAction} from '../../../../redux/actions/commonAction'
import {utilsGetStudentBasedAttendanceSummary} from '../../../../routes/instituteSystem'
import {PERMISSION_CONSTANTS} from '../../../../utils/permission.constants'
import AssignToClassModal from '../../../StudentManagement/components/AssignToClassModal/AssignToClassModal'
import SectionOverviewCard from '../../../StudentManagement/components/SectionOverviewCard/SectionOverviewCard'
import styles from './StudentAttendanceCard.module.css'

export default function StudentAttendanceCard({currentStudent}) {
  const [data, setData] = useState(null)
  const [showAssignClassModal, setShowAssignClassModal] = useState(false)

  const dispatch = useDispatch()

  useEffect(() => {
    if (currentStudent?._id && currentStudent?.hierarchy_nodes?.[0]) {
      dispatch(showLoadingAction(true))
      utilsGetStudentBasedAttendanceSummary(currentStudent._id)
        .then(({obj}) => setData(obj))
        .catch(() => {})
        .finally(() => dispatch(showLoadingAction(false)))
    }
  }, [currentStudent])

  return (
    <SectionOverviewCard
      cardLabel={
        <>
          <Para
            type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
            className={styles.cardLabel}
          >
            {t('attendance')}
          </Para>

          {currentStudent?.hierarchy_nodes?.[0] && (
            <Badges
              label={`${t('today')} - ${t(
                data?.todays_status === 'NOT_MARKED'
                  ? 'notMarked'
                  : data?.todays_status === 'ABSENT'
                  ? 'absent'
                  : 'present'
              )}`}
              showIcon={false}
              className={classNames(
                styles.statusBadge,
                data?.todays_status === 'PRESENT' ? styles.presentBadge : '',
                data?.todays_status === 'ABSENT' ? styles.absentBadge : ''
              )}
            />
          )}
        </>
      }
      icon="people2"
      classes={{header: styles.header, iconFrame: styles.iconFrame}}
    >
      {currentStudent?.hierarchy_nodes?.[0] ? (
        <div className={styles.body}>
          <PlainCard className={styles.overviewItem}>
            <Heading
              type={HEADING_CONSTANTS.TYPE.SUCCESS}
              textSize={HEADING_CONSTANTS.TEXT_SIZE.SMALL}
              className={styles.overviewItemValue}
            >
              {(data?.percentage || 0) + '%'}
            </Heading>

            <Para>{t('totalAttendance')}</Para>
          </PlainCard>

          <PlainCard className={styles.overviewItem}>
            <div className={styles.totalDaysCardValueWrapper}>
              <Heading
                textSize={HEADING_CONSTANTS.TEXT_SIZE.SMALL}
                className={styles.overviewItemValue}
              >
                {data?.no_of_present_days || 0}
              </Heading>
              <Heading
                type={HEADING_CONSTANTS.TYPE.TEXT_SECONDARY}
                textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}
                className={styles.overviewItemValue}
              >
                {'/' + (data?.no_of_working_days || 0)}
              </Heading>
            </div>

            <Para>{t('totalPresentDays')}</Para>
          </PlainCard>
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
