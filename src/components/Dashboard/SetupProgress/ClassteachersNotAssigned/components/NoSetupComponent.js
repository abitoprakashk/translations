import {Icon, ICON_CONSTANTS} from '@teachmint/krayon'
import classNames from 'classnames'
import React from 'react'
import {Link} from 'react-router-dom'
import styles from '../../SetupProgress.module.css'

const NoSetupComponent = ({message, path}) => {
  return (
    <Link to={path} className={classNames(styles.setup_card)}>
      <Icon
        name="add"
        size={ICON_CONSTANTS.SIZES.XX_SMALL}
        type={ICON_CONSTANTS.TYPES.SECONDARY}
      />
      <div className={styles.noSetupMessage}>{message}</div>
    </Link>
  )
}

export default NoSetupComponent
