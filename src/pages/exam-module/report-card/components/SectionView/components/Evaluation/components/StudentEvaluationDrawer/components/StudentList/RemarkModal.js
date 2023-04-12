import {Input, Modal, MODAL_CONSTANTS} from '@teachmint/krayon'
import {useState} from 'react'
import {EVALUATION_TYPE} from '../../../../../../../../constants'

import styles from './RemarkModal.module.css'

const RemarkModal = ({showModal, setShowModal, value, setValue, type}) => {
  const [text, setText] = useState(value)

  const typeStr = type == EVALUATION_TYPE.REMARKS ? 'Remark' : 'Result'

  return (
    <Modal
      header={`${typeStr}s`}
      isOpen={showModal}
      size={MODAL_CONSTANTS.SIZE.SMALL}
      onClose={() => setShowModal(false)}
      actionButtons={[
        {
          onClick: () => {
            setValue(text)
            setShowModal(false)
          },
          body: value ? `Update ${typeStr}` : `Add ${typeStr}`,
        },
      ]}
    >
      <div className={styles.textarea}>
        <Input
          type="textarea"
          placeholder="Type here"
          title={`${typeStr}s`}
          value={text}
          onChange={({value}) => setText(value)}
          maxLength={type == EVALUATION_TYPE.REMARKS ? 100 : 25}
        />
      </div>
    </Modal>
  )
}

export default RemarkModal
