import styles from './navlist.module.css'
import {NavLink, useRouteMatch} from 'react-router-dom'
import {useSelector} from 'react-redux'
import React from 'react'

const CreateTabs = (tabs) => {
  let {path} = useRouteMatch()
  const url = (link) => `${path}/${link}`
  const {eventManager} = useSelector((state) => state)
  let navList = tabs?.map((tab, i) => {
    return (
      <NavLink
        key={`${tab.route}${i}`}
        activeClassName={styles.active}
        to={url(tab.route)}
        onClick={() => {
          eventManager.send_event(tab?.event, {})
        }}
      >
        {tab.label}
      </NavLink>
    )
  })
  return navList
}

export default function NavBarTabs(props) {
  return <nav className={styles.tabMenu}>{CreateTabs(props.TABLIST)}</nav>
}
