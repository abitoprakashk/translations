import {Icon} from '@teachmint/common'
import {
  BUTTON_CONSTANTS,
  ICON_CONSTANTS,
  Para,
  PARA_CONSTANTS,
  Popup,
} from '@teachmint/krayon'
import {t} from 'i18next'
import React, {useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {showToast} from '../../../../../../../../redux/actions/commonAction'
import {getStudentDependency} from '../../../../../../../../routes/dashboard'
import {events} from '../../../../../../../../utils/EventsConstants'
import {deleteStudentAction} from '../../../../../../../user-profile/redux/actions/studentActions'
import styles from './DeleteModal.module.css'
import {sidebarData} from '../../../../../../../../utils/SidebarItems'
import history from '../../../../../../../../history'

export default function DeleteModal({
  handleClosePopup,
  currentStudentId,
  studentName,
}) {
  // Screens ->
  // 1 : normal popup
  // 2 : popup with warning(fees or library)
  const [screenToShow, setScreenToShow] = useState(1)

  const dispatch = useDispatch()
  const {eventManager} = useSelector((state) => state)

  const handleDelete = () => {
    dispatch(deleteStudentAction({imember_id: currentStudentId}))
    handleClosePopup()
    history.push(sidebarData.STUDENT_DIRECTORY.route)
  }

  const checkDependency = () => {
    eventManager.send_event(events.DELETE_STUDENT_PROFILE_CLICKED_TFI, {
      screen_name: 'add_student_slider',
    })

    // eslint-disable-next-line no-console
    getStudentDependency({
      imember_id: currentStudentId,
    })
      .then((responseObject) => {
        if (responseObject?.book) setScreenToShow(2)
        else handleDelete()
      })
      .catch(() => {
        dispatch(showToast({type: 'error', message: t('dependencyfailed')}))
      })
  }

  return (
    <Popup
      isOpen={true}
      onClose={handleClosePopup}
      headerIcon={<Icon name="delete1" size={ICON_CONSTANTS.SIZES.SMALL} />}
      header={`${t('deleteThisStudent1')} ${studentName}${t(
        'deleteThisStudent2'
      )}`}
      actionButtons={[
        {
          id: 'cancel-btn',
          onClick: handleClosePopup,
          body: t('cancel'),
          type: BUTTON_CONSTANTS.TYPE.OUTLINE,
          classes: {button: styles.cancelButton},
        },
        {
          id: 'activate-btn',
          onClick: screenToShow === 1 ? checkDependency : handleDelete,
          body: t('delete'),
          category: BUTTON_CONSTANTS.CATEGORY.DESTRUCTIVE,
        },
      ]}
    >
      <Para
        type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
        className={styles.deletePopupContent}
      >
        {t(
          screenToShow === 1
            ? 'deleteStudentConfirmation'
            : 'studentbooknotreturned'
        )}
      </Para>
    </Popup>
  )
}
