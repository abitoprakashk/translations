import React from 'react'
import styles from './NotFoundCard.module.css'

export default function NotFoundCard({text}) {
  return <div className={styles.section}>{text}</div>
}
