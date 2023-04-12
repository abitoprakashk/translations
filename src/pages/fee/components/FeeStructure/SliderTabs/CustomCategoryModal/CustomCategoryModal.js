import React from 'react'
import {Button, Modal} from '@teachmint/common'
import styles from './CustomCategoryModal.module.css'
import classNames from 'classnames'
import {CUSTOM_CATEGORY} from '../../../../fees.constants'

export default function CustomCategoryModal({
  showAddCustomCategoryPopup = false,
  handleDeclineAddCustomCategory,
  handleAddCustomCategory,
  title = '',
  handleChangeAddnewCustomCategory,
  customCategoryName = '',
}) {
  return (
    <Modal
      show={showAddCustomCategoryPopup}
      className={classNames(styles.modalWrapper, styles.mainModal)}
    >
      <section className={styles.section}>
        <div className={classNames(styles.titleSection, styles.flexAndCenter)}>
          {title}
        </div>
        <input
          type="text"
          className={styles.input}
          placeholder={CUSTOM_CATEGORY.addNewPopup.placeholder}
          onChange={handleChangeAddnewCustomCategory}
          value={customCategoryName}
          maxLength={CUSTOM_CATEGORY.addNewPopup.charLimit}
        />
        <div className={styles.charLimitSection}>
          <span
            className={classNames(styles.charLimitSpan, {
              [styles.charLimitSpanSuccess]: customCategoryName.length <= 40,
              [styles.charLimitSpanError]: customCategoryName.length > 40,
            })}
          >
            <span>{customCategoryName.length}</span> /{' '}
            {CUSTOM_CATEGORY.addNewPopup.charLimit}
          </span>
        </div>

        <div className={classNames(styles.flexAndCenter, styles.buttonSection)}>
          <Button
            size="big"
            type="medium"
            className={classNames(
              styles.confirmationBtns,
              styles.declineBtn,
              styles.buttonTag
            )}
            onClick={handleDeclineAddCustomCategory}
          >
            Decline
          </Button>
          <Button
            size="big"
            type="medium"
            className={classNames(
              styles.confirmationBtns,
              styles.comfirmBtn,
              styles.buttonTag
            )}
            onClick={handleAddCustomCategory}
          >
            Add
          </Button>
        </div>
      </section>
    </Modal>
  )
}
