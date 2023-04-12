import classNames from 'classnames'
import React from 'react'
import {useTranslation} from 'react-i18next'
import {useDispatch} from 'react-redux'
import PostAttachedFile from '../../Posts/components/PostAttachedFile'
import {setFeedbackInfoAction} from './../../../redux/actions/feedbackActions'
import postStyles from './../../Posts/Post.module.css'

export default function FeedbackPostContent({post, setIsFeedbackSilderOpen}) {
  const {t} = useTranslation()

  const dispatch = useDispatch()
  const handleViewAllResponses = ({_id, message, is_anonymous}) => {
    dispatch(
      setFeedbackInfoAction({
        announcement_id: _id,
        question: message,
        is_anonymous: is_anonymous,
      })
    )
    setIsFeedbackSilderOpen(true)
  }
  return (
    <>
      <div className={postStyles.postAnnouncementTitle}>{post.message}</div>
      {!!post.attachment_urls?.length || !!post.attachment_url ? (
        <PostAttachedFile post={post} />
      ) : null}
      {post.feedback_count > 0 && (
        <button
          className={classNames(postStyles.postFeedbackViewResponseBtn, 'mt-2')}
          onClick={() => handleViewAllResponses(post)}
        >
          {t('viewAllResponses')}
        </button>
      )}
    </>
  )
}
