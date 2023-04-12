import React from 'react'
import s from '../../Certificates.module.css'
import {useTranslation} from 'react-i18next'
import EmptyScreenV1 from '../../../../components/Common/EmptyScreenV1/EmptyScreenV1'
import examMobileImage from '../../../../assets/images/dashboard/exam-mobile.svg'
import {useHistory} from 'react-router-dom'

const Certificates = () => {
  const history = useHistory()
  const {t} = useTranslation()

  return (
    <div className={s.noCertificatesWrapper}>
      <EmptyScreenV1
        image={examMobileImage}
        title={'No certificates found'}
        desc=""
        btnText={t('Go Back')}
        handleChange={() => history.goBack()}
        btnType="primary"
      />
    </div>
  )
}

export default Certificates
