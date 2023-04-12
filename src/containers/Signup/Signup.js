import React, {Component} from 'react'
import {
  utilsCheckLogin,
  utilsNotRegistredLeadSquare,
  utilsValidateAuthCode,
} from '../../routes/login'
import {
  utilsGetAdminInfo,
  utilsGetInstituteList,
  utilsGetPendingInstituteList,
  utilsGetInstituteAcademicDetails,
} from '../../routes/dashboard'
import SWW from '../../components/Common/SWW/SWW'
import teachmintLogo from '../../assets/images/common/teachmint-logo-white.svg'
import adminFeatureImage from '../../assets/images/login/admin-features.png'
import adminFeatureMobileImage from '../../assets/images/login/admin-features-mobile.png'
import {validateInputs} from '../../utils/Validations'
import {
  REACT_APP_BASE_URL,
  REACT_APP_TEACHMINT_ACCOUNTS_URL,
} from '../../constants'
import ViewThree from '../../components/Login/ViewThree'
import ViewFour from '../../components/Login/ViewFour'
import {
  instituteInfoAction,
  instituteListInfoAction,
  pendingInstituteListInfoAction,
} from '../../redux/actions/instituteInfoActions'
import {organisationInfoAction} from '../../redux/actions/organisationInfoAction'
import {adminInfoAction} from '../../redux/actions/adminInfo'
import {setLoadingListAction} from '../../redux/actions/commonAction'
import {connect} from 'react-redux'
import Loader from '../../components/Common/Loader/Loader'
import EventManager from '../../utils/EventManager'
import {eventManagerAction} from '../../redux/actions/EventManagerAction'
import {events} from '../../utils/EventsConstants'
import InstituteListPopup from '../../components/Common/InstituteList/InsituteListPopup'
import ViewSix from '../../components/Login/ViewSix'
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary'
import history from '../../history'
import {DASHBOARD, LOGIN, sidebarData} from '../../utils/SidebarItems'
import {
  BROWSER_STORAGE_KEYS,
  INSTITUTE_TYPES,
} from '../../constants/institute.constants'
import {
  getAdminSpecificFromLocalStorage,
  getFromLocalStorage,
  getFromSessionStorage,
  setAdminSpecificToLocalStorage,
  setToSessionStorage,
} from '../../utils/Helpers'
import {t} from 'i18next'
import {LOADER} from '../../constants/loader.constant'
import {getNextActiveSessionId} from '../../utils/sessionUtils'

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pageNum: 0,
      profileSelected: -1,
      isLoading: false,
      errorOccured: false,
      instituteType: INSTITUTE_TYPES.NONE,
      instituteName: '',
      whatsappOptIn: true,
      firstLoginState: false,
    }
  }

  setFirstLoginState = (data) => this.setState({firstLoginState: data})
  setPageNum = (data) => this.setState({pageNum: data})
  setprofileSelected = (data) => {
    this.props.eventManager.send_event(events.USER_TYPE_CARD_CLICKED, {
      final_role: data,
    })
    this.setState({profileSelected: data})
  }
  setInstituteType = (data) => this.setState({instituteType: data})
  setInstituteName = (data) => this.setState({instituteName: data})
  setIsLoading = (data) => this.setState({isLoading: data})
  setErrorOccured = (data) => this.setState({errorOccured: data})
  setWhatsappOptIn = (data) => this.setState({whatsappOptIn: data})

  onboardingPages = [
    {num: 0, isBackActive: false, isCrossActive: false},
    {num: 1, isBackActive: false, isCrossActive: true},
    {num: 2, isBackActive: true, isCrossActive: false},
    {num: 3, isBackActive: false, isCrossActive: false},
    {num: 4, isBackActive: false, isCrossActive: false},
  ]

  componentDidMount = async () => {
    this.props.setLoadingListAction({
      [LOADER.checkLogin]: true,
    })

    // Create Event manager
    let eventManagerBeforeLogin = new EventManager(null, window.location.href)
    eventManagerBeforeLogin.getConfig()
    this.props.eventManagerAction(eventManagerBeforeLogin)

    // Add data to state coming from URL
    const search = this.props.location.search
    const instituteName = new URLSearchParams(search).get('tm_ins_name')
    if (validateInputs('instituteName', instituteName, true))
      this.setState({instituteName})

    // Get authcode from URL
    const authCode = new URLSearchParams(search).get('code')

    if (authCode) {
      // Validate auth code
      this.props.setLoadingListAction({
        [LOADER.validateAuthCode]: true,
      })
      const response = await utilsValidateAuthCode(authCode).catch(() => {})
      this.props.setLoadingListAction({
        [LOADER.validateAuthCode]: false,
      })
      // Redirect to accounts if invalid auth code
      if (!response?.status) this.redirectToAccounts()
    }

    // Call check login
    this.checkLogin()
  }

  redirectToAccounts = () => {
    window.location.href = `${REACT_APP_TEACHMINT_ACCOUNTS_URL}?client_id=tfi&redirect_uri=${REACT_APP_BASE_URL}${String(
      LOGIN
    ).substring(1)}&state=default&scope=all&utype=4`
  }

  checkLogin = () => {
    this.props.setLoadingListAction({
      [LOADER.checkLogin]: true,
    })
    if (!getFromSessionStorage(BROWSER_STORAGE_KEYS.ADMIN_UUID)) {
      const adminsGlobal = Object.keys(
        JSON.parse(
          getFromLocalStorage(BROWSER_STORAGE_KEYS.ADMINS_GLOBAL) || '{}'
        )
      )
      if (adminsGlobal?.length > 0)
        setToSessionStorage(BROWSER_STORAGE_KEYS.ADMIN_UUID, adminsGlobal?.[0])
    }

    utilsCheckLogin()
      .then(({data}) => {
        if (data === 'NAME') this.getAdminAndInstituteInfo()
        else this.redirectToAccounts()
      })
      .catch(() => this.setErrorOccured(true))
      .finally(() => {
        this.props.setLoadingListAction({
          [LOADER.checkLogin]: false,
        })
      })
  }

  getAdminAndInstituteInfo = (instituteIdTemp) => {
    this.props.setLoadingListAction({
      [LOADER.getAdminAndInstituteInfo]: true,
    })
    utilsGetAdminInfo()
      .then(async ({admin}) => {
        this.props.adminInfoAction(admin)

        // Config event manager with admin id
        const eventManager = new EventManager(
          admin?._id,
          this.props.eventManager.campaignUrl
        )
        await eventManager.getConfig()
        this.props.eventManagerAction(eventManager)

        const pendingInstituteListResponse = await utilsGetPendingInstituteList(
          admin?.phone_number,
          admin?.email
        )
        const {institutes, organisation} = await utilsGetInstituteList(
          admin?.user_type
        )

        if (organisation?._id) {
          // redirect to Multi-institute Dashboard
          setAdminSpecificToLocalStorage(
            BROWSER_STORAGE_KEYS.CURRENT_ORG_ID,
            organisation?._id
          )
          history.push(DASHBOARD)
        }

        if (pendingInstituteListResponse?.status)
          this.props.pendingInstituteListInfoAction(
            pendingInstituteListResponse?.obj
          )

        this.props.instituteListInfoAction(institutes)
        this.props.organisationInfoAction(organisation)

        if (pendingInstituteListResponse?.obj?.length > 0) {
          if (!instituteIdTemp) {
            this.setState({pageNum: 3})
          } else {
            let insti = institutes.find((item) => item._id === instituteIdTemp)
            this.props.instituteInfoAction(insti)
            setAdminSpecificToLocalStorage(
              BROWSER_STORAGE_KEYS.CURRENT_INSTITUTE_ID,
              insti._id
            )
            this.getTeacherExist(insti._id, insti?.institute_type)
          }
        } else {
          if (institutes.length === 1) {
            this.props.instituteInfoAction(institutes[0])
            setAdminSpecificToLocalStorage(
              BROWSER_STORAGE_KEYS.CURRENT_INSTITUTE_ID,
              institutes[0]._id
            )
            this.getTeacherExist(
              institutes[0]._id,
              institutes[0]?.institute_type
            )
          } else if (institutes.length == 0) {
            // Get utm params from url
            const search = this.props.location.search
            const utmSource = new URLSearchParams(search).get('utm_source')
            const utmMedium = new URLSearchParams(search).get('utm_medium')
            const utmCampaign = new URLSearchParams(search).get('utm_campaign')
            const utmContent = new URLSearchParams(search).get('utm_content')
            const utmKeyword = new URLSearchParams(search).get('utm_keyword')

            const params = {}
            if (utmSource) params.utm_source = utmSource
            if (utmMedium) params.utm_medium = utmMedium
            if (utmCampaign) params.utm_campaign = utmCampaign
            if (utmContent) params.utm_content = utmContent
            if (utmKeyword) params.utm_keyword = utmKeyword
            params.source_url = window.location.href

            // Send data to lead square
            utilsNotRegistredLeadSquare(params).catch(() => {})
            this.setState({pageNum: 1})
          } else {
            this.setState({pageNum: 3})
          }
        }
      })
      .catch(() => this.setState({errorOccured: true}))
      .finally(() => {
        this.props.setLoadingListAction({
          [LOADER.getAdminAndInstituteInfo]: false,
        })
      })
  }

  getTeacherExist = async (instituteId, instituteType) => {
    this.props.setLoadingListAction({
      [LOADER.getTeacherExist]: true,
    })

    await utilsGetInstituteAcademicDetails(instituteId).then(
      ({status, obj}) => {
        if (status) {
          let activeSessionId = getAdminSpecificFromLocalStorage(
            BROWSER_STORAGE_KEYS.ACTIVE_ACADEMIC_SESSION_ID
          )
          let sessionPresentId = null
          if (activeSessionId) {
            sessionPresentId = obj.find(
              (academicSession) => academicSession._id === activeSessionId
            )?._id
          }
          if (!activeSessionId || !sessionPresentId) {
            const sessionId = getNextActiveSessionId(obj)
            setAdminSpecificToLocalStorage(
              BROWSER_STORAGE_KEYS.ACTIVE_ACADEMIC_SESSION_ID,
              sessionId
            )
          }
        }
      }
    )

    const search = this.props.location.search
    const shouldRedirectToAdmission = new URLSearchParams(search).get(
      'redirect_to_admission'
    )
    // We want to keep the admissions dashboard open when user is coming from ekaakshara admission management solution so we are storing that information in local storage
    if (localStorage.getItem('admission_open') != 'true') {
      localStorage.setItem('admission_open', shouldRedirectToAdmission)
    }

    if (shouldRedirectToAdmission == 'true')
      history.push(sidebarData.ADMISSION.route)
    else if (
      instituteType === INSTITUTE_TYPES.SCHOOL &&
      this.state.firstLoginState
    )
      history.push(sidebarData.SCHOOL_SETUP.route)
    else if (
      instituteType === INSTITUTE_TYPES.SCHOOL &&
      !this.state.firstLoginState
    )
      history.push(DASHBOARD)
    else if (instituteId) {
      // Don't remove the following commented code as for now we have commented it because we don't want to show ViewSix to anyone (show invite teachers screen)
      history.push(DASHBOARD)
      // utilsGetUsersList({type: [INSTITUTE_MEMBER_TYPE.TEACHER]}).then(
      //   ({status, obj}) => {
      //     if (status && obj?.length > 0) {
      //       history.push(DASHBOARD)
      //     } else this.setState({pageNum: 4})
      //   }
      // )
    }

    this.props.setLoadingListAction({
      [LOADER.getTeacherExist]: false,
    })
  }

  getPreviewPage = () => {
    switch (this.state.pageNum) {
      case 0:
        return <div></div>
      case 1:
        return (
          <ViewThree
            instituteType={this.state.instituteType}
            setInstituteType={this.setInstituteType}
            setPageNum={this.setPageNum}
          />
        )
      case 2:
        return (
          <ViewFour
            instituteType={this.state.instituteType}
            whatsappOptIn={this.state.whatsappOptIn}
            setIsGridLoading={this.props.setLoadingListAction}
            setErrorOccured={this.setErrorOccured}
            getAdminAndInstituteInfo={this.getAdminAndInstituteInfo}
            instituteNameTemp={this.state.instituteName}
            setFirstLoginState={this.setFirstLoginState}
          />
        )
      case 3:
        return (
          <InstituteListPopup
            getTeacherExist={this.getTeacherExist}
            setPageNum={this.setPageNum}
          />
        )
      case 4:
        return (
          <ViewSix
            setIsLoading={this.setIsLoading}
            setErrorOccured={this.setErrorOccured}
          />
        )
      default:
        break
    }
  }

  render() {
    if (this.state.errorOccured) return <SWW />
    return (
      <div className="w-full min-h-screen lg:h-screen lg:flex lg:flex-wrap">
        <ErrorBoundary>
          <Loader show={this.state.isLoading} />
        </ErrorBoundary>
        {this.state.pageNum !== 3 && this.state.pageNum !== 0 && (
          <div className="w-full p-4 lg:w-1/3 lg:p-10 tm-bg-text-primary">
            <div className="flex items-center justify-between">
              <a href="https://www.teachmint.com/institute">
                <img
                  src={teachmintLogo}
                  alt="Teachmint"
                  className="w-32 lg:w-52"
                />
              </a>

              {!this.onboardingPages[this.state.pageNum].isBackActive &&
                this.state.pageNum !== 4 && (
                  <img
                    src="https://storage.googleapis.com/tm-assets/icons/white/close-white.svg"
                    alt="Teachmint"
                    className="w-4 h-4 ml-3 lg:hidden"
                    onClick={() =>
                      (window.location.href = `${REACT_APP_TEACHMINT_ACCOUNTS_URL}?client_id=tfi&redirect_uri=${REACT_APP_BASE_URL}${String(
                        LOGIN
                      ).substring(1)}&state=default&scope=all&utype=4`)
                    }
                  />
                )}
            </div>
            <div className="my-6 lg:my-10">
              <div className="tm-para-14 lg:tm-para-24 tm-cr-wh-1 text-center">
                {t('exploreEverythingThatYourInstituteNeeds')}
              </div>
              <img
                src={adminFeatureImage}
                alt=""
                className="mt-8 w-full max-w-md mx-auto hidden lg:block"
              />
              <img
                src={adminFeatureMobileImage}
                alt=""
                className="mt-4 w-full max-w-md mx-auto lg:hidden"
              />
            </div>
          </div>
        )}

        <div className="w-full tm-bg-text-primary lg:w-2/3">
          <div className="w-full bg-white rounded-t-3xl lg:rounded-none py-6 px-4 lg:py-12 lg:px-20 lg:h-screen lg:overflow-y-auto">
            <div className="flex items-center justify-between">
              <img
                src="https://storage.googleapis.com/tm-assets/icons/primary/back-primary.svg"
                alt=""
                className={`w-4 h-4 mb-4 lg:m-0 cursor-pointer ${
                  this.onboardingPages[this.state.pageNum].isBackActive
                    ? ''
                    : 'invisible'
                }`}
                onClick={() => {
                  this.props.eventManager.send_event(
                    events.BACK_BUTTON_CLICKED,
                    {
                      screen_name: this.state.pageNum,
                    }
                  )
                  this.setPageNum(this.state.pageNum - 1)
                }}
              />

              {this.onboardingPages[this.state.pageNum].isCrossActive && (
                <img
                  src="https://storage.googleapis.com/tm-assets/icons/primary/close-primary.svg"
                  alt="Teachmint"
                  className="w-4 h-4 ml-3 cursor-pointer hidden lg:block"
                  onClick={() => {
                    this.props.eventManager.send_event(
                      events.CROSS_BUTTON_CLICKED_TFI,
                      {screen_name: this.state.pageNum}
                    )
                    window.location.href = `${REACT_APP_TEACHMINT_ACCOUNTS_URL}?client_id=tfi&redirect_uri=${REACT_APP_BASE_URL}${String(
                      LOGIN
                    ).substring(1)}&state=default&scope=all&utype=4`
                  }}
                />
              )}
            </div>

            <div className="lg:pt-10">
              <ErrorBoundary>{this.getPreviewPage()}</ErrorBoundary>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {eventManager: state.eventManager, adminInfo: state.adminInfo}
}

export default connect(mapStateToProps, {
  adminInfoAction,
  instituteInfoAction,
  eventManagerAction,
  instituteListInfoAction,
  pendingInstituteListInfoAction,
  organisationInfoAction,
  setLoadingListAction,
})(Login)
