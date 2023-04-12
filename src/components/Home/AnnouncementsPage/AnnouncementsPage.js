import React, {useState, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useTranslation} from 'react-i18next'
import calendarIcon from '../../../assets/images/icons/calendar-gray.svg'
import {
  showErrorOccuredAction,
  showLoadingAction,
} from '../../../redux/actions/commonAction'
import {utilsGetAnnouncements} from '../../../routes/dashboard'
import {getDateFromTimeStamp} from '../../../utils/Helpers'
import {userTypeOptions} from '../../../utils/SampleCSVRows'
import AddAnnouncement from '../../AnnouncementPage/AddAnnouncement'
import EmptyScreen from '../../Common/EmptyScreen/EmptyScreen'
import ImgText from '../../Common/ImgText/ImgText'
import emptyAnnouncementIcon from '../../../assets/images/dashboard/empty/announcement-empty.svg'
import ErrorBoundary from '../../ErrorBoundary/ErrorBoundary'

export default function AnnouncementsPage() {
  const [announcementList, setAnnouncementList] = useState([])
  const [showAddAnnouncement, setShowAddAnnouncement] = useState(false)
  const {instituteInfo} = useSelector((state) => state)
  const dispatch = useDispatch()
  const {t} = useTranslation()

  useEffect(() => {
    if (instituteInfo && instituteInfo._id) getAnnouncements()
  }, [instituteInfo])

  const getAnnouncements = () => {
    dispatch(showLoadingAction(true))
    utilsGetAnnouncements(instituteInfo._id)
      .then(({data}) => {
        setAnnouncementList(data)
      })
      .catch(() => dispatch(showErrorOccuredAction(true)))
      .finally(() => dispatch(showLoadingAction(false)))
  }

  return (
    <div className="px-4 lg:px-6 lg:pb-6 lg:pt-3">
      <ErrorBoundary>
        {showAddAnnouncement && (
          <AddAnnouncement
            setShowAddAnnouncement={setShowAddAnnouncement}
            getAnnouncements={getAnnouncements}
          />
        )}

        <div>
          <div className="mt-3 lg:mt-0">
            <div className="flex justify-between items-center mt-2 lg:mt-0">
              <div className="tm-para2">
                {t('totalAnnouncements')}
                {announcementList && announcementList.length}
              </div>
              <div className="hidden lg:flex items-center">
                <div
                  className="tm-btn2-blue w-62 ml-3"
                  onClick={() => setShowAddAnnouncement(true)}
                >
                  {t('createAnnouncements')}
                </div>
              </div>
            </div>
          </div>

          <div>
            <ErrorBoundary>
              {announcementList && announcementList.length > 0 ? (
                announcementList.map(({title, message, send_to, c}, index) => (
                  <div
                    className="w-full my-3 px-4 py-3 tm-border-radius1 bg-white lg:py-4"
                    key={index}
                  >
                    <div className="lg:flex lg:flex-row lg:justify-between">
                      <div className="tm-para1 tm-color-text-primary">
                        {title}
                      </div>
                      <div className="flex justify-between items-center mt-1.5 lg:m-0">
                        <div className="tm-para2">
                          {t('toColon')}
                          {userTypeOptions[send_to] &&
                            userTypeOptions[send_to].value}
                        </div>
                        <div className="lg:min-w-min lg:ml-8">
                          <ImgText
                            icon={calendarIcon}
                            text={getDateFromTimeStamp(c)}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="tm-para2 mt-2">{message}</div>
                  </div>
                ))
              ) : (
                <EmptyScreen
                  img={emptyAnnouncementIcon}
                  text={t('noAnnouncements')}
                />
              )}
            </ErrorBoundary>
          </div>
        </div>
      </ErrorBoundary>
    </div>
  )
}
