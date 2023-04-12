import {Icon, Modal} from '@teachmint/common'
import classNames from 'classnames'
import React from 'react'
import {CLOSE} from '../../../constants'
import TopicList from './TopicList'
import styles from './TopicList.module.css'

export default function TopicListModal({
  isTopicListModalOpen,
  handleTopicListModalClose,
  setShowAllVideos,
  setShowAllStudyMaterials,
  setIsTopicListModalOpen,
}) {
  return (
    <div className={styles.topicListModalSection}>
      <Modal
        show={isTopicListModalOpen}
        className={classNames(
          styles.topicListModalMain,
          styles.topicListModalTag
        )}
      >
        <div className={styles.topicListModalHeaderSection}>
          <button
            className={styles.topicListModalCloseBtn}
            onClick={handleTopicListModalClose}
            title={CLOSE}
          >
            <Icon
              color="secondary"
              name="circledClose"
              size="xl"
              type="filled"
              className={styles.topicListModalCloseBtnIcon}
            />
          </button>
        </div>
        <div className={styles.mobileTopicListDiv}>
          <TopicList
            setShowAllVideos={setShowAllVideos}
            setShowAllStudyMaterials={setShowAllStudyMaterials}
            setIsTopicListModalOpen={setIsTopicListModalOpen}
            isTopicListModalOpen={isTopicListModalOpen}
          />
        </div>
      </Modal>
    </div>
  )
}
