import React from 'react'
import {Modal} from '@teachmint/common'
import styles from './DeletePostModal.module.css'
import classNames from 'classnames'
import {useDispatch, useSelector} from 'react-redux'
import {deleteDraftAction} from '../../redux/actions/commonActions'
import {setIsDeletePostModalOpenAction} from '../../redux/actions/postsActions'
import {Trans, useTranslation} from 'react-i18next'

export default function DeletePostModal() {
  const {t} = useTranslation()
  const {postTitleForDelete, isDeletePostModalOpen, postToDeleteInfo} =
    useSelector((state) => state.communicationInfo.posts)
  const dispatch = useDispatch()

  let postType =
    postToDeleteInfo.announcement_type === 0
      ? t('announcement')
      : postToDeleteInfo.announcement_type === 1
      ? t('feedback')
      : t('poll')

  const handleConfirmDeletePost = () => {
    dispatch(deleteDraftAction({announcement_id: postToDeleteInfo._id}))
  }

  const handleCancelDelete = () => {
    dispatch(setIsDeletePostModalOpenAction(false))
  }
  return (
    <div className={styles.deletePostModalParentDiv}>
      <Modal show={isDeletePostModalOpen} className={styles.modalSection}>
        <div className={styles.deletePostSection}>
          <div className={classNames(styles.imageSection)}>
            <div className={styles.imageOuterSec}>
              <img
                src="https://storage.googleapis.com/tm-assets/icons/colorful/delete-red.svg"
                alt={t('trashIcon')}
              />
            </div>
          </div>
          <div className={styles.deleteHeading}>
            <Trans i18nKey={'deleteDraftTitle'}>Delete {postType} Draft?</Trans>
          </div>
          <div className={styles.messageWithPostTitle}>
            <Trans i18nKey={'deleteDraftDesc'}>
              This will permanently delete {postTitleForDelete}
            </Trans>
          </div>
          <div className={styles.buttonSection}>
            <button
              className={classNames(styles.btn, styles.cancelBtn)}
              onClick={handleCancelDelete}
            >
              {t('cancel')}
            </button>
            <button
              className={classNames(styles.btn, styles.removeBtn)}
              onClick={handleConfirmDeletePost}
            >
              {t('delete')}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
