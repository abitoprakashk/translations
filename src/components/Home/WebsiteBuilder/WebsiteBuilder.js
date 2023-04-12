import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {Trans} from 'react-i18next'
import websiteBuildeImage from '../../../assets/images/dashboard/website-builder.png'
import {
  showErrorOccuredAction,
  showLoadingAction,
} from '../../../redux/actions/commonAction'
import {utilsGetWebsiteBuilderUrl} from '../../../routes/dashboard'
import {t} from 'i18next'
import history from '../../../history'
import {sidebarData} from '../../../utils/SidebarItems'
import Permission from '../../Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../utils/permission.constants'

const items = [
  'createYourInstituteWebsite',
  'growYourInstituteOnlinePresence',
  'buildAndPublishYourWebsiteWithOurWebsiteBuilder',
]

export default function WebsiteBuilder() {
  const {instituteInfo} = useSelector((state) => state)
  const dispatch = useDispatch()

  const handleRedirect = () => {
    dispatch(showLoadingAction(true))
    utilsGetWebsiteBuilderUrl(instituteInfo?._id)
      .then(({data}) => window.open(data))
      .catch((_err) => dispatch(showErrorOccuredAction(true)))
      .finally(() => dispatch(showLoadingAction(false)))
  }

  return (
    <div>
      {instituteInfo?._id &&
      (instituteInfo?.subscription_type === 2 ||
        instituteInfo?.subscription_type === 3 ||
        (instituteInfo?.trial_status === 1 &&
          instituteInfo?.trial_days_remaining > 0)) ? (
        <div className="w-full flex justify-center px-8 mt-10 lg:mt-20">
          <div className="flex flex-col items-center text-center lg:w-2/5">
            <div className="tm-h7 lg:tm-hdg-24">{t('websiteBuilder')}</div>
            <img src={websiteBuildeImage} alt="" className="w-40 mt-4" />

            <div className="mt-8 flex flex-col items-center text-center">
              {items.map((item, index) => (
                <div className="flex mt-3 items-baseline" key={index}>
                  <img
                    className="w-2 h-2 mr-1.5 mt-1"
                    src="https://storage.googleapis.com/tm-assets/icons/colorful/dot-green.svg"
                    alt=""
                  />
                  <div className="tm-hdg tm-hdg-14 lg:tm-hdg-16 w-fit">
                    {t(item)}
                  </div>
                </div>
              ))}
            </div>

            <Permission
              permissionId={
                PERMISSION_CONSTANTS.websiteBuilderController_getTokenUrl_create
              }
            >
              <button className="tm-btn1-blue mt-5" onClick={handleRedirect}>
                {t('visitWebsiteBuilderPortal')}
              </button>
            </Permission>
          </div>
        </div>
      ) : (
        <div className="w-full flex justify-center px-8 mt-10 lg:mt-20">
          <div className="flex flex-col items-center text-center lg:w-2/5">
            <div className="tm-h7 lg:tm-hdg-24">{t('websiteBuilder')}</div>
            <img src={websiteBuildeImage} alt="" className="w-40 mt-4" />

            <div className="mt-8 flex flex-col items-center text-center">
              {items.map((item, index) => (
                <div className="flex mt-3" key={index}>
                  <img
                    className="w-2 h-2 mr-1.5 mt-1"
                    src="https://storage.googleapis.com/tm-assets/icons/colorful/dot-green.svg"
                    alt=""
                  />
                  <div className="tm-hdg tm-hdg-14 lg:tm-hdg-16 w-fit">
                    {t(item)}
                  </div>
                </div>
              ))}
            </div>

            <div className="tm-para-14 lg:tm-para-16 mt-8 tm-color-text-primary">
              <Trans i18nKey="websiteBuilderFeatureIsAvailableInOurDynamic">
                Website builder feature is available in our{' '}
                <span className="tm-hdg tm-hdg-14 lg:tm-hdg-16">
                  Advanced Plan
                </span>
                . Please contact us today to upgrade your plan
              </Trans>
            </div>

            <button
              className="tm-btn1-blue mt-5"
              onClick={() => history.push(sidebarData.CONTACTUS.route)}
            >
              {t('contactSales')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
