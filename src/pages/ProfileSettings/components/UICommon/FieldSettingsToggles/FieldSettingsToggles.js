import React from 'react'
import {ImageIcon, ToggleSwitch, Tooltip} from '@teachmint/common'
import styles from './FieldSettingsToggles.module.css'

const FieldSettingsToggles = ({
  fieldFormInputsValue,
  setFieldFormInputsValue,
  toolTipsOptionsData,
  setIsFormValid = () => {},
}) => {
  const onChangeToggleHandler = (changeToggle, id) => {
    if (toolTipsOptionsData && toolTipsOptionsData.length > 0) {
      toolTipsOptionsData.map((item) => {
        if (id === item.id) {
          setFieldFormInputsValue({
            ...fieldFormInputsValue,
            [item.fieldName]: changeToggle,
          })
        }
      })
      setIsFormValid(true)
    }
  }

  return (
    <div className={styles.toggleBlock}>
      {toolTipsOptionsData &&
        toolTipsOptionsData.map((item, i) => {
          const toolTipHTML = (
            <div
              key={`${item.id}_${i}`}
              className={styles.commonToggleInputGroup}
            >
              <span className={styles.toggleSwitchInput}>
                <ToggleSwitch
                  id={item.id}
                  checked={fieldFormInputsValue[item.fieldName]}
                  onChange={(changeToggle) =>
                    onChangeToggleHandler(changeToggle, item.id)
                  }
                  multiline={true}
                />
              </span>
              <span className={styles.toggleSwitchTitle}>{item.text}</span>
              <span
                className={styles.toggleTooltips}
                data-tip
                data-for={`${item.toolTipId}_${i}`}
              >
                <ImageIcon name={'alertCircleYellow'} size={'s'} />
              </span>
              <Tooltip
                toolTipId={`${item.toolTipId}_${i}`}
                place="top"
                type="basic"
                className={styles.toolTipBlock}
              >
                <span>{item.toolTipText}</span>
              </Tooltip>
            </div>
          )

          return toolTipHTML
        })}
    </div>
  )
}

export default FieldSettingsToggles
