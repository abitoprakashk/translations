import {useSelector} from 'react-redux'
import {NavLink, useRouteMatch} from 'react-router-dom'
import styles from './TabNav.module.css'

export default function TabNav({tabs}) {
  let {path} = useRouteMatch()
  const url = (link) => `${path}/${link}`
  const eventManager = useSelector((state) => state.eventManager)
  const dispatchEvent = (eventName) => eventManager.send_event(eventName)

  return tabs.map((tab, i) => {
    return (
      <NavLink
        key={i}
        activeClassName={styles.active}
        to={url(tab.route)}
        onClick={() => dispatchEvent(tab.eventName)}
      >
        {/* NO need to translate this, it is not just text. It can be a component */}
        {tab.label}
      </NavLink>
    )
  })
}
