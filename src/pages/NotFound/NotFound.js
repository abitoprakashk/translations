import React from 'react'
import {Link} from 'react-router-dom'
import {NotFound} from '@teachmint/common'
import {DASHBOARD} from '../../utils/SidebarItems'
import styles from './NotFound.module.css'

export const NotFoundPage = ({to}) => (
  <NotFound>
    <Link className={`tm-btn2-blue w-62 ml-3 ${styles.homeButton}`} to={to}>
      Home
    </Link>
  </NotFound>
)

NotFoundPage.defaultProps = {
  to: DASHBOARD,
}

export default NotFoundPage
