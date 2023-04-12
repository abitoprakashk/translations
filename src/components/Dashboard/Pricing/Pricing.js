import React, {useState, useEffect} from 'react'
import pricingTick from '../../../assets/images/icons/pricing-tick-green.svg'
import {useDispatch, useSelector} from 'react-redux'
import {events} from '../../../utils/EventsConstants'
import {utilsCheckLogin} from '../../../routes/login'
import {utilsGetInstituteList} from '../../../routes/dashboard'
import {showErrorOccuredAction} from '../../../redux/actions/commonAction'
import {instituteInfoAction} from '../../../redux/actions/instituteInfoActions'
import {
  getUpdatedInstituteInfoFromInstituteList,
  is_indian_institute,
} from '../../../utils/Helpers'
import {useTranslation} from 'react-i18next'

export default function Pricing({screenName}) {
  const [loggedIn, setLoggedIn] = useState(false)
  const {eventManager, instituteInfo} = useSelector((state) => state)
  const dispatch = useDispatch()
  const {t} = useTranslation()
  const is_indian_institute_val = is_indian_institute(instituteInfo)

  const plans = [
    {
      num: 1,
      title: t('plansBasic'),
      desc: t('planBasicDesc'),
      data: [
        t('teachmintApplicationForTeachersAndStudents'),
        t('unlimitedTwoWayLiveClassAndRecording'),
        t('digitalContentSharing'),
        t('onlineTestsIncludingAutoGradedMCQs'),
        t('teacherStudentChatDiscussions'),
        t('dashboardForInstituteAdministration'),
        t('adminControlsFeature'),
        t('basicStatistics'),
        t('singleAdminAccess'),
      ],
    },
    {
      num: 2,
      title: t('advanced'),
      desc: t('paidPlan'),
      data: [
        t('everythingInTheBasicPlan'),
        t('classroomMonitoring'),
        t('studentAttendanceTracking'),
        t('studentPerformanceReports'),
        t('insightfulStatistics'),
        t('feeManagement'),
        t('admissionManagement'),
        t('websiteBuilder'),
        t('basicStatisticsAdvanced'),
        t('certificateGenerator'),
        t('yearlyCalendar'),
        t('transportMangement'),
        t('hostelManagement'),
        t('parentEngagementApp'),
        t('dedicatedSupportManager'),
        t('periodicTeacherProductWorkshop'),
      ],
    },
    {
      num: 3,
      title: t('pro'),
      desc: t('paidPlan'),
      data: [
        t('everythingInTheAdvancedPlan'),
        t('lessonPlanning'),
        t('digitalLearningContent'),
        t('hrManagement'),
        t('inventoryManagement'),
      ],
    },
  ]

  const checkLoggedIn = () => {
    utilsCheckLogin()
      .then(({data}) => {
        if (data === 'NAME') {
          setLoggedIn(true)
          return utilsGetInstituteList()
        } else setLoggedIn(false)
      })
      .then(({institutes}) => {
        if (loggedIn) {
          eventManager.add_unique_user()
          dispatch(
            instituteInfoAction(
              getUpdatedInstituteInfoFromInstituteList(
                instituteInfo,
                institutes
              )
            )
          )
        }
      })
      .catch(() => dispatch(showErrorOccuredAction(true)))
  }

  useEffect(() => {
    checkLoggedIn()
  }, [])

  return (
    <>
      <div className="w-full px-4 py-3 lg:px-0">
        <div className="tm-h5">{t('teachmintPlans')}</div>
        <div className="w-full mt-3 lg:grid grid-cols-3 gap-4">
          {plans.map(({num, title, desc, data}) => (
            <div
              className="w-full bg-white tm-border-radius1 p-4 mb-3 lg:w-auto lg:m-0 relative lg:p-5 tm-box-shadow1"
              key={title}
            >
              <div className="w-full flex">
                <div className="w-6/12 tm-h1 flex justify-start">{title}</div>
              </div>
              <div className="tm-para2 tm-border1-bottom pt-1 pb-2">{desc}</div>
              <div className="pt-2 mb-36">
                {data.map((item, index) => (
                  <div key={item} className="w-full flex my-4">
                    <img src={pricingTick} className="w-4 mr-2" alt="" />
                    <div>
                      <div className="tm-para2 tm-color-text-primary">
                        {item}
                      </div>
                      {num == 3 && (index == 3 || index == 4) && (
                        <div className="tm-para4">{t('comingSoon')}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="absolute bottom-3 left-3 right-3 lg:w-auto mb-2">
                {is_indian_institute_val && num === 2 ? (
                  <a
                    className="w-full tm-btn1-white-blue block mb-4"
                    href="https://rzp.io/l/TFIwebsiteSubscription"
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => {
                      eventManager.send_event(events.BUY_NOW_CLICKED, {
                        screen_name: 'pricing_page',
                      })
                    }}
                  >
                    {t('buyNow')}
                  </a>
                ) : null}

                {num === 1 ? (
                  <a
                    className="w-full tm-btn1-blue block"
                    href="https://www.teachmint.com/login"
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => {
                      eventManager.send_event(events.GET_STARTED_CLICKED_TFI, {
                        screen_name: screenName,
                      })
                    }}
                  >
                    {t('getStarted')}
                  </a>
                ) : (
                  <a
                    className="w-full tm-btn1-green block"
                    href={
                      is_indian_institute_val
                        ? 'https://teachmint.viewpage.co/contact-sales'
                        : 'https://teachmint4.viewpage.co/Contact_Sales_on_Website'
                    }
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => {
                      eventManager.send_event(
                        events.ENQUIRY_CONTACT_US_CLICKED_TFI
                      )
                    }}
                  >
                    {t('contactSales')}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
