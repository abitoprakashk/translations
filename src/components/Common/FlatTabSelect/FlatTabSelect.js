import classNames from 'classnames'
import React from 'react'
import styles from './FlatTabSelect.module.scss'

export default function FlatTabSelect({options, onClick, active, label}) {
  // options = [{name,value}]
  return (
    <>
      <div>
        <div className={styles.label}>{label}</div>
        <div className={styles.container}>
          {options.map((option) => (
            <button
              className={classNames(styles.button, {
                [styles.active]: active == option.value,
              })}
              key={option.value}
              onClick={() => onClick(option.value)}
            >
              {option.name}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
