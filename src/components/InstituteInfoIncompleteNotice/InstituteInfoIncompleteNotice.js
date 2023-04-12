import React, {useState, useEffect} from 'react'
import {Notice, Icon} from '@teachmint/common'
import {getScreenWidth} from '../../utils/Helpers'
import history from '../../history'
import {secondaryItems} from '../../utils/SidebarItems'
import {NOTICE} from './InstituteInfoIncompleteNotice.constants'
import s from './InstituteInfoIncompleteNotice.module.css'
import UserProfileComponent from '../../pages/user-profile/UserProfileComponent'
import {useSelector} from 'react-redux'
import {t} from 'i18next'

const InstituteInfoIncompleteNotice = ({type}) => {
  const [showInstituteInfoSlider, setInstituteInfoSlider] = useState(false)
  const [showNotice, setNoticeBanner] = useState(false)
  const {instituteInfo} = useSelector((store) => store)

  useEffect(() => {
    const {ins_logo = ''} = instituteInfo
    if (isAddressAvailable() && ins_logo) setNoticeBanner(false)
    else setNoticeBanner(true)
  }, [instituteInfo])

  const isAddressAvailable = () => {
    const {address = ''} = instituteInfo
    const {pin = '', line1 = '', city = '', state = ''} = address
    if (pin && line1 && city && state) return true
    else false
  }

  return (
    <>
      {showNotice && (
        <>
          {showInstituteInfoSlider && (
            <UserProfileComponent
              userType="institute"
              isSliderOpen={showInstituteInfoSlider}
              setSliderScreen={setInstituteInfoSlider}
            />
          )}

          <div className={s.notice_container}>
            <Notice>
              <div className={s.incomplete_info}>
                <div>
                  <Icon name="error" color="warning" size="xxs" />
                </div>
                <div className={s.content}>
                  <p className={s.notice_header}>
                    {t('completeYourInstitutesProfile')}
                  </p>
                  <p className={s.notice_subheading}>
                    {t('ensureDetailsAreUpdated')}
                    <span
                      className="tm-color-blue cursor_pointer"
                      onClick={() => {
                        if (getScreenWidth() < 1024)
                          history.push(
                            secondaryItems.EDIT_INSTITUTE_DETAILS.route
                          )
                        else {
                          setInstituteInfoSlider(true)
                        }
                      }}
                    >
                      {' '}
                      {t('instituteProfile')}
                    </span>
                    {t('infoWillBeUsedAsInstituteDetail')} {type}.
                  </p>
                  <ul>
                    {!isAddressAvailable() && (
                      <li>{NOTICE.INSTITUTE_ADDRESS}</li>
                    )}
                    {!instituteInfo?.ins_logo && (
                      <li>{NOTICE.INSTITUTE_LOGO}</li>
                    )}
                  </ul>
                </div>
              </div>
            </Notice>
          </div>
        </>
      )}
    </>
  )
}

export default InstituteInfoIncompleteNotice
