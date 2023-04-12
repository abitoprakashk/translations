import {Button} from '@teachmint/common'
import history from '../../../history'
import {Trans, useTranslation} from 'react-i18next'
import accessLock from '../../../assets/images/icons/accesslock.svg'
import {DASHBOARD} from '../../../utils/SidebarItems'

export default function UnauthorisedPage() {
  const {t} = useTranslation()

  const handleRedirectToHome = () => {
    history.push(DASHBOARD)
  }
  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex items-center flex-col">
        <div className="mb-4">
          <img src={accessLock} alt={t('unauthorised')} />
        </div>
        <p
          className="mb-4"
          style={{
            color: '#1F3965',
            fontFamily: 'Inter',
            fontStyle: 'normal',
            fontSize: '40px',
            fontWeight: 500,
            lineHeight: '60px',
            textAlign: 'center',
          }}
        >
          {t('ooops')}
        </p>
        <p
          className="mb-5"
          style={{
            color: '#1F3965',
            fontFamily: 'Inter',
            fontStyle: 'normal',
            fontSize: '20px',
            fontWeight: 500,
            lineHeight: '32px',
            textAlign: 'center',
          }}
        >
          <Trans i18nKey="authorisedPara">
            It seems you are not authorised to access <br /> the page.
          </Trans>
        </p>
        <Button onClick={handleRedirectToHome}>{t('goToHomepage')}</Button>
      </div>
    </div>
  )
}
