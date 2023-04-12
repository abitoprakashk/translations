import React, {useMemo} from 'react'
import styles from '../SearchBox.module.css'
import {
  Button,
  BUTTON_CONSTANTS,
  EmptyState,
  Heading,
  HEADING_CONSTANTS,
  Para,
  Table,
} from '@teachmint/krayon'
import {useDispatch, useSelector} from 'react-redux'
import SubjectTooltipOptions from '../../../../../../../components/SchoolSystem/SectionDetails/SubjectTooltipOptions'
import {getAmountFixDecimalWithCurrency} from '../../../../../../../utils/Helpers'
import feeCollectionActionTypes from '../../../../../redux/feeCollectionActionTypes'
import classNames from 'classnames'
import StudentDetails from '../../../../../../../components/Common/StudentDetails/StudentDetails'
import {t} from 'i18next'
import {events} from '../../../../../../../utils/EventsConstants'
import {PERMISSION_CONSTANTS} from '../../../../../../../utils/permission.constants'
import Permission from '../../../../../../../components/Common/Permission/Permission'
import {ErrorBoundary} from '@teachmint/common'

export default function SearchResultTable({
  searchResults = [],
  studentListObj = {},
  instituteInfo = {},
  handleCollectFeeClick = () => {},
  feeReminderRequestedAction = () => {},
  sendClickEvent = () => {},
}) {
  const dispatch = useDispatch()
  const eventManager = useSelector((state) => state.eventManager)

  const cols = [
    {key: 'studentDetails', label: t('studentDetails')},
    {key: 'parentsDetails', label: t('parentDetails')},
    {key: 'class', label: t('class')},
    {key: 'paid', label: t('totalPaid')},
    {key: 'due', label: t('totalDue')},
    {key: 'action', label: ''},
  ]

  const rowData = useMemo(() => {
    return searchResults.map((s, i) => {
      let student = studentListObj[s.Id] || null
      return {
        studentDetails: (
          <StudentDetails
            fullName={student?.full_name}
            studentData={s}
            phoneNumber={student?.phone_number}
            enrollmentNumber={student?.enrollment_number}
            verificationStatus={false}
            selectedSliderTab={'FEE_HISTORY'}
          />
        ),
        parentsDetails: (
          <div>
            <div className="flex gap-1 flex-wrap">
              <Para>
                {student?.father_name && student?.father_name !== ''
                  ? student?.father_name
                  : '--'}
                ,{' '}
              </Para>
              <Para>
                {student?.father_contact_number &&
                student?.father_contact_number !== ''
                  ? student?.father_contact_number
                  : '--'}
              </Para>
            </div>
            <div className="flex gap-1 flex-wrap">
              <Para>
                {student?.mother_name && student?.mother_name !== ''
                  ? student?.mother_name
                  : '--'}
                ,{' '}
              </Para>
              <Para>
                {student?.mother_contact_number &&
                student?.mother_contact_number !== ''
                  ? student?.mother_contact_number
                  : '--'}
              </Para>
            </div>
          </div>
        ),
        class: (
          <Para>
            {student?.hierarchy_nodes?.length > 0
              ? student?.hierarchy_nodes[0]
              : student?.classroom}
          </Para>
        ),
        paid: (
          <Heading
            type={HEADING_CONSTANTS.TYPE.SUCCESS}
            textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}
          >
            {' '}
            {getAmountFixDecimalWithCurrency(
              s.paid || 0,
              instituteInfo.currency
            )}
          </Heading>
        ),
        due: (
          <Heading
            type={HEADING_CONSTANTS.TYPE.ERROR}
            textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}
          >
            {getAmountFixDecimalWithCurrency(
              s.due || 0,
              instituteInfo.currency
            )}
          </Heading>
        ),
        action: (
          <div className={styles.studentActions}>
            <Permission
              permissionId={
                PERMISSION_CONSTANTS.feeModuleController_feeStudentPayment_create
              }
            >
              <Button
                size={BUTTON_CONSTANTS.SIZE.LARGE}
                onClick={() => {
                  handleCollectFeeClick(s.Id)
                  sendClickEvent(events.RECORD_PAYMENT_INITIALIZED_TFI, {
                    student_id: s.Id,
                    screen_name: 'search_bar',
                  })
                }}
                type={BUTTON_CONSTANTS.TYPE.FILLED}
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
                    dispatch(feeReminderRequestedAction(Array(s.Id)))
                    sendClickEvent(events.FEE_REMINDER_SENT_TFI, {
                      screen_name: 'search_bar',
                      student_id: s.Id,
                    })
                  },
                  permissionId:
                    PERMISSION_CONSTANTS.feeModuleController_sendFeeReminder_create,
                },
                {
                  label: t('downloadDD'),
                  action: () => {
                    dispatch({
                      type: feeCollectionActionTypes.DOWNLOAD_DEMAND_LETTER_REQUESTED,
                      payload: {studentId: s.Id, eventManager},
                    })
                    sendClickEvent(events.DEMAND_LETTER_DOWNLOADED_TFI, {
                      screen_name: 'search_bar',
                      student_id: s.Id,
                    })
                  },
                },
              ]}
              trigger={
                <span
                  data-size="x_s"
                  data-qa="icon-moreVertical"
                  className="icon-moreVertical_outlined krayon__Icon-module__eRVVq krayon__Icon-module__szG-X SearchBox_studentMoreActionIcon__1Bl2U"
                  data-type="primary"
                ></span>
              }
              handleChange={(action) => action()}
            />
          </div>
        ),
      }
    })
  }, [searchResults])

  return (
    <ErrorBoundary>
      <div
        className={classNames({
          [styles.resultTableSectionBorder]: searchResults.length === 0,
        })}
      >
        <Table
          rows={rowData}
          cols={cols}
          classes={{
            table: classNames({
              [styles.tableWithDataWrapper]: searchResults.length != 0,
              [styles.tableWrapper]: searchResults.length == 0,
            }),
          }}
        />
        {searchResults.length === 0 && (
          <EmptyState
            button={false}
            iconName={'students'}
            content={t('noStudentFound')}
            classes={{wrapper: 'my-20'}}
          />
        )}
      </div>
    </ErrorBoundary>
  )
}
