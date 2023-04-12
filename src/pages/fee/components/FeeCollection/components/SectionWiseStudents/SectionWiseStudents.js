import {useDispatch, useSelector} from 'react-redux'
import styles from './SectionWiseStudents.module.css'
import classNames from 'classnames'
import {
  Button,
  BUTTON_CONSTANTS,
  Icon,
  ICON_CONSTANTS,
  EmptyState,
  Avatar,
  Para,
} from '@teachmint/krayon'
import {
  getAmountFixDecimalWithCurrency,
  truncateTextWithTooltip,
} from '../../../../../../utils/Helpers'
import feeCollectionActionTypes from '../../../../redux/feeCollectionActionTypes'
import {useFeeCollection} from '../../../../redux/feeCollectionSelectors'
import {
  setSliderScreenAction,
  feeReminderRequestedAction,
} from '../../../../redux/feeCollectionActions'
import {
  STUDENT_NAME_SECTION_TRUNCATE_LIMIT,
  SECTION_WISE_FILTER,
  SliderScreens,
} from '../../../../fees.constants'
import StudentDetailsShimmer from '../StudentDetailsShimmer/StudentDetailsShimmer'
import SubjectTooltipOptions from '../../../../../../components/SchoolSystem/SectionDetails/SubjectTooltipOptions'
import {useMemo} from 'react'
import {useTranslation} from 'react-i18next'
import {events} from '../../../../../../utils/EventsConstants'
import {PERMISSION_CONSTANTS} from '../../../../../../utils/permission.constants'
import Permission from '../../../../../../components/Common/Permission/Permission'
import {ErrorBoundary} from '@teachmint/common'
import SectionCard from './SectionCard'
import SectionOverview from './SectionOverview'
import {useFeeCollectionContext} from '../../../context/FeeCollectionContext/FeeCollectionContext'
import Dot from '../../../../../../assets/images/icons/dot.svg'

export default function SectionWiseStudents({
  studentsData,
  sections,
  selectedSection,
  handleCollectFeeClick,
  sendClickEvent,
  studentsDataLoder = false,
}) {
  const {t} = useTranslation()
  const instituteInfo = useSelector((state) => state.instituteInfo)
  const eventManager = useSelector((state) => state.eventManager)
  const dispatch = useDispatch()
  const {studentDuesLoading} = useFeeCollection()
  const {selectedFilter} = useFeeCollectionContext()

  const filteredStudents = useMemo(() => {
    return studentsData.filter((student) =>
      selectedFilter === SECTION_WISE_FILTER.due.value
        ? student.totalDue !== 0
        : selectedFilter === SECTION_WISE_FILTER.paid.value
        ? student.totalDue === 0
        : true
    )
  }, [studentsData, selectedFilter])

  return (
    <ErrorBoundary>
      <div className={styles.content}>
        <div className={styles.classesContainer}>
          <div className={styles.sectionContainer}>
            <div className={styles.sectionHeader}>
              <span className={styles.classHeaderSectionName}>
                {t('classes')}
              </span>
            </div>
            <div
              className={classNames(
                styles.sectionList,
                'show-scrollbar show-scrollbar-small'
              )}
            >
              {sections.map((section, i) => {
                return <SectionCard key={i} section={section} />
              })}
            </div>
          </div>
          {(studentDuesLoading || studentsDataLoder) && (
            <div className={styles.studentDetailsShimmerWrapper}>
              {[...Array(3)].map((item, idx) => {
                return <StudentDetailsShimmer key={`${item}${idx}`} />
              })}
            </div>
          )}
          {selectedSection &&
            !studentDuesLoading &&
            !studentsDataLoder &&
            studentsData.length == 0 && (
              <div className={styles.studentListEmptyState}>
                <EmptyState
                  button={false}
                  iconName={'students'}
                  content={t('noStudentInSection')}
                />
              </div>
            )}
          {selectedSection &&
            !studentDuesLoading &&
            !studentsDataLoder &&
            studentsData.length > 0 && (
              <div className={styles.classSectionContainer}>
                <SectionOverview />
                <div
                  className={classNames(
                    styles.studentList,
                    'show-scrollbar show-scrollbar-small'
                  )}
                >
                  {filteredStudents.length === 0 ? (
                    <div className={styles.studentListFilterEmptyState}>
                      <EmptyState
                        button={false}
                        iconName={'students'}
                        content={t('noStudentInSelectedFilter')}
                      />
                    </div>
                  ) : (
                    filteredStudents.map((student, i) => {
                      return (
                        <div key={i} className={styles.studentTile}>
                          {student.name && (
                            <div
                              className={styles.studentProfile}
                              onClick={() => {
                                dispatch(
                                  setSliderScreenAction(
                                    SliderScreens.STUDENT_DETAILS_SLIDER,
                                    student
                                  )
                                )
                              }}
                            >
                              <Avatar
                                imgSrc={student.pic_url}
                                name={student.name}
                                onClick={() => {}}
                                size={'l'}
                              />
                              <div className={styles.studentNameWrapper}>
                                <span className={styles.studentName}>
                                  {truncateTextWithTooltip(
                                    student.name,
                                    STUDENT_NAME_SECTION_TRUNCATE_LIMIT
                                  )}
                                </span>
                                <div className="flex gap-2 items-center">
                                  {student.phoneNumber && (
                                    <div className="flex">
                                      <Icon
                                        name="call"
                                        size={ICON_CONSTANTS.SIZES.XX_SMALL}
                                        type={ICON_CONSTANTS.TYPES.SECONDARY}
                                      />
                                      <Para>{student.phoneNumber}</Para>
                                    </div>
                                  )}
                                  {student?.enrollmentNumber && (
                                    <div className="flex gap-2 items-center">
                                      <img src={Dot} />
                                      <Para>
                                        {t('studentEnrolmentID', {
                                          enrollmentNumber:
                                            student?.enrollmentNumber,
                                        })}
                                      </Para>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                          <div className={styles.studentPaidFee}>
                            <Para className={styles.paidText}>
                              {t('totalPaid')}
                            </Para>
                            <span className={styles.studentPaidFeeAmount}>
                              {getAmountFixDecimalWithCurrency(
                                student.totalPaid ?? 0,
                                instituteInfo.currency
                              )}
                            </span>
                          </div>
                          <div className={styles.studentDueFee}>
                            <Para className={styles.dueText}>
                              {t('totalDue')}
                            </Para>
                            <div className={styles.studentDueFeeAmount}>
                              {getAmountFixDecimalWithCurrency(
                                student.totalDue ?? 0,
                                instituteInfo.currency
                              )}
                            </div>
                          </div>
                          <div className={styles.studentActions}>
                            <Permission
                              permissionId={
                                PERMISSION_CONSTANTS.feeModuleController_feeStudentPayment_create
                              }
                            >
                              <Button
                                size={BUTTON_CONSTANTS.SIZE.LARGE}
                                onClick={() => {
                                  handleCollectFeeClick(student.Id)
                                  sendClickEvent(
                                    events.RECORD_PAYMENT_INITIALIZED_TFI,
                                    {
                                      student_id: student.Id,
                                      screen_name: 'classroom_fee_details',
                                    }
                                  )
                                }}
                                type="filled"
                              >
                                {t('collect')}
                              </Button>
                            </Permission>
                            <SubjectTooltipOptions
                              subjectItem={i}
                              options={[
                                {
                                  label: t('sendReminder'),
                                  action: () => {
                                    dispatch(
                                      feeReminderRequestedAction(
                                        Array(student.Id)
                                      )
                                    )
                                    sendClickEvent(
                                      events.FEE_REMINDER_SENT_TFI,
                                      {
                                        screen_name: 'class_page',
                                        student_id: student.Id,
                                      }
                                    )
                                  },
                                  permissionId:
                                    PERMISSION_CONSTANTS.feeModuleController_sendFeeReminder_create,
                                },
                                {
                                  label: t('downloadDD'),
                                  action: () => {
                                    dispatch({
                                      type: feeCollectionActionTypes.DOWNLOAD_DEMAND_LETTER_REQUESTED,
                                      payload: {
                                        studentId: student.Id,
                                        eventManager,
                                      },
                                    })
                                    sendClickEvent(
                                      events.DEMAND_LETTER_DOWNLOADED_TFI,
                                      {
                                        screen_name: 'class_page',
                                        student_id: student.Id,
                                      }
                                    )
                                  },
                                },
                              ]}
                              trigger={
                                <span
                                  data-size="x_s"
                                  data-qa="icon-moreVertical"
                                  className="icon-moreVertical_outlined krayon__Icon-module__eRVVq krayon__Icon-module__szG-X SectionWiseStudents_studentMoreActionIcon__1Bl2U"
                                  data-type="primary"
                                ></span>
                              }
                              handleChange={(action) => action()}
                            />
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            )}
        </div>
      </div>
    </ErrorBoundary>
  )
}
