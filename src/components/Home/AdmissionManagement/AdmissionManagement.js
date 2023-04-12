import React from 'react'
import {t} from 'i18next'
import {useDispatch, useSelector} from 'react-redux'
import websiteBuildeImage from '../../../assets/images/dashboard/website-builder.png'
import {
  showErrorOccuredAction,
  showLoadingAction,
} from '../../../redux/actions/commonAction'
import {utilsGetAdmissionManagementUrl} from '../../../routes/dashboard'
import {events} from '../../../utils/EventsConstants'
import {sidebarData} from '../../../utils/SidebarItems'
import history from '../../../history'
import Permission from '../../Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../utils/permission.constants'

const items = [
  'manageYourAdmissions',
  'manageNewJoinees',
  'managePeopleWhoLeave',
]

export default function AdmissionManagement() {
  const {eventManager, instituteInfo} = useSelector((state) => state)
  const dispatch = useDispatch()

  const handleRedirect = () => {
    eventManager.send_event(events.VISIT_ADMISSION_PORTAL_CLICKED_TFI, {
      insti_id: instituteInfo?._id,
      insti_type: instituteInfo?.institute_type,
    })
    dispatch(showLoadingAction(true))
    utilsGetAdmissionManagementUrl(instituteInfo?._id)
      .then(({data}) => window.open(data))
      .catch((_err) => dispatch(showErrorOccuredAction(true)))
      .finally(() => dispatch(showLoadingAction(false)))
  }

  return (
    <div>
      {instituteInfo?._id &&
      (instituteInfo?.subscription_type === 2 ||
        instituteInfo?.subscription_type === 3) ? (
        <div className="w-full flex justify-center px-8 mt-10 lg:mt-20">
          <div className="flex flex-col items-center text-center lg:w-2/5">
            <div className="tm-h7 lg:tm-hdg-24">{t('admissionManagement')}</div>
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
                PERMISSION_CONSTANTS.admissionController_getQueryTokenUrl_create
              }
            >
              <button className="tm-btn1-blue mt-5" onClick={handleRedirect}>
                {t('visitAdmissionsPortal')}
              </button>
            </Permission>
          </div>
        </div>
      ) : (
        <div className="w-full flex justify-center px-8 mt-10 lg:mt-20">
          <div className="flex flex-col items-center text-center lg:w-2/5">
            <div className="tm-h7 lg:tm-hdg-24">{t('admissionManagement')}</div>
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
              {t('admissionManagementFeatureIsAvailableInOur')}
              <span className="tm-hdg tm-hdg-14 lg:tm-hdg-16">
                {t('advancedPlan')}
              </span>
              . {t('pleaseContactOurSalesTeamTodayToUpgradeYourPlan')}
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
