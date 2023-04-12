import {Icon, ICON_CONSTANTS} from '@teachmint/krayon'
import classNames from 'classnames'
import React from 'react'
import {useHistory} from 'react-router-dom'
import styles from '../../SetupProgress.module.css'

const UpaidState = ({message, path}) => {
  const history = useHistory()
  return (
    <div
      onClick={() => history.push(path)}
      className={classNames(styles.setup_card, styles.setup_card_unpaid)}
    >
      <Icon
        name="lock"
        size={ICON_CONSTANTS.SIZES.XXX_SMALL}
        type={ICON_CONSTANTS.TYPES.SECONDARY}
      />
      <div className={styles.noSetupMessage}>{message}</div>
    </div>
  )
}

export default UpaidState
