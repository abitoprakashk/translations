import React, {useState} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import styles from './DeleteButton.module.css'
import ConfirmationPopup from '../../../../../components/Common/ConfirmationPopup/ConfirmationPopup'
import {Trans, useTranslation} from 'react-i18next'
import {events} from '../../../../../utils/EventsConstants'
import {getStudentDependency} from '../../../../../routes/dashboard'
import {showToast} from '../../../../../redux/actions/commonAction'
import {Icon} from '@teachmint/common'

const DeleteButton = ({userType, name, deleteProfile, imember_id}) => {
  const [showPopup, setShowPopup] = useState(false)
  const dispatch = useDispatch()
  const {t} = useTranslation()
  const {eventManager} = useSelector((state) => state)
  const asAUser = userType !== 'user' ? `'s account` : ''
  const defaultPopupDesc =
    userType === 'teacher' ? (
      <div className={styles.deactivateTeacherDesc}>
        <ul>
          <li>Once deactivated, teacher cannot be made active again.</li>
        </ul>
      </div>
    ) : (
      <Trans i18nKey="deleteButtonConfirmPopupDesc">
        If you delete {{name}} you will lose all the data of the
        {{userType}}. This data cannot be recovered later.
      </Trans>
    )
  const [popupDesc, setpopupdesc] = useState(defaultPopupDesc)

  const getEventName = (eventType) => {
    if (eventType === 'deleteClicked') {
      switch (userType) {
        case 'student':
          return events.DELETE_STUDENT_PROFILE_CLICKED_TFI
        case 'teacher':
          return events.DELETE_TEACHER_PROFILE_CLICKED_TFI
        case 'user':
          return events.DELETE_USER_PROFILE_CLICKED_TFI
      }
    } else {
      switch (userType) {
        case 'student':
          return events.DELETE_STUDENT_PROFILE_POPUP_CLICKED_TFI
        case 'teacher':
          return events.DELETE_TEACHER_PROFILE_POPUP_CLICKED_TFI
        case 'user':
          return events.DELETE_USER_PROFILE_POPUP_CLICKED_TFI
      }
    }
  }

  const studentDesc = (responseObject) => {
    const dependencies = []

    if (responseObject?.book) {
      dependencies.push(t('studentbooknotreturned'))
    } else {
      dependencies.push(t('deleteStudentConfirmation'))
    }

    return (
      <div className={styles.deactivateStudentDesc}>
        {dependencies.map((dependency) => {
          return (
            <span key={dependency} className={styles.deactivateStudentDescText}>
              {dependency}
            </span>
          )
        })}
      </div>
    )
  }

  const handleClick = () => {
    eventManager.send_event(getEventName('deleteClicked'), {
      screen_name: `add_${userType}_slider`,
    })
    if (userType === 'student') {
      // eslint-disable-next-line no-console
      getStudentDependency({
        imember_id: imember_id,
      })
        .then((responseObject) => {
          setpopupdesc(studentDesc(responseObject))
          setShowPopup(true)
        })
        .catch(() => {
          dispatch(showToast({type: 'error', message: t('dependencyfailed')}))
        })
    } else {
      setShowPopup(true)
    }
  }

  const handleConfirmCilck = () => {
    eventManager.send_event(getEventName(), {
      screen_name: `add_${userType}`,
      action: 'deleted',
    })
    deleteProfile()
  }

  return (
    <>
      <div
        className={
          (userType === 'student'
            ? styles.deactivateStudent
            : userType === 'teacher'
            ? styles.deactivateTeacher
            : styles.deleteBtn) + ' clearfix'
        }
        onClick={() => handleClick()}
      >
        {userType === 'teacher' ? (
          <Icon name="removeCircle" color="warning" size="s" />
        ) : (
          <img src="https://storage.googleapis.com/tm-assets/icons/colorful/delete-red.svg" />
        )}

        <div>
          <a>
            {userType === 'teacher'
              ? t('deactivateProfile')
              : t('deleteAccount')}
          </a>
          {userType === 'student' ? (
            <>
              <ul>
                <li>
                  <span>{t('accountWillBeInactive')}</span>
                </li>
                <li>
                  <span>{t('datacannotberecovered')}</span>
                </li>
              </ul>
            </>
          ) : userType === 'teacher' ? (
            <>
              <ul>
                <li>
                  <span>{t('teacherdataremoved')}</span>
                </li>
                <li>
                  <span>{t('teachercantseeinformation')}</span>
                </li>
              </ul>
            </>
          ) : (
            <>
              <span>{t('thisWillDeleteWithCurrentProfile')}</span>
            </>
          )}
        </div>
      </div>
      {showPopup && (
        <ConfirmationPopup
          onClose={() => {
            eventManager.send_event(getEventName(), {
              screen_name: `add_${userType}`,
              action: 'cancel',
            })
            setpopupdesc(defaultPopupDesc)
            setShowPopup()
          }}
          onAction={() => handleConfirmCilck()}
          icon={
            userType === 'teacher'
              ? 'https://storage.googleapis.com/tm-assets/icons/colorful/warning-orange.svg'
              : 'https://storage.googleapis.com/tm-assets/icons/colorful/remove-bg-red.svg'
          }
          title={
            userType === 'user' ? (
              <Trans i18nKey="deleteUserConfirmPopupTitle">
                “Remove {{name}} from the institute?
              </Trans>
            ) : userType === 'student' ? (
              <Trans i18nKey="deleteButtonConfirmPopupTitleNew">
                Delete {{name}} {{asAUser}}?
              </Trans>
            ) : (
              <Trans i18nKey="deactivateButtonConfirmPopupTitleNew">
                Deactivate {{name}} {{asAUser}}?
              </Trans>
            )
          }
          desc={popupDesc}
          primaryBtnText={t('cancel')}
          secondaryBtnText={
            userType === 'teacher' ? t('deactivate') : t('delete')
          }
          secondaryBtnStyle={
            userType === 'teacher' ? null : 'tm-btn2-red w-9/10'
          }
        />
      )}
    </>
  )
}

export default DeleteButton
