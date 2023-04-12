import React from 'react'
import EmptyScreenV1 from '../../components/Common/EmptyScreenV1/EmptyScreenV1'
import CustomIDCard from './CustomIDCard'
import examMobileImage from '../../assets/images/dashboard/exam-mobile.svg'
import {t} from 'i18next'
import {sidebarData} from '../../utils/SidebarItems'
import {useHistory} from 'react-router-dom'
import useCheckDeviceWidth from '../AttendanceReport/hooks/useCheckDeviceWidth'

const CustomIDCardWrapper = () => {
  const history = useHistory()
  const isMobile = useCheckDeviceWidth(1000)

  return isMobile ? (
    <EmptyScreenV1
      image={examMobileImage}
      title={t('toUseTheFeaturePleaseOpenThePageInDesktop')}
      desc=""
      btnText={t('goToDashboard')}
      handleChange={() => history.push(sidebarData.DASHBOARD.route)}
      btnType="primary"
    />
  ) : (
    <CustomIDCard />
  )
}

export default CustomIDCardWrapper
