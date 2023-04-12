import {HeaderTemplate, Icon, ICON_CONSTANTS} from '@teachmint/krayon'
import React from 'react'
import {useTranslation} from 'react-i18next'
import {useHistory} from 'react-router-dom'
import {sidebarData} from '../../../../utils/SidebarItems'
import styles from './Header.module.css'

function Header({title = '', onEditClick, actionButtons = []}) {
  const {t} = useTranslation()
  const history = useHistory()
  const handleRouteSelection = (e, route) => {
    e?.preventDefault()
    history.push(route)
  }
  return (
    <HeaderTemplate
      actionButtons={actionButtons}
      breadcrumbObj={{
        className: '',
        paths: [
          {
            label: t('feeReport'),
            to: sidebarData.FEE_REPORTS.route,
            onClick: (e) => {
              handleRouteSelection(e, sidebarData.FEE_REPORTS.route)
            },
          },
          {
            label: t('customReport'),
          },
        ],
      }}
      classes={{
        mainHeading: styles.titleWrapper,
        subHeading: '',
        wrapper: '',
        buttonWrapper: styles.buttonWrapper,
      }}
      mainHeading={
        <>
          <div>{title} </div>
          <Icon
            onClick={onEditClick}
            className={styles.editIcon}
            size={ICON_CONSTANTS.SIZES.XX_SMALL}
            name="edit2"
            type={ICON_CONSTANTS.TYPES.PRIMARY}
          />
        </>
      }
    />
  )
}

export default Header
