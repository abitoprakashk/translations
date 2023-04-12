import React from 'react'
import postStyles from '../../Posts/Post.module.css'
import PostAttachedFile from '../../Posts/components/PostAttachedFile'
import PollOption from './PollOption/PollOption'

export default function PollPostContent({post}) {
  const claculatePercentage = (votes) => {
    if (post.poll_count && votes !== 0) {
      return votes
        ? Math.round((+votes * 100) / +post.downloaded_users_count)
        : 0
    } else {
      return 0
    }
  }

  return (
    <>
      <div className={postStyles.postAnnouncementTitle}>{post.message}</div>

      {post?.question_options &&
        Object.keys(post.question_options).map((optionKey) => {
          return (
            <PollOption
              key={optionKey}
              title={`${post.question_options[optionKey]}`}
              isDraft={post.draft}
              resultPercentage={
                post.poll_count
                  ? claculatePercentage(
                      post.poll_count ? post.poll_count[optionKey] : 0
                    )
                  : 0
              }
              votes={post.poll_count ? post.poll_count[optionKey] : 0}
            />
          )
        })}

      {!!post.attachment_urls?.length || !!post.attachment_url ? (
        <PostAttachedFile post={post} />
      ) : null}
    </>
  )
}
