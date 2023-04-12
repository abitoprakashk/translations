import classNames from 'classnames'
import React from 'react'
import styles from './TopicList.module.css'
import contentStyles from '../../../Content.module.css'
import {useDispatch, useSelector} from 'react-redux'
import {
  isStudyMaterialContentSetAction,
  setIsVideoModalOpenAction,
  setTopicAction,
} from '../../../redux/actions/contentActions'
import {useHistory} from 'react-router-dom'
import {PAGE_PATH} from '../../../constants'
import {events} from '../../../../../utils/EventsConstants'
import {useContent} from '../../../redux/contentSelectors'
import {getUrlWithParams} from '../../../commonFunctions'

export default function TopicList({
  setShowAllVideos,
  setShowAllStudyMaterials,
  setIsTopicListModalOpen,
  isTopicListModalOpen,
}) {
  const {
    topic: selectedTopic,
    topicList,
    currentLanguage,
    class: selectedClass,
    subject: selectedSubject,
    selectedCourse,
  } = useContent()

  const eventManager = useSelector((state) => state.eventManager)

  const dispatch = useDispatch()
  const history = useHistory()

  const handleTopicSelection = (topic) => {
    if (isTopicListModalOpen) setIsTopicListModalOpen(false)
    setShowAllVideos(false)
    setShowAllStudyMaterials(false)
    dispatch(setIsVideoModalOpenAction(false))
    dispatch(isStudyMaterialContentSetAction(false))
    dispatch(setTopicAction(topic))
    eventManager.send_event(events.PC_TOPIC_SELECTED, {pc_topic_name: topic})

    history.push(
      getUrlWithParams(PAGE_PATH.topicPage, {
        course: selectedCourse,
        language: currentLanguage,
        class: selectedClass,
        subject: selectedSubject,
        topic: encodeURIComponent(topic),
      })
    )
  }

  return (
    <div className={styles.section}>
      {Object.keys(topicList).length &&
        Object.entries(topicList).map(([topicId, topic]) => {
          return (
            <div
              key={topicId}
              className={classNames(styles.topicItem, {
                [styles.active]: selectedTopic && selectedTopic === topicId,
              })}
              onClick={() => handleTopicSelection(topicId)}
            >
              <span className={contentStyles.ellipsisAfterTwoLines}>
                {topic.name}
              </span>
            </div>
          )
        })}
    </div>
  )
}
