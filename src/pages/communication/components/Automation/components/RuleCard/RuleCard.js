import {
  Toggle,
  KebabMenu,
  isMobile,
  Icon,
  ICON_CONSTANTS,
  Popup,
  BUTTON_CONSTANTS,
  Para,
  PARA_CONSTANTS,
  Divider,
  Badges,
  BADGES_CONSTANTS,
} from '@teachmint/krayon'
import classNames from 'classnames'
import {useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {Trans, useTranslation} from 'react-i18next'
import {
  toggleActiveStatus,
  postDeleteRule,
} from '../../../../redux/actions/schedulerActions'
import SendMessages from './SendMessages/SendMessages'
import {getNextTriggerTimeLabel} from '../../utils'
import {ACTIONS, SCHEDULER_TEMPLATE_TYPES} from '../../Automation.constants'
import {events} from '../../../../../../utils/EventsConstants'
import Permission from '../../../../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../../../utils/permission.constants'
import {checkPermission} from '../../../../../../utils/Permssions'
import useHierarchyGroup from '../../hooks/useHierarchyGroup'
import RuleDetails from './RuleDetails'
import styles from './RuleCard.module.css'

const TEMPLATE_BG_CLASS = {
  [SCHEDULER_TEMPLATE_TYPES.FEE_REMINDER]: styles.feeColor,
  [SCHEDULER_TEMPLATE_TYPES.ATTENDANCE]: styles.attendanceColor,
  [SCHEDULER_TEMPLATE_TYPES.BIRTHDAY]: styles.birthdayBarColor,
  [SCHEDULER_TEMPLATE_TYPES.HOLIDAY]: styles.holidayColor,
}

export default function RuleCard({
  rule,
  setData,
  setPreSelectedIds,
  onRuleToggle,
  showMoreActions = true,
  hierarchy,
  ruleActive,
}) {
  const {t} = useTranslation()
  const [toggleActive, setIsToggleActive] = useState(ruleActive ?? rule.active)
  const [deletePopupOpen, setDeletePopupOpen] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [showSentMessages, setShowSentMessages] = useState(false)

  const dispatch = useDispatch()
  const eventManager = useSelector((state) => state.eventManager)

  const {groupNames, customClasses} = useHierarchyGroup({
    ruleData: rule,
    instHierarchy: hierarchy,
  })
  const userRolePermission = useSelector(
    (state) => state.globalData?.userRolePermission
  )
  const toggleShowSentMessages = () => {
    setShowSentMessages((open) => !open)
    eventManager.send_event(events.COMMS_RULES_VIEW_SENT_MESSAGES_TFI, {
      rule_id: rule._id,
    })
  }
  const toggleShowDetails = () => setShowDetails((show) => !show)

  const customClassIds = new Set(
    customClasses?.map((customClass) => customClass._id) || []
  )
  const allRecipients = rule.filter?.recipient_node_ids || []
  const preselectedHierarchyIds = allRecipients.filter(
    (id) => !customClassIds.has(id)
  )

  const kebabMenuOptions = [
    {
      icon: 'chat',
      content: t('viewSentMessages'),
      handleClick: toggleShowSentMessages,
    },
    {
      ...(checkPermission(
        userRolePermission,
        PERMISSION_CONSTANTS.triggerController_update__rule_update
      ) && {
        icon: 'edit2',
        content: t('editRule'),
        handleClick: () => {
          setData(rule)
          setPreSelectedIds(preselectedHierarchyIds)
          eventManager.send_event(events.COMMS_RULES_EDIT_TFI, {
            rule_id: rule._id,
          })
        },
      }),
    },
    {
      ...(checkPermission(
        userRolePermission,
        PERMISSION_CONSTANTS.triggerController_delete__rule_delete
      ) && {
        icon: 'delete1',
        content: t('deleteRule'),
        handleClick: () => {
          setDeletePopupOpen(true)
          eventManager.send_event(events.COMMS_RULES_DELETE_TFI, {
            rule_id: rule._id,
          })
        },
      }),
    },
  ]
  const popupActionBtns = [
    {
      body: t('goBack'),
      onClick: () => {
        setDeletePopupOpen(false)
      },
      type: BUTTON_CONSTANTS.TYPE.OUTLINE,
    },
    {
      body: t('deleteRule'),
      onClick: () => {
        dispatch(postDeleteRule({rule_id: rule._id}))
        setDeletePopupOpen(false)
        eventManager.send_event(events.COMMS_RULES_RULE_DELETED, {
          rule_id: rule._id,
        })
      },
      category: BUTTON_CONSTANTS.CATEGORY.DESTRUCTIVE,
    },
  ]
  const handleToggle = ({value}) => {
    setIsToggleActive(!toggleActive)
    const payload = {rule_id: rule._id, status: value}

    if (onRuleToggle) {
      onRuleToggle(payload)
    } else {
      dispatch(toggleActiveStatus(payload))
      eventManager.send_event(events.COMMS_RULES_TOGGLED_TFI, payload)
    }
  }

  const nextTriggerTime = getNextTriggerTimeLabel(rule)

  const template = rule.template_id || rule._id
  const isMobileDevice = isMobile()

  return (
    <div className={styles.outerCard}>
      <div className={styles.smallCard}>
        <div
          className={classNames(styles.colorbar, TEMPLATE_BG_CLASS[template])}
        />
        <div className={styles.titleSec}>
          <div className={styles.titleLabel}>{rule.name}</div>
          {!isMobileDevice && (
            <div className={styles.ruleDetails}>
              {nextTriggerTime}
              <span
                className={styles.detailsToggle}
                onClick={toggleShowDetails}
              >
                {showDetails ? t('hideDetails') : t('showDetails')}
              </span>
            </div>
          )}
        </div>
        {isMobileDevice ? (
          <Icon
            name="arrowForwardIos"
            className={classNames(styles.downArrow, {
              [styles.upArrow]: showDetails,
            })}
            size={ICON_CONSTANTS.SIZES.XXX_SMALL}
            type={ICON_CONSTANTS.TYPES.SECONDARY}
            onClick={toggleShowDetails}
          />
        ) : (
          <>
            <LowSmsWarning rule={rule} />
            <Permission
              permissionId={
                PERMISSION_CONSTANTS.triggerController_toggle__rule__active__status_update
              }
            >
              <Toggle isSelected={toggleActive} handleChange={handleToggle} />
            </Permission>
          </>
        )}
        {!isMobileDevice && showMoreActions && (
          <KebabMenu
            options={kebabMenuOptions}
            isVertical={true}
            classes={{
              iconFrame: styles.kebabWrapper,
              wrapper: styles.kebab,
              tooltipWrapper: styles.tooltipWrapper,
            }}
            place="right"
          />
        )}
      </div>
      {isMobileDevice && (
        <div>
          <Divider spacing="0" />
          <div className={styles.mobileCardFooter}>
            <LowSmsWarning
              rule={rule}
              fallback={
                <span className={styles.nextRunningOnLabel}>
                  {nextTriggerTime}
                </span>
              }
            />
            <Permission
              permissionId={
                PERMISSION_CONSTANTS.triggerController_toggle__rule__active__status_update
              }
            >
              <Toggle isSelected={toggleActive} handleChange={handleToggle} />
            </Permission>
          </div>
        </div>
      )}
      <RuleDetails
        rule={rule}
        showDetails={showDetails}
        groupNames={groupNames}
      />
      <Popup
        isOpen={deletePopupOpen}
        actionButtons={popupActionBtns}
        header={t('deleteRuleWithName', {name: rule.name})}
        onClose={() => {
          setDeletePopupOpen(false)
        }}
      >
        <Para
          textSize={PARA_CONSTANTS.TEXT_SIZE.LARGE}
          weight={PARA_CONSTANTS.WEIGHT.MEDIUM}
          className={styles.deletePopupText}
        >
          <Trans i18nKey={'ruleDeleteInfo'} values={{name: rule.name}} />
        </Para>
      </Popup>
      {showSentMessages && (
        <SendMessages toggleModal={toggleShowSentMessages} rule={rule} />
      )}
    </div>
  )
}

const LowSmsWarning = ({rule, fallback}) => {
  const {t} = useTranslation()
  const unusedQuota = useSelector(
    (state) => state.communicationInfo.sms.unusedQuota
  )

  const actions = new Set(rule.actions_list || [])

  const showNoSmsBalanceError =
    !isNaN(parseInt(unusedQuota)) &&
    unusedQuota <= 0 &&
    (actions.has(ACTIONS.SEND_SMS_IF_APP_NOT_INSTALLED) ||
      actions.has(ACTIONS.SEND_SMS_NOTIFICATIONS))

  if (showNoSmsBalanceError) {
    return (
      <Badges
        label={t('lowSmsBalance')}
        iconName="caution"
        type={BADGES_CONSTANTS.TYPE.ERROR}
        size={BADGES_CONSTANTS.SIZE.SMALL}
        className={styles.warningBadge}
      />
    )
  }

  return fallback || null
}
