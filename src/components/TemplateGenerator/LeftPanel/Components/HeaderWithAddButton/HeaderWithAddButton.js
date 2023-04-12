import {Icon, ICON_CONSTANTS, Para, PARA_CONSTANTS} from '@teachmint/krayon'
import React from 'react'
import styles from './HeaderWithAddButton.module.css'

const HeaderWithAddButton = ({
  label,
  action,
  isFileInput = false,
  allowedFormates = [],
}) => {
  return (
    <div className={styles.labelAndAddButton}>
      {label && (
        <Para
          type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
          weight={PARA_CONSTANTS.WEIGHT.MEDIUM}
        >
          {label}
        </Para>
      )}

      {!isFileInput ? (
        <span className={styles.actionButton} onClick={action}>
          <Icon
            name="circledClose"
            type={ICON_CONSTANTS.TYPES.PRIMARY}
            size={ICON_CONSTANTS.SIZES.XX_SMALL}
            version={ICON_CONSTANTS.VERSION.OUTLINED}
          />
        </span>
      ) : (
        <label className={styles.actionButton} htmlFor="imageupload">
          <Icon
            name="circledClose"
            type={ICON_CONSTANTS.TYPES.PRIMARY}
            size={ICON_CONSTANTS.SIZES.XX_SMALL}
            version={ICON_CONSTANTS.VERSION.OUTLINED}
          />
          {isFileInput && (
            <>
              <input
                type="file"
                accept={allowedFormates.join(', ')}
                id="imageupload"
                onChange={action}
              />
            </>
          )}
        </label>
      )}
    </div>
  )
}

export default HeaderWithAddButton
