import React from 'react'
import EmptyScreenV1 from '../../components/Common/EmptyScreenV1/EmptyScreenV1'
import CustomCertificate from './CustomCertificate'
import examMobileImage from '../../assets/images/dashboard/exam-mobile.svg'
import {t} from 'i18next'
import {DASHBOARD} from '../../utils/SidebarItems'
import {useHistory} from 'react-router-dom'

import useCheckDeviceWidth from '../AttendanceReport/hooks/useCheckDeviceWidth'

const CustomCertificateWrapper = () => {
  const history = useHistory()
  const isMobile = useCheckDeviceWidth(1250)

  return isMobile ? (
    <EmptyScreenV1
      image={examMobileImage}
      title={t('toUseTheFeaturePleaseOpenThePageInDesktop')}
      desc=""
      btnText={t('goToDashboard')}
      handleChange={() => history.push(DASHBOARD)}
      btnType="primary"
    />
  ) : (
    <CustomCertificate />
  )
}

export default CustomCertificateWrapper
