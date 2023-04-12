import React from 'react'
import {Trans, useTranslation} from 'react-i18next'
import './footer.scss'

// Import Images
import teachmintLogo from '../../../assets/images/common/teachmint-logo.svg'
import fbIcon from '../../../assets/images/icons/footer-social/fb-icon.svg'
import instagramIcon from '../../../assets/images/icons/footer-social/instagram-icon.svg'
import linkedinIcon from '../../../assets/images/icons/footer-social/linkedin-icon.svg'
import twitterIcon from '../../../assets/images/icons/footer-social/twitter-icon.svg'

export default function Footer() {
  const {t} = useTranslation()
  const getFullYear = new Date().getFullYear()
  return (
    <footer className="main-footer">
      <div className="main-footer-inner">
        <div className="footer-item-container-outer">
          <div className="footer-item-container">
            <img
              className="footer-item-teachmint-logo"
              src={teachmintLogo}
              alt="Teachmint"
            />
          </div>
          <div className="footer-item-container">
            <div className="footer-text-item-heading">{t('links')}</div>
            <a
              className="footer-text-item-normal"
              href="https://teachmint.com/institute"
            >
              {t('home')}
            </a>
            <a
              className="footer-text-item-normal"
              href="https://blog.teachmint.com/"
            >
              {t('blog')}
            </a>
            <a
              className="footer-text-item-normal"
              href="https://teachmint.com/privacy"
            >
              {t('privacyPolicy')}
            </a>
            <a
              className="footer-text-item-normal"
              href="https://teachmint.com/terms"
            >
              {t('termsOfService')}
            </a>
          </div>
          <div className="footer-item-container">
            <div className="footer-text-item-heading">{t('contact')}</div>
            <div className="footer-text-item-normal">{t('companyAddress')}</div>
            <div className="footer-text-item-normal">support@teachmint.com</div>
            <div className="footer-text-item-normal">+91-8035073710</div>
            <div className="footer-text-item-normal">
              8 A.M. - 8 P.M (Everyday)
            </div>
          </div>
          <div className="footer-item-container">
            <div className="footer-text-item-heading">{t('social')}</div>
            <a
              className="footer-social-btn"
              href="https://www.facebook.com/teachmintapp/"
              target="_blank"
              rel="noreferrer"
            >
              <img
                className="footer-social-btn-icon"
                src={fbIcon}
                alt={t('facebook')}
              />
              <div className="footer-social-btn-txt">{t('facebook')}</div>
            </a>
            <a
              className="footer-social-btn"
              href="https://www.instagram.com/teachmintapp/"
              target="_blank"
              rel="noreferrer"
            >
              <img
                className="footer-social-btn-icon"
                src={instagramIcon}
                alt={t('instagram')}
              />
              <div className="footer-social-btn-txt">{t('instagram')}</div>
            </a>
            <a
              className="footer-social-btn"
              href="https://twitter.com/teachmintapp"
              target="_blank"
              rel="noreferrer"
            >
              <img
                className="footer-social-btn-icon"
                src={twitterIcon}
                alt="Twitter"
              />
              <div className="footer-social-btn-txt">{t('twitter')}</div>
            </a>
            <a
              className="footer-social-btn"
              href="https://www.linkedin.com/company/teachmint/"
              target="_blank"
              rel="noreferrer"
            >
              <img
                className="footer-social-btn-icon"
                src={linkedinIcon}
                alt="Linkedin"
              />
              <div className="footer-social-btn-txt">{t('linkedin')}</div>
            </a>
          </div>
        </div>
        <div className="footer-copyright">
          <Trans i18nKey="copyRightText">
            ©Copyright {{getFullYear}} Teachmint Technologies Pvt. Ltd.
          </Trans>
        </div>
      </div>
    </footer>
  )
}
