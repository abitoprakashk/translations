import {
  Badges,
  BADGES_CONSTANTS,
  EmptyState,
  Icon,
  ICON_CONSTANTS,
  isMobile,
  Modal,
  MODAL_CONSTANTS,
} from '@teachmint/krayon'
import classNames from 'classnames'
import {useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {useDispatch, useSelector} from 'react-redux'
import {toggleRuleInstances} from '../../../../redux/actions/schedulerActions'
import {INSTANCE_STATUS} from '../../Automation.constants'
import useActiveSessionRangeSelector from '../../hooks/useActiveSessionRangeSelector'
import RuleCard from '../RuleCard/RuleCard'
import {events} from '../../../../../../utils/EventsConstants'
import {
  getActiveRuleInstances,
  getRulesRunningOnCurrentAndNextDay,
} from '../../utils'
import styles from './ManageRules.module.css'

export default function ManageRules({heirarchy}) {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const isMobileDevice = isMobile()

  const {sessionEndDatePassed} = useActiveSessionRangeSelector()
  const ruleInstances = useSelector(
    (state) => state.communicationInfo?.scheduler?.ruleInstances
  )
  const eventManager = useSelector((state) => state.eventManager)

  const [showManageRulesModal, setShowManageRulesModal] = useState(false)
  const [showRulesForToday, setShowRulesForToday] = useState(true)
  const [instanceActiveStatus, setInstanceActiveStatus] = useState({})

  useEffect(() => {
    if (ruleInstances?.length) {
      const status = ruleInstances.reduce((acc, curr) => {
        acc[curr._id] = curr.status === INSTANCE_STATUS.PENDING
        return acc
      }, {})

      setInstanceActiveStatus(status)
    }
  }, [ruleInstances])

  const onRuleToggle = ({rule_id, status}) => {
    setInstanceActiveStatus((prev) => ({...prev, [rule_id]: status}))
    eventManager.send_event(events.COMMS_RULES_TOGGLED_TFI, {
      manage_modal: 1,
      status,
      rule_id,
    })
  }

  const onSaveAndExit = () => {
    const instancesToToggle = []

    const currentStatus = ruleInstances.reduce((acc, curr) => {
      acc[curr._id] = curr.status === INSTANCE_STATUS.PENDING
      return acc
    }, {})

    Object.entries(instanceActiveStatus).forEach(([ruleId, isActive]) => {
      if (currentStatus[ruleId] !== isActive) {
        instancesToToggle.push({
          instance_id: ruleId,
          status: isActive,
        })
      }
    })

    if (instancesToToggle.length) {
      dispatch(
        toggleRuleInstances({
          instances_list: instancesToToggle,
        })
      )
    }
    eventManager.send_event(events.COMMS_RULES_MANAGE_SAVEANDEXIT_TFI)
    setShowManageRulesModal(false)
  }

  const [rulesRunningToday, rulesRunningTomorrow] =
    getRulesRunningOnCurrentAndNextDay(ruleInstances)

  const toggleManageRulesModal = () => {
    setShowManageRulesModal((open) => !open)
    eventManager.send_event(events.COMMS_RULES_MANAGE_CLICKED)
  }

  const isHidden =
    sessionEndDatePassed ||
    (!rulesRunningToday.length && !rulesRunningTomorrow.length)

  const activeList = showRulesForToday
    ? rulesRunningToday
    : rulesRunningTomorrow

  return isHidden && isMobileDevice ? null : (
    <div
      className={classNames(styles.manageContainer, {
        [styles.hide]: isHidden,
      })}
    >
      <Icon
        name="autoRenew"
        type={ICON_CONSTANTS.TYPES.SECONDARY}
        size={ICON_CONSTANTS.SIZES.XX_SMALL}
        className={styles.manageIcon}
      />
      <span>
        {t('rulesRunning', {
          count: getActiveRuleInstances(rulesRunningToday).length,
        })}
        <span className={styles.manageLink} onClick={toggleManageRulesModal}>
          {t('manage')}
        </span>
      </span>
      <Modal
        isOpen={showManageRulesModal}
        size={MODAL_CONSTANTS.SIZE.MEDIUM}
        header={t('manageRules')}
        actionButtons={[{body: t('saveAndExit'), onClick: onSaveAndExit}]}
        onClose={toggleManageRulesModal}
      >
        <div className={styles.manageModalBody}>
          <div className={styles.badgeGroup}>
            <Badges
              size={BADGES_CONSTANTS.SIZE.MEDIUM}
              type={
                showRulesForToday
                  ? BADGES_CONSTANTS.TYPE.PRIMARY
                  : BADGES_CONSTANTS.TYPE.BASIC
              }
              inverted={showRulesForToday}
              showIcon={false}
              label={t('today')}
              className={styles.cursorPointer}
              onClick={() => {
                setShowRulesForToday(true)
                eventManager.send_event(
                  events.COMMS_MANAGE_DAY_TAB_CHANGED_TFI,
                  {
                    today: 1,
                  }
                )
              }}
            />
            <Badges
              size={BADGES_CONSTANTS.SIZE.MEDIUM}
              type={
                !showRulesForToday
                  ? BADGES_CONSTANTS.TYPE.PRIMARY
                  : BADGES_CONSTANTS.TYPE.BASIC
              }
              inverted={!showRulesForToday}
              showIcon={false}
              label={t('tomorrow')}
              className={styles.cursorPointer}
              onClick={() => {
                setShowRulesForToday(false)
                eventManager.send_event(
                  events.COMMS_MANAGE_DAY_TAB_CHANGED_TFI,
                  {
                    today: 0,
                  }
                )
              }}
            />
          </div>
          <div
            className={classNames(styles.rulesContainer, {
              [styles.justifyCenter]: !activeList.length,
            })}
          >
            {activeList.length ? (
              activeList.map((rule) => (
                <RuleCard
                  key={rule._id}
                  rule={rule}
                  showMoreActions={false}
                  onRuleToggle={onRuleToggle}
                  hierarchy={heirarchy}
                  ruleActive={instanceActiveStatus[rule._id]}
                />
              ))
            ) : (
              <EmptyState
                iconName="addChart"
                content={t('noRuleScheduledToRunOn', {
                  date: showRulesForToday
                    ? t('todayLowerCase')
                    : t('tomorrowLowerCase'),
                })}
                button={null}
              />
            )}
          </div>
        </div>
      </Modal>
    </div>
  )
}
