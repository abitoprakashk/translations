import React, {useState, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {useTranslation} from 'react-i18next'
import LinearTabOptions from '../../../../components/Common/LinearTabOptions/LinearTabOptions'
import {events} from '../../../../utils/EventsConstants'
import {
  fetchPostsDataRequestAction,
  setFilteredPostsAction,
} from './../../redux/actions/postsActions'
import Posts from './../Posts/Posts'
import styles from './../../Communication.module.css'
import FeedbackResponse from '../Feedback/components/FeedbackResponse/FeedbackResponse'
import CommSliderComp from '../CommSliderComp/CommSliderComp'
import {ANALYTICS_TABS, announcementType} from '../../constants'
import {getPostTypeInText} from '../../commonFunctions'
import {setIsPostCreatedOrUpdatedAction} from '../../redux/actions/commonActions'
import Templates from '../Templates/Templates'
import {VirtualizedLazyList} from '@teachmint/common'
import {
  Button,
  SearchBar,
  BUTTON_CONSTANTS,
  ICON_CONSTANTS,
  Chips,
  EmptyState,
} from '@teachmint/krayon'
import FilterModal from '../FilterModal/FilterModal'
import {getTimeFilterCheck} from '../../commonFunctions'
import {isMobile} from '@teachmint/krayon'
import {FILTER_KEYS, FILTER_OPTIONS} from '../FilterModal/Filter.constants'

function AnalyticsPage({editDraft, onCreatePost}) {
  const {t} = useTranslation()
  const posts = useSelector((state) => state.communicationInfo.posts)
  const selectAll = useSelector(
    (state) => state.communicationInfo.common.selectAll
  )

  const {filteredPosts, postList, isPostsLoading} = posts
  const [isFeedbackSilderOpen, setIsFeedbackSilderOpen] = useState(false)
  const [filterModalOpen, setFilterModalOpen] = useState(false)
  const instituteInfo = useSelector((state) => state.instituteInfo)
  const currentAdminInfo = useSelector((state) => state.currentAdminInfo)
  const eventManager = useSelector((state) => state.eventManager)
  const instituteActiveAcademicSessionId = useSelector(
    (state) => state.instituteActiveAcademicSessionId
  )
  const isLoading = useSelector(
    (state) => state.communicationInfo.common.isLoading
  )

  const announcementTilte = useSelector(
    (state) => state.communicationInfo.announcement.title
  )
  const feedbackTilte = useSelector(
    (state) => state.communicationInfo.feedback.message
  )
  const pollTilte = useSelector((state) => state.communicationInfo.poll.message)
  const announcement_type = useSelector(
    (state) => state.communicationInfo.common.announcement_type
  )
  const isPostCreatedOrUpdated = useSelector(
    (state) => state.communicationInfo.common.isPostCreatedOrUpdated
  )
  const total_no_of_users = useSelector(
    (state) => state.communicationInfo.common.total_no_of_users
  )
  const selected_users = useSelector(
    (state) => state.communicationInfo.common.selected_users
  )
  const user_filter_tags = useSelector(
    (state) => state.communicationInfo.common.user_filter_tags
  )
  const userSegmentForEvent = useSelector(
    (state) => state.communicationInfo.common.user_filter_tags
  )
  const draft = useSelector((state) => state.communicationInfo.common.draft)
  const popupInfo = useSelector((state) => state.popup.popupInfo)

  const [currentTab, setCurrentTab] = useState(ANALYTICS_TABS.ALL)
  const [sentPost, setSentPost] = useState([])
  const [myPost, setMyPost] = useState([])
  const [draftPost, setDraftPost] = useState([])
  const [postInView, setPostInView] = useState([])
  const [searchText, setSearchText] = useState('')

  const queryParameters = new URLSearchParams(window.location.search)
  const template_priority = queryParameters.get('template_priority')

  const [filterOptions, setFilterOptions] = useState({})
  const [chipOptions, setChipOptions] = useState([])
  const dispatch = useDispatch()

  useEffect(() => {
    if (instituteInfo._id && currentAdminInfo.imember_id)
      dispatch(fetchPostsDataRequestAction())
  }, [
    instituteInfo._id,
    currentAdminInfo.imember_id,
    instituteActiveAcademicSessionId,
  ])

  useEffect(() => {
    setCurrentTab(ANALYTICS_TABS.ALL)
    applyFilters(filterOptions)
  }, [postList])

  useEffect(() => {
    if (isPostCreatedOrUpdated) {
      eventManager.send_event(events.NEW_POST_CREATED_TFI, {
        post_type: getPostTypeInText(announcement_type),
        post_title: getPostTitle(),
        selected: total_no_of_users,
        user_segments: user_filter_tags.length
          ? user_filter_tags.map((tag) => tag.name)
          : userSegmentForEvent,
        isDraft: draft,
        nudge_type: selectAll ? popupInfo?.popup_type : null,
        user_ids: selected_users,
      })

      dispatch(setIsPostCreatedOrUpdatedAction(false))
    }
  }, [isPostCreatedOrUpdated])

  useEffect(() => {
    filterAllPosts()
  }, [filteredPosts])

  useEffect(() => {
    getChipOptions()
  }, [filterOptions])

  const getPostTitle = () => {
    let post_title = announcementTilte
    if (announcement_type === announcementType.FEEDBACK) {
      post_title = feedbackTilte
    } else if (announcement_type === announcementType.POLL) {
      post_title = pollTilte
    }
    return post_title
  }

  const getChipOptions = () => {
    let chipList = []
    Object.entries(filterOptions).map(([key, value]) => {
      if (!Object.keys(FILTER_OPTIONS).includes(key)) {
        return
      }
      if (key === FILTER_KEYS.TIME) {
        FILTER_OPTIONS[key].children.map((ele) => {
          if (ele.value === value) {
            chipList.push({id: `${key}_${value}`, label: ele.label})
          }
        })
      } else {
        value.map((val) => {
          let obj = FILTER_OPTIONS[key].children.find(
            (ele) => ele.value === val
          )
          if (obj) {
            chipList.push({id: `${key}_${val}`, label: obj.label})
          }
        })
      }
    })
    setChipOptions(chipList)
  }

  const handleTabClick = (tab) => {
    setCurrentTab(tab)
    if (tab === ANALYTICS_TABS.ALL) {
      eventManager.send_event(events.ALL_POSTS_CLICKED_TFI)
      setPostInView(sentPost)
    } else if (tab === ANALYTICS_TABS.MY_POSTS) {
      eventManager.send_event(events.MY_POSTS_CLICKED_TFI)
      setPostInView(myPost)
    } else if (tab === ANALYTICS_TABS.DRAFTS) {
      eventManager.send_event(events.DRAFT_POSTS_CLICKED_TFI)
      setPostInView(draftPost)
    }
  }

  const resetPosts = () => {
    let newList = postList.filter((item) => {
      return !item.automated
    })
    dispatch(setFilteredPostsAction(newList))
  }

  const filterAllPosts = () => {
    let sentPostTemp = filteredPosts.filter((item) => {
      return !item.deleted && !item.draft
    })
    setSentPost(sentPostTemp)
    let myPostTemp = filteredPosts.filter((item) => {
      return item.creator_id === currentAdminInfo.imember_id && !item.draft
    })
    setMyPost(myPostTemp)
    let draftPostTemp = filteredPosts.filter((item) => {
      return item.draft
    })
    setDraftPost(draftPostTemp)

    if (currentTab === ANALYTICS_TABS.ALL) {
      setPostInView(sentPostTemp)
    }
    if (currentTab === ANALYTICS_TABS.MY_POSTS) {
      setPostInView(myPostTemp)
    }
    if (currentTab === ANALYTICS_TABS.DRAFTS) {
      setPostInView(draftPostTemp)
    }
  }

  const handleSearch = ({value}) => {
    setSearchText(value)
    if (value) {
      let tempList = filteredPosts.filter((item) => {
        return (
          item.title?.toLowerCase().includes(value) ||
          item.message?.toLowerCase().includes(value)
        )
      })
      dispatch(setFilteredPostsAction(tempList))
    } else {
      if (filterOptions.length) {
        applyFilters(filterOptions)
      } else {
        resetPosts()
      }
    }
  }

  const applyFilters = (selected) => {
    if (!Object.keys(selected).length) {
      if (searchText) {
        filterAllPosts()
      } else {
        resetPosts()
      }
    } else {
      const newPostList = postList.filter((item) => {
        const messageCondition = selected?.message?.length
          ? selected[FILTER_KEYS.MESSAGE].includes(item.announcement_type)
          : true

        const receiverCondition = selected?.receiver?.length
          ? item.segments.some((val) =>
              selected[FILTER_KEYS.RECEIVER]?.includes(val)
            )
          : true

        const timeCondition =
          FILTER_KEYS.TIME in selected
            ? getTimeFilterCheck(item, selected.time, selected.range)
            : true
        return (
          messageCondition &&
          receiverCondition &&
          timeCondition &&
          !item.automated
        )
      })
      dispatch(setFilteredPostsAction(newPostList))
    }
    setFilterModalOpen(false)
    setFilterOptions(selected)
  }

  const onChipClose = (id) => {
    let [key, value] = id.split('_')
    let newOptions = {...filterOptions}
    if (key === FILTER_KEYS.TIME) {
      delete newOptions[key]
      setFilterOptions(newOptions)
    } else {
      let checkVal = +value
      if (isNaN(checkVal)) {
        checkVal = value
      }
      let index = newOptions[key].indexOf(checkVal)
      newOptions[key].splice(index, 1)
      setFilterOptions(newOptions)
    }
    applyFilters(newOptions)
  }

  const postJsx = ({item}) => {
    return (
      <Posts
        key={item._id}
        post={item}
        editIt={editDraft}
        setIsFeedbackSilderOpen={setIsFeedbackSilderOpen}
        handleTabClick={handleTabClick}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
      />
    )
  }

  const getPostListSection = () => {
    if (isPostsLoading) {
      return <div className="loader" />
    }

    if (!postList?.length) {
      return (
        <div className={styles.emptyStateContainer}>
          <EmptyState
            content={t('noPostsLabel')}
            iconName="chat1"
            button={{
              children: t('createNew'),
              onClick: onCreatePost,
            }}
          />
        </div>
      )
    }

    return (
      <div className={styles.postListSection}>
        <div className={styles.communicationActions}>
          <div className={styles.searchBoxContainer}>
            <div className={styles.searchBoxWrapper}>
              <SearchBar value={searchText} handleChange={handleSearch} />
            </div>
            {!isMobile() && (
              <Button
                type={BUTTON_CONSTANTS.TYPE.OUTLINE}
                onClick={() => {
                  setFilterModalOpen(true)
                }}
                children={t('filters')}
                prefixIcon="filter"
                prefixIconVersion={ICON_CONSTANTS.VERSION.OUTLINED}
              />
            )}
          </div>
          {!!chipOptions.length && (
            <div className={styles.chips}>
              <Chips chipList={chipOptions} onChange={onChipClose} />
            </div>
          )}
          <div className={styles.linearTabs}>
            <LinearTabOptions
              options={[
                {
                  id: ANALYTICS_TABS.ALL,
                  label: `Sent Posts(${sentPost.length})`,
                },
                {
                  id: ANALYTICS_TABS.MY_POSTS,
                  label: `${t('myPosts')}(${myPost.length})`,
                },
                {
                  id: ANALYTICS_TABS.DRAFTS,
                  label: `${t('drafts')}(${draftPost.length})`,
                },
              ]}
              selected={currentTab}
              handleChange={(tab) => handleTabClick(tab)}
            />
          </div>
        </div>

        <div className={styles.communicationCard}>
          <div className={styles.communicatonHeaderSec} />
          {postInView.length ? (
            <div className={styles.virtualisedListWrapper}>
              <VirtualizedLazyList
                itemCount={postInView.length}
                itemSize={2}
                rowsData={postInView}
                loadMoreItems={() => {}}
                RowJSX={postJsx}
                dynamicSize={true}
                loadMorePlaceholder={<div className="loader" />}
                showLoadMorePlaceholder={false}
              />
            </div>
          ) : (
            <div className={styles.postNotFoundSec}>
              <div>{t('postsNotFound')}</div>
            </div>
          )}

          {isFeedbackSilderOpen ? (
            <CommSliderComp
              width="900"
              handleConfirmationModalPopup={() =>
                setIsFeedbackSilderOpen(false)
              }
            >
              {<FeedbackResponse />}
            </CommSliderComp>
          ) : null}
        </div>
      </div>
    )
  }

  return (
    <>
      <div className={styles.contentContainer}>
        <div className={styles.postListSection}>{getPostListSection()}</div>
        <div>
          <Templates editDraft={editDraft} priorityParam={template_priority} />
        </div>
      </div>
      {isLoading && <div className="loader"></div>}
      {!isMobile() && filterModalOpen && (
        <FilterModal
          isOpen={filterModalOpen}
          onClose={() => setFilterModalOpen(false)}
          onApply={applyFilters}
          selected={filterOptions}
          hideSections={[FILTER_KEYS.SMS_TYPE]}
        />
      )}
    </>
  )
}
export default React.memo(AnalyticsPage)
