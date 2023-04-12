import React from 'react'
import PostAttachedFile from '../../Posts/components/PostAttachedFile'
import styles from '../../Posts/Post.module.css'
import AudioPlayer from './VoiceRecorder/AudioPlayer'

export default function AnnouncementPostContent({post}) {
  return (
    <>
      <div className={styles.postAnnouncementTitle}>{post.title}</div>
      <div className={styles.postAnnouncementMessage}>{post.message}</div>
      <div className={styles.postMedia}>
        {post.voice_note_url && (
          <AudioPlayer
            audioSource={post.voice_note_url}
            duration={post.voice_note_duration}
          />
        )}
        {post.attachment_urls?.length || post.attachment_url ? (
          <PostAttachedFile post={post} />
        ) : null}
      </div>
    </>
  )
}
