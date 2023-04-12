import classNames from 'classnames'
import React from 'react'
import styles from './Tabs.module.css'

function Tabs({tabs, onTabClick, currentTab}) {
  return (
    <div className={styles.tabwrapper}>
      {tabs.map((tab) => (
        <a
          key={tab?.key}
          onClick={() => onTabClick(tab)}
          className={classNames(
            {
              [styles.active]: currentTab.key === tab.key,
            },
            styles.tab
          )}
        >
          {tab.title}
        </a>
      ))}
    </div>
  )
}

export default Tabs
