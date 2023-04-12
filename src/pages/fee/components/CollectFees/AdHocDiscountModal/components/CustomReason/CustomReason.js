import React, {useState} from 'react'
import customStyles from './CustomReasonPopup.module.css'
import styles from './CustomReason.module.css'
import classNames from 'classnames'
import {CUSTOM_CATEGORY} from '../../../../../fees.constants'
import {Button, Modal} from '@teachmint/common'
import {useDispatch} from 'react-redux'
import {createAdHocDiscountAction} from '../../../../../redux/feeDiscountsActions'

export default function CustomReason({
  isModalOpen = false,
  handleDecline = () => {},
}) {
  const dispatch = useDispatch()

  const [customReason, setCustomReason] = useState('')

  const handleOnChangeCustomReason = (event) => {
    setCustomReason(event.target.value)
  }

  const handleCreateReason = () => {
    if (customReason.trim() === '') return
    dispatch(createAdHocDiscountAction({name: customReason}))
  }

  return (
    <Modal
      show={isModalOpen}
      className={classNames(customStyles.modalWrapper, customStyles.mainModal)}
      wrapperClassName={classNames(styles.higherSpecificity, styles.zIndex)}
    >
      <section className={styles.section}>
        <div className={classNames(styles.label)}>{'Add Reason'}</div>
        <input
          type="text"
          className={styles.input}
          placeholder="Add your reason here"
          onChange={handleOnChangeCustomReason}
          value={customReason}
          maxLength={CUSTOM_CATEGORY.addNewPopup.charLimit}
        />
        <div className={customStyles.charLimitSection}>
          <span
            className={classNames(customStyles.charLimitSpan, {
              [customStyles.charLimitSpanSuccess]: customReason.length < 40,
              [customStyles.charLimitSpanError]: customReason.length >= 40,
            })}
          >
            <span>{customReason.length}</span> /{' '}
            {CUSTOM_CATEGORY.addNewPopup.charLimit}
          </span>
        </div>

        <div
          className={classNames(
            customStyles.flexAndCenter,
            customStyles.buttonSection
          )}
        >
          <Button
            size="big"
            type="border"
            className={classNames(
              customStyles.confirmationBtns,
              customStyles.declineBtn,
              customStyles.buttonTag
            )}
            onClick={handleDecline}
          >
            Decline
          </Button>
          <Button
            size="big"
            type="fill"
            className={classNames(
              customStyles.confirmationBtns,
              customStyles.comfirmBtn,
              customStyles.buttonTag
            )}
            onClick={handleCreateReason}
          >
            Add
          </Button>
        </div>
      </section>
    </Modal>
  )
}
