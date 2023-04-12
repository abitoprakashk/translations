import React from 'react'
import styles from './DotsMenuButton.module.css'
import useComponentVisible from '../../../fee/hooks/useComponentVisible'
import classNames from 'classnames'
import ellipsisDarkIcon from '../../../../assets/images/icons/ellipsis-circle-dark.svg'

export default function DotsMenuButton({dropdownMenuItems, content}) {
  const {
    ref,
    isComponentVisible: showDotButtonDropdown,
    setIsComponentVisible: setShowDotButtonDropdown,
  } = useComponentVisible(false)

  return (
    <div
      onClick={(e) => {
        e.stopPropagation()
        setShowDotButtonDropdown(!showDotButtonDropdown)
      }}
      ref={ref}
    >
      <div className={styles.dropdownWrapper}>
        <img
          className={styles.reportIcon}
          src={ellipsisDarkIcon}
          alt="report icon"
        />
        {showDotButtonDropdown && (
          <div className={classNames(styles.tmDashboardNotificationDropdown)}>
            <div className={classNames(styles.msgBox)}>
              {dropdownMenuItems.map(({title, iconSrc, handleClick}) => (
                <div
                  className={styles.dropdownListItem}
                  key={title}
                  onClick={() => handleClick(content)}
                >
                  {iconSrc && (
                    <img
                      src={iconSrc}
                      alt="list icon"
                      className={styles.dropdownListItemIcon}
                    />
                  )}
                  <div className={styles.dropdownListItemText}>{title}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
