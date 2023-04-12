import {
  Icon,
  ICON_CONSTANTS,
  Para,
  PARA_CONSTANTS,
  TabGroup,
  Tooltip,
  TOOLTIP_CONSTANTS,
} from '@teachmint/krayon'
import {t} from 'i18next'
import React, {useState} from 'react'
import {useSelector} from 'react-redux'
import {checkSubscriptionType} from '../../../../utils/Helpers'
import {sidebarData} from '../../../../utils/SidebarItems'
import StudentInventoryItemsPage from '../StudentInventoryItemsPage/StudentInventoryItemsPage'
import StudentLibraryBooksPage from '../StudentLibraryBooksPage/StudentLibraryBooksPage'
import styles from './StudentIssuedItemsPage.module.css'
import {v4 as uuidv4} from 'uuid'
import {useEffect} from 'react'

export default function StudentIssuedItemsPage({currentStudent}) {
  const [selectedTab, setSelectedTab] = useState('inventoryItems')

  const {instituteInfo, sidebar} = useSelector((state) => state)
  const isPremium = checkSubscriptionType(instituteInfo)

  useEffect(() => {
    if (
      sidebar?.allowedMenus &&
      !checkFeatureAuthorization(sidebarData.INVENTORY_MANAGEMENT.id)
    )
      setSelectedTab('libraryBooks')
  }, [sidebar])

  const checkFeatureAuthorization = (subModuleId) => {
    const isPremiumFeature = sidebar?.premiumItems?.has(subModuleId)
    const isfeatureAllowed = sidebar?.allowedMenus?.has(subModuleId)

    if (isPremiumFeature) {
      return isPremium && isfeatureAllowed
    } else {
      return isfeatureAllowed
    }
  }

  const permissionComponent = (allowedMenuId, label) => {
    const uuid = uuidv4()

    if (checkFeatureAuthorization(allowedMenuId)) return label
    return (
      <>
        <div
          className={styles.opacity}
          data-for={`${uuid}-permission`}
          data-tip
          onClickCapture={(e) => {
            e.preventDefault()
            e.stopPropagation()
            return
          }}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            return
          }}
        >
          {label}
        </div>
        {
          <Tooltip
            place={TOOLTIP_CONSTANTS.TOOLTIP_POSITIONS.TOP}
            toolTipBody={
              <Para
                className={styles.tooltipBody}
                weight={PARA_CONSTANTS.WEIGHT.MEDIUM}
                textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
              >
                <Icon
                  size={ICON_CONSTANTS.SIZES.X_SMALL}
                  name="caution"
                  type={ICON_CONSTANTS.TYPES.WARNING}
                  version={ICON_CONSTANTS.VERSION.OUTLINED}
                />
                {t('noPermissionAlert')}
              </Para>
            }
            toolTipId={`${uuid}-permission`}
            effect="solid"
            classNames={{
              toolTipBody: styles.tooltipBody,
              wrapper: styles.tooltipWrapper,
            }}
          />
        }
      </>
    )
  }

  const tabOptions = {
    inventoryItems: {
      id: 'inventoryItems',
      label: permissionComponent(
        sidebarData.INVENTORY_MANAGEMENT.id,
        t('inventoryItems')
      ),
      link: null,
      component: <StudentInventoryItemsPage currentStudent={currentStudent} />,
    },
    libraryBooks: {
      id: 'libraryBooks',
      label: permissionComponent(
        sidebarData.LIBRARY_MANAGEMENT.id,
        t('libraryBooks')
      ),
      link: null,
      component: <StudentLibraryBooksPage currentStudent={currentStudent} />,
    },
  }

  return (
    <div>
      <div className={styles.tabGroupWrapper}>
        <TabGroup
          showMoreTab={false}
          tabOptions={Object.values(tabOptions)}
          selectedTab={selectedTab}
          onTabClick={({id}) => setSelectedTab(id)}
        />
      </div>

      <div className={styles.componentWrapper}>
        {tabOptions[selectedTab]?.component}
      </div>
    </div>
  )
}
