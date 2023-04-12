import React from 'react'
import RouteMapping from '../RouteMapping'
import NavBarTabs from '../../../components/NavList/NavigationalRoutes'
import {TABLIST} from '../RouteMapping'
import styles from './landingView.module.css'
import {useTranslation} from 'react-i18next'
import EmptyScreenV1 from '../../../../../components/Common/EmptyScreenV1/EmptyScreenV1'
import examMobileImage from '../../../../../assets/images/dashboard/exam-mobile.svg'
import {DASHBOARD} from '../../../../../utils/SidebarItems'
import history from '../../../../../history'

const HeadingUI = () => {
  const {t} = useTranslation()
  return <h1 className={styles.heading}>{t('inventoryManagement')}</h1>
}

const MainContentUI = (props) => {
  return <>{props.children}</>
}

export default function LandingView() {
  const {t} = useTranslation()
  return (
    <>
      <div className={styles.showEmptyScreen}>
        <EmptyScreenV1
          image={examMobileImage}
          title={t('toUseTheFeaturePleaseOpenThePageInDesktop')}
          desc=""
          btnText={t('goToDashboardBtn')}
          handleChange={() => history.push(DASHBOARD)}
          btnType="primary"
        />
      </div>
      <div className={styles.showInventory}>
        <HeadingUI />
        <NavBarTabs TABLIST={TABLIST} />
        <MainContentUI>
          <RouteMapping />
        </MainContentUI>
      </div>
    </>
  )
}
