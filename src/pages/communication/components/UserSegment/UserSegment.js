import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import CommunicationStyles from '../../Communication.module.css'
import styles from './UserSegment.module.css'
import {
  setSegmentsAction,
  setNodeIdsAction,
  setAcademicSessionIdAction,
  setUserFilterTagsAction,
  setUserFilterVisibleAction,
  getUserListAction,
  fetchUncategorisedClassesDataAction,
  setTotalNoOfUsersAction,
  setSeletedUsersAction,
} from '../../redux/actions/commonActions'
import HierarchyChart from './components/HierarchyChart'
import UserList from './components/UserList'
import {
  announcementType,
  COMMUNICATION_TYPE,
  SEGMENTS_DEFAULT_VALUES,
} from '../../constants'
import {useActiveAcademicSessionId} from '../../../../utils/CustomHooks/AcademicSessionHook'
import {events} from '../../../../utils/EventsConstants'
import classNames from 'classnames'
import {getPostTypeInText} from '../../commonFunctions'
import {Trans, useTranslation} from 'react-i18next'
import {Icon} from '@teachmint/common'

import {getSelectedUsers} from '../../redux/actions/announcementActions'
const UserSegment = ({title, selectedOption}) => {
  const {instituteInfo, instituteHierarchy, eventManager} = useSelector(
    (state) => state
  )
  const {
    segments,
    node_ids,
    user_filter_tags,
    isUserFilterVisible,
    usersList,
    userSegmentLoader,
    uncategorisedClassesData,
    announcement_type,
    selected_users,
    selectAll,
    editPost,
  } = useSelector(({communicationInfo}) => communicationInfo.common)

  const announcementTitle = useSelector(
    (state) => state.communicationInfo.announcement.title
  )
  const feedbackTitle = useSelector(
    (state) => state.communicationInfo.feedback.message
  )
  const defaultSegment = useSelector(
    (state) => state.communicationInfo.defaultSegment.defaultSegment
  )
  const pollTitle = useSelector((state) => state.communicationInfo.poll.message)
  const announcementId = useSelector(
    (state) => state.communicationInfo.announcement.edit_id
  )
  const [userHierarchyIdList, setUserHierarchyIdList] = useState(node_ids)
  const [hierarchyData, setHierarchyData] = useState(instituteHierarchy)
  const [filteredUserList, setFilteredUserList] = useState([])
  const [isUnassigned, setIsUnassigned] = useState(false)
  const [isAllSelected, setIsAllSelected] = useState(false)
  const [displayed, setDisplayed] = useState(true)
  const [isAllUncategorisedSelected, setIsAllUncategorisedSelected] =
    useState(false)
  const [isFilterApplied, setIsFilterApplied] = useState(false)
  const [showSmsWarn, setShowSmsWarn] = useState(true)
  const sessionId = useActiveAcademicSessionId()
  const dispatch = useDispatch()
  const {t} = useTranslation()
  const findHierarchy = (id, root) => {
    if (root.id === id) return root
    if (root.children) {
      for (let i = 0; i < root.children.length; i++) {
        let res = findHierarchy(id, root.children[i])
        if (res) return res
      }
    }
  }
  const resetFilters = {
    node_ids: [sessionId],
    segments: SEGMENTS_DEFAULT_VALUES,
  }
  useEffect(() => {
    const getData = async () => {
      if (!selected_users.length || !(usersList?.length > 0)) {
        if (selectAll || defaultSegment.length !== 0) {
          dispatch(
            getUserListAction({
              node_ids: [sessionId],
              segments: segments,
            })
          )
        } else {
          dispatch(getUserListAction(resetFilters))
          if (editPost) {
            dispatch(getSelectedUsers(announcementId))
          }
        }
      }
      let rootChildren = instituteHierarchy.children.filter(
        (child) => child.type === 'DEPARTMENT'
      )
      dispatch(fetchUncategorisedClassesDataAction(instituteInfo._id))
      setHierarchyData({...instituteHierarchy, children: rootChildren})
      if (Array.isArray(userHierarchyIdList)) {
        let json = {}
        userHierarchyIdList.forEach(
          (item) => (json[item] = findHierarchy(item, instituteHierarchy)?.name)
        )
        setUserHierarchyIdList(json)
      }
      dispatch(setAcademicSessionIdAction(sessionId))
    }
    getData()
  }, [instituteInfo?._id])

  useEffect(() => {
    setFilteredUserList(usersList)
    if ((selectAll || defaultSegment.length !== 0) && displayed) {
      dispatch(
        setSeletedUsersAction(
          Array.from(usersList.map((rowData) => rowData._id))
        )
      )
      dispatch(setTotalNoOfUsersAction(usersList.length))
    }
  }, [usersList])

  const getParamForUserList = (ids = [], segmentArr) => {
    return {
      node_ids: ids,
      segments: segmentArr || segments,
    }
  }
  const updateUsers = (list) => {
    setUserHierarchyIdList({...list})
  }
  const addEventForApplyFilter = (data) => {
    eventManager.send_event(events.APPLY_FILTER_CLICKED_TFI, {
      post_title: getPostTitle(),
      post_type: getPostTypeInText(),
      all_classes: isAllSelected ? 'yes' : 'no',
      departments: null,
      standards: null,
      sections: null,
      unassigned: isUnassigned ? 'yes' : 'no',
      user_segments: data.length ? data.map((tag) => tag.name) : segments,
    })
  }
  const clearAll = () => {
    eventManager.send_event(events.CLEAR_ALL_FILTER_CLICKED_TFI, {
      post_type: selectedOption,
      post_title: title,
    })
    updateUsers({})
    dispatch(setUserFilterTagsAction([]))
    dispatch(setNodeIdsAction([]))
    dispatch(setSegmentsAction(SEGMENTS_DEFAULT_VALUES))
    dispatch(getUserListAction(resetFilters))
    setIsUnassigned(false)
    setIsAllSelected(false)
    setIsAllUncategorisedSelected(false)
    setIsFilterApplied(false)
  }
  const setCorrectHierarchy = (root, arr) => {
    let tmpArr = []
    root.children.forEach((dep) => {
      if (dep.children.length) {
        let res = setCorrectHierarchy(dep, arr)
        if (res) {
          tmpArr.push({
            id: dep.id,
            name: userHierarchyIdList[dep.id]
              ? userHierarchyIdList[dep.id]
              : dep.name,
          })
        }
      } else {
        if (userHierarchyIdList[dep.id]) {
          tmpArr.push({id: dep.id, name: userHierarchyIdList[dep.id]})
        }
      }
    })
    if (tmpArr.length === root.children.length) {
      return true
    } else {
      tmpArr.forEach((item) => {
        arr.push(item)
      })
    }
  }

  const setUncategorisedClasses = (arr) => {
    uncategorisedClassesData.forEach((item) => {
      if (userHierarchyIdList[item._id]) {
        arr.push({id: item._id, name: item.name})
      }
    })
  }

  const settingParamsBasedOnFilters = (filteredHierarchyIds, segment) => {
    let userAPIParams = {}
    if (userHierarchyIdList.all_departments) {
      // if user selects all classes
      userAPIParams = getParamForUserList([sessionId], segment)
    } else if (!filteredHierarchyIds.length && !isUnassigned) {
      // if user unselect every thing
      userAPIParams = resetFilters
    } else {
      userAPIParams = getParamForUserList(
        filteredHierarchyIds.map((item) => item.id),
        segment
      )
    }
    return userAPIParams
  }

  const applyFilter = async (segment) => {
    dispatch(setUserFilterVisibleAction(false))
    segment = handleUnassigned(isUnassigned, segment)
    let filteredHierarchyIds = []
    setCorrectHierarchy(hierarchyData, filteredHierarchyIds)
    setUncategorisedClasses(filteredHierarchyIds)
    let userAPIParams = settingParamsBasedOnFilters(
      filteredHierarchyIds,
      segment
    )
    dispatch(getUserListAction(userAPIParams))
    dispatch(setNodeIdsAction(userAPIParams.node_ids))
    dispatch(setSegmentsAction(userAPIParams.segments))
    // this is to display tags of filter
    let tagsData =
      segment.indexOf('unassigned') !== -1
        ? [...filteredHierarchyIds, {id: 1, name: 'Unassigned'}]
        : filteredHierarchyIds
    if (isAllUncategorisedSelected) {
      tagsData = [{id: 3, name: 'Uncategorised'}, ...tagsData]
    }
    if (isAllSelected) {
      tagsData = [{id: 2, name: 'All classes'}, ...tagsData]
    }
    dispatch(setUserFilterTagsAction(tagsData))
    addEventForApplyFilter(tagsData)
  }

  const getPostTitle = () => {
    let post_title = announcementTitle
    if (announcement_type === 1) {
      post_title = feedbackTitle
    } else if (announcement_type === 2) {
      post_title = pollTitle
    }
    return post_title
  }

  const addOrApplyFilter = () => {
    if (isUserFilterVisible) {
      applyFilter()
      setIsFilterApplied(true)
    } else {
      eventManager.send_event(events.ADD_FILTER_CLICKED_TFI, {
        post_type: getPostTypeInText(),
        post_title: getPostTitle(),
      })
    }

    dispatch(setUserFilterVisibleAction(!isUserFilterVisible))
  }
  const handleSegmentChange = async (arr) => {
    if (isFilterApplied) {
      applyFilter(arr)
    } else {
      const isUnassignedTagged = segments.indexOf('unassigned') !== -1
      arr = handleUnassigned(isUnassignedTagged, arr)
      let userAPIParams
      if (
        isUnassignedTagged &&
        node_ids[0] === sessionId &&
        user_filter_tags.length
      ) {
        userAPIParams = getParamForUserList([], arr)
      } else {
        userAPIParams = getParamForUserList(
          node_ids.length ? node_ids : [sessionId],
          arr
        )
      }
      dispatch(getUserListAction(userAPIParams))
    }
    setDisplayed(false)
    dispatch(setSegmentsAction(arr))
  }
  const handleUnassigned = (isChecked, segmentsArr) => {
    segmentsArr = segmentsArr || [...segments]
    if (isChecked && segmentsArr.indexOf('unassigned') !== -1)
      return segmentsArr
    if (!isChecked && segmentsArr.indexOf('unassigned') === -1)
      return segmentsArr
    if (isChecked) {
      segmentsArr.push('unassigned')
    } else {
      segmentsArr.splice(segmentsArr.indexOf('unassigned'), 1)
    }
    return segmentsArr
  }
  const handleCancelFilterClickedTfi = () => {
    eventManager.send_event(events.CANCEL_FILTER_CLICKED_TFI, {
      post_title: getPostTitle(),
      post_type: getPostTypeInText(),
    })
  }
  return (
    <>
      {showSmsWarn && announcement_type !== announcementType.SMS && (
        <div className={CommunicationStyles.smsWarn}>
          <div className={CommunicationStyles.flexDisplay}>
            <div className={CommunicationStyles.smsMessageIconContainer}>
              <Icon
                name="chat"
                size="xs"
                className={CommunicationStyles.smsMessageIcon}
              />
            </div>
            <div className={CommunicationStyles.smsWarnBody}>
              {t('userSegmentSmsWarn')}
            </div>
          </div>
          <div
            className={CommunicationStyles.smsCloseIconContainer}
            onClick={() => setShowSmsWarn(false)}
          >
            <Icon
              name="close"
              size="xs"
              color="secondary"
              className={styles.smsCloseIcon}
            />
          </div>
        </div>
      )}
      <div className={CommunicationStyles.contentTitle}>
        {announcement_type !== announcementType.SMS && (
          <div className={CommunicationStyles.contentTitleText}>
            <Trans i18nKey="selectWhomToShareThis">
              Select whom to share this {COMMUNICATION_TYPE[announcement_type]}{' '}
              with
            </Trans>
          </div>
        )}
        <div className={CommunicationStyles.contentTitleTextMweb}>
          {announcement_type !== announcementType.SMS
            ? t('selectUserSegment') + ' :'
            : null}
          {user_filter_tags.length ? (
            <span
              className={classNames(styles.clearAll, styles.clearAllMweb)}
              onClick={clearAll}
            >
              <Icon name="restore" color="error" size="xxxs" />
              {t('resetFilters')}
            </span>
          ) : null}
        </div>
      </div>
      <div>
        {isUserFilterVisible ? (
          <HierarchyChart
            data={hierarchyData}
            uncategorisedClasses={uncategorisedClassesData}
            updateUsers={updateUsers}
            hierarchyList={userHierarchyIdList}
            setUnassigned={setIsUnassigned}
            isUnassigned={isUnassigned}
            setIsAllSelected={setIsAllSelected}
            isAllSelected={isAllSelected}
            isAllUncategorisedSelected={isAllUncategorisedSelected}
            setIsAllUncategorisedSelected={setIsAllUncategorisedSelected}
            handleCancelFilterClickedTfi={handleCancelFilterClickedTfi}
            addOrApplyFilter={addOrApplyFilter}
            isUserFilterVisible={isUserFilterVisible}
          />
        ) : !userSegmentLoader ? (
          <UserList
            list={filteredUserList}
            clearAll={clearAll}
            tagData={user_filter_tags}
            setSendUsersTo={handleSegmentChange}
            handleCancelFilterClickedTfi={handleCancelFilterClickedTfi}
            addOrApplyFilter={addOrApplyFilter}
            isUserFilterVisible={isUserFilterVisible}
            sessionId={sessionId}
            isSelectAll={isAllSelected}
            isUnassigned={isUnassigned}
            isUncategorised={isAllUncategorisedSelected}
          />
        ) : null}
        {userSegmentLoader && (
          <div className={classNames('loader', styles.userSegmentLoader)}></div>
        )}
      </div>
    </>
  )
}
export default UserSegment
