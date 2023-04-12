import React from 'react'
import './pricing.scss'
import {Link} from 'react-router-dom'
import Footer from '../../components/Common/Footer/Footer'
import {useTranslation} from 'react-i18next'

// Import Images
import pricingCover from '../../assets/images/common/pricing-illustration.png'
import teachmintLogo from '../../assets/images/common/teachmint-logo.svg'
import PricingElement from '../../components/Dashboard/Pricing/Pricing'
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary'

export default function Pricing() {
  const {t} = useTranslation()

  return (
    <>
      <div className="institite-header">
        <div className="institite-header-inner">
          <a href="https://www.teachmint.com/institute">
            <img src={teachmintLogo} alt="Teachmint" />
          </a>
        </div>
      </div>
      <div className="pricing-page">
        <div className="pricing-banner-con">
          <Link>
            <div className="pricing-text-con">
              <div className="pricing-title">
                {t('digitiseYourInstituteToday')}
              </div>
              <div className="pricing-desc">
                {t('simpleAndSecureAccessForEveryone')}
              </div>
            </div>
            <img src={pricingCover} alt="Pricing img" className="pricing-img" />
          </Link>
        </div>

        <div className="pricing-allplan-con">
          <div className="pricing-allplan-content-con">
            <ErrorBoundary>
              <PricingElement screenName="PRICING" />
            </ErrorBoundary>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
