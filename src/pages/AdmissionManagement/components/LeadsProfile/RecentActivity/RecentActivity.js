import {useState, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {DateTime} from 'luxon'
import {t} from 'i18next'
import {
  Badges,
  Heading,
  Para,
  PlainCard,
  Avatar,
  HEADING_CONSTANTS,
  AVATAR_CONSTANTS,
  Icon,
  Tooltip,
  TOOLTIP_CONSTANTS,
  ICON_CONSTANTS,
  BADGES_CONSTANTS,
  PARA_CONSTANTS,
  EmptyState,
} from '@teachmint/krayon'
import {ErrorBoundary} from '@teachmint/common'
import {isAdmin, getClassName, getSectionName} from '../../../utils/helpers'
import DateDropdownFilter from '../../Common/DateDropdownFilter/DateDropdownFilter'
import {
  useLeadRecentActivity,
  useAdmissionCrmSettings,
  useCrmInstituteHierarchy,
} from '../../../redux/admissionManagement.selectors'
import globalActions from '../../../../../redux/actions/global.actions'
import {
  recentActivityEvents,
  recentActivityTypes,
} from '../../../utils/constants'
import {sendSMSMapping} from '../../Common/SendSms/constants'
import styles from './RecentActivity.module.css'
import {Trans} from 'react-i18next'
import {events} from '../../../../../utils/EventsConstants'

const RECENT_ACTIVITY_TYPE_IDS = {
  ALL: 'ALL',
  ADMIN: 'ADMIN',
  STUDENT: 'STUDENT',
}

const RECENT_ACTIVITY_TYPES = {
  [RECENT_ACTIVITY_TYPE_IDS.ALL]: {
    id: RECENT_ACTIVITY_TYPE_IDS.ALL,
    label: t('all'),
  },
  [RECENT_ACTIVITY_TYPE_IDS.ADMIN]: {
    id: RECENT_ACTIVITY_TYPE_IDS.ADMIN,
    label: t('admin'),
  },
  [RECENT_ACTIVITY_TYPE_IDS.STUDENT]: {
    id: RECENT_ACTIVITY_TYPE_IDS.STUDENT,
    label: t('student'),
  },
}

export default function RecentActivity({leadData}) {
  const dispatch = useDispatch()
  const admissionFormFields = useAdmissionCrmSettings()
  const eventManager = useSelector((state) => state.eventManager)
  const leadStages = Object.values(admissionFormFields?.data?.lead_stages)
  const instituteHierarchy = useCrmInstituteHierarchy()
  const recentActivity = useLeadRecentActivity()
  const instituteAdminList = useSelector((state) => state.instituteAdminList)
  const [selectedFilter, setSelectedFilter] = useState(
    RECENT_ACTIVITY_TYPE_IDS.ALL
  )
  const [filters, setFilters] = useState({
    startDate: DateTime.now().minus({months: 1}).toSeconds(),
    endDate: DateTime.now().endOf('month').toSeconds(),
  })
  const leadName = `${leadData?.profile_data?.name ?? ''} ${
    leadData?.profile_data?.last_name ?? ''
  }`

  const getEventName = (id) => {
    switch (id) {
      case RECENT_ACTIVITY_TYPE_IDS.ALL:
        return events.ADMISSION_LEAD_LIST_PROFILE_ALL_VIEW_CLICKED_TFI
      case RECENT_ACTIVITY_TYPE_IDS.STUDENT:
        return events.ADMISSION_LEAD_LIST_PROFILE_STUDENT_VIEW_CLICKED_TFI
      case RECENT_ACTIVITY_TYPE_IDS.ADMIN:
        return events.ADMISSION_LEAD_LIST_PROFILE_ADMIN_VIEW_CLICKED_TFI
    }
  }

  useEffect(() => {
    dispatch(globalActions.getLeadRecentActivity.request(leadData._id))
    return () => dispatch(globalActions.getLeadRecentActivity.success([]))
  }, [])

  if (recentActivity.isLoading) {
    return <div className="loading" />
  }

  const recentActivities = recentActivity?.data
    ?.filter((activity) => {
      if (selectedFilter !== RECENT_ACTIVITY_TYPE_IDS.ALL) {
        return (
          (selectedFilter === RECENT_ACTIVITY_TYPE_IDS.ADMIN &&
            isAdmin(activity.created_user_id, instituteAdminList)) ||
          (selectedFilter === RECENT_ACTIVITY_TYPE_IDS.STUDENT &&
            !isAdmin(activity.created_user_id, instituteAdminList))
        )
      }
      return true
    })
    .filter((activity) => {
      return (
        activity.timestamp >= filters.startDate &&
        activity.timestamp <= filters.endDate
      )
    })

  const getCapitalizeName = (leadName) => {
    return leadName
      .split(' ')
      .map((name) => name.charAt(0).toUpperCase() + name.slice(1))
      .join(' ')
  }

  const getUserData = (id) => {
    let userData = {
      name: getCapitalizeName(leadName),
      image: leadData?.profile_data?.profile_pic,
    }
    const adminData = isAdmin(id, instituteAdminList)

    if (adminData) {
      userData = {
        name: getCapitalizeName(adminData.full_name),
        image: adminData.img_url,
      }
    }
    return userData
  }

  const renderAvatar = (createdUserId) => {
    const userData = getUserData(createdUserId)
    return (
      <Avatar
        name={userData.name}
        imgSrc={userData.image}
        size={AVATAR_CONSTANTS.SIZE.LARGE}
      />
    )
  }

  const getActivityTranslation = (item) => {
    return Object.values(recentActivityTypes).find(
      (activity) => activity.TYPE === item.event_type
    )?.SENTENCE
  }

  const getDate = (timestamp) =>
    DateTime.fromSeconds(timestamp).toFormat('dd LLL, yyyy')

  const getTime = (timestamp) =>
    DateTime.fromSeconds(timestamp).toFormat('hh:mm a')

  return (
    <ErrorBoundary>
      <div className={styles.recentActivityWrapper}>
        <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.MEDIUM}>
          {t('recentActivity')}
        </Heading>
        <div
          onClick={() => {
            eventManager.send_event(events.ADMISSION_SORT_FILTER_CLICKED_TFI, {
              screen_name: 'lead_profile',
            })
          }}
        >
          <DateDropdownFilter
            handleChange={(value) => {
              eventManager.send_event(
                events.ADMISSION_SORT_FILTER_SELECTED_TFI,
                {value: value, screen_name: 'lead_profile'}
              )
              setFilters(value)
            }}
          />
        </div>
      </div>
      <div className={styles.filterWrapper}>
        {Object.values(RECENT_ACTIVITY_TYPES).map((type) => {
          return (
            <Badges
              key={type.id}
              type={
                selectedFilter === type.id
                  ? BADGES_CONSTANTS.TYPE.PRIMARY
                  : BADGES_CONSTANTS.TYPE.BASIC
              }
              showIcon={false}
              label={type.label}
              onClick={() => {
                eventManager.send_event(getEventName(type.id))
                setSelectedFilter(type.id)
              }}
            />
          )
        })}
      </div>
      <div>
        {recentActivities?.length === 0 ? (
          <div className={styles.recentActivityEmpty}>
            <EmptyState
              button={false}
              iconName="list"
              content={t('leadProfileRecentActivityEmptyState')}
            />
          </div>
        ) : (
          recentActivities?.map((item, key) => (
            <PlainCard
              key={key}
              className={
                selectedFilter === RECENT_ACTIVITY_TYPE_IDS.ALL &&
                isAdmin(item.created_user_id, instituteAdminList)
                  ? styles.adminClass
                  : styles.studentClass
              }
            >
              <div className={styles.activityCardWrapper}>
                <div className={styles.innerWrapper}>
                  <div className={styles.avatarWrap}>
                    {renderAvatar(item.created_user_id)}
                  </div>
                  <div className={styles.activityContentWrapper}>
                    <div className={styles.activityNameSentenceWrapper}>
                      <Para className={styles.activityCreatorName}>
                        <Trans i18nKey={getActivityTranslation(item)}>
                          {{
                            name: getUserData(item.created_user_id).name,
                            stage: leadStages?.find(
                              (stage) => stage._id === item.data.lead_stage_id
                            )?.name,
                            student: getUserData(item?.entity_id)?.name,
                            class: getClassName(
                              instituteHierarchy,
                              item?.data?.class_id
                            ),
                            section: getSectionName(
                              instituteHierarchy,
                              item?.data?.profile_data?.section
                            ),
                            form: item?.data?.form_type?.toLowerCase(),
                            template:
                              sendSMSMapping[item?.data?.sms_template_id],
                          }}
                          {getActivityTranslation(item)}
                        </Trans>
                      </Para>
                    </div>
                    <div className={styles.activityDateTimeWrapper}>
                      <Para
                        children={getDate(item.timestamp)}
                        textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
                      />
                      <Para
                        children={getTime(item.timestamp)}
                        textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
                        className={styles.activityTime}
                      />
                    </div>
                  </div>
                </div>

                {(item.event_type ===
                  recentActivityEvents.CRM_FOLLOWUP_CREATED ||
                  item.event_type ===
                    recentActivityEvents.CRM_FOLLOWUP_UPDATED ||
                  item.event_type ===
                    recentActivityEvents.CRM_FOLLOWUP_COMPLETED) && (
                  <div className={styles.activityIconWrapper}>
                    <Icon
                      name="eye1"
                      type={ICON_CONSTANTS.TYPES.PRIMARY}
                      size={ICON_CONSTANTS.SIZES.XXX_SMALL}
                      className={styles.viewNoteIcon}
                    />
                    <div>
                      <span
                        data-tip
                        data-for={item._id}
                        className={styles.viewNoteStyle}
                      >
                        {t('viewNoteLeadProfilePage')}
                      </span>
                      <Tooltip
                        toolTipId={item._id}
                        title={t('followUpNoteRecentActivity')}
                        place={TOOLTIP_CONSTANTS.TOOLTIP_POSITIONS.LEFT}
                        toolTipBody={
                          <div className={styles.tooltipContent}>
                            <div className={styles.tooltipBodyContent}>
                              <Para
                                children={item.data.note}
                                className={styles.tooltipContentDateColor}
                              />
                            </div>
                            <div className={styles.tooltipContentDateTime}>
                              <Para
                                textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
                                children={getDate(item.data.followup_timestamp)}
                                className={styles.tooltipContentDateColor}
                              />
                              <Para
                                textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
                                children={getTime(item.data.followup_timestamp)}
                                className={styles.tooltipContentDateColor}
                              />
                            </div>
                          </div>
                        }
                        effect={TOOLTIP_CONSTANTS.TOOLTIP_EFFECTS.FLOAT}
                        classNames={{
                          title: styles.tooltipTitle,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </PlainCard>
          ))
        )}
      </div>
    </ErrorBoundary>
  )
}
