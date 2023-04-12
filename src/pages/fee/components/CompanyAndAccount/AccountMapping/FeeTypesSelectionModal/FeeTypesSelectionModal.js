import React, {useEffect, useState} from 'react'
import styles from './FeeTypesSelectionModal.module.css'
import {CheckboxGroup, Modal} from '@teachmint/krayon'
import {TRANSLATIONS_CA} from '../../companyAccConstants'

export default function FeeTypesSelectionModal({
  isOpen = false,
  modalHeader = TRANSLATIONS_CA.selectFeeTypes,
  data = [],
  selectedFeeTypes = [],
  onClose = () => {},
  handleConfirmFeeTypeSelection = () => {},
  sessionFeeTypesData = [],
}) {
  const [selectedItems, setSelectedItems] = useState([...selectedFeeTypes])
  useEffect(() => {
    const selectedFeeTypesData = new Set([
      ...selectedFeeTypes,
      ...sessionFeeTypesData,
    ])
    setSelectedItems([...selectedFeeTypesData])
  }, [])

  return (
    <Modal
      isOpen={isOpen}
      actionButtons={[
        {
          body: TRANSLATIONS_CA.cancel,
          onClick: onClose,
          type: 'outline',
        },
        {
          body: TRANSLATIONS_CA.confirm,
          onClick: () => handleConfirmFeeTypeSelection(selectedItems),
        },
      ]}
      header={modalHeader}
      onClose={onClose}
      size="m"
      classes={{content: 'show-scrollbar show-scrollbar-small'}}
    >
      <div className={styles.section}>
        <CheckboxGroup
          onChange={(obj) => {
            setSelectedItems([...obj])
          }}
          wrapperClass={styles.checkboxGroupWrapperClass}
          options={data.map((option) => {
            return {
              label: option?.name,
              value: option?._id,
            }
          })}
          frozenOptions={sessionFeeTypesData}
          selectedOptions={selectedItems}
        />
      </div>
    </Modal>
  )
}
