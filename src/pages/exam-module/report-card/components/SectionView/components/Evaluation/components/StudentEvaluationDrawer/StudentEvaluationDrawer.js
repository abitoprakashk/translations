import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {
  Alert,
  ALERT_CONSTANTS,
  Button,
  BUTTON_CONSTANTS,
  Divider,
  Drawer,
  DRAWER_CONSTANTS,
  Heading,
  HEADING_CONSTANTS,
  Icon,
  ICON_CONSTANTS,
  Para,
} from '@teachmint/krayon'
import {useDispatch, useSelector} from 'react-redux'
import {
  closeEvaluationDrawer,
  getSectionEvaluationStructure,
  getTermEvaluationDetails,
} from '../../../../../../redux/actions'

import EvaluationInfo from './components/EvaluationInfo/EvaluationInfo'
import Filters from './components/Filters/Filters'
import TotalMetric from './components/TotalMetric/TotalMetric'
import styles from './StudentEvaluationDrawer.module.css'
import StudentList from './components/StudentList/StudentList'
import {
  sectionEvaluationDetails,
  sectionOthersDetails,
  sendOthersNotification,
  sendScholasticNotification,
  updateAttendanceTotalMetric,
  updateScholasticTotalMetric,
  updateSectionOthersDetails,
  updateSectionScholasticDetails,
} from '../../../../../../apiService'
import useSearchFilter from '../../../../../../../../../hooks/useSearchFilter'
import useSort from '../../../../../../../../../hooks/useSort'
import usePendingOnlyFilter from './hooks/usePendingOnlyFilter'
import Loader from '../../../../../../../../../components/Common/Loader/Loader'
import {ErrorBoundary} from '@teachmint/common'
import {diffChecker} from './utils/diffChecker'
import {evaluationAlertMessage, evaluationHeading} from './utils/uiTexts'
import classNames from 'classnames'
import {IS_MOBILE} from '../../../../../../../../../constants'
import {
  EVALUATION_TYPE,
  EVALUATION_DURATION_TYPE,
} from '../../../../../../constants'
import {
  showErrorToast,
  showSuccessToast,
} from '../../../../../../../../../redux/actions/commonAction'
import {useTranslation} from 'react-i18next'
import Spinner from '../../../../../../../../../components/Common/Krayon/Spinner'
import {events} from '../../../../../../../../../utils/EventsConstants'
import Permission from '../../../../../../../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../../../../../../utils/permission.constants'
import {useCheckPermission} from '../../../../../../../../../utils/Permssions'

const getTeacherId = ({teacher, co_teachers = []}) =>
  teacher?._id || co_teachers?.map(({_id}) => _id).join(',')

const maxDaysAllowed = {
  [EVALUATION_DURATION_TYPE.OVERALL]: 366,
  [EVALUATION_DURATION_TYPE.TERM]: 366,
  [EVALUATION_DURATION_TYPE.MONTH]: 31,
}

const StudentEvaluationDrawer = () => {
  const dispatch = useDispatch()
  const {t} = useTranslation()
  const {open, data: drawerData} = useSelector(
    (state) => state.reportCard.evaluationDrawer
  )

  const evaluation_type = drawerData?.type
  const duration_type = drawerData?.duration_type

  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({})
  const [studentList, setStudentList] = useState([])
  const [metric, setMetric] = useState({})
  const [commitedMetric, setCommitedMetric] = useState({})
  const [totalMetric, setTotalMetric] = useState(0)
  const [saving, setSaving] = useState(false)
  const [notificationSent, setNotificationSent] = useState(false)

  const eventManager = useSelector((state) => state.eventManager)

  const hasPermissionToSendScholasticNotification = useCheckPermission(
    PERMISSION_CONSTANTS.reportCardEvaluationController_sendScholasticSingleNotification_update
  )
  const hasPermissionToSendOtherNotification = useCheckPermission(
    PERMISSION_CONSTANTS.reportCardEvaluationController_sendOtherSingleNotification_update
  )

  const totalMetricRef = useRef()

  const onClose = useCallback(() => {
    dispatch(closeEvaluationDrawer())
  }, [])

  const {total_students, total_students_result_count} = data || {}

  const isEvaluationCompleted = () =>
    total_students == total_students_result_count

  const {
    query,
    setQuery,
    filteredList: searchStudentList,
  } = useSearchFilter({
    list: studentList || [],
    compare: (item, trimmedQuery) =>
      item.name?.toLowerCase().includes(trimmedQuery) ||
      item.roll_number?.toLowerCase().includes(trimmedQuery),
  })

  const {
    active: pendingOnly,
    setActive,
    filteredList,
  } = usePendingOnlyFilter({
    list: searchStudentList || [],
    type: evaluation_type,
  })

  const {sortedList: sortedStudentList, setActive: setActiveSort} = useSort({
    list: filteredList || [],
  })

  const sendFilterEvents = useCallback(
    (eventName) => {
      const {class_id, section_id, type} = drawerData
      eventManager.send_event(eventName, {
        class_id,
        section_id,
        screen_name: 'subject_exam',
        teacher_id: getTeacherId(drawerData),
        type,
      })
    },
    [drawerData]
  )

  const setPending = useCallback(({value}) => setActive(value), [setActive])

  const {hasChanged, changes} = useMemo(
    () => diffChecker(commitedMetric, metric, ['value', 'isAbsent']),
    [metric]
  )

  useEffect(() => {
    if (open) {
      setLoading(true)
      const {
        section_id,
        class_id,
        assessment_id,
        subject_id,
        type,
        duration_type,
        duration_type_id,
      } = drawerData
      const isScholastic = type == EVALUATION_TYPE.SCHOLASTIC

      if (isScholastic) {
        sectionEvaluationDetails({section_id, class_id, assessment_id})
          .then((res) => {
            if (res.status) {
              const {student_result, paper, ...rest} = res.obj
              setData(rest)
              setStudentList(student_result)
              const defaultMetric = student_result.reduce((acc, curr) => {
                acc[curr.iid] = {
                  value: !curr.is_absent
                    ? curr.score != null
                      ? String(curr.score)
                      : ''
                    : '',
                  isAbsent: !!curr.is_absent,
                  user_id: curr.user_id,
                  error: false,
                }
                return acc
              }, {})
              setCommitedMetric({...defaultMetric})
              setMetric({...defaultMetric})
              setTotalMetric(paper?.totalMarks || 0)
            } else dispatch(showErrorToast(t('somethingWentWrong')))
          })
          .catch(() => dispatch(showErrorToast(t('somethingWentWrong'))))
          .finally(() => setLoading(false))
      } else {
        sectionOthersDetails({
          section_id,
          class_id,
          subject_id,
          evaluation_type,
          duration_type,
          duration_type_id,
        })
          .then((res) => {
            if (res.status) {
              const {student_result, total_working_days, ...rest} = res.obj
              setData(rest)
              setStudentList(student_result)
              const defaultMetric = student_result.reduce((acc, curr) => {
                acc[curr.iid] = {
                  value:
                    evaluation_type == EVALUATION_TYPE.ATTENDANCE
                      ? curr.value != null && curr.value >= 0
                        ? String(curr.value)
                        : ''
                      : curr.value,
                  isAbsent: !!curr.is_absent,
                  user_id: curr.user_id,
                  error: false,
                }
                return acc
              }, {})
              setCommitedMetric({...defaultMetric})
              setMetric({...defaultMetric})
              setTotalMetric(total_working_days || 0)
            } else dispatch(showErrorToast(t('somethingWentWrong')))
          })
          .catch(() => dispatch(showErrorToast(t('somethingWentWrong'))))
          .finally(() => setLoading(false))
      }
    } else {
      setData({})
      setStudentList([])
      setMetric({})
      setCommitedMetric({})
      setTotalMetric(0)
      setActive(false)
      setQuery('')
      setActiveSort(false)
      setNotificationSent(false)
    }
  }, [open])

  const onSaveTotalMetric = useCallback(
    (total) => {
      const {
        class_id,
        section_id,
        term_id,
        assessment_id,
        duration_type,
        duration_type_id,
      } = drawerData

      eventManager.send_event(
        evaluation_type == EVALUATION_TYPE.SCHOLASTIC
          ? events.REPORT_CARD_EVALUATION_TOTAL_MARKS_EDIT_CLICKED_TFI
          : events.REPORT_CARD_EVALUATION_WORKING_DAYS_EDIT_CLICKED_TFI,
        {class_id, section_id, term_id, value: total}
      )

      const promise =
        evaluation_type == EVALUATION_TYPE.SCHOLASTIC
          ? updateScholasticTotalMetric({
              total: Number(total),
              section_id,
              assessment_id,
            })
          : updateAttendanceTotalMetric({
              total: Number(total),
              evaluation_type,
              section_id,
              duration_type,
              duration_type_id,
            })

      promise
        .then((res) => {
          if (res.status && res.obj) {
            setTotalMetric(total)
            dispatch(showSuccessToast('Total updated successfully'))
          } else {
            throw new Error()
          }
        })
        .catch(() => {
          totalMetricRef.current?.setTotal(totalMetric)
          dispatch(showErrorToast('Failed to update total value'))
        })
    },
    [drawerData, totalMetric]
  )

  const onSaveMetrics = useCallback(() => {
    setSaving(true)
    const {
      assessment_id,
      section_id,
      class_id,
      term_id,
      subject_id,
      test_id,
      type,
      duration_type,
      duration_type_id,
    } = drawerData

    const eventData = {
      class_id,
      section_id,
      term_id,
      exam_id: test_id,
      screen_name: 'subject_exam',
      teacher_id: getTeacherId(drawerData),
      type,
    }

    eventManager.send_event(
      events.REPROT_CARD_EVALUATION_SAVE_CHANGES_CLICKED_TFI,
      eventData
    )

    if (type == EVALUATION_TYPE.SCHOLASTIC) {
      updateSectionScholasticDetails({
        assessment_id,
        submissions: Object.entries(changes).map(
          ([iid, {value, isAbsent, user_id}]) => ({
            marks: value === '' ? null : Number(value),
            is_absent: isAbsent,
            userId: user_id,
            iid,
          })
        ),
      })
        .then((res) => {
          if (res.status) {
            dispatch(showSuccessToast('Evaluation saved successfully'))
            dispatch(getSectionEvaluationStructure({section_id, class_id}))
            dispatch(
              getTermEvaluationDetails({
                term_id,
                section_id,
                class_id,
                evaluation_type,
              })
            )
            eventManager.send_event(
              events.REPORT_CARD_EVALUATION_CHANGES_SAVED_TFI,
              eventData
            )
            onClose()
          } else {
            dispatch(showErrorToast(t('somethingWentWrong')))
          }
        })
        .catch(() => {
          dispatch(showErrorToast(t('somethingWentWrong')))
        })
        .finally(() => setSaving(false))
    } else {
      updateSectionOthersDetails({
        assessment_id,
        section_id,
        evaluation_type: type,
        duration_type,
        duration_type_id,
        ...(evaluation_type == EVALUATION_TYPE.CO_SCHOLASTIC
          ? {subject_id}
          : {}),
        submissions: Object.entries(changes).map(([iid, {value, user_id}]) => ({
          value:
            evaluation_type == EVALUATION_TYPE.ATTENDANCE
              ? value === ''
                ? null
                : Number(value)
              : value,
          userId: user_id,
          iid,
        })),
      })
        .then((res) => {
          if (res.status) {
            if (evaluation_type == EVALUATION_TYPE.REMARKS)
              dispatch(showSuccessToast('Remarks saved successfully'))
            else if (evaluation_type == EVALUATION_TYPE.RESULTS)
              dispatch(showSuccessToast('Results saved successfully'))
            else dispatch(showSuccessToast('Evaluation saved successfully'))

            dispatch(getSectionEvaluationStructure({section_id, class_id}))
            dispatch(
              getTermEvaluationDetails({
                term_id: 'other',
                evaluation_type: EVALUATION_TYPE.OTHER,
                section_id,
                class_id,
              })
            )
            eventManager.send_event(
              events.REPORT_CARD_EVALUATION_CHANGES_SAVED_TFI,
              eventData
            )
            onClose()
          } else {
            dispatch(showErrorToast(t('somethingWentWrong')))
          }
        })
        .catch(() => {
          dispatch(showErrorToast(t('somethingWentWrong')))
        })
        .finally(() => setSaving(false))
    }
  }, [drawerData, changes])

  const sendNotification = useCallback(() => {
    const notificationApi =
      evaluation_type == EVALUATION_TYPE.SCHOLASTIC
        ? sendScholasticNotification
        : sendOthersNotification

    const payload = {
      standard_id: drawerData?.class_id,
      section_id: drawerData?.section_id,
    }

    if (evaluation_type == EVALUATION_TYPE.SCHOLASTIC) {
      payload['assessment_id'] = drawerData.assessment_id
    } else {
      payload['evaluation_type'] = evaluation_type
      payload['duration_type'] = drawerData.duration_type
      payload['duration_type_id'] = drawerData.duration_type_id
      if (evaluation_type == EVALUATION_TYPE.CO_SCHOLASTIC)
        payload['subject_id'] = drawerData.subject_id
    }

    notificationApi(payload)
      .then((res) => {
        if (res.status) {
          setNotificationSent(true)
          dispatch(showSuccessToast('Teachers notified successfully'))
        } else {
          dispatch(showErrorToast('Failed to notify teachers'))
        }
      })
      .catch(() => {
        dispatch(showErrorToast(t('somethingWentWrong')))
      })
  }, [drawerData, evaluation_type])

  const hasError = useMemo(() => {
    return Object.values(metric).some(({error}) => error)
  }, [metric])

  const teacherNotAssigned =
    !drawerData?.teacher &&
    !(drawerData?.coTeachers && drawerData?.coTeachers.length > 0)

  return (
    <Drawer
      open={open}
      onClose={onClose}
      className={classNames(styles.drawer, {[styles.mobile]: IS_MOBILE})}
      fullScreen={IS_MOBILE}
      direction={
        IS_MOBILE
          ? DRAWER_CONSTANTS.DIRECTION.BOTTOM
          : DRAWER_CONSTANTS.DIRECTION.RIGHT
      }
    >
      <Drawer.Header
        className={classNames(styles.header, {[styles.mobile]: IS_MOBILE})}
      >
        {IS_MOBILE && <Icon name="chevronLeft" onClick={onClose} />}
        <Heading
          textSize={HEADING_CONSTANTS.TEXT_SIZE.X_SMALL}
          weight={HEADING_CONSTANTS.WEIGHT.BOLD}
        >
          {evaluationHeading(evaluation_type, drawerData)}
        </Heading>{' '}
        {!IS_MOBILE && (
          <Permission
            permissionId={
              evaluation_type == EVALUATION_TYPE.SCHOLASTIC
                ? PERMISSION_CONSTANTS.reportCardEvaluationController_sectionScholasticUpsertDetails_update
                : PERMISSION_CONSTANTS.reportCardEvaluationController_sectionOthersUpsertDetails_update
            }
          >
            <Button
              isDisabled={hasError || saving || !hasChanged}
              onClick={onSaveMetrics}
            >
              {t('save')}{' '}
              {saving && (
                <Spinner className={styles.spinner}>
                  <Icon
                    name="autoRenew"
                    size={ICON_CONSTANTS.SIZES.XXX_SMALL}
                    type={ICON_CONSTANTS.TYPES.INVERTED}
                  />
                </Spinner>
              )}
            </Button>
          </Permission>
        )}
      </Drawer.Header>
      <Drawer.Content
        className={classNames(styles.wrapper, {
          [styles.mobile]: IS_MOBILE,
          ['overflow-hidden']:
            evaluation_type == EVALUATION_TYPE.SCHOLASTIC ||
            evaluation_type == EVALUATION_TYPE.ATTENDANCE
              ? isNaN(totalMetric) || totalMetric == 0
              : false,
        })}
      >
        <Loader show={loading} />
        {!loading && (
          <ErrorBoundary>
            <EvaluationInfo termId={drawerData?.term_id} />
            <Divider spacing="20px" className={styles.divider} />
            <div className={styles.filtersWrapper}>
              {(evaluation_type == EVALUATION_TYPE.SCHOLASTIC ||
                evaluation_type == EVALUATION_TYPE.ATTENDANCE) && (
                <TotalMetric
                  value={totalMetric}
                  onSave={onSaveTotalMetric}
                  ref={totalMetricRef}
                  type={evaluation_type}
                  allValues={metric}
                  max={
                    evaluation_type == EVALUATION_TYPE.ATTENDANCE
                      ? maxDaysAllowed[duration_type]
                      : null
                  }
                />
              )}

              <Alert
                hideClose
                icon={
                  isEvaluationCompleted()
                    ? 'checkCircle'
                    : ALERT_CONSTANTS.TYPE.ERROR
                }
                type={
                  isEvaluationCompleted()
                    ? ALERT_CONSTANTS.TYPE.SUCCESS
                    : ALERT_CONSTANTS.TYPE.WARNING
                }
                content={
                  <>
                    <Para>
                      {evaluationAlertMessage(
                        evaluation_type,
                        total_students,
                        total_students - total_students_result_count,
                        t
                      )}
                    </Para>
                    {!isEvaluationCompleted() &&
                      !teacherNotAssigned &&
                      (hasPermissionToSendScholasticNotification ||
                        hasPermissionToSendOtherNotification) && (
                        <Button
                          type={BUTTON_CONSTANTS.TYPE.TEXT}
                          prefixIcon="notificationsActive"
                          classes={{button: styles.notify}}
                          onClick={sendNotification}
                          isDisabled={notificationSent}
                        >
                          {!IS_MOBILE ? t('notifyTeacher') : t('notify')}
                        </Button>
                      )}
                  </>
                }
                className={styles.notifyAlert}
              />
              <Filters
                query={query}
                setQuery={setQuery}
                setActiveSort={setActiveSort}
                pending={!!pendingOnly}
                setPending={setPending}
                sendFilterEvents={sendFilterEvents}
                evaluationCompleted={isEvaluationCompleted()}
              />
            </div>
            <StudentList
              list={sortedStudentList}
              metric={metric}
              setMetric={setMetric}
              totalMetric={totalMetric}
              queryActive={!!query?.length || !!pendingOnly}
              type={evaluation_type}
              onClose={onClose}
            />
          </ErrorBoundary>
        )}
      </Drawer.Content>
      {IS_MOBILE ? (
        <Drawer.Footer className={styles.footer}>
          <Permission
            permissionId={
              evaluation_type == EVALUATION_TYPE.SCHOLASTIC
                ? PERMISSION_CONSTANTS.reportCardEvaluationController_sectionScholasticUpsertDetails_update
                : PERMISSION_CONSTANTS.reportCardEvaluationController_sectionOthersUpsertDetails_update
            }
          >
            <Button
              width={BUTTON_CONSTANTS.WIDTH.FULL}
              isDisabled={hasError || saving || !hasChanged}
              onClick={onSaveMetrics}
            >
              {t('save')}{' '}
              {saving && (
                <Spinner className={styles.spinner}>
                  <Icon
                    name="autoRenew"
                    size={ICON_CONSTANTS.SIZES.XXX_SMALL}
                    type={ICON_CONSTANTS.TYPES.INVERTED}
                  />
                </Spinner>
              )}
            </Button>
          </Permission>
        </Drawer.Footer>
      ) : (
        <></>
      )}
    </Drawer>
  )
}

export default React.memo(StudentEvaluationDrawer)
