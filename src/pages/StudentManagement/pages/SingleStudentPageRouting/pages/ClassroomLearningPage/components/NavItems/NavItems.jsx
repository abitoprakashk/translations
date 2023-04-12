import {Para, PARA_CONSTANTS} from '@teachmint/krayon'
import classNames from 'classnames'
import React from 'react'
import styles from './NavItems.module.css'

export default function NavItems({items, selectedTab, setSelectedTab}) {
  return (
    <div className={styles.wrapper}>
      {items?.map(({id, label}) => (
        <div
          key={id}
          className={classNames(
            styles.navItem,
            id === selectedTab ? styles.navItemSelected : ''
          )}
          onClick={() => setSelectedTab(id)}
        >
          <Para
            type={
              id === selectedTab
                ? PARA_CONSTANTS.TYPE.TEXT_PRIMARY
                : PARA_CONSTANTS.TYPE.TEXT_SECONDARY
            }
          >
            {label}
          </Para>
        </div>
      ))}
    </div>
  )
}
