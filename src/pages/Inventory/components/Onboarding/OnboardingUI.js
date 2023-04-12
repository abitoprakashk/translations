import React from 'react'
import Permission from '../../../../components/Common/Permission/Permission'
import styles from './onboarding.module.css'

export default function Onboarding(props) {
  return (
    <div className={styles.contentWrapper}>
      <img src={props.image}></img>
      <p className={styles.messageText}>{props.messageText}</p>
      {props.helpText && (
        <div>
          {props.helpIcon}
          <span className={styles.helpText}>{props.helpText}</span>
        </div>
      )}
      <p className={styles.descriptionText}>{props.descriptionText}</p>
      <p className={styles.descriptionText}>{props.descriptionText2}</p>
      <Permission permissionId={props.permissionId}>
        <button className={styles.startButton} onClick={props.clickHandler}>
          {props.buttonText}
        </button>
      </Permission>
    </div>
  )
}
