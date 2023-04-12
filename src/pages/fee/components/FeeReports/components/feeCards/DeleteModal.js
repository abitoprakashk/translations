import {
  BUTTON_CONSTANTS,
  Icon,
  ICON_CONSTANTS,
  Modal,
  MODAL_CONSTANTS,
  Para,
  PARA_CONSTANTS,
} from '@teachmint/krayon'
import React from 'react'
import {Trans, useTranslation} from 'react-i18next'
import {useSelector} from 'react-redux'
import {events} from '../../../../../../utils/EventsConstants'
import styles from './styles.module.css'

function DeleteModal({setShowDeletePopup, onDelete, selectedReport}) {
  const eventManager = useSelector((state) => state.eventManager)
  const {t} = useTranslation()
  return (
    <Modal
      isOpen
      actionButtons={[
        {
          body: t('cancel'),
          onClick: () => {
            setShowDeletePopup(null)
            eventManager.send_event(
              events.FEE_REPORTS_CUSTOM_DELETE_POPUP_CLICKED_TFI,
              {
                action: 'cancel',
              }
            )
          },
          type: 'outline',
        },
        {
          body: t('delete'),
          onClick: onDelete,
          category: BUTTON_CONSTANTS.CATEGORY.DESTRUCTIVE,
        },
      ]}
      classes={{modal: styles.xxmodal, footer: styles.modalFooter}}
      header={t('deleteCustomReport')}
      headerIcon={
        <Icon name="delete1" size="x_s" type={ICON_CONSTANTS.TYPES.ERROR} />
      }
      onClose={() => {
        setShowDeletePopup(null)
        eventManager.send_event(
          events.FEE_REPORTS_CUSTOM_DELETE_POPUP_CLICKED_TFI,
          {
            action: 'cancel',
          }
        )
      }}
      size={MODAL_CONSTANTS.SIZE.SMALL}
    >
      <React.Fragment>
        <br />
        <Para type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}>
          <Trans i18nKey={'deleteText'}>
            Are you sure you want to delete{' '}
            {{reportName: selectedReport.name?.trim()}}? This report will be
            permanently removed and can’t be restored.
          </Trans>
        </Para>
        <br />
      </React.Fragment>
    </Modal>
  )
}

export default DeleteModal
