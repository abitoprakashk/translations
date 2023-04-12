import {useTranslation} from 'react-i18next'
import {useDispatch, useSelector} from 'react-redux'
import styles from './editUsersModal.module.css'
import {Modal, Icon, ICON_CONSTANTS, MODAL_CONSTANTS} from '@teachmint/krayon'
import EditUserCard from '../editUsersCard/editUsersCard'
import globalActions from '../../../../../../../redux/actions/global.actions'
import {events} from '../../../../../../../utils/EventsConstants'

export default function EditUsersModal({
  showModal,
  setShowModal,
  userData,
  cardError,
  setUserData,
  setCardError,
  allRows,
}) {
  const onModalClose = () => {
    setShowModal(false)
  }
  const {eventManager} = useSelector((state) => state)
  const dispatch = useDispatch()

  const {t} = useTranslation()

  const handleFormSubmit = () => {
    eventManager.send_event(events.HRMS_SAVE_USER_ID_CLICKED_TFI)

    let data = {
      iid: userData.imember_id,
      user_id: userData.user_id,
    }

    let payload = {
      user_data: [data],
    }

    dispatch(globalActions?.updateBiometricUsers?.request(payload))
    setShowModal(false)
  }

  const getFormHasError = () => {
    let hasError = false
    hasError = Object.values(cardError)?.some((value) => value)
    return hasError
  }

  return (
    <Modal
      header={t('editUserID')}
      classes={{modal: styles.modal}}
      headerIcon={
        <Icon
          size={ICON_CONSTANTS.SIZES.SMALL}
          name="edit"
          type={ICON_CONSTANTS.TYPES.BASIC}
        />
      }
      isOpen={showModal}
      onClose={onModalClose}
      actionButtons={[
        {
          onClick: handleFormSubmit,
          body: t('confirm'),
          isDisabled: getFormHasError(),
        },
      ]}
      size={MODAL_CONSTANTS.SIZE.SMALL}
      shouldCloseOnOverlayClick={false}
    >
      <EditUserCard
        userData={userData}
        cardError={cardError}
        setUserData={setUserData}
        setCardError={setCardError}
        allRows={allRows}
      />
    </Modal>
  )
}
