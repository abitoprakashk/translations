import React from 'react'
import styles from './Badge.module.css'

export default function Badge({title = ''}) {
  return (
    <div className={styles.section}>
      <span>{title}</span>
    </div>
  )
}
