import {useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {DateTime} from 'luxon'
import classNames from 'classnames'
import {
  Para,
  Table,
  KebabMenu,
  Button,
  Badges,
  BADGES_CONSTANTS,
  BUTTON_CONSTANTS,
  Avatar,
  AVATAR_CONSTANTS,
  EmptyState,
  Tooltip,
  TOOLTIP_CONSTANTS,
  PARA_CONSTANTS,
} from '@teachmint/krayon'
import {ErrorBoundary} from '@teachmint/common'
import globalActions from '../../../../redux/actions/global.actions'
import {getClassName, isAdmin, getSpecificLeadData} from '../../utils/helpers'
import {
  admissionCrmFollowupStatus,
  followUpsTabIds,
} from '../../utils/constants'
import {t} from 'i18next'
import history from '../../../../history'
import styles from './FollowUps.module.css'
import UpdateFollowUps from '../Common/FollowUps/FollowUps'
import {
  useCrmInstituteHierarchy,
  useLeadList,
} from '../../redux/admissionManagement.selectors'
import {events} from '../../../../utils/EventsConstants'

export default function FollowupTable({tableRows, currentTab}) {
  const dispatch = useDispatch()
  const leadlist = useLeadList()
  const eventManager = useSelector((state) => state.eventManager)
  const [followUpdata, setFollowUpdata] = useState({})
  const [showModal, setShowModal] = useState(false)
  const [followupId, setFollowUpId] = useState('')

  const convertDate = (timeStamp) =>
    DateTime.fromSeconds(timeStamp).toFormat('dd LLL, yyyy')

  const convertTime = (timeStamp) =>
    DateTime.fromSeconds(timeStamp).toFormat('hh:mm a')

  const instituteHierarchy = useCrmInstituteHierarchy()
  const instituteAdminList = useSelector((state) => state.instituteAdminList)

  if (leadlist.isLoading) {
    return <div className="loader"></div>
  }

  const changeStatus = (followupId, leadId) => {
    dispatch(
      globalActions.updateFollowups.request({
        _id: followupId,
        status: admissionCrmFollowupStatus.COMPLETED,
      })
    )
    eventManager.send_event(events.LEAD_FOLLOW_UP_MARK_COMPLETE_CLICKED_TFI, {
      lead_id: leadId,
    })
  }

  const reschedule = (id, followUpobj, leadId) => {
    eventManager.send_event(events.LEAD_FOLLOW_UP_RESCHEDULE_CLICKED_TFI, {
      lead_id: leadId,
    })
    setFollowUpId(id)
    setFollowUpdata(followUpobj)
    setShowModal((show) => !show)
  }

  const redirectLink = (leadId) => {
    eventManager.send_event(events.ADMISSION_STUDENT_NAME_CLICKED_TFI, {
      screen_name: 'followup_tab',
    })
    history.push(`/institute/dashboard/admission-management/leads/${leadId}`, {
      tab: t('tabFollowups'),
      link: history.location.pathname,
    })
  }

  const getLeadTextType = (lead) => {
    return lead
      ? PARA_CONSTANTS.TYPE.TEXT_PRIMARY
      : PARA_CONSTANTS.TYPE.TEXT_SECONDARY
  }

  const rows = tableRows?.map((rowData) => {
    const lead = getSpecificLeadData(leadlist?.data, rowData?.lead_id)
    const leadName = lead
      ? `${lead?.profile_data?.name ?? ''} ${
          lead?.profile_data?.last_name ?? ''
        }`
      : null
    return {
      key: rowData?.lead_id,
      student: (
        <div
          className={classNames(
            styles.studentColumn,
            lead ? styles.showCursor : styles.hideCursor
          )}
          onClick={lead ? () => redirectLink(rowData?.lead_id) : ''}
        >
          <Avatar
            size={AVATAR_CONSTANTS.SIZE.LARGE}
            variant={!lead ? AVATAR_CONSTANTS.VARIANTS[6] : ''}
            name={leadName ?? 'NA'}
            imgSrc={lead?.profile_data?.img_url ?? ''}
          />
          <div className={styles.studentContent}>
            <Para
              className={classNames(
                {[styles.studentName]: lead},
                styles.textTransform
              )}
              type={getLeadTextType(lead)}
            >
              {leadName ?? t('deletedUser')}
            </Para>
            {lead && <Para children={`+ ${lead?.phone_number}`} />}
          </div>
        </div>
      ),
      class: (
        <div className={styles.classColumn}>
          <Para type={getLeadTextType(lead)}>
            {lead
              ? getClassName(instituteHierarchy, lead?.profile_data?.standard)
              : t('na')}
          </Para>
        </div>
      ),
      note: (
        <div className={styles.noteColumn}>
          <div className={styles.textSpace}>
            <Para
              data-tip
              data-for={rowData._id}
              children={rowData.note}
              className={styles.followupNoteStyle}
              type={getLeadTextType(lead)}
            />
            <Tooltip
              toolTipId={rowData._id}
              toolTipBody={rowData.note}
              place={TOOLTIP_CONSTANTS.TOOLTIP_POSITIONS.TOP}
              effect={TOOLTIP_CONSTANTS.TOOLTIP_EFFECTS.SOLID}
              classNames={{
                toolTipBody: styles.toolTipBody,
              }}
            ></Tooltip>
          </div>
        </div>
      ),
      dateTime: (
        <div className={styles.dateTimeColumn}>
          <Para type={getLeadTextType(lead)}>
            {convertDate(rowData.followup_timestamp)}
          </Para>
          <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>
            {convertTime(rowData.followup_timestamp)}
          </Para>
        </div>
      ),
      creator: (
        <div className={styles.createdByColumn}>
          <Para type={getLeadTextType(lead)} className={styles.textTransform}>
            {rowData.c_by != null
              ? isAdmin(rowData?.c_by, instituteAdminList)?.full_name
              : ''}
          </Para>
        </div>
      ),
      action: (
        <div className={styles.actionColumn}>
          <div>
            {rowData.status == admissionCrmFollowupStatus.PENDING ? (
              parseInt(rowData.followup_timestamp) <
              parseInt(DateTime.now().toSeconds()) ? (
                <Badges
                  size={BADGES_CONSTANTS.SIZE.LARGE}
                  type={BADGES_CONSTANTS.TYPE.ERROR}
                  inverted={false}
                  showIcon={true}
                  iconName={'phoneMissed'}
                  label={t('missed')}
                  className={styles.badgeStyling}
                />
              ) : (
                <Button
                  children={t('markComplete')}
                  category={BUTTON_CONSTANTS.CATEGORY.PRIMARY}
                  size={BUTTON_CONSTANTS.SIZE.SMALL}
                  onClick={() => changeStatus(rowData?._id, rowData?.lead_id)}
                  classes={{button: styles.markCompleteButtonStyle}}
                  isDisabled={lead ? false : true}
                />
              )
            ) : (
              <Badges
                size={BADGES_CONSTANTS.SIZE.LARGE}
                type={BADGES_CONSTANTS.TYPE.SUCCESS}
                inverted={false}
                showIcon={true}
                iconName={'checkCircle'}
                label={t('completed')}
                className={styles.badgeStyling}
              />
            )}
          </div>
          <div className={styles.kebab}>
            {typeof lead != 'object' ||
            rowData.status == admissionCrmFollowupStatus.COMPLETED ? (
              <div></div>
            ) : (
              <KebabMenu
                options={
                  rowData.status == admissionCrmFollowupStatus.PENDING &&
                  rowData.followup_timestamp > DateTime.now().toSeconds()
                    ? [
                        {
                          icon: '',
                          content: t('reschedule'),
                          handleClick: () =>
                            reschedule(
                              rowData?._id,
                              {
                                note: rowData.note,
                                followupDate: DateTime.fromSeconds(
                                  rowData.followup_timestamp
                                ).toJSDate(),
                                followupTime: DateTime.fromSeconds(
                                  rowData.followup_timestamp
                                ).toFormat('hh:mm a'),
                              },
                              rowData?.lead_id
                            ),
                        },
                      ]
                    : [
                        {
                          icon: '',
                          content: t('reschedule'),
                          handleClick: () =>
                            reschedule(rowData._id, {
                              note: rowData.note,
                              followupDate: DateTime.fromSeconds(
                                rowData.followup_timestamp
                              ).toJSDate(),
                              followupTime: DateTime.fromSeconds(
                                rowData.followup_timestamp
                              ).toFormat('hh:mm a'),
                            }),
                        },
                        {
                          icon: '',
                          content: t('markAsComplete'),
                          handleClick: () => changeStatus(rowData._id),
                        },
                      ]
                }
                isVertical={true}
                classes={{
                  tooltipWrapper: styles.options,
                  option: styles.kebabOption,
                  iconFrame: styles.kebabMenuIcon,
                }}
              />
            )}
          </div>
        </div>
      ),
    }
  })

  const cols = [
    {key: 'student', label: t('student')},
    {key: 'class', label: t('class')},
    {key: 'note', label: t('note')},
    {key: 'dateTime', label: t('dateandtime')},
    {key: 'creator', label: t('createdBy')},
    {key: 'action', label: t('act')},
  ]

  return (
    <ErrorBoundary>
      {showModal && (
        <UpdateFollowUps
          showModal={showModal}
          setShowModal={setShowModal}
          followupId={followupId}
          formValues={followUpdata}
          isFollowupPage={true}
        />
      )}
      {tableRows.length === 0 ? (
        <div className={styles.emptyStateWrapper}>
          <EmptyState
            iconName="call"
            button={false}
            content={
              <Para>
                {t('noFollowupsFound', {
                  type:
                    currentTab !== followUpsTabIds.ALL
                      ? currentTab.toLowerCase()
                      : '',
                })}
              </Para>
            }
          />
        </div>
      ) : (
        <Table rows={rows} cols={cols} />
      )}
    </ErrorBoundary>
  )
}
