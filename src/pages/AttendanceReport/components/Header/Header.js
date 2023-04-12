import React from 'react'
import {HeaderTemplate, Icon, ICON_CONSTANTS} from '@teachmint/krayon'
import styles from './Header.module.css'
import useIsMobile from '../../hooks/useIsMobile'
import {useTranslation} from 'react-i18next'

function Header({title, desc, classes, forceUpdate, ...props}) {
  const isMobile = useIsMobile()
  const {t} = useTranslation()
  return (
    <HeaderTemplate
      classes={{
        mainHeading: styles.title,
        subHeading: styles.subTitle,
        wrapper: '',
        divider: styles.divider,
        ...classes,
      }}
      mainHeading={title}
      subHeading={desc}
      {...props}
      {...(forceUpdate
        ? {
            actionButtons: [
              {
                category: 'primary',
                children: (
                  <span className={styles.btnWrapper}>
                    <Icon
                      name="refresh"
                      size={ICON_CONSTANTS.SIZES.X_SMALL}
                      type={ICON_CONSTANTS.TYPES.INVERTED}
                      version={ICON_CONSTANTS.VERSION.OUTLINED}
                    />
                    {isMobile ? null : <span>{t('refresh')}</span>}
                  </span>
                ),
                classes: {},
                id: 'sec-btn',
                onClick: forceUpdate,
                size: 's',
                type: 'filled',
                width: 'fit',
              },
            ],
          }
        : {})}
    />
  )
}

export default Header
