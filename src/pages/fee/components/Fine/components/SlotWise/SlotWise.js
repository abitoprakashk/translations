import React, {useState} from 'react'
import styles from './SlotWise.module.css'
import sliderStyles from '../RuleConfigureSlider/RuleConfigureSlider.module.css'
import {useTranslation} from 'react-i18next'
import {
  CONFIRM_DELETE_SLOT_WISE_ROW_LBL,
  CREATE_SLOT_LABEL,
} from '../../FineConstant'
import {Icon, Input} from '@teachmint/common'
import classNames from 'classnames'
import ConfirmationPopup from '../../../../../../components/Common/ConfirmationPopup/ConfirmationPopup'
import {getNumbersOfDays} from '../../../../helpers/helpers'

export default function SlotWise({
  slotWiseData = [],
  blankRow = {},
  handleChange = () => {},
  setSlotWiseData = () => {},
}) {
  const {t} = useTranslation()

  const [isConfirmationpopUpOpen, setIsConfirmationpopUpOpen] = useState(false)
  const [deleteRowIndex, setDeleteRowIndex] = useState(null)

  const addTableRows = () => {
    const newValues = [...slotWiseData]

    // console.log('newValues', newValues)

    setSlotWiseData([...newValues, {...blankRow}])

    // eventManager.send_event(events.ADD_MORE_SECTION_CLICKED_TFI, {
    //   fee_type: feeType,
    //   type: 'fee_type',
    // })
  }

  const deleteTableRows = (index) => {
    // console.log(
    //   !slotWiseData[index].from &&
    //     !slotWiseData[index].to &&
    //     !slotWiseData[index].amount
    // )
    setDeleteRowIndex(index)
    if (
      !slotWiseData[index].from &&
      !slotWiseData[index].to &&
      !slotWiseData[index].amount
    ) {
      deleteTableRow(index)
    } else {
      setIsConfirmationpopUpOpen(true)
    }
  }

  const deleteTableRow = (index = deleteRowIndex) => {
    const newValues = [...slotWiseData]
    newValues.splice(index, 1)
    setSlotWiseData(newValues)
    setIsConfirmationpopUpOpen(false)
  }

  return (
    <div>
      {isConfirmationpopUpOpen && (
        <ConfirmationPopup
          onClose={() => setIsConfirmationpopUpOpen(false)}
          icon="https://storage.googleapis.com/tm-assets/icons/colorful/warning-orange.svg"
          onAction={() => deleteTableRow(deleteRowIndex)}
          title={t(CONFIRM_DELETE_SLOT_WISE_ROW_LBL)}
          // desc="your data will be lost whatever you create till now"
          primaryBtnText={t('cancel')}
          secondaryBtnText={t('yes')}
          secondaryBtnStyle={styles.modalWarningActionBtn}
        />
      )}
      <div className={sliderStyles.rulesSelectionHeadingText}>
        {t(CREATE_SLOT_LABEL)}
      </div>
      <div className="mt-5">
        <table className={styles.slotWiseTable}>
          <thead>
            <tr>
              <td className={classNames(styles.label, styles.labelFrom)}>
                {t('from')}
              </td>
              <td>
                <span className={styles.marginX}></span>
              </td>
              <td className={classNames(styles.label, styles.labelTo)}>
                {t('to')}
              </td>
              <td>
                <span className={styles.marginX}></span>
              </td>
              <td className={classNames(styles.label, styles.labelAmount)}>
                {t('amount')}
              </td>
              <td></td>
            </tr>
          </thead>
          <tbody className="pt-5">
            {slotWiseData
              .filter((slot) => !slot.isDelete)
              .map((slot, idx) => {
                return (
                  <tr key={`slot${idx}`}>
                    <td>
                      <Input
                        type="select"
                        fieldName="from"
                        value={slot.from}
                        options={getNumbersOfDays(31)}
                        onChange={(obj) => handleChange({...obj, index: idx})}
                        disabled={false}
                        classes={{wrapper: styles.commonInputWrapper}}
                      />
                    </td>
                    <td className={styles.dashCell}>-</td>
                    <td>
                      <Input
                        type="select"
                        fieldName="to"
                        value={slot.to}
                        options={getNumbersOfDays(31)}
                        onChange={(obj) => handleChange({...obj, index: idx})}
                        disabled={false}
                        classes={{wrapper: styles.commonInputWrapper}}
                      />
                    </td>
                    <td className={styles.dashCell}>:</td>
                    <td>
                      <Input
                        type="text"
                        fieldName="amount"
                        value={slot.amount}
                        onChange={(obj) => handleChange({...obj, index: idx})}
                        classes={{wrapper: styles.commonInputWrapper}}
                      />
                    </td>
                    <td>
                      {idx !== 0 && (
                        <div
                          className={styles.deleteIcon}
                          onClick={() => deleteTableRows(idx)}
                        >
                          <Icon
                            color="error"
                            name="close"
                            size="s"
                            type="outlined"
                          />
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>
      <div>
        <div className={styles.addMoreType} onClick={addTableRows}>
          + {t('newSlot')}
        </div>
      </div>
    </div>
  )
}
