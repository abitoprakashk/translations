import {useTranslation} from 'react-i18next'
import styles from './addMemberModal.module.css'
import {Modal, MODAL_CONSTANTS} from '@teachmint/krayon'
import UserSelection from '../../../../../../../../components/Common/UserSelection/UserSelection'
import {useSelector} from 'react-redux'

export default function AddMemberModal({
  showModal,
  setShowModal,
  handleUserSelect,
}) {
  const {t} = useTranslation()
  const transportStopsData = useSelector(
    (state) => state?.globalData?.transportStops?.data
  )

  let usersAleadyInTransport = transportStopsData?.reduce((acc, cur) => {
    cur?.passenger_ids?.forEach((id) => acc.add(id))
    return acc
  }, new Set())

  const onModalClose = () => {
    setShowModal(false)
  }

  return (
    <Modal
      isOpen={showModal}
      onClose={onModalClose}
      size={MODAL_CONSTANTS.SIZE.MEDIUM}
      header={t('addMember')}
      classes={{content: styles.modalContent, modal: styles.modal}}
    >
      <UserSelection
        data={[]}
        handleChange={handleUserSelect}
        showSelectAll={false}
        isMultiSelect={false}
        suffixIcon="forwardArrow"
        hiddenIdsSet={usersAleadyInTransport}
        // disabledIds={['d']}
      />
    </Modal>
  )
}
