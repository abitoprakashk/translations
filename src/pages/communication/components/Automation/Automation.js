import {VirtualizedLazyList} from '@teachmint/common'
import {EmptyState} from '@teachmint/krayon'
import {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {t} from 'i18next'
import LinearTabOptions from '../../../../components/Common/LinearTabOptions/LinearTabOptions'
import RulesSetup from './components/RulesSetup/RulesSetup'
import {
  getAutomatedMessages,
  getRuleInstances,
  getRulesList,
} from '../../redux/actions/schedulerActions'
import feeStructureActionTypes from '../../../../pages/fee/redux/feeStructure/feeStructureActionTypes'
import {
  fetchUncategorisedClassesDataAction,
  setPostReceiversList,
} from '../../redux/actions/commonActions'
import ManageRules from './components/ManageRules/ManageRules'
import Message from './components/RuleCard/SendMessages/Message/Message'
import ReceiversList from '../Posts/components/ReceiversList/ReceiversList'
import RuleTemplates from './components/RuleTemplates/RuleTemplates'
import CreateModal from './components/CreateModal/CreateModal'
import styles from './Automation.module.css'
import Loader from '../../../../components/Common/Loader/Loader'
import {events} from '../../../../utils/EventsConstants'
import useInstituteHeirarchy from '../../../AttendanceReport/pages/StudentWiseAttendance/hooks/useInstituteHeirarchy'

export default function Automation() {
  const dispatch = useDispatch()
  const rulesList = useSelector(
    (state) => state.communicationInfo.scheduler.rulesList
  )

  const sendMessages = useSelector(
    (state) => state.communicationInfo.scheduler.sendMessages?.all
  )

  const loadingInfo = useSelector(
    (state) => state.communicationInfo.scheduler.loadingInfo
  )

  const instituteId = useSelector((state) => state.instituteInfo._id)

  const userSegmentLoader = useSelector(
    (state) => state.communicationInfo.common.userSegmentLoader
  )

  const eventManager = useSelector((state) => state.eventManager)
  const {heirarchy} = useInstituteHeirarchy({allSelected: true})

  const tabs = getAutomationTabs(rulesList?.length, sendMessages?.length)

  const [selectedTab, setSelectedTab] = useState(tabs.rulesSetup.id)
  const [receiversInfo, setReceiversInfo] = useState({})
  const [chosenTemplate, setChosenTemplate] = useState({})
  const [preSelectedIds, setPreSelectedIds] = useState([])

  useEffect(() => {
    dispatch(getRulesList())
    dispatch({type: feeStructureActionTypes.FETCH_FEE_STRUCTURES_REQUESTED})
    dispatch(getAutomatedMessages({}))
    dispatch(getRuleInstances())
  }, [])

  useEffect(() => {
    if (instituteId) {
      dispatch(fetchUncategorisedClassesDataAction(instituteId))
    }
  }, [instituteId])

  const handleTabClick = (tab) => {
    eventManager.send_event(events.COMMS_RULES_TAB_SWITCHED_TFI, {
      tab_name: tab,
    })
    setSelectedTab(tab)
  }

  const onSeeReceiversClick = (post, tabId) => {
    setReceiversInfo({post, tabId})
    dispatch(setPostReceiversList(post._id))
  }

  const onCreateModalClose = () => {
    setChosenTemplate({})
    setPreSelectedIds([])
  }

  const renderTabContent = () => {
    if (selectedTab === tabs.rulesSetup.id) {
      return (
        <RulesSetup
          heirarchy={heirarchy}
          loadingInfo={loadingInfo}
          setChosenTemplate={setChosenTemplate}
          setPreSelectedIds={setPreSelectedIds}
        />
      )
    }

    return (
      <SendMessages
        sendMessages={sendMessages}
        onSeeReceiversClick={onSeeReceiversClick}
        loading={loadingInfo.messages}
      />
    )
  }

  return (
    <div>
      <div className={styles.navContainer}>
        <div className={styles.tabGroupWrapper}>
          <LinearTabOptions
            options={Object.values(tabs)}
            selected={selectedTab}
            handleChange={handleTabClick}
          />
        </div>
        <ManageRules heirarchy={heirarchy} />
      </div>
      <div className={styles.contentContainer}>
        {renderTabContent()}
        <RuleTemplates setChosenTemplate={setChosenTemplate} />
      </div>
      <MessageReceivers
        receiversInfo={receiversInfo}
        setReceiversInfo={setReceiversInfo}
        userSegmentLoader={userSegmentLoader}
      />
      {chosenTemplate._id && (
        <CreateModal
          setModalOpen={onCreateModalClose}
          template={chosenTemplate}
          preSelectedIds={preSelectedIds}
        />
      )}
    </div>
  )
}

const MessageReceivers = ({
  receiversInfo,
  userSegmentLoader,
  setReceiversInfo,
}) => {
  if (userSegmentLoader) {
    return <Loader show />
  }

  if (receiversInfo?.post) {
    return (
      <ReceiversList
        setSliderOpen={() => setReceiversInfo(null)}
        tabId={receiversInfo.tabId}
        post={receiversInfo.post}
        showSmsTab={false}
      />
    )
  }

  return null
}

const SendMessages = ({sendMessages, onSeeReceiversClick, loading}) => {
  if (loading) {
    return <Loader show />
  }

  if (sendMessages?.length) {
    return (
      <div className={styles.vListWrapper}>
        <VirtualizedLazyList
          itemCount={sendMessages.length}
          rowsData={sendMessages}
          RowJSX={({item}) => (
            <Message
              key={item._id}
              post={item}
              onSelect={(tabId) => onSeeReceiversClick(item, tabId)}
            />
          )}
          dynamicSize
          loadMorePlaceholder={<div className="loader" />}
          showLoadMorePlaceholder={false}
        />
      </div>
    )
  }

  return (
    <EmptyState
      iconName="chat1"
      content={t('zeroMessagesSendViaAutomation')}
      button={null}
      classes={{wrapper: styles.emptyStateWrapper}}
    />
  )
}

const getAutomationTabs = (rulesCount = 0, messageCount = 0) => ({
  rulesSetup: {id: 1, label: t('ruleSetupTabLabel', {count: rulesCount})},
  messagesSent: {id: 2, label: t('messageSentLabel', {count: messageCount})},
})
