import React from 'react'
import styles from './overview.module.css'
import {Card} from '@teachmint/common'

export const InfoCard = (props) => {
  const dataCards = props.cards.map((card) => {
    return (
      <Card className={styles.data_card} key={card.id}>
        <div className={styles[card.classes.frame]}>{card.icon}</div>
        <div>
          <p className={styles.data_card_title}>{card.title}</p>
          <p>{card.description}</p>
        </div>
      </Card>
    )
  })
  return <div className={styles.data_card_wrapper}>{dataCards}</div>
}
