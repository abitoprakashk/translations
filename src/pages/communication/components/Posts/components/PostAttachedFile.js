import React, {useState} from 'react'
import {Icon, ICON_CONSTANTS, Button} from '@teachmint/krayon'
import styles from '../Post.module.css'
import {getPostTypeInText, getExtensionFromUrl} from '../../../commonFunctions'
import {events} from '../../../../../utils/EventsConstants'
import {useSelector} from 'react-redux'
import {announcementType} from '../../../constants'
import {useOutsideClickHandler} from '@teachmint/common'
import {useRef} from 'react'
import {t} from 'i18next'
export default function PostAttachedFile({post}) {
  const eventManager = useSelector((state) => state.eventManager)
  const [showDropdown, setShowDropdown] = useState(false)
  const outsideRef = useRef(null)
  const iconNames = {
    png: 'image',
    jpg: 'image',
    jpeg: 'image',
    mp3: 'play1',
    pdf: 'document',
    mp4: 'video',
    mpeg: 'play1',
  }
  const getPostTitle = (annType) => {
    let postTitle = ''
    if (annType === announcementType.ANNOUNCEMENT) {
      postTitle = post.title
    } else if (
      annType === announcementType.FEEDBACK ||
      annType === announcementType.POLL
    ) {
      postTitle = post.message
    }
    return postTitle
  }

  const handleClickEvent = () => {
    setShowDropdown(!showDropdown)
    eventManager.send_event(events.VIEW_ATTACHMENT_CLICKED_TFI, {
      post_type: getPostTypeInText(post.announcement_type),
      post_title: getPostTitle(post.announcement_type),
      isdraft: post.draft,
    })
  }
  const renderFileList = () => {
    const tempArr = post.attachment_urls.length
      ? post.attachment_urls
      : [post.attachment_url]
    return tempArr?.map((data) => (
      <div key={data} className={styles.moreActionItem}>
        <a href={data} target="_blank" rel="noreferrer" className="flex">
          <Icon
            name={iconNames[getExtensionFromUrl(data)]}
            size={ICON_CONSTANTS.SIZES.XXX_SMALL}
            type={ICON_CONSTANTS.TYPES.SECONDARY}
          />
          &nbsp;&nbsp;
          <span>{data.split('/')[4] + '.' + getExtensionFromUrl(data)}</span>
        </a>
      </div>
    ))
  }
  useOutsideClickHandler(outsideRef, () => {
    setShowDropdown(false)
  })
  return (
    <>
      <div ref={outsideRef} className={styles.attachWrapper}>
        <Button
          onClick={handleClickEvent}
          prefixIcon="attachment"
          suffixIcon="chevronDown"
          children={
            post.attachment_urls.length > 1
              ? t('filesAttached', {count: post.attachment_urls.length})
              : t('fileAttached')
          }
          classes={{
            button: styles.fileAttachedBtn,
            label: styles.fileAttachedText,
          }}
        />
        {showDropdown && (
          <div className={styles.fileDropdown}>{renderFileList()}</div>
        )}
      </div>
    </>
  )
}
