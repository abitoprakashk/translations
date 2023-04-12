import React from 'react'
import styles from './Legend.module.css'

function Legend({data = []}) {
  return (
    <div className={styles.wrapper}>
      {data.map((item, i) => (
        <div key={i} className={styles.legend}>
          <div className={styles.color} style={{background: item.color}} />
          <div className={styles.label}>{item.label}</div>
        </div>
      ))}
    </div>
  )
}

export default Legend
