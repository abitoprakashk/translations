import styles from '../Post.module.css'
import {Icon} from '@teachmint/krayon'
import {useSelector, useDispatch} from 'react-redux'
import {events} from '../../../../../utils/EventsConstants'
import {
  getPostTypeInText,
  getSharePostMessageText,
} from '../../../commonFunctions'
import DeleteConfirmationModal from '../../../../../components/Common/DeleteConfirmationModal/DeleteConfirmationModal'
import {useState} from 'react'
import {setEditPost} from '../../../redux/actions/commonActions'
import {POST_TYPE} from '../../../constants'
import {setAnnouncementId} from '../../../redux/actions/announcementActions'
import {removeCommunicationPost} from '../../../redux/actions/commonActions'
import {useTranslation} from 'react-i18next'
import {PERMISSION_CONSTANTS} from '../../../../../utils/permission.constants'
import Permission from '../../../../../components/Common/Permission/Permission'

export default function MoreActions({
  showMoreActions,
  post,
  editPost,
  setShowMoreActions,
}) {
  const [showConfirmPopup, setShowConfirmPopUp] = useState(false)
  const eventManager = useSelector((state) => state.eventManager)
  const postType = getPostTypeInText(post.announcement_type)
  const url = `https://www.teachmint.com/announcement/${post._id}`
  const urlText = getSharePostMessageText(post)

  const dispatch = useDispatch()
  const {t} = useTranslation()

  const onRemove = () => {
    dispatch(removeCommunicationPost({_id: post._id}))
    setShowConfirmPopUp(false)
    eventManager.send_event(events.COMM_POST_REMOVE_CONFIRMED, {
      post_type: postType,
      post_id: post._id,
    })
  }

  const MORE_ACTIONS_ITEMS = [
    {
      label: 'Share Post',
      value: 'share',
      permissionId: PERMISSION_CONSTANTS.announcementsController_edit_update,
      icon: <Icon name="whatsapp" size="xx_s" />,
      onClick: () => {
        eventManager.send_event(events.COMM_POST_SHARE_CLICKED, {
          post_type: postType,
          post_id: post._id,
        })
        window.open(
          `https://api.whatsapp.com/send?text=${urlText.concat(url)}`,
          '_blank'
        )
      },
    },
    {
      ...(postType === POST_TYPE.announcement && {
        label: 'Edit Post',
        value: 'edit',
        permissionId: PERMISSION_CONSTANTS.announcementsController_edit_update,
        icon: <Icon name="edit2" size="xx_s" />,
        onClick: () => {
          dispatch(setAnnouncementId(post._id))
          dispatch(setEditPost(true))
          editPost({...post, editPost: true})
          eventManager.send_event(events.COMM_POST_EDIT_CLICKED, {
            post_type: postType,
            post_id: post._id,
          })
        },
      }),
    },
    {
      ...(postType === POST_TYPE.announcement && {
        label: 'Remove Post',
        value: 'remove',
        permissionId:
          PERMISSION_CONSTANTS.announcementsController_disablePost_update,
        icon: <Icon name="invisible" size="xx_s" />,
        onClick: () => {
          setShowConfirmPopUp(true)
          setShowMoreActions(false)
          eventManager.send_event(events.COMM_POST_REMOVE_CLICKED, {
            post_type: postType,
            post_id: post._id,
          })
        },
      }),
    },
  ]
  return (
    <>
      {showMoreActions && (
        <div className={styles.moreActionContainer}>
          {MORE_ACTIONS_ITEMS.map((item) => {
            if (Object.keys(item).length !== 0) {
              return (
                <Permission key={item?.label} permissionId={item?.permissionId}>
                  <div
                    key={item.value}
                    onClick={item?.onClick}
                    className={styles.moreActionItem}
                  >
                    {item.icon} &nbsp; &nbsp;
                    {item.label}
                  </div>
                </Permission>
              )
            } else return null
          })}
        </div>
      )}

      {showConfirmPopup && (
        <DeleteConfirmationModal
          setShowConfirmPopUp={setShowConfirmPopUp}
          post={post}
          postType={postType}
          title={t('removePostModalTitle')}
          desc={t('removePostModalDesc')}
          onRemove={onRemove}
        />
      )}
    </>
  )
}
