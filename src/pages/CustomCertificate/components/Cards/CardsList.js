import React from 'react'
import TemplateCard from './TemplateCard'
import styles from './Cards.module.css'

const CardsList = ({
  showFirstRow = false,
  list = [],
  showDocPreview,
  itemsToShowInFirstRow,
}) => {
  const getList = () => {
    if (showFirstRow)
      return list.slice(0, itemsToShowInFirstRow).map((item) => {
        return (
          <TemplateCard
            key={item._id}
            card={item}
            showDocPreview={showDocPreview}
          />
        )
      })
    else
      return list.map((item) => {
        return (
          <TemplateCard
            showDocPreview={showDocPreview}
            key={item._id}
            card={item}
          />
        )
      })
  }

  return <div className={styles.templateList}>{getList()}</div>
}

export default CardsList
