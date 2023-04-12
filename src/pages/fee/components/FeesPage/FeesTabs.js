import {useSelector} from 'react-redux'
import {NavLink, useRouteMatch} from 'react-router-dom'
import styles from './FeesPage.module.css'
import {Trans} from 'react-i18next'

export function FeesTabs({feesTabs}) {
  let {path} = useRouteMatch()
  const url = (link) => `${path}/${link}`
  const eventManager = useSelector((state) => state.eventManager)
  const dispatchEvent = (eventName) =>
    eventManager.send_event(eventName, {screen_name: 'fee_page'})

  return feesTabs.map((tab, i) => {
    return (
      <NavLink
        key={i}
        activeClassName={styles.active}
        to={url(tab.route)}
        onClick={() => {
          dispatchEvent(tab.eventName)
        }}
      >
        <Trans i18nKey={tab.label}></Trans>
      </NavLink>
    )
  })
}
