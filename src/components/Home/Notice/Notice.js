import classNames from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './Notice.module.css'
import hazardIcon from '../../../assets/images/icons/hazard-icon.svg'
import tickIcon from '../../../assets/images/icons/tick-bg-green.svg'
import alertIcon from '../../../assets/images/icons/alert-circle-red.svg'
import unlockIcon from '../../../assets/images/icons/unlock-blue.svg'

const Notice = ({
  type,
  startDateTime,
  endDateTime,
  children,
  onCloseClick,
  matchTextColorToType = false,
  showIcon = false,
}) => {
  const start = startDateTime ? startDateTime.getTime() : null
  const end = endDateTime ? endDateTime.getTime() : null
  const currentTime = new Date().getTime()
  let showNotice = true
  if ((start && currentTime < start) || (end && currentTime > end)) {
    showNotice = false
  }

  return showNotice ? (
    <div
      className={classNames(
        {
          'tm-bg-light-yellow': type === 'warning',
          'tm-bg-light-red': type === 'error',
          'tm-bg-red': type === 'error_v2',
          'tm-bg-medium-blue': type === 'info',
          'tm-bg-light-green': type === 'success',
        },
        styles.wrapper
      )}
    >
      <div
        className={classNames(
          styles.content,
          'tm-para2 py-2 px-4 text-center lg:py-3',
          {
            'tm-color-semantic-warning-100':
              type === 'warning' && matchTextColorToType,
            'tm-color-semantic-error-100':
              type === 'error' && matchTextColorToType,
            'tm-color-white': type === 'error_v2' && matchTextColorToType,
            'tm-color-semantic-information-100':
              type === 'info' && matchTextColorToType,
            'tm-color-semantic-success-100':
              type === 'success' && matchTextColorToType,
            'tm-color-text-primary': !matchTextColorToType,
          }
        )}
      >
        <div className={styles.contentInner}>
          {showIcon && (
            <div style={{marginRight: '5px'}}>
              {type == 'warning' && (
                <img
                  src={hazardIcon}
                  alt="hazard"
                  className="w-5 h-5 relative"
                />
              )}
              {type == 'success' && (
                <img
                  src={tickIcon}
                  alt="success"
                  className="w-5 h-5 relative"
                />
              )}
              {type == 'error' && (
                <img src={alertIcon} alt="alert" className="w-5 h-5 relative" />
              )}
              {type == 'info' && (
                <img
                  src={unlockIcon}
                  alt="alert"
                  className="w-5 h-5 relative"
                />
              )}
            </div>
          )}
          {children}
        </div>
      </div>
      {onCloseClick && (
        <img
          className={styles.closeButton}
          src="https://storage.googleapis.com/tm-assets/icons/colorful/cross-red.svg"
          onClick={() => onCloseClick && onCloseClick()}
        />
      )}
    </div>
  ) : null
}
Notice.propTypes = {
  type: PropTypes.oneOf(['error', 'error_v2', 'warning', 'info', 'success']),
}
Notice.defaultProps = {
  type: 'warning',
}

export default Notice
