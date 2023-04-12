// import React, {useState} from 'react'
import ToggleSwitch from '../../../../../fee/components/ToggleSwitch/ToggleSwitch'
import classNames from 'classnames'
import styles from './ToggleAccordion.module.css'
import Permission from '../../../../../../components/Common/Permission/Permission'
import {useTranslation} from 'react-i18next'

export default function ToggleAccordion({
  id,
  title,
  icon = null,
  isOn,
  handleActions,
  feeSettingLoading,
  permissionId = null,
  classes = {},
}) {
  const {t} = useTranslation()
  // const [isOnState, setIsOn] = useState(isOn)
  return (
    <div
      className={classNames(
        styles.toogleAccordionContainer,
        classes.toogleAccordionContainer
      )}
    >
      {icon && <img src={icon} alt="" className={styles.toggleAccordionIcon} />}
      <div className={classNames('tm-para-16', 'tm-color-text-primary')}>
        {t(title)}
      </div>
      {permissionId ? (
        <Permission permissionId={permissionId}>
          <ToggleSwitch
            id={id}
            checked={isOn}
            small={true}
            disabled={feeSettingLoading}
            onChange={(value) => {
              // setIsOn(value)
              handleActions(id, value)
            }}
          />
        </Permission>
      ) : (
        <ToggleSwitch
          id={id}
          checked={isOn}
          small={true}
          disabled={feeSettingLoading}
          onChange={(value) => {
            // setIsOn(value)
            handleActions(id, value)
          }}
        />
      )}
    </div>
  )
}
