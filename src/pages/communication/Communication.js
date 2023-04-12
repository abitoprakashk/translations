import React, {useState, useEffect, useCallback} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {ErrorBoundary} from '@teachmint/common'
import CreateNewModal from './components/CreateNewModal/CreateNewModal'
import Announcement from './components/Announcement/Announcement'
import Feedback from './components/Feedback/Feedback'
import Poll from './components/Poll/Poll'
import ConfirmationModal from './components/ConfirmationModal/ConfirmationModal'
import {
  setAttachmentFileAction,
  setAttachmentUrls,
  setDraftDataAction,
} from './redux/actions/commonActions'
import SaveDraftModal from './components/SaveDraftModal'
import CommSliderComp from './components/CommSliderComp/CommSliderComp'
import {events} from '../../utils/EventsConstants'
import AnalyticsPage from './components/AnalyticsPage/AnalyticsPage'
import {announcementType} from './constants'
import DeletePostModal from './components/DeletePostModal/DeletePostModal'
import {getPostTypeInText} from './commonFunctions'
import {useLocation} from 'react-router'
import styles from './Communication.module.css'
import {
  CommonActionType,
  DefaultSegmentType,
  SaveDraftType,
  SliderActionTypes,
  TemplateActionTypes,
} from './redux/actionTypes'
import {getTemplateAction} from './redux/actions/templateActions'
import {Sms} from './components/Sms/Sms'
import {
  getSmsPreview,
  getSmsUnusedQuotaRequest,
} from './redux/actions/smsActions'
import {v4 as uuidv4} from 'uuid'

import {
  Alert,
  ALERT_CONSTANTS,
  Button,
  BUTTON_CONSTANTS,
  HeaderTemplate,
  TabGroup,
} from '@teachmint/krayon'
import {COMMUNICATION_TAB_LISTS} from './constants'
import {Route, Switch, useHistory, useRouteMatch} from 'react-router-dom'
import Permission from '../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../utils/permission.constants'
import {t} from 'i18next'
import SmsListing from './components/SmsListing/SmsListing'
import Automation from './components/Automation/Automation'
import {checkPermission} from '../../utils/Permssions'
import {ProductFruits} from 'react-product-fruits'
import {REACT_APP_PRODUCT_FRUITS_KEY} from '../../constants'
export default function Communication() {
  const location = useLocation()
  const adminInfo = useSelector((state) => state.adminInfo)
  const eventManager = useSelector((state) => state.eventManager)
  const posts = useSelector((state) => state.communicationInfo.posts)
  const common = useSelector((state) => state.communicationInfo.common)
  const sms = useSelector((state) => state.communicationInfo.sms)
  const announcement_type = useSelector(
    (state) => state.communicationInfo.common.announcement_type
  )

  const announcementTitle = useSelector(
    (state) => state.communicationInfo.announcement.title
  )
  const feedbackTitle = useSelector(
    (state) => state.communicationInfo.feedback.message
  )
  const pollTitle = useSelector((state) => state.communicationInfo.poll.message)
  const total_no_of_users = useSelector(
    (state) => state.communicationInfo.common.total_no_of_users
  )
  const selected_users = useSelector(
    (state) => state.communicationInfo.common.selected_users
  )
  const selectAll = useSelector(
    (state) => state.communicationInfo.common.selectAll
  )
  const user_filter_tags = useSelector(
    (state) => state.communicationInfo.common.user_filter_tags
  )
  const userSegmentsForEvent = useSelector(
    (state) => state.communicationInfo.common.segments
  )
  const isSliderOpen = useSelector(
    (state) => state.communicationInfo.isSliderOpen.isSliderOpen
  )
  const popupInfo = useSelector((state) => state.popup.popupInfo)

  const currentTemplate = useSelector(
    (state) => state.communicationInfo.comm_templates.currentTemplate
  )
  const userRolePermission = useSelector(
    (state) => state.globalData?.userRolePermission
  )
  const instituteInfo = useSelector((state) => state.instituteInfo)
  const [forceShowRechargeSms, setForceShowRechargeSms] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState(
    location?.state?.selectedOption || announcementType.ANNOUNCEMENT
  )
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [showConfirmPopup, setShowConfirmPopup] = useState(false)
  const [selectedtab, setSelectedTab] = useState(
    COMMUNICATION_TAB_LISTS.allPosts.id
  )
  const countryCheck = instituteInfo['address']['country']
    ? instituteInfo['address']['country'] === 'India'
    : true
  const dispatch = useDispatch()
  const history = useHistory()
  const {path} = useRouteMatch()
  const tabOptions = () => {
    const temparr = Object.values(COMMUNICATION_TAB_LISTS).map((item) => item)
    if (countryCheck) return temparr
    return temparr.slice(0, 1)
  }
  const urlParams = new URLSearchParams(window.location.search)
  const getPostTitle = () => {
    let post_title = announcementTitle
    if (announcement_type === 1) {
      post_title = feedbackTitle
    } else if (announcement_type === 2) {
      post_title = pollTitle
    }
    return post_title
  }
  const handleTabClick = (tab) => {
    eventManager.send_event(events.COMMS_HEAD_TOGGLE_CLICKED_TFI, {
      selected_section: tab.label,
    })
    history.push(`${path}/${tab.route}`)
  }
  const createCommunication = () => {
    if (common.announcement_type === announcementType.SMS) {
      let obj = {...common, draft: false}
      obj = {
        template_id: sms.selectedTemplateId,
        input_variables: sms.userInputData,
        ...obj,
      }
      dispatch(getSmsPreview(obj))
    }
    setIsConfirmModalOpen(true)
  }

  const handleOpenCreateModal = useCallback(() => {
    eventManager.send_event(events.CREATE_NEW_POST_CLICKED_TFI)
    dispatch(setDraftDataAction(null))
    setIsCreateModalOpen(true)
  }, [])

  const handleCreateNewModalClose = () => {
    eventManager.send_event(events.CREATE_NEW_POST_POPUP_CLICKED_TFI, {
      post_type: 'closed',
    })
    setIsCreateModalOpen(false)
  }

  const handleOptionSelection = (selectedOpt) => {
    setSelectedOption(selectedOpt)
    dispatch({type: SliderActionTypes.SET_SLIDER, payload: true})
    setIsCreateModalOpen(false)
  }

  const handleNewPostConfirmationPopupClickedTfi = (action) => {
    eventManager.send_event(events.NEW_POST_CONFIRMATION_POPUP_CLICKED_TFI, {
      post_type: getPostTypeInText(announcement_type),
      post_title: getPostTitle(),
      selected: total_no_of_users,
      user_segments: user_filter_tags.length
        ? user_filter_tags.map((tag) => tag.name)
        : userSegmentsForEvent,
      action: action,
      nudge_type: selectAll ? popupInfo?.popup_type : null,
      user_ids: selected_users,
      template_type: currentTemplate,
    })
  }

  const handleConfirmationModalClose = () => {
    handleNewPostConfirmationPopupClickedTfi('declined')
    setIsConfirmModalOpen(false)
  }

  const handleConfirmationSubmit = async () => {
    handleNewPostConfirmationPopupClickedTfi('confirmed')
    setIsConfirmModalOpen(false)
    dispatch({type: SliderActionTypes.SET_SLIDER, payload: false})
    dispatch({
      type: TemplateActionTypes.SET_CURRENT_TEMPLATE,
      payload: null,
    })
  }

  const handleConfirmationModalPopup = () => {
    eventManager.send_event(events.EXIT_POST_POPUP_SHOWN_TFI, {
      exit_type: 'cross',
      post_type: getPostTypeInText(announcement_type),
      post_title: getPostTitle(),
      template_type: currentTemplate,
    })
    setShowConfirmPopup(true)
  }

  const handleDeclineAnnouncementPost = async (isDraft) => {
    eventManager.send_event(events.EXIT_POST_POPUP_CLICKED_TFI, {
      action_type: isDraft ? 'draft' : 'decline',
      post_type: getPostTypeInText(announcement_type),
      template_type: currentTemplate,
    })
    dispatch({type: SliderActionTypes.SET_SLIDER, payload: false})
    dispatch({
      type: TemplateActionTypes.SET_CURRENT_TEMPLATE,
      payload: null,
    })
    dispatch({type: SaveDraftType.SET_SAVE_DRAFT, payload: false})
    dispatch({
      type: DefaultSegmentType.SET_DEFAULT_SEGMENT,
      payload: [],
    })
    setShowConfirmPopup(false)

    if (common.redirectOnClose) {
      let redirectOnCloseTemp = common.redirectOnClose
      dispatch({type: CommonActionType.REDIRECT_ON_CLOSE, payload: null})
      history.push(redirectOnCloseTemp)
    }
  }

  const editDraft = useCallback((data) => {
    dispatch(setDraftDataAction({...data}))
    const tempArr = data.attachment_urls
    const idArr = []
    const urlsArr = []
    if (tempArr?.length) {
      tempArr.map((url) => {
        const obj = {id: uuidv4(), url: url}
        idArr.push(obj)
        urlsArr.push(url)
      })
    }
    dispatch(setAttachmentFileAction(idArr))
    dispatch(setAttachmentUrls(urlsArr))
    setShowConfirmPopup(false)
    handleOptionSelection(data.announcement_type)
  }, [])

  const handleCommunicationComp = () => {
    switch (selectedOption) {
      case announcementType.ANNOUNCEMENT:
        return <Announcement createCommunication={createCommunication} />
      case announcementType.FEEDBACK:
        return <Feedback createCommunication={createCommunication} />
      case announcementType.POLL:
        return <Poll createCommunication={createCommunication} />
      case announcementType.SMS:
        return <Sms createCommunication={createCommunication} />
      default:
        return null
    }
  }
  useEffect(() => {
    let currentRoute = window.location.pathname.split('/').slice(-1)[0]
    let currentPage = tabOptions()
    currentPage = currentPage.find((obj) => obj.route === currentRoute)
    if (!currentPage) {
      currentPage = tabOptions()
      history.push(`${path}/${currentPage[0].route}`)
    }
    setSelectedTab(currentPage.id)
  }, [window?.location?.pathname])

  useEffect(() => {
    if (!location?.state?.hasData) {
      dispatch(
        setDraftDataAction({redirectOnSuccess: common.redirectOnSuccess})
      )
    }

    dispatch(getTemplateAction())
    dispatch(getSmsUnusedQuotaRequest())
  }, [])

  useEffect(() => {
    if (
      !checkPermission(
        userRolePermission,
        PERMISSION_CONSTANTS.communicationController_announcement_create
      )
    ) {
      return
    }
    const title = urlParams.get('title') || ''
    const message = urlParams.get('message') || ''
    if (title.length > 150) {
      return
    }
    if (title || message) {
      editDraft({
        announcement_type: announcementType.ANNOUNCEMENT,
        title: title,
        message: message,
        channels: ['notification'],
        segments: ['teacher', 'student', 'unassigned'],
      })
    }
  }, [])
  const handleSmsRechargeClick = () => {
    setForceShowRechargeSms(true)
    handleTabClick(COMMUNICATION_TAB_LISTS.sms)
    eventManager.send_event(events.COMMS_SMS_RECHARGE_BALANCE_CLICKED, {
      source: 'error_message',
    })
  }

  return (
    <div className={styles.wrapper}>
      <HeaderTemplate
        mainHeading={'Communication'}
        headerTemplateRightElement={
          <Permission
            permissionId={
              PERMISSION_CONSTANTS.communicationController_announcement_create
            }
          >
            <Button onClick={handleOpenCreateModal} children={t('createNew')} />
          </Permission>
        }
      />
      {!isNaN(parseInt(sms.unusedQuota)) && sms.unusedQuota <= 0 && (
        <Alert
          content={
            <div className={styles.lowSmsBalanceAlertContent}>
              {t('insufficientSmsBalance')}
              <Button
                type={BUTTON_CONSTANTS.TYPE.TEXT}
                classes={{button: styles.rechargeSmsBtn}}
                onClick={handleSmsRechargeClick}
              >
                {t('rechargeSms')}
              </Button>
            </div>
          }
          type={ALERT_CONSTANTS.TYPE.ERROR}
          className={styles.lowSmsBalanceAlert}
        />
      )}
      <ProductFruits
        workspaceCode={REACT_APP_PRODUCT_FRUITS_KEY}
        language={adminInfo.lang || 'en'}
        user={{username: adminInfo._id, role: adminInfo.user_type}}
        lifeCycle="unmount"
      />
      <div className={styles.tabGroupWrapper}>
        {countryCheck ? (
          <TabGroup
            showMoreTab={false}
            tabOptions={tabOptions()}
            selectedTab={selectedtab}
            onTabClick={handleTabClick}
          />
        ) : null}
      </div>
      <ErrorBoundary>
        <Switch>
          <Route path={`${path}/${COMMUNICATION_TAB_LISTS.allPosts.route}`}>
            <AnalyticsPage
              editDraft={editDraft}
              onCreatePost={handleOpenCreateModal}
            />
          </Route>
          <Route path={`${path}/${COMMUNICATION_TAB_LISTS.sms.route}`}>
            <SmsListing
              forceShowRechargeSms={forceShowRechargeSms}
              setForceShowRechargeSms={setForceShowRechargeSms}
              handleSendSMS={() => handleOptionSelection(announcementType.SMS)}
            />
          </Route>
          <Route path={`${path}/${COMMUNICATION_TAB_LISTS.automation.route}`}>
            <Automation />
          </Route>
        </Switch>
      </ErrorBoundary>
      <ErrorBoundary>
        <CreateNewModal
          handleClick={() => setIsCreateModalOpen(false)}
          handleOptionSelection={handleOptionSelection}
          isCreateModalOpen={isCreateModalOpen}
          handleCreateNewModalClose={handleCreateNewModalClose}
        />
      </ErrorBoundary>
      <ErrorBoundary>
        {isSliderOpen ? (
          <CommSliderComp
            width="900"
            handleConfirmationModalPopup={handleConfirmationModalPopup}
            handleDeclineAnnouncementPost={handleDeclineAnnouncementPost}
          >
            <>
              {handleCommunicationComp()}
              <ErrorBoundary>
                <ConfirmationModal
                  isConfirmModalOpen={isConfirmModalOpen}
                  handleConfirmationModalClose={handleConfirmationModalClose}
                  handleConfirmationSubmit={handleConfirmationSubmit}
                  handleDeclineModal={() => setIsConfirmModalOpen(false)}
                />
              </ErrorBoundary>
            </>
          </CommSliderComp>
        ) : null}
      </ErrorBoundary>
      <ErrorBoundary>
        {showConfirmPopup && (
          <SaveDraftModal
            setShowConfirmPopup={setShowConfirmPopup}
            handleDeclineAnnouncementPost={handleDeclineAnnouncementPost}
            announcement_type={announcement_type}
          />
        )}
      </ErrorBoundary>

      {posts.isDeletePostModalOpen && <DeletePostModal />}
    </div>
  )
}
