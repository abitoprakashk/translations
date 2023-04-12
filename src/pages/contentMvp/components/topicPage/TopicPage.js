import {ErrorBoundary, VideoPlayerModal} from '@teachmint/common'
import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {
  CAPITALIZED_TEXT_STUDY_MATERIAL,
  CAPITALIZED_TEXT_VIDEO,
  DROPDOWN_ITEMS,
  FILE_TYPES,
  NOT_FOUND_TEXT,
  PAGES,
  PAYLOAD_FIELDS,
  SHOW_LIMITED_DATA_COUNT,
  STUDY_MATERIAL,
  STUDY_MATERIALS,
  VIDEO,
  VIDEOS,
} from '../../constants'
import StudyMaterialCard from './topicCard/StudyMaterialCard'
import VideoCard from './topicCard/VideoCard'
import TopicList from './topicList/TopicList'
import styles from './TopicPage.module.css'
import topicStyles from './topicList/TopicList.module.css'
import contentStyles from '../../Content.module.css'
import {
  clearTopicAction,
  fetchClassTaxonomyAction,
  fetchContentAction,
  fetchContentListRequestAction,
  fetchSubjectTaxonomyAction,
  fetchTopicTaxonomyAction,
  isStudyMaterialContentSetAction,
  setClassAction,
  setContentAction,
  setContentForReportAction,
  setCourseAction,
  setIsVideoModalOpenAction,
  setLanguageAction,
  setPageAction,
  setSubjectAction,
  setTopicAction,
} from '../../redux/actions/contentActions'
import ReportContentModal from './reportContentModal/ReportContentModal'
import {useParams} from 'react-router-dom'
import NotFoundCard from '../notFoundCard/NotFoundCard'
import {events} from '../../../../utils/EventsConstants'
import classNames from 'classnames'
import TopicListModal from './topicList/TopicListModal'
import {useContent} from '../../redux/contentSelectors'
import ContentSection from './contentSection/ContentSection'

// import VideoModal from './topicList/VideoModal'

export default function TopicPage() {
  const {
    taxonomyLoader,
    contentList,
    class: selectedClass,
    currentLanguage: selectedLanguage,
    languageList,
    subject: selectedSubject,
    topic: selectedTopic,
    topicList,
    contentListLoader,
    currentContent,
    isVideoModalOpen,
    selectedCourse,
    classList,
    courses,
    subjectList,
  } = useContent()
  const eventManager = useSelector((state) => state.eventManager)

  const dispatch = useDispatch()
  const urlParams = useParams()

  const [showAllVideos, setShowAllVideos] = useState(false)
  const [showAllStudyMaterials, setShowAllStudyMaterials] = useState(false)
  const [isTopicListModalOpen, setIsTopicListModalOpen] = useState(false)

  const languages = languageList[selectedCourse]
  const topicIds = Object.keys(topicList || {})

  useEffect(() => {
    if (selectedCourse && selectedTopic) {
      dispatch(
        fetchContentListRequestAction({
          parent_id: selectedTopic,
          filetypes: FILE_TYPES,
          language: selectedLanguage,
        })
      )
    }
  }, [selectedLanguage, selectedTopic, selectedCourse])

  useEffect(() => {
    dispatch(setPageAction(PAGES.contentPage))

    if (urlParams.course && urlParams.course !== selectedCourse) {
      dispatch(setCourseAction(urlParams.course))
    }

    if (urlParams.language && urlParams.language !== selectedLanguage) {
      dispatch(setLanguageAction(urlParams.language))
    }

    if (urlParams.class !== selectedClass) {
      dispatch(setClassAction(urlParams.class))
    }

    if (urlParams.subject !== selectedSubject) {
      dispatch(setSubjectAction(urlParams.subject))
    }

    if (
      Object.keys(languages || {}).length &&
      selectedClass &&
      selectedSubject
    ) {
      dispatch(
        fetchTopicTaxonomyAction({
          field: PAYLOAD_FIELDS.topicName,
          language: selectedLanguage,
          classId: selectedClass,
          subjectId: selectedSubject,
        })
      )
    }

    if (!Object.keys(classList).length) {
      const {children_type} =
        courses?.find((course) => course._id === selectedCourse) || {}

      if (children_type) {
        dispatch(
          fetchClassTaxonomyAction({
            field: PAYLOAD_FIELDS.className,
            parent_id: selectedCourse,
            language: selectedLanguage,
            children_type,
          })
        )
      }
    }

    if (!Object.keys(subjectList).length && selectedLanguage && selectedClass) {
      dispatch(
        fetchSubjectTaxonomyAction({
          field: PAYLOAD_FIELDS.subjectName,
          language: selectedLanguage,
          classId: selectedClass,
        })
      )
    }

    return () => {
      dispatch(clearTopicAction())
    }
  }, [])

  useEffect(() => {
    if (urlParams.topic && urlParams.topic !== selectedTopic) {
      dispatch(setTopicAction(decodeURIComponent(urlParams.topic)))
    } else if (
      topicIds.length &&
      (!selectedTopic || !topicIds.includes(selectedTopic))
    ) {
      dispatch(setTopicAction(topicIds[0]))
    }
  }, [topicIds, selectedTopic, urlParams.topic])

  const getFilteredContentList = (isViewAll, filterBy, isCount = false) => {
    let filteredArr = contentList.filter((content) => {
      return content.content_type === filterBy
    })
    if (!isViewAll) {
      filteredArr =
        filterBy === CAPITALIZED_TEXT_VIDEO
          ? filteredArr.slice(0, SHOW_LIMITED_DATA_COUNT.video)
          : filteredArr.slice(0, SHOW_LIMITED_DATA_COUNT.studyMaterial)
    }

    if (isCount) {
      return filteredArr.length
    }

    return filteredArr
  }

  const [isReportContentModalOpen, setIsReportContentModalOpen] =
    useState(false)
  const handleVideoPlay = (selectedContent) => {
    eventManager.send_event(events.PC_MATERIAL_CLICKED, {
      pc_material_id: selectedContent._id,
      pc_material_type: VIDEO,
    })
    eventManager.send_event(events.PC_VIDEO_PLAY_EVENT, {
      pc_material_id: selectedContent._id,
      pc_material_type: VIDEO,
      pc_material_duration: selectedContent?.video_duration,
    })
    dispatch(
      fetchContentAction({uuid: selectedContent.uuid, contentType: VIDEOS})
    )
  }

  const handleVideoModalClose = () => {
    dispatch(setIsVideoModalOpenAction(false))
  }

  const handleStudyMaterialClick = (selectedContent) => {
    eventManager.send_event(events.PC_MATERIAL_CLICKED, {
      pc_material_id: selectedContent._id,
      pc_material_type: STUDY_MATERIAL,
    })

    dispatch(isStudyMaterialContentSetAction(false))

    dispatch(
      fetchContentAction({
        uuid: selectedContent.uuid,
        contentType: STUDY_MATERIALS,
      })
    )
  }

  const handleShowHideData = (type) => {
    if (type === VIDEOS) {
      eventManager.send_event(events.PC_VIEW_ALL_CLICKED, {
        pc_material_type: VIDEO,
        total_material_available: getFilteredContentList(
          true,
          CAPITALIZED_TEXT_VIDEO,
          true
        ),
      })
      setShowAllVideos(!showAllVideos)
    } else {
      eventManager.send_event(events.PC_VIEW_ALL_CLICKED, {
        pc_material_type: STUDY_MATERIAL,
        total_material_available: getFilteredContentList(
          true,
          SHOW_LIMITED_DATA_COUNT,
          true
        ),
      })
      setShowAllStudyMaterials(!showAllStudyMaterials)
    }
  }

  const viewAllRemaingCount = (countOf, totalCount = 0) => {
    let remainingCount = 0
    if (countOf === CAPITALIZED_TEXT_VIDEO) {
      remainingCount = totalCount - SHOW_LIMITED_DATA_COUNT.video
    } else {
      remainingCount = totalCount - SHOW_LIMITED_DATA_COUNT.studyMaterial
    }
    remainingCount = remainingCount < 0 ? 0 : remainingCount
    return remainingCount
  }

  let videosList = getFilteredContentList(true, CAPITALIZED_TEXT_VIDEO)
  let stydyMatierialList = getFilteredContentList(
    true,
    CAPITALIZED_TEXT_STUDY_MATERIAL
  )
  let totalCountOfVideos = videosList.length
  let totalCountOfStudyMaterial = stydyMatierialList.length
  let remaingCountForVideos = viewAllRemaingCount(
    CAPITALIZED_TEXT_VIDEO,
    totalCountOfVideos
  )
  let remaingCountForStudyMaterial = viewAllRemaingCount(
    CAPITALIZED_TEXT_STUDY_MATERIAL,
    totalCountOfStudyMaterial
  )

  const handleTopicListModalOpen = () => {
    setIsTopicListModalOpen(true)
  }
  const handleTopicListModalClose = () => {
    setIsTopicListModalOpen(false)
  }

  const handleReportContent = (contentToReport) => {
    eventManager.send_event(events.PC_REPORT_CONTENT_CLICKED, {
      ppc_material_id: contentToReport._id,
      pc_material_type: contentToReport.content_type,
    })
    dispatch(setContentForReportAction(contentToReport))
    setIsReportContentModalOpen(true)
  }

  const dotsMenuButtonDropdownItems = [
    {
      title: DROPDOWN_ITEMS.reportContent,
      iconSrc: null,
      handleClick: handleReportContent,
    },
  ]

  const onVideoModalClosed = (videoElement) => {
    let myContent = {...currentContent}
    eventManager.send_event(events.PC_VIDEO_CLOSE_POPUP, {
      pc_material_id: myContent._id,
      pc_material_type: VIDEO,
      pc_material_duration: myContent.video_duration,
      pc_playing_time: videoElement.currentTime.toFixed(2),
    })
    dispatch(setContentAction(null))
  }

  if (taxonomyLoader) {
    return <div className="loader"></div>
  }

  if (!topicIds.length) {
    return <NotFoundCard text={NOT_FOUND_TEXT.topic} />
  }

  return (
    <>
      {isVideoModalOpen && (
        <ErrorBoundary>
          {/* <VideoModal
            isVideoModalOpen={isVideoModalOpen}
            handleVideoModalClose={handleVideoModalClose}
            onClose={onVideoModalClosed}
          /> */}
          <VideoPlayerModal
            videoControlOptions={{
              controls: true,
              autoPlay: true,
              controlsList: 'nodownload',
              disablePictureInPicture: true,
              className: classNames(styles.videoTag, styles.videoModalMain),
              onContextMenu: (e) => e.preventDefault(),
            }}
            videoUrl={currentContent?.content_url}
            videoTitle={currentContent?.title}
            isVideoModalOpen={isVideoModalOpen}
            handleVideoModalClose={handleVideoModalClose}
            onClose={onVideoModalClosed}
          />
        </ErrorBoundary>
      )}

      {isReportContentModalOpen && (
        <ErrorBoundary>
          <ReportContentModal
            isReportContentModalOpen={isReportContentModalOpen}
            setIsReportContentModalOpen={setIsReportContentModalOpen}
          />
        </ErrorBoundary>
      )}

      <div className={topicStyles.mobileTopicNameSection}>
        <div
          className={classNames(
            topicStyles.topicItem,
            topicStyles.mobileTopicListContainerItem,
            topicStyles.activeBorderBottomNone
          )}
          onClick={handleTopicListModalOpen}
        >
          <div className={contentStyles.ellipsisAfterTwoLines}>
            {topicList[selectedTopic]?.name}
          </div>
          <div className={topicStyles.mobileTopicImgSpan}>
            <img
              src="https://storage.googleapis.com/tm-assets/icons/secondary/down-arrow-secondary.svg"
              alt="down arraow"
            />
          </div>
        </div>
      </div>

      {isTopicListModalOpen && (
        <TopicListModal
          isTopicListModalOpen={isTopicListModalOpen}
          handleTopicListModalClose={handleTopicListModalClose}
          setShowAllVideos={setShowAllVideos}
          setShowAllStudyMaterials={setShowAllStudyMaterials}
          setIsTopicListModalOpen={setIsTopicListModalOpen}
        />
      )}

      <ErrorBoundary>
        <div className={styles.pageSection}>
          <div
            className={classNames(
              styles.topicListContainerForDesk,
              'show-scrollbar show-scrollbar-small'
            )}
          >
            <TopicList
              setShowAllVideos={setShowAllVideos}
              setShowAllStudyMaterials={setShowAllStudyMaterials}
              setIsTopicListModalOpen={setIsTopicListModalOpen}
              isTopicListModalOpen={isTopicListModalOpen}
            />
          </div>

          {contentListLoader ? (
            <div className="loader"></div>
          ) : (
            <div className={styles.contentListSectionDiv}>
              {totalCountOfVideos > 0 && (
                <ContentSection
                  pageSectionClass={styles.videoPageSection}
                  contentFor={VIDEOS}
                  headingText={VIDEOS}
                  isShowAll={showAllVideos}
                  handleShowHideData={() => handleShowHideData(VIDEOS)}
                  setIsReportContentModalOpen={setIsReportContentModalOpen}
                  remaingCounts={remaingCountForVideos}
                  totalCount={totalCountOfVideos}
                  iconNmae={'camera'}
                >
                  <div
                    className={classNames(
                      styles.videoSection,
                      'show-scrollbar show-scrollbar-small'
                    )}
                  >
                    {getFilteredContentList(
                      showAllVideos,
                      CAPITALIZED_TEXT_VIDEO
                    ).map((video, idx) => {
                      return (
                        <VideoCard
                          key={idx}
                          video={video}
                          handleVideoPlay={handleVideoPlay}
                          dropdownMenuItems={dotsMenuButtonDropdownItems}
                        />
                      )
                    })}
                  </div>
                </ContentSection>
              )}
              {totalCountOfVideos > 0 && totalCountOfStudyMaterial > 0 && (
                <hr className={styles.hr} />
              )}

              {totalCountOfStudyMaterial > 0 && (
                <ContentSection
                  pageSectionClass={styles.studyMaterialPageSection}
                  contentFor={STUDY_MATERIALS}
                  headingText={STUDY_MATERIALS}
                  isShowAll={showAllStudyMaterials}
                  handleShowHideData={() => handleShowHideData(STUDY_MATERIALS)}
                  setIsReportContentModalOpen={setIsReportContentModalOpen}
                  remaingCounts={remaingCountForStudyMaterial}
                  totalCount={totalCountOfStudyMaterial}
                  iconNmae={'studyMaterial'}
                >
                  <div
                    className={classNames(
                      styles.studyMaterialSection,
                      'show-scrollbar show-scrollbar-small'
                    )}
                  >
                    {getFilteredContentList(
                      showAllStudyMaterials,
                      CAPITALIZED_TEXT_STUDY_MATERIAL
                    ).map((studyMaterialInfo, idx) => {
                      return (
                        <StudyMaterialCard
                          key={idx}
                          studyMaterialInfo={studyMaterialInfo}
                          handleStudyMaterialClick={handleStudyMaterialClick}
                          dropdownMenuItems={dotsMenuButtonDropdownItems}
                        />
                      )
                    })}
                  </div>
                </ContentSection>
              )}

              {totalCountOfVideos === 0 && totalCountOfStudyMaterial === 0 && (
                <NotFoundCard text={NOT_FOUND_TEXT.content} />
              )}
            </div>
          )}
        </div>
      </ErrorBoundary>
    </>
  )
}
